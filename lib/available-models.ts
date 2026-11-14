/**
 * 本站可用的模型列表。
 *
 * 数据来自上游 `/v1/models`，但要滤掉一批不该出现在玩家面前的条目。
 * 这份过滤规则同时被两个地方使用：
 *   - `GET /api/ai/models` —— 前端模型面板的数据源；
 *   - `/rankings` 页面 —— 排行榜只展示**本站确实提供**的模型，
 *     否则会列出玩家根本选不到的模型（比如上游有、但账号没开通的那些）。
 * 两边必须走同一个函数，否则两处口径会漂移。
 */

export type AvailableModel = {
  id: string;
  object?: string;
  created?: number;
  owned_by?: string;
  [key: string]: unknown;
};

/** 带 HTTP 状态码的错误，便于路由直接转成对应响应 */
export class ModelsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ModelsError";
  }
}

/**
 * 上游 /v1/models 未列出、但已手动调用验证可用的模型。
 * 补进列表，避免用户每次都要在模型面板里手动输入 ID。
 * ⚠️ 只放「确实调用通过」的；上游正式放出后此处自动去重，可删掉对应条目。
 */
const EXTRA_MODELS: AvailableModel[] = [
  { id: "epai-1.0", object: "model", created: 0, owned_by: "endlesspixel" },
];

/**
 * 过滤分两类：
 *   ① 能力类别 —— 根本没法对话的（嵌入 / 重排 / 视觉 / 生图 / 语音 …）；
 *   ② 明显不该出现在客服对话框里的 —— 代码补全、医疗金融法律等垂直模型、
 *      2B~7B 级别的过小/过时模型、上游渠道别名重复项。
 * 第 ② 类是 2026-11-14 按实际拉到的模型逐个核对后补的：
 * 这些模型即使能调通，拿来回答玩家问题也只会答非所问，不如不放出来。
 * 原则仍是「宁可少滤，不可误杀」—— 模糊地带（例如 30B 上下的通用模型）一律保留，
 * 交给前端「推荐」逻辑排到后面，不在这里删。
 */
const FILTER_REGEX: RegExp[] = [
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
  // 上游玩笑虚假模型
  /^gemini-9-dragon$/i,
  /^gpt-7-astra$/i,

  // —— 代码补全 / 代码专用：按补全任务微调过，闲聊会一直往外吐代码
  /coder|codellama|codegemma|code-?instruct|codestral|starcoder/i,
  // —— 垂直领域：医疗 / 金融 / 创意写作 / RAG 问答 / 机器人推理，与客服对话无关
  /palmyra-(?:med|fin|creative|code)/i,
  /chatqa/,
  /cosmos-reason/,
  // —— 过小 / 过时的通用模型：2B~7B 的 base 或 2023 年前后的老模型，答不准也不稳定
  /recurrentgemma/,
  /(?:^|\/)gemma-(?:2b|3-(?:1|4|12)b)/,
  /granite-3\.0-(?:3b|8b)/,
  /(?:^|\/)llama2(?:[-_/]|$)/,
  /mistral-7b/,
  /mistral-nemo/,
  /minitron/,
  /zamba2/,
  /sea-lion/,
  /(?:^|\/)dbrx/,
  /phi-3\.5/,
  /nemotron-4-/,
  /nemotron-nano/,
  // —— 上游渠道别名：`x-` 前缀是同一模型的重复条目
  /^x-/,
  // —— 其余小众 / 命名奇怪的条目
  /laguna|poolside/i, // Poolside：代码补全厂商
  /gemma/i, // Gemma 全系：开源小模型，不是通用客服的首选
  /muse-glimmer/, // 来源不明的条目，非厂商官方命名
  /-nano|-e4b|bolt/i, // 各家的极小档（nano / 4B 级）
  /-lite/i, // 各家的轻量档，能力明显弱于主力档
  /^deepseek-ai\/deepseek-v4/, // 与短名 deepseek-v4.x 重复
];

/**
 * 上游列出、但调用必定 404 的模型（账号未开通）。
 *
 * 2026-11-14 对上游全量 107 个模型逐个探测，404 的报错原文是
 * `{"error":{"message":"Function '<uuid>': Not found for account '<id>'"}}` ——
 * 与模型名无关，是账号权限问题，所以没法用正则表达，只能按 ID 拉黑。
 * 下面只列「主流对话模型但调不通」的；代码/嵌入/审核等已在 FILTER_REGEX 里按类别过滤。
 * 上游开通对应模型后把条目删掉即可。
 */
const UNAVAILABLE_MODELS = new Set([
  "01-ai/yi-large",
  "ai21labs/jamba-1.5-large-instruct",
  "mistralai/mistral-large", // 注意 mistral-large-4-1t-a52b 是另一个模型，可正常调用
  "mistralai/mistral-large-2-instruct",
  "mistralai/mixtral-8x22b-v0.1",
  "moonshotai/kimi-k2.6",
  "nvidia/llama-3.1-nemotron-51b-instruct",
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "nvidia/llama-3.1-nemotron-ultra-253b-v1",
  "nvidia/nemotron-3-super-120b-a12b",
]);

/**
 * 拉取并过滤出本站可用的模型列表。
 *
 * `revalidate` 传值时走 Next 的数据缓存（页面用，避免每次渲染都打上游）；
 * 不传则每次都实时拉（API 路由用，模型面板要看到最新列表）。
 */
export async function fetchAvailableModels(
  options: { revalidate?: number } = {},
): Promise<AvailableModel[]> {
  const apiBaseUrl = process.env.API_BASE_URL || "https://xn--kiv260fv3i.cn";
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new ModelsError("API_KEY 未配置", 500);
  }

  const modelsUrl = `${apiBaseUrl}/v1/models`;
  const init: RequestInit & { next?: { revalidate: number } } = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };
  if (options.revalidate) {
    init.next = { revalidate: options.revalidate };
  } else {
    init.cache = "no-store";
  }

  // 上游偶发 502/503（nginx/Cloudflare 瞬时故障），重试一次
  let response = await fetch(modelsUrl, init);
  if (response.status === 502 || response.status === 503) {
    await new Promise((r) => setTimeout(r, 800));
    response = await fetch(modelsUrl, init);
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
    throw new ModelsError(msg, 502);
  }

  // 防御：上游可能返回非 JSON（如网关 502 的 HTML 页面）
  let data: { data?: AvailableModel[] } | null;
  try {
    data = await response.json();
  } catch {
    console.error("[ai/models] 上游返回非 JSON 响应");
    throw new ModelsError("上游返回数据格式异常", 502);
  }

  if (!data || !Array.isArray(data.data)) {
    return [];
  }

  const seen = new Set<string>();
  const models = data.data.filter((model) => {
    if (!model.id) return true;
    // 顺手去重：上游偶尔会重复列出同一个 id
    if (seen.has(model.id)) return false;
    seen.add(model.id);
    if (UNAVAILABLE_MODELS.has(model.id)) return false;
    return !FILTER_REGEX.some((re) => re.test(model.id));
  });

  // 上游 /v1/models 未列出、但已手动调用验证可用的模型，补进列表，
  // 免得用户每次都要在面板里手动输入 ID。
  for (const extra of EXTRA_MODELS) {
    if (!seen.has(extra.id)) {
      models.push(extra);
      seen.add(extra.id);
    }
  }

  return models;
}
