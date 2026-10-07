export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "https://xn--kiv260fv3i.cn";
    const apiKey = process.env.API_KEY;

    // 只过滤明确不能用于文本聊天的类别。原则是「宁可少滤，不可误杀」：
    // 这里只按**能力类别**拉黑（根本没法对话的模型）；
    // 模型的强弱与新老（小模型、老模型、代码模型）交给前端「推荐」逻辑区分，不在这里删。
    // 按类别分组，新增供应商时对照分组补即可。
    const filterRegex = [
      // —— 向量嵌入 / 检索 / 重排：没有对话能力
      /-embed/,
      /embed-?qa/i, // nv-embedqa 之类的嵌入问答
      /^embed/i,
      /retriever/, // 检索召回
      /rerank/, // 重排
      /bge-m3/i,
      /arctic-embed/i,
      // —— 审核 / 安全 / 分类
      /content-safety/i,
      /nemoguard/i,
      /guard/, // guard / safety-guard 一类
      /topic-control/i,
      /moderation/i,
      // —— 视觉 / 多模态图像理解
      /vision/i, // *-vision-instruct、phi-3-vision 等
      /-vl-|-vl$/i, // 视觉语言模型的另一种命名
      /neva-/, // nvidia/neva-22b
      /fuyu/, // adept/fuyu-8b
      /kosmos/, // microsoft/kosmos-2
      /vila/i,
      /clip/i,
      /deplot/i,
      // —— 文档解析 / 结构化抽取
      /nemotron-parse/,
      // —— 打分类模型（只打分，不生成文本）
      /-reward|reward$/i,
      /calibration/i,
      /detector/i,
      // —— 生图 / 图像处理
      /imagine/,
      /dall-e/,
      /flux/,
      /sdxl/,
      /stable-diffusion/,
      /diffusion/,
      /ocr/,
      // —— 语音 / 音频
      /whisper/,
      /-tts|^tts/i,
      // —— 翻译专项（非通用对话）
      /translate/,
      // —— 视频生成
      /-veo|-sora|kling/i,
    ];

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API_KEY 未配置" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const modelsUrl = `${apiBaseUrl}/v1/models`;

    const fetchModels = () =>
      fetch(modelsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

    // 上游偶发 502/503（nginx/Cloudflare 瞬时故障），重试一次
    let response = await fetchModels();
    if (response.status === 502 || response.status === 503) {
      await new Promise((r) => setTimeout(r, 800));
      response = await fetchModels();
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`[ai/models] 上游错误 ${response.status}:`, errorBody.slice(0, 500));
      const msg =
        response.status >= 500
          ? "上游服务繁忙，请稍后再试"
          : response.status === 401 || response.status === 403
            ? "认证失败，请联系管理员"
            : `上游返回错误 (${response.status})`;
      return new Response(JSON.stringify({ error: msg }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 防御：上游可能返回非 JSON（如网关 502 的 HTML 页面）
    let data: { data?: Array<{ id?: string }> } | null;
    try {
      data = await response.json();
    } catch {
      console.error("[ai/models] 上游返回非 JSON 响应");
      return new Response(JSON.stringify({ error: "上游返回数据格式异常" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (data && Array.isArray(data.data)) {
      data.data = data.data.filter((model) => {
        if (!model.id) return true;
        return !filterRegex.some((re: RegExp) => re.test(model.id as string));
      });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("获取模型列表失败:", err);
    return new Response(JSON.stringify({ error: "获取模型列表失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
