"use server";

import { revalidatePath } from "next/cache";

/**
 * 手动刷新状态页。
 *
 * 页面平时靠 ISR（5 分钟）自然更新，但「当前状态」那几行可能刚好在上一次探测之后
 * 出了问题 —— 这时候等 5 分钟太傻。这个 action 只清掉 `/status` 的缓存，
 * 下次请求会重新跑一轮探测（不额外消耗上游配额，探测本身很轻）。
 */
export async function refreshStatusPage(): Promise<void> {
  revalidatePath("/status");
}
