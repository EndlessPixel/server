/**
 * Wiki 知识检索 —— 轻量版 RAG，不依赖 embedding。
 *
 * 上游代理不放行 /v1/embeddings，Vercel 也没有向量库，
 * 所以改用「中文 2-gram + 路径加权」的关键词检索：
 * 49 个知识块、每块约 1.7KB，提问时只把最相关的 2~3 块注入 system prompt。
 *
 * 数据由 `public/data/wiki-knowledge.json` 提供，构建时从 Wiki 仓库生成，
 * 经 fetch 加载并模块级缓存，不进 JS bundle（仅服务端对话路由使用）。
 */

export type WikiChunk = {
  path: string;
  text: string;
};

type WikiKnowledge = {
  version: number;
  source: string;
  baseUrl: string;
  generatedAt?: string;
  chunks: WikiChunk[];
};

export type WikiHit = {
  path: string;
  url: string;
  text: string;
  score: number;
};

let cache: Promise<WikiKnowledge> | null = null;

function loadKnowledge(): Promise<WikiKnowledge> {
  if (!cache) {
    cache = fetch("/data/wiki-knowledge.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<WikiKnowledge>;
      })
      .catch((error) => {
        cache = null;
        console.error("[wiki-knowledge] 加载失败:", error);
        return { version: 1, source: "", baseUrl: "", chunks: [] };
      });
  }
  return cache;
}

/** 提取检索词：英文/数字词 + 中文 2-gram（中文没有空格，2-gram 足够召回） */
function termSet(query: string): string[] {
  const normalized = query.toLowerCase().replace(/[^\u4e00-\u9fffA-Za-z0-9]+/g, " ");
  const terms = new Set<string>();

  for (const word of normalized.split(/\s+/)) {
    if (word.length >= 2) terms.add(word);
    if (/^[\u4e00-\u9fff]+$/.test(word) && word.length >= 3) {
      for (let i = 0; i < word.length - 1; i += 1) {
        terms.add(word.slice(i, i + 2));
      }
    }
  }
  return [...terms];
}

/**
 * 检索与问题相关的 Wiki 章节。
 *
 * 双阈值：绝对分 ≥4，且不低于最高分的 50%——避免问题在 Wiki 里没有对应内容时
 * 硬塞一个勉强沾边的块进去，那比不注入更有害（会让模型拿错资料回答）。
 */
export async function searchWiki(query: string, top = 3): Promise<WikiHit[]> {
  const knowledge = await loadKnowledge();
  const terms = termSet(query);
  if (terms.length === 0 || knowledge.chunks.length === 0) return [];

  const scored: WikiHit[] = [];
  for (const chunk of knowledge.chunks) {
    const pathLower = chunk.path.toLowerCase();
    const text = `${chunk.path} ${chunk.text}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      const count = text.split(term).length - 1;
      if (count > 0) score += Math.min(count, 5) * (pathLower.includes(term) ? 3 : 1);
    }
    if (score > 0) {
      scored.push({
        path: chunk.path,
        url: `${knowledge.baseUrl}/${chunk.path}`,
        text: chunk.text,
        score,
      });
    }
  }

  if (scored.length === 0) return [];
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].score;
  return scored.slice(0, top).filter((hit) => hit.score >= 4 && hit.score >= best * 0.5);
}

/** 把命中的知识块格式化成可注入 system prompt 的文本 */
export function formatWikiContext(hits: WikiHit[]): string {
  if (hits.length === 0) return "";
  const sections = hits.map((hit) => `【Wiki: ${hit.path}】\n来源: ${hit.url}\n${hit.text}`);
  return [
    "以下是从官方 Wiki 检索到的相关内容，回答时优先依据这些内容，并在合适时给出来源链接。",
    "若这些内容不足以回答，请按已有知识库规则处理，不要编造。",
    "",
    ...sections,
  ].join("\n\n");
}
