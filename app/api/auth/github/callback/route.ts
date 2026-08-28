import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {
    SESSION_COOKIE,
    createSessionToken,
    SESSION_MAX_AGE,
    PROVIDER_COOKIE,
} from '@/lib/session';

const CLIENT_ID = process.env.GH_CLIENT_ID;
const CLIENT_SECRET = process.env.GH_CLIENT_SECRETS;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.endlesspixel.cn';
const REDIRECT_URI = `${SITE_URL}/api/auth/github/callback`;

/**
 * GET /api/auth/github/callback
 * GitHub 回调：校验 state -> 用 code 换 token -> 取 GitHub 用户名 -> 下发会话 cookie。
 * GitHub 登录用户为独立身份，不与 Minecraft 账号体系绑定，个人中心显示提示而非游戏资料。
 */
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookieStore = await cookies();
    const savedState = cookieStore.get('gh_oauth_state')?.value;

    // 清理一次性 state cookie
    const clearState = (res: NextResponse) => {
        res.cookies.set('gh_oauth_state', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });
    };

    if (!code || !state || !savedState || state !== savedState) {
        const res = NextResponse.redirect(`${SITE_URL}/login?error=github_state`);
        clearState(res);
        return res;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        const res = NextResponse.redirect(`${SITE_URL}/login?error=github_config`);
        clearState(res);
        return res;
    }

    try {
        // 1. 用 code 换 access_token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: REDIRECT_URI,
                state,
            }),
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        if (!accessToken) {
            const res = NextResponse.redirect(`${SITE_URL}/login?error=github_token`);
            clearState(res);
            return res;
        }

        // 2. 取 GitHub 用户名
        const userRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'User-Agent': 'EndlessPixel-Server',
            },
        });
        const userData = await userRes.json();
        const login = userData.login as string | undefined;
        if (!login) {
            const res = NextResponse.redirect(`${SITE_URL}/login?error=github_user`);
            clearState(res);
            return res;
        }

        // 3. 下发会话：ep_session（签名）+ mc_user（前端展示）+ ep_provider=github（标记身份来源）
        const sessionToken = createSessionToken(login);
        const res = NextResponse.redirect(`${SITE_URL}/`);
        res.cookies.set(SESSION_COOKIE, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE,
        });
        res.cookies.set('mc_user', encodeURIComponent(login), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE,
        });
        res.cookies.set(PROVIDER_COOKIE, 'github', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE,
        });
        clearState(res);
        return res;
    } catch (error) {
        console.error('GitHub 登录回调失败:', error);
        const res = NextResponse.redirect(`${SITE_URL}/login?error=github_exception`);
        clearState(res);
        return res;
    }
}
