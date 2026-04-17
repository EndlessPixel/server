// app/api/ai/chat/route.ts
import { NextRequest } from 'next/server';
import { createParser, EventSourceMessage } from 'eventsource-parser';
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

    const { model, history } = await req.json();
    if (!history || !Array.isArray(history)) {
      return new Response('data: 格式错误\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const truncatedHistory = truncateHistory(history, 20);
    const search = !!model?.search;
    const reasoner = !!model?.reasoner;
    let targetModel = 'deepseek-expert-chat';
    if (search && reasoner) targetModel = 'deepseek-expert-reasoner-search';
    else if (search) targetModel = 'deepseek-expert-chat-search';
    else if (reasoner) targetModel = 'deepseek-expert-reasoner';

    const systemPrompt = await getSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      ...truncatedHistory,
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    // --- 代理配置 ---
    const USE_PROXY = !!process.env.PROXY_URL;
    const UPSTREAM_URL = USE_PROXY
      ? `${process.env.PROXY_URL}/v1/chat/completions`
      : 'https://api.xinjianya.top/v1/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (USE_PROXY) {
      // 代理模式：用 PROXY_AUTH_TOKEN 鉴权，真实 API Key 放在自定义头
      headers.Authorization = `Bearer ${process.env.PROXY_AUTH_TOKEN!}`;
      headers['X-Real-Authorization'] = `Bearer ${process.env.AI_KEY!}`;
    } else {
      // 直连模式：直接用真实 API Key
      headers.Authorization = `Bearer ${process.env.AI_KEY!}`;
    }

    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      signal: controller.signal,
      headers,
      body: JSON.stringify({
        model: targetModel,
        messages,
        stream: true,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 1.0,
        presence_penalty: 1.0,
      }),
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error('Upstream error:', upstream.status, errorBody);
      return new Response(`data: 服务异常 (${upstream.status})\n\n`, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        const parser = createParser({
          onEvent: (event: EventSourceMessage) => {
            const chunk = `data: ${event.data}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          },
        });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            parser.feed(chunk);
          }
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