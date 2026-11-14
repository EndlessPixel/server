/**
 * 模型品牌图标映射（图标来自 LobeHub Icons：https://lobehub.com/zh/icons，MIT）
 *
 * 图标本体是静态 SVG，放在 `public/lobehub-icons/`，由浏览器按需异步获取，
 * 不进 JS bundle —— 只有实际渲染到的那几个会被下载。
 *
 * 规则按「厂商家族」匹配，版本号一律用 \d+ 通配：上游升级版号后不用改这里。
 * 顺序即优先级，先匹配先赢 —— 例如 `gpt-oss` 应归 OpenAI。
 *
 * ⚠️ 图标只保留**当前实际在用**的 10 家厂商（2026-11-14 按 `/api/ai/models`
 * 的 24 个可用模型统计得出）。上游新增别家厂商的模型时，这里匹配不到，
 * 会显示成空白占位 —— 需要的话把对应 SVG 拷进 `public/lobehub-icons/`，
 * 再在下面加一条规则即可。
 *
 * ⚠️ 用的是 LobeHub 的**单色版**（`fill="currentColor"`），不是彩色品牌版。
 * 原因是本站深色模式下背景是纯黑（`--background: oklch(0 0 0)`）、浅色下接近纯白，
 * 而彩色品牌色与纯黑/纯白普遍达不到 3:1 —— 实测 qwen 的 082dff 在黑底上只有 2.35、
 * gemini 的黄 fabc12 在白底上只有 2.60、hunyuan 的 ececee 在白底上只有 1.85。
 * 单色版跟随主题文字色，深/浅两种背景下对比度都在 13:1 以上，且风格统一。
 */

export type ModelIconSpec = {
  /** `public/lobehub-icons/` 下的文件名（不含 .svg） */
  slug: string;
};

/** [模型 ID 匹配规则, 图标 slug] —— 顺序即优先级 */
const RULES: ReadonlyArray<readonly [RegExp, string]> = [
  // —— xAI
  [/(?:^|[/_-])grok/i, "grok"],
  // —— Google
  [/gemini|(?:^|[/_-])google|palm/i, "gemini"],
  // —— DeepSeek
  [/deepseek/i, "deepseek"],
  // —— 智谱 GLM
  [/glm|zhipu|chatglm/i, "zhipu"],
  // —— 月之暗面 Kimi
  [/kimi|moonshot/i, "kimi"],
  // —— Mistral
  [/mistral|mixtral|devstral|magistral|codestral|ministral/i, "mistral"],
  // —— NVIDIA
  [/nemotron|nvidia/i, "nvidia"],
  // —— OpenAI
  [/gpt|openai|chatgpt|(?:^|[/_-])o[1-9](?:[-.]|$)/i, "openai"],
  // —— MiniMax
  [/minimax|abab/i, "minimax"],
  // —— 阶跃星辰
  [/stepfun|(?:^|[/_-])step-[a-z0-9]/i, "stepfun"],
];

/** 解析模型 ID 对应的品牌图标；无法识别时返回 null，调用方应保持布局不塌陷。 */
export function resolveModelIcon(modelId: string): ModelIconSpec | null {
  if (!modelId) return null;
  for (const [pattern, slug] of RULES) {
    if (pattern.test(modelId)) return { slug };
  }
  return null;
}
