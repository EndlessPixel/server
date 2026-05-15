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
    const systemPrompt = await getSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      ...truncatedHistory,
    ];
    const openaiBody = {
      model: "deepseek-ai/deepseek-v4-flash",
      messages: messages,
      stream: true,
      temperature: 0.3,
      top_p: 0.7,
      presence_penalty: 0.8,
      frequency_penalty: 0.5
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const upstreamUrl = "https://api.iamhc.cn/v1/chat/completions";
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
    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error("API 错误:", upstream.status, errorBody);
      return new Response(`data: 服务异常 (${upstream.status})\n\n`, {
        headers: { "Content-Type": "text/event-stream" },
      });
    }
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
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