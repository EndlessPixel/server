/**
 * 从 EndlessPixel-Wiki 仓库生成 AI 对话用的 Wiki 知识块。
 *
 * 本地：node scripts/generate-wiki-knowledge.mjs [wiki目录]
 * CI：  由 .github/workflows/sync-wiki-knowledge.yml 克隆 Wiki 后调用
 *
 * 输出 public/data/wiki-knowledge.json —— 与 lib/wiki-knowledge.ts 的格式约定一致。
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wikiArg = process.argv[2];
const WIKI_DIR = wikiArg ? path.resolve(wikiArg) : path.join(ROOT, ".wiki-tmp", "wiki");
const OUTPUT = path.join(ROOT, "public", "data", "wiki-knowledge.json");
const BASE_URL = "https://wiki.endlesspixel.cn";

/** 最大块大小：超过则按 ## 标题再切 */
const MAX_CHUNK = 3500;
/** 太短的块没有检索价值 */
const MIN_CHUNK = 100;

function cleanMarkdown(source) {
  let text = source;
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/^---[\s\S]*?^---/m, "");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

async function listMarkdown(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await listMarkdown(full)));
    } else if (entry.name.endsWith(".md")) {
      result.push(full);
    }
  }
  return result.sort();
}

function splitDocument(text, max) {
  if (text.length <= max) return [text];

  const parts = [];
  let buffer = "";
  for (const section of text.split(/\n(?=## )/)) {
    if (buffer && buffer.length + section.length > max) {
      parts.push(buffer.trim());
      buffer = "";
    }
    buffer += `${section}\n`;
  }
  if (buffer.trim()) parts.push(buffer.trim());
  return parts;
}

async function main() {
  let files;
  try {
    files = await listMarkdown(WIKI_DIR);
  } catch (error) {
    console.error(`[wiki-knowledge] 无法读取 Wiki 目录 ${WIKI_DIR}:`, error.message);
    process.exit(1);
  }

  const chunks = [];
  for (const file of files) {
    const relative = path.relative(WIKI_DIR, file).replace(/\\/g, "/").replace(/\.md$/, "");
    const cleaned = cleanMarkdown(await fs.readFile(file, "utf-8"));
    if (cleaned.length < MIN_CHUNK) continue;

    for (const part of splitDocument(cleaned, MAX_CHUNK)) {
      if (part.length >= MIN_CHUNK) chunks.push({ path: relative, text: part });
    }
  }

  if (chunks.length === 0) {
    console.error("[wiki-knowledge] 没有生成任何知识块，拒绝写入空文件");
    process.exit(1);
  }

  const payload = {
    version: 1,
    source: "EndlessPixel-Wiki",
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    chunks,
  };

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, `${JSON.stringify(payload)}\n`, "utf-8");

  const size = (await fs.stat(OUTPUT)).size;
  console.log(`[wiki-knowledge] 生成 ${chunks.length} 块 / ${size} 字节 → ${OUTPUT}`);
}

main();
