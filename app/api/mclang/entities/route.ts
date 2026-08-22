import { NextResponse, NextRequest } from 'next/server';
import entitiesData from '../../../../lib/mclang/entities.json';

/**
 * GET /api/mclang/entities
 * 返回 Minecraft 26.2 实体中文翻译表（entity.minecraft.<id> -> 中文名）。
 * 可选 ?id=entity.minecraft.xxx 查询单条。
 */
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
        const value = (entitiesData as Record<string, string>)[id];
        if (value === undefined) {
            return NextResponse.json({ error: 'not found', id }, { status: 404 });
        }
        return NextResponse.json({ id, name: value });
    }
    return NextResponse.json(entitiesData);
}
