import itemsData from './mclang/items.json';
import blocksData from './mclang/blocks.json';
import entitiesData from './mclang/entities.json';

/** Minecraft 物品/方块翻译表（items + blocks 合并） */
export const itemNames: Record<string, string> = {
  ...blocksData,
  ...itemsData,
};

/** Minecraft 实体翻译表 */
export const entityNames: Record<string, string> = { ...entitiesData };

/**
 * 将物品 ID（如 "minecraft:exposed_copper_golem_statue"）转换为语言文件键名
 */
function normalizeItemId(id: string): string {
    // 如果已经是 "block.minecraft.xxx" 或 "item.minecraft.xxx" 格式，直接返回
    if (id.startsWith('block.minecraft.') || id.startsWith('item.minecraft.')) {
        return id;
    }

    // 去掉 "minecraft:" 前缀，得到裸名
    const nakedId = id.replace(/^minecraft:/, '');

    // 尝试常见的几种键名格式（按优先级）
    const candidates = [
        `block.minecraft.${nakedId}`,   // 方块
        `item.minecraft.${nakedId}`,    // 物品
        `minecraft:${nakedId}`,         // 原始格式（兜底）
    ];

    return candidates.find(key => itemNames[key]) || id;
}

/**
 * 将实体 ID（如 "minecraft:zombie"）转换为语言文件键名
 */
function normalizeEntityId(id: string): string {
    // 已经是 "entity.minecraft.xxx" 格式，直接返回
    if (id.startsWith('entity.minecraft.')) {
        return id;
    }

    // 去掉 "minecraft:" 前缀，得到裸名
    const nakedId = id.replace(/^minecraft:/, '');

    // 尝试常见的几种键名格式（按优先级）
    const candidates = [
        `entity.minecraft.${nakedId}`,  // 实体
        `minecraft:${nakedId}`,         // 原始格式（兜底）
    ];

    return candidates.find(key => entityNames[key]) || id;
}

/**
 * 获取物品中文名
 */
export function getItemDisplayName(itemId: string): string {
    const key = normalizeItemId(itemId);
    return itemNames[key] || itemId;
}

/**
 * 获取实体中文名
 */
export function getEntityDisplayName(entityId: string): string {
    const key = normalizeEntityId(entityId);
    return entityNames[key] || entityId;
}
