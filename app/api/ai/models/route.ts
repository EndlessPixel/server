export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "https://xn--kiv260fv3i.cn";
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

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`[ai/models] 上游错误 ${response.status}:`, errorBody.slice(0, 500));
      const msg =
        response.status >= 500
          ? "上游服务繁忙，请稍后再试"
          : response.status === 401 || response.status === 403
          ? "认证失败，请联系管理员"
          : `上游返回错误 (${response.status})`;
      return new Response(JSON.stringify({ error: msg }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 防御：上游可能返回非 JSON（如网关 502 的 HTML 页面）
    let data: any;
    try {
      data = await response.json();
    } catch {
      console.error('[ai/models] 上游返回非 JSON 响应');
      return new Response(
        JSON.stringify({ error: "上游返回数据格式异常" }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

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