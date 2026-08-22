import { NextResponse, NextRequest } from 'next/server';
import itemsData from '../../../../lib/mclang/items.json';

/**
 * GET /api/mclang/items
 * 返回 Minecraft 26.2 物品中文翻译表（item.minecraft.<id> -> 中文名）。
 * 可选 ?id=item.minecraft.xxx 查询单条。
 */
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
        const value = (itemsData as Record<string, string>)[id];
        if (value === undefined) {
            return NextResponse.json({ error: 'not found', id }, { status: 404 });
        }
        return NextResponse.json({ id, name: value });
    }
    return NextResponse.json(itemsData);
}
