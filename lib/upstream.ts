/**
 * 上游（代理服务器）的基础地址 —— 全站唯一入口。
 *
 * 本站只对接**一台**代理：AI 对话 `/v1/chat/completions`、模型列表 `/v1/models`、
 * 链路自检 `/ping`、模型排行 `/api/rankings` 都是这台机器上的不同路径。
 * 所以只需要一个 `API_BASE_URL`，不要再拆出 `RANKINGS_API_BASE_URL` /
 * `AI_EDGE_BASE_URL` 之类的变量 —— 拆出来就得同步维护，改一处漏一处。
 *
 * 读不到时抛异常而不是兜底到某个硬编码地址：那些兜底地址迟早会过期
 * （历史上就出现过兜底到直连上游、结果被 Cloudflare 403 的情况），
 * 于是「变量没配」表现为难以定位的请求失败。
 */
export function upstreamBaseUrl(): string {
  const raw = process.env.API_BASE_URL?.trim();
  if (!raw) {
    throw new Error("环境变量 API_BASE_URL 未配置");
  }
  // 统一去掉末尾斜杠，避免拼出 `http://host//v1/models`
  return raw.replace(/\/+$/, "");
}
