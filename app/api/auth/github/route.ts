import { NextResponse } from "next/server";

// Server-side route to exchange GitHub OAuth code for an access token
// and fetch basic user info. Requires environment variables:
// GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { code } = body || {};

    if (!code) {
      console.error("❌ GitHub OAuth: Missing authorization code");
      return NextResponse.json(
        { 
          error: "授权码缺失",
          message: "GitHub 授权流程未完成，请重新尝试登录",
          code: "MISSING_AUTH_CODE"
        }, 
        { status: 400 }
      );
    }

    // Validate code format (basic check)
    if (typeof code !== "string" || code.length < 10) {
      console.error("❌ GitHub OAuth: Invalid code format");
      return NextResponse.json(
        { 
          error: "无效的授权码格式",
          message: "授权码格式不正确，请重新尝试登录",
          code: "INVALID_CODE_FORMAT"
        }, 
        { status: 400 }
      );
    }

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const missing: string[] = [];
    if (!client_id) missing.push("GITHUB_CLIENT_ID");
    if (!client_secret) missing.push("GITHUB_CLIENT_SECRET");
    
    if (missing.length > 0) {
      console.error(`🔧 GitHub OAuth: Missing environment variables: ${missing.join(", ")}`);
      
      // In production we must have the secrets. In development provide a mock user
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { 
            error: "服务器配置错误",
            message: "身份验证服务暂时不可用，请稍后重试",
            code: "SERVER_CONFIG_ERROR",
            details: `Missing environment variables: ${missing.join(", ")}`
          }, 
          { status: 500 }
        );
      }

      // Development fallback: return a safe mock user so frontend dev can continue
      console.warn("🚧 GitHub OAuth: Using development mock user");
      const mockUser = {
        provider: "github",
        login: "devuser",
        id: 123456789,
        name: "开发测试用户",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        email: "dev@example.com",
        html_url: "https://github.com/devuser",
        bio: "开发环境测试用户",
        location: "Beijing, China",
        raw: { 
          dev: true,
          message: "This is a mock user for development"
        },
      };

      return NextResponse.json({ 
        ok: true, 
        user: mockUser, 
        warning: `开发环境: 缺少环境变量 ${missing.join(", ")}，使用模拟用户`,
        execution_time: Date.now() - startTime
      });
    }

    console.log("🔐 GitHub OAuth: Exchanging code for access token...");

    // Exchange code for access_token with timeout
    const tokenController = new AbortController();
    const tokenTimeout = setTimeout(() => tokenController.abort(), 10000); // 10秒超时

    let tokenRes;
    try {
      tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "EndlessPixel-Server/1.0"
        },
        body: JSON.stringify({ 
          client_id, 
          client_secret, 
          code,
          redirect_uri: process.env.GITHUB_REDIRECT_URI || "https://ep.endlesspixel.fun/login/success"
        }),
        signal: tokenController.signal
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error("❌ GitHub OAuth: Token exchange timeout");
        return NextResponse.json(
          { 
            error: "请求超时",
            message: "GitHub 服务响应超时，请稍后重试",
            code: "TIMEOUT_ERROR"
          }, 
          { status: 504 }
        );
      }
      throw error;
    } finally {
      clearTimeout(tokenTimeout);
    }

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error(`❌ GitHub OAuth: Token exchange failed - ${tokenRes.status}`, errorText);
      
      let errorMessage = "GitHub 身份验证服务暂时不可用";
      let errorCode = "GITHUB_SERVICE_ERROR";
      
      if (tokenRes.status === 400) {
        errorMessage = "无效的授权码，请重新登录";
        errorCode = "INVALID_GRANT";
      } else if (tokenRes.status === 403) {
        errorMessage = "GitHub API 限制，请稍后重试";
        errorCode = "RATE_LIMITED";
      }

      return NextResponse.json(
        { 
          error: "身份验证失败",
          message: errorMessage,
          code: errorCode,
          status: tokenRes.status
        }, 
        { status: 502 }
      );
    }

    const tokenJson = await tokenRes.json();
    const access_token = tokenJson.access_token;

    if (!access_token) {
      console.error("❌ GitHub OAuth: No access token returned", tokenJson);
      return NextResponse.json(
        { 
          error: "身份验证失败",
          message: "未能获取访问令牌，请重新尝试登录",
          code: "NO_ACCESS_TOKEN",
          details: tokenJson.error_description || tokenJson.error
        }, 
        { status: 502 }
      );
    }

    console.log("✅ GitHub OAuth: Successfully obtained access token");

    // Use token to fetch user info with timeout
    const userController = new AbortController();
    const userTimeout = setTimeout(() => userController.abort(), 10000); // 10秒超时

    let userRes;
    try {
      userRes = await fetch("https://api.github.com/user", {
        headers: { 
          Authorization: `Bearer ${access_token}`, 
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "EndlessPixel-Server/1.0"
        },
        signal: userController.signal
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error("❌ GitHub OAuth: User info fetch timeout");
        return NextResponse.json(
          { 
            error: "请求超时",
            message: "获取用户信息超时，请稍后重试",
            code: "TIMEOUT_ERROR"
          }, 
          { status: 504 }
        );
      }
      throw error;
    } finally {
      clearTimeout(userTimeout);
    }

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error(`❌ GitHub OAuth: User info fetch failed - ${userRes.status}`, errorText);
      
      return NextResponse.json(
        { 
          error: "获取用户信息失败",
          message: "无法从 GitHub 获取用户信息，请检查账户权限",
          code: "USER_INFO_FETCH_FAILED",
          status: userRes.status
        }, 
        { status: 502 }
      );
    }

    const user = await userRes.json();
    console.log(`👤 GitHub OAuth: Retrieved user info for ${user.login}`);

    // Try to fetch primary email if not present
    let primaryEmail: string | null = null;
    let verifiedEmail: string | null = null;
    
    if (!user.email) {
      console.log("📧 GitHub OAuth: Fetching user emails...");
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { 
          Authorization: `Bearer ${access_token}`, 
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "EndlessPixel-Server/1.0"
        },
      });
      
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primary = (emails || []).find((e: any) => e.primary && e.verified);
        const firstVerified = (emails || []).find((e: any) => e.verified);
        
        if (primary) {
          primaryEmail = primary.email;
          verifiedEmail = primary.email;
        } else if (firstVerified) {
          primaryEmail = firstVerified.email;
          verifiedEmail = firstVerified.email;
        } else if (emails.length > 0) {
          primaryEmail = emails[0].email;
        }
        
        console.log(`📧 GitHub OAuth: Found ${emails.length} email(s), using: ${primaryEmail}`);
      }
    } else {
      verifiedEmail = user.email;
    }

    // Construct user result with essential info
    const result = {
      provider: "github",
      login: user.login,
      id: user.id,
      name: user.name || user.login,
      avatar_url: user.avatar_url || null,
      email: user.email || primaryEmail,
      verified_email: verifiedEmail,
      profile_url: user.html_url,
      bio: user.bio || null,
      location: user.location || null,
      raw: {
        login: user.login,
        id: user.id,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        // Don't include sensitive or unnecessary raw data
      },
    };

    const executionTime = Date.now() - startTime;
    console.log(`✅ GitHub OAuth: Successfully authenticated user ${user.login} in ${executionTime}ms`);

    return NextResponse.json({ 
      ok: true, 
      user: result,
      execution_time: executionTime
    });

  } catch (err: any) {
    const executionTime = Date.now() - startTime;
    console.error("💥 GitHub OAuth: Unexpected error:", err);
    
    return NextResponse.json(
      { 
        error: "服务器内部错误",
        message: "身份验证过程中出现意外错误，请稍后重试",
        code: "INTERNAL_SERVER_ERROR",
        execution_time: executionTime
      }, 
      { status: 500 }
    );
  }
}