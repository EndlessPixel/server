export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "https://new.xinjianya.top";
    const apiKey = process.env.API_KEY;

    // 过滤列表 - id 包含这些字符串的模型将被移除
    const filterList: string[] = [
      "embed",           // embedding模型
      "retriever",       // 检索模型
      "nv-embedqa",      // Nvidia的QA embedding
      "bge-m3",          // BAAI embedding
      "arctic-embed",    // Snowflake embedding
      "content-safety",  // 内容安全模型
      "nemoguard",       // 内容安全模型
      "guard",           // 内容安全模型
      "safety-guard",    // 安全模型
      "topic-control",   // 主题控制模型
      "console",         // 控制台调试版本
      "code",            // 代码专用（除非你需要）
      "translate",       // 翻译专用
      "vision",          // 视觉模型（除非你需要）
      "reward",          // 奖励模型
      "pii",             // PII识别
      "detector",        // 检测器
      "parse",           // 解析器
      'diffusion',       // 命中文生图模型
      'imagine',         // 图像模型
      "nemotron",        // Nvidia的多模态模型
      'vila',            // 视觉语言模型
      'clip',            // 图像分类/搜索模型
      'deplot',          // 读图专家模型
      'fuyu',            // 数字代理模型
      'kosmos',          // 多模态输入模型
      'neva',            // 视觉语言助手模型
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

    // 过滤模型列表 - 如果id包含filterList中的任意字符串，则移除
    if (data && data.data && Array.isArray(data.data)) {
      data.data = data.data.filter((model: { id?: string }) => {
        // 如果模型有id属性，检查是否包含过滤列表中的任一字符串
        if (model.id) {
          return !filterList.some((filterStr: string) => model.id!.includes(filterStr));
        }
        return true; // 如果没有id属性，保留
      });
    }

    // 返回过滤后的模型列表
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