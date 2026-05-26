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
      ...messages.slice(-20),
    ];

    const openaiBody = {
      model: "qwen/qwen3.5-397b-a17b",
      messages: fullMessages,
      stream: true,
      temperature: 0.2,
      top_p: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0.3
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const apiBaseUrl = process.env.API_BASE_URL || "https://new.xinjianya.top";
    const upstreamUrl = `${apiBaseUrl}/v1/chat/completions`;
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY 未设置");
    }

    // ==============================================
    // ✅ 这里是修复 Cloudflare 403 的核心代码
    // ==============================================
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36",
      "Accept": "text/event-stream",
      "Referer": apiBaseUrl,
      "Origin": apiBaseUrl,
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    };

    // 使用原生 fetch + 真实浏览器指纹绕过 CF
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      signal: controller.signal,
      headers: headers,
      body: JSON.stringify(openaiBody),
      keepalive: true
    });

    clearTimeout(timeout);
    console.log('[API] Upstream response status:', upstream.status, upstream.ok);
    console.log('[API] Upstream headers:', Object.fromEntries(upstream.headers.entries()));

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error("API 错误:", upstream.status, errorBody);
      
      let errorCode = 'unknown_error';
      let errorMessage = '服务异常';
      let errorType = 'api_error';
      
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error) {
          errorCode = errorJson.error.code || errorCode;
          errorMessage = errorJson.error.message || errorMessage;
          errorType = errorJson.error.type || errorType;
        }
      } catch {}
      
      const errorResponse = {
        type: 'error',
        code: errorCode,
        message: errorMessage,
        errorType: errorType,
        status: upstream.status,
      };
      
      return new Response(`data: ${JSON.stringify(errorResponse)}\n\ndata: [DONE]\n\n`, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const messageId = crypto.randomUUID();

    let buffer = '';
    let messageCount = 0;
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        buffer += new TextDecoder().decode(chunk);
        
        const lines = buffer.split('\n');
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
                const out = JSON.stringify({
                  type: 'text-delta',
                  id: messageId,
                  delta: content,
                });
                controller.enqueue(new TextEncoder().encode(`data: ${out}\n\n`));
              }
            } catch (e) {}
          }
        }
      },
      flush() {
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