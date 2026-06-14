export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "https://new.xinjianya.top";
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API_KEY 未配置" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const modelsUrl = `${apiBaseUrl}/v1/models`;
    
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // 直接返回上游的模型列表
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('获取模型列表失败:', err);
    return new Response(
      JSON.stringify({ error: "获取模型列表失败" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}