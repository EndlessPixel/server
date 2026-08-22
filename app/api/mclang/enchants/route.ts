import { NextResponse, NextRequest } from 'next/server';
import enchantmentsData from '../../../../lib/mclang/enchants.json';
import customEnchantmentsData from '../../../../lib/mclang/custom-enchants.json';

/**
 * GET /api/mclang/enchants
 * 返回 Minecraft 26.2 附魔中文翻译表。
 * 默认合并返回：官方附魔（enchantment.minecraft.<id>）+ 服务器自定义附魔（enchantments:<id>）。
 *  ?scope=official  仅官方附魔
 *  ?scope=custom   仅服务器自定义附魔
 *  ?id=xxx         查询单条（自动匹配官方/自定义）
 */
export async function GET(request: NextRequest) {
    const scope = request.nextUrl.searchParams.get('scope');
    const id = request.nextUrl.searchParams.get('id');

    const official = enchantmentsData as Record<string, string>;
    const custom = customEnchantmentsData as Record<string, string>;

    if (id) {
        const name = official[id] ?? custom[id];
        if (name === undefined) {
            return NextResponse.json({ error: 'not found', id }, { status: 404 });
        }
        const source = id in official ? 'official' : id in custom ? 'custom' : undefined;
        return NextResponse.json({ id, name, source });
    }

    if (scope === 'official') return NextResponse.json(official);
    if (scope === 'custom') return NextResponse.json(custom);

    return NextResponse.json({ ...official, ...custom });
}
