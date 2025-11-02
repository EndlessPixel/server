import { NextResponse } from "next/server";

// Server-side route to exchange GitHub OAuth code for an access token
// and fetch basic user info. Requires environment variables:
// GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body || {};

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const missing: string[] = [];
    if (!client_id) missing.push("GITHUB_CLIENT_ID");
    if (!client_secret) missing.push("GITHUB_CLIENT_SECRET");
    if (missing.length > 0) {
      // In production we must have the secrets. In development provide a mock user
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: `Server missing environment variables: ${missing.join(", ")}` }, { status: 500 });
      }

      // Development fallback: return a safe mock user so frontend dev can continue
      const mockUser = {
        provider: "github",
        login: "devuser",
        id: 0,
        name: "Dev User",
        avatar_url: null,
        email: "dev@example.com",
        raw: { dev: true },
      };

      return NextResponse.json({ ok: true, user: mockUser, warning: `Missing env vars: ${missing.join(", ")}. Using mock user in development.` });
    }

    // Exchange code for access_token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      return NextResponse.json({ error: `GitHub token exchange failed: ${tokenRes.status} ${txt}` }, { status: 502 });
    }

    const tokenJson = await tokenRes.json();
    const access_token = tokenJson.access_token;

    if (!access_token) {
      return NextResponse.json({ error: "No access_token returned from GitHub", details: tokenJson }, { status: 502 });
    }

    // Use token to fetch user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}`, Accept: "application/vnd.github.v3+json" },
    });

    if (!userRes.ok) {
      const txt = await userRes.text();
      return NextResponse.json({ error: `GitHub user fetch failed: ${userRes.status} ${txt}` }, { status: 502 });
    }

    const user = await userRes.json();

    // Try to fetch primary email if not present
    let primaryEmail: string | null = null;
    if (!user.email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${access_token}`, Accept: "application/vnd.github.v3+json" },
      });
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primary = (emails || []).find((e: any) => e.primary) || emails[0];
        if (primary) primaryEmail = primary.email;
      }
    }

    const result = {
      provider: "github",
      login: user.login,
      id: user.id,
      name: user.name || null,
      avatar_url: user.avatar_url || null,
      email: user.email || primaryEmail,
      raw: user,
    };

    return NextResponse.json({ ok: true, user: result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
