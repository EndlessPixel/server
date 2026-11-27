/**
 * 成就中文名查询 —— 数据来自服务器上的 BACAP / Enhanced Discoveries 语言包。
 *
 * 翻译条目约 1600 条、100KB，放在 `public/data/achievement-translations.json`
 * 按需 fetch，不进 JS bundle（成就页是 profile 的一个 tab，多数访客不会打开）。
 *
 * 数据格式：`{ "<成就ID>": ["<中文名>", "<来源>"] }`，来源取值：
 * - `bacap`   BlazeandCave's Advancements Pack 简体中文语言包
 * - `ed`      Enhanced Discoveries 简体中文语言包（beta）
 * - `manual`  ED beta 语言包缺项，本站补译
 *
 * 署名信息见 `ACHIEVEMENT_TRANSLATION_CREDITS`，会显示在成就面板底部。
 */

export type TranslationSource = "bacap" | "ed" | "manual";

export type AchievementTranslation = {
  zh: string;
  source: TranslationSource;
};

type RawTranslations = Record<string, [string, TranslationSource]>;

export const ACHIEVEMENT_TRANSLATION_CREDITS = [
  {
    pack: "BlazeandCave's Advancements Pack 简体中文语言包",
    authors: "Remilias_Scarlet (1.5)、tianjr123 (1.6–1.9)、SleepyAsh0191 (1.10–1.21)",
  },
  {
    pack: "Enhanced Discoveries 简体中文语言包 (3.0.0-beta1)",
    authors: "Acikizape",
  },
  {
    pack: "ED beta 未覆盖条目",
    authors: "本站补译",
  },
] as const;

let cache: Promise<RawTranslations> | null = null;

/** 模块级单例，多个组件/多次切换 tab 只请求一次 */
export function loadAchievementTranslations(): Promise<RawTranslations> {
  if (!cache) {
    cache = fetch("/data/achievement-translations.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<RawTranslations>;
      })
      .catch((error) => {
        // 失败时清空缓存，下次可以重试；页面会退回显示英文 ID
        cache = null;
        console.error("[achievement-translations] 加载失败:", error);
        return {} as RawTranslations;
      });
  }
  return cache;
}

/** 精确匹配成就 ID，命中则返回中文名与来源 */
export function translateAchievement(
  translations: RawTranslations | null,
  id: string,
): AchievementTranslation | null {
  const entry = translations?.[id];
  if (!entry) return null;
  return { zh: entry[0], source: entry[1] };
}
