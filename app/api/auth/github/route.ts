import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CLIENT_ID = process.env.GH_CLIENT_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.endlesspixel.cn';
const REDIRECT_URI = `${SITE_URL}/api/auth/github/callback`;

/**
 * GET /api/auth/github
 * 发起 GitHub OAuth 授权，带 state 防 CSRF，跳转 GitHub 登录页。
 */
export async function GET() {
    if (!CLIENT_ID) {
        return NextResponse.json({ error: 'GitHub 登录未配置' }, { status: 503 });
    }

    const state = crypto.randomBytes(16).toString('hex');
    const githubUrl = new URL('https://github.com/login/oauth/authorize');
    githubUrl.searchParams.set('client_id', CLIENT_ID);
    githubUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    githubUrl.searchParams.set('scope', 'read:user');
    githubUrl.searchParams.set('state', state);

    const res = NextResponse.redirect(githubUrl.toString());
    // state 存 HttpOnly cookie，回调时校验（防 CSRF）
    res.cookies.set('gh_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 600,
    });
    return res;
}
