import { NextResponse, NextRequest } from 'next/server';
import blocksData from '../../../../lib/mclang/blocks.json';

/**
 * GET /api/mclang/blocks
 * 返回 Minecraft 26.2 方块中文翻译表（block.minecraft.<id> -> 中文名）。
 * 可选 ?id=block.minecraft.xxx 查询单条。
 */
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
        const value = (blocksData as Record<string, string>)[id];
        if (value === undefined) {
            return NextResponse.json({ error: 'not found', id }, { status: 404 });
        }
        return NextResponse.json({ id, name: value });
    }
    return NextResponse.json(blocksData);
}
