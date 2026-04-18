import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ipRequestMap = new Map<string, number[]>();
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

function truncateHistory(history: any[], max = 20) {
  return history.slice(-max);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response('data: 请求过于频繁，请稍后再试\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const { history } = await req.json();
    if (!history || !Array.isArray(history)) {
      return new Response('data: 格式错误\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const truncatedHistory = truncateHistory(history, 20);
    let ollamaModel = 'deepseek-r1:14b';

    const systemPrompt = await getSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      ...truncatedHistory,
    ];

    // Ollama API 请求体
    const ollamaBody = {
      model: ollamaModel,
      messages: messages,
      stream: true,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      },
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const upstreamUrl = process.env.OLLAMA_API_URL;
    if (!upstreamUrl) {
      throw new Error('OLLAMA_API_URL is not set');
    }

    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaBody),
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error('Ollama error:', upstream.status, errorBody);
      return new Response(`data: 服务异常 (${upstream.status})\n\n`, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // 将 Ollama 的流式响应（每行一个 JSON）转换为 SSE 格式
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // 按行分割
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 最后一部分可能不完整，保留到下次处理

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              try {
                const json = JSON.parse(trimmed);
                // Ollama 流式响应格式：{ "model": "...", "created_at": "...", "message": { "role": "assistant", "content": "..." }, "done": false }
                // 我们需要转换为 OpenAI 风格的 SSE chunk
                const content = json.message?.content || '';
                const finishReason = json.done ? 'stop' : null;

                const sseChunk = {
                  choices: [{
                    delta: finishReason ? {} : { content },
                    finish_reason: finishReason,
                    index: 0,
                  }],
                  created: Math.floor(Date.now() / 1000),
                  id: json.id || 'ollama-' + Date.now(),
                  model: json.model,
                  object: 'chat.completion.chunk',
                };

                controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseChunk)}\n\n`));
              } catch (parseErr) {
                console.warn('Failed to parse Ollama line:', trimmed, parseErr);
              }
            }
          }

          // 处理剩余的 buffer（如果有）
          if (buffer.trim()) {
            try {
              const json = JSON.parse(buffer.trim());
              const content = json.message?.content || '';
              const finishReason = json.done ? 'stop' : null;
              const sseChunk = {
                choices: [{
                  delta: finishReason ? {} : { content },
                  finish_reason: finishReason,
                  index: 0,
                }],
                created: Math.floor(Date.now() / 1000),
                id: json.id || 'ollama-' + Date.now(),
                model: json.model,
                object: 'chat.completion.chunk',
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseChunk)}\n\n`));
            } catch {
              // ignore
            }
          }

          // 发送结束标记
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          console.error('Stream error:', err);
          controller.enqueue(encoder.encode('data: 流中断\n\n'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('API Error:', err);
    const message = err instanceof Error && err.name === 'AbortError'
      ? '请求超时'
      : '服务异常，请稍后再试';
    return new Response(`data: ${message}\n\n`, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }
}