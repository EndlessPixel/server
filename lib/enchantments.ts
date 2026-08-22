import enchantmentsData from './mclang/enchants.json';

/** Minecraft 附魔翻译表（标准键名 `enchantment.minecraft.<id>`） */
export const enchantments: Record<string, string> = enchantmentsData;

/**
 * 将附魔 ID（如 "minecraft:sharpness" 或 "enchantment.minecraft.sharpness"）归一化为标准键名
 */
function normalizeEnchantId(id: string): string {
    if (id.startsWith('enchantment.minecraft.')) return id;
    const naked = id.replace(/^minecraft:/, '');
    return `enchantment.minecraft.${naked}`;
}

/**
 * 获取附魔中文名（缺翻译时回退英文 / 原始 ID）
 */
export function getEnchantmentDisplayName(enchantId: string): string {
    const key = normalizeEnchantId(enchantId);
    return enchantments[key] || enchantId;
}
