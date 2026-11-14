import { ModelsError, fetchAvailableModels } from "@/lib/available-models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 可用模型列表。
 *
 * 过滤规则在 `lib/available-models.ts` 里 —— 与 `/rankings` 页面共用同一份，
 * 保证「玩家能选的模型」和「排行榜展示的模型」口径一致。
 */
export async function GET() {
  try {
    const models = await fetchAvailableModels();
    return new Response(JSON.stringify({ data: models }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof ModelsError) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: err.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("获取模型列表失败:", err);
    return new Response(JSON.stringify({ error: "获取模型列表失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
