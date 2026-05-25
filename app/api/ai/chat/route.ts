import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ipRequestMap = new Map<string, number[]>();

function isRateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 10;
  const requests = ipRequestMap.get(ip) ?? [];
  const recent = requests.filter(t => now - t < windowMs);
  if (recent.length >= maxReq) return true;
  ipRequestMap.set(ip, [...recent, now]);
  return false;
}

let systemPromptCache: string | null = null;
async function getSystemPrompt(): Promise<string> {
  if (systemPromptCache) return systemPromptCache;
  const filePath = path.join(process.cwd(), 'public', 'system.txt');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    systemPromptCache = content;
    return content;
  } catch (err) {
    console.error('Failed to read system.txt:', err);
    throw new Error('系统提示词加载失败');
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response('data: {"type":"error","errorText":"请求过于频繁"}\n\ndata: [DONE]\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response('data: {"type":"error","errorText":"格式错误"}\n\ndata: [DONE]\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const systemPrompt = await getSystemPrompt();
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-20), // 保留最近20条
    ];

    const openaiBody = {
      model: "qwen3.5-397b-a17b",
      messages: fullMessages,
      stream: true,
      temperature: 0.2,  // 降低到 0.2，让回答更稳定
      top_p: 0.7,
      presence_penalty: 0.5,  // 降低重复惩罚
      frequency_penalty: 0.3  // 降低频率惩罚
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    // 从环境变量读取 API base URL，默认为 api.iamhc.cn
    const apiBaseUrl = process.env.API_BASE_URL || "https://api.iamhc.cn";
    const upstreamUrl = `${apiBaseUrl}/v1/chat/completions`;
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY 未设置");
    }

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(openaiBody),
    });

    clearTimeout(timeout);
    console.log('[API] Upstream response status:', upstream.status, upstream.ok);
    console.log('[API] Upstream headers:', Object.fromEntries(upstream.headers.entries()));

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error("API 错误:", upstream.status, errorBody);
      
      // 尝试解析错误信息，提供更友好的提示
      let errorMessage = '服务异常';
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
          // 如果是模型不可用，给出更明确的提示
          if (errorMessage.includes('model_not_found') || errorMessage.includes('No available channel')) {
            errorMessage = 'AI 模型暂时不可用，请稍后重试';
          }
        }
      } catch {
        // 如果解析失败，使用默认消息
      }
      
      return new Response(`data: {"type":"error","errorText":"${errorMessage}"}\n\ndata: [DONE]\n\n`, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    // 生成一个消息 ID（整个对话使用同一个 ID，AI SDK 会自动处理）
    const messageId = crypto.randomUUID();

    // 转换 OpenAI SSE 为 AI SDK 数据流协议
    let buffer = '';
    let messageCount = 0;
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        buffer += new TextDecoder().decode(chunk);
        
        // 按行处理
        const lines = buffer.split('\n');
        // 保留最后一个不完整的行在 buffer 中
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            messageCount++;
            const data = line.slice(6);
            if (data === '[DONE]') {
              console.log('[API] Received [DONE], total messages:', messageCount);
              controller.enqueue(new TextEncoder().encode('data: {"type":"finish"}\n\ndata: [DONE]\n\n'));
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              const content = delta?.content;
              if (content) {
                // 发送 text-delta 部分
                const out = JSON.stringify({
                  type: 'text-delta',
                  id: messageId,
                  delta: content,
                });
                controller.enqueue(new TextEncoder().encode(`data: ${out}\n\n`));
              }
            } catch (e) {
              // 忽略解析错误，可能是空行或其他非 JSON 数据
              if (messageCount <= 3) {
                console.debug('[API] SSE parse skip:', line.substring(0, 100));
              }
            }
          }
        }
      },
      flush() {
        // 处理剩余的 buffer
        if (buffer.trim()) {
          console.debug('[API] Flushing remaining buffer:', buffer.substring(0, 100));
        }
        console.log('[API] TransformStream flushed, total messages processed:', messageCount);
      },
    });

    const transformedBody = upstream.body?.pipeThrough(transformStream);
    if (!transformedBody) {
      console.error('[API] Upstream body is null');
      throw new Error('无法获取上游响应体');
    }

    console.log('[API] Starting to stream response to client');
    return new Response(transformedBody, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });

  } catch (err) {
    console.error('API Error:', err);
    const message = err instanceof Error && err.name === 'AbortError' ? '请求超时' : '服务异常，请稍后再试';
    return new Response(`data: {"type":"error","errorText":"${message}"}\n\ndata: [DONE]\n\n`, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }
}