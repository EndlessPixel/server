/**
 * Minecraft 皮肤解析 —— 支持正版（Mojang）与 LittleSkin 两个来源。
 *
 * 两者的查询方式**完全一致**：都实现了 Yggdrasil 协议，
 * `GET <session>/session/minecraft/profile/<uuid>` 返回的 `properties[].value`
 * 是 base64 编码的 JSON，里面 `textures.SKIN.url` 就是皮肤 PNG 地址。
 * 所以这里只需要把「基地址」参数化，解析逻辑共用一份。
 *
 * 失败一律返回 null 而不是抛错 —— 调用方（`/api/skin`）会兜底到默认皮肤，
 * 保证预览永远拿到一张合法的 PNG。
 */

/** 可选来源，`auto` 表示按 Mojang → LittleSkin 的顺序依次尝试 */
export type SkinSource = "auto" | "mojang" | "littleskin";

export type ResolvedSkin = {
  /** 可直接下载的皮肤 PNG 地址 */
  url: string;
  /** 实际命中的来源 */
  source: "mojang" | "littleskin";
  /** 上游返回的角色名（不一定有） */
  name?: string;
};

/** 单个上游请求的上限：串行试多个来源，整体不能拖太久 */
const TIMEOUT_MS = 8000;

const MOJANG_SESSION = "https://sessionserver.mojang.com/session/minecraft/profile";
const MOJANG_UUID_BY_NAME = "https://api.mojang.com/users/profiles/minecraft";

const LITTLESKIN_SESSION =
  "https://littleskin.cn/api/yggdrasil/sessionserver/session/minecraft/profile";
const LITTLESKIN_UUID_BY_NAME = "https://littleskin.cn/api/yggdrasil/api/profiles/minecraft";

async function timedFetch(url: string, init: RequestInit = {}): Promise<Response | null> {
  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

/** 32 位 hex（允许带连字符）→ 无连字符小写；非法返回 null */
export function normalizeUuid(input: string | null | undefined): string | null {
  if (!input) return null;
  const clean = input.replace(/-/g, "").toLowerCase();
  return /^[0-9a-f]{32}$/.test(clean) ? clean : null;
}

/** 角色名：Minecraft 规则 3~16 位字母数字下划线 */
export function isValidPlayerName(input: string | null | undefined): input is string {
  return typeof input === "string" && /^[a-zA-Z0-9_]{3,16}$/.test(input);
}

export function normalizeSkinSource(input: string | null | undefined): SkinSource {
  return input === "mojang" || input === "littleskin" ? input : "auto";
}

/** 从 Yggdrasil profile 响应里取出皮肤地址 */
function extractSkinFromProfile(json: unknown): { url: string; name?: string } | null {
  const profile = json as {
    name?: string;
    properties?: { name?: string; value?: string }[];
  } | null;

  const texturesProperty = profile?.properties?.find((p) => p.name === "textures");
  if (!texturesProperty?.value) return null;

  try {
    const decoded = JSON.parse(Buffer.from(texturesProperty.value, "base64").toString("utf8")) as {
      textures?: { SKIN?: { url?: string } };
    };
    const url = decoded.textures?.SKIN?.url;
    if (!url) return null;

    // textures.minecraft.net 返回的是 http，浏览器会当成混合内容拦掉
    return { url: url.replace(/^http:\/\//, "https://"), name: profile?.name };
  } catch {
    // 上游返回了非预期的 base64，当作没有皮肤
    return null;
  }
}

async function lookupProfile(base: string, uuid: string) {
  const res = await timedFetch(`${base}/${uuid}`, { headers: { Accept: "application/json" } });
  // 204 = 该来源没有这个角色（Yggdrasil 的「找不到」）
  if (!res?.ok) return null;
  return extractSkinFromProfile(await res.json().catch(() => null));
}

async function mojangUuidByName(name: string): Promise<string | null> {
  const res = await timedFetch(`${MOJANG_UUID_BY_NAME}/${encodeURIComponent(name)}`);
  if (!res?.ok) return null;
  const json = (await res.json().catch(() => null)) as { id?: string } | null;
  return normalizeUuid(json?.id);
}

async function littleskinUuidByName(name: string): Promise<string | null> {
  const res = await timedFetch(LITTLESKIN_UUID_BY_NAME, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([name]),
  });
  if (!res?.ok) return null;
  const json = (await res.json().catch(() => null)) as { id?: string }[] | null;
  return normalizeUuid(Array.isArray(json) ? json[0]?.id : null);
}

/**
 * 解析皮肤地址。
 *
 * `uuid` 优先于 `name`；两者都没给、或格式不合法时返回 null。
 * 按来源逐个尝试，任一命中即返回。
 */
export async function resolveSkin(input: {
  uuid?: string | null;
  name?: string | null;
  source?: SkinSource;
}): Promise<ResolvedSkin | null> {
  const source = input.source ?? "auto";
  const uuid = normalizeUuid(input.uuid);

  // 没有 UUID 就按角色名换：正版与 LittleSkin 各有自己的名字接口
  const name = isValidPlayerName(input.name) ? input.name : null;

  const tryMojang = async (): Promise<ResolvedSkin | null> => {
    const id = uuid ?? (name ? await mojangUuidByName(name) : null);
    if (!id) return null;
    const hit = await lookupProfile(MOJANG_SESSION, id);
    return hit ? { ...hit, source: "mojang" } : null;
  };

  const tryLittleSkin = async (): Promise<ResolvedSkin | null> => {
    const id = uuid ?? (name ? await littleskinUuidByName(name) : null);
    if (!id) return null;
    const hit = await lookupProfile(LITTLESKIN_SESSION, id);
    return hit ? { ...hit, source: "littleskin" } : null;
  };

  if (source === "mojang") return tryMojang();
  if (source === "littleskin") return tryLittleSkin();

  return (await tryMojang()) ?? (await tryLittleSkin());
}
