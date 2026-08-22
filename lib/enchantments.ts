import enchantmentsData from './mclang/enchants.json';
import customEnchantmentsData from './mclang/custom-enchants.json';

/** Minecraft 官方附魔翻译表（标准键名 `enchantment.minecraft.<id>`） */
export const enchantments: Record<string, string> = enchantmentsData;

/** 服务器自定义附魔翻译表（键名 `enchantments:<id>`） */
export const customEnchantments: Record<string, string> = customEnchantmentsData;

/**
 * 将附魔 ID（如 "minecraft:sharpness" / "enchantment.minecraft.sharpness" / "enchantments:attack_speed"）归一化为标准键名
 */
function normalizeEnchantId(id: string): string {
    if (id.startsWith('enchantment.minecraft.')) return id;
    if (id.startsWith('enchantments:')) return id;
    const naked = id.replace(/^minecraft:/, '');
    return `enchantment.minecraft.${naked}`;
}

/**
 * 获取附魔中文名（先查官方，再查服务器自定义，最后回退原始 ID）
 */
export function getEnchantmentDisplayName(enchantId: string): string {
    const key = normalizeEnchantId(enchantId);
    return enchantments[key] || customEnchantments[key] || enchantId;
}
