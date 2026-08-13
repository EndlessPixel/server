export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "https://api.futureppo.top";
    const apiKey = process.env.API_KEY;

    // 只过滤明确不能用于文本聊天的类别（向量/检索/安全审核/生图/多模态视觉等）。
    // 用边界匹配，避免误杀名称里恰好包含这些子串的正常聊天模型。
    const filterRegex = [
      /-embed/,          // 向量嵌入模型 纯文本聊天无用
      /embed-?qa/i,      // nv-embedqa 之类的嵌入问答
      /retriever/,       // 检索召回模型
      /bge-m3/i,
      /arctic-embed/i,
      /content-safety/i, // 内容安全审核模型
      /nemoguard/i,
      /guard/,           // 各类 guard / safety-guard
      /topic-control/i,
      /imagine/,         // 生图相关
      /vila/i,
      /clip/i,
      /deplot/i,
    ];

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

    if (data && data.data && Array.isArray(data.data)) {
      data.data = data.data.filter((model: { id?: string }) => {
        if (!model.id) return true;
        return !filterRegex.some((re: RegExp) => re.test(model.id!));
      });
    }

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