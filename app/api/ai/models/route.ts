export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "https://api.futureppo.top";
    const apiKey = process.env.API_KEY;

    const filterList: string[] = [
      "embed",           // 向量嵌入模型 纯文本聊天无用
      "retriever",       // 检索召回模型
      "nv-embedqa",
      "bge-m3",
      "arctic-embed",
      "content-safety",  // 内容安全审核模型
      "nemoguard",
      "guard",
      "safety-guard",
      "topic-control",
      "reward",          // 奖励训练模型
      "pii",             // 隐私信息检测
      "detector",        // 各类检测器
      "parse",           // 文档解析工具
      "imagine",         // 生图相关
      "vila",
      "clip",
      "deplot",
      "fuyu",
      "neva",
      "kosmos"
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
        if (model.id) {
          return !filterList.some((filterStr: string) => model.id!.includes(filterStr));
        }
        return true;
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