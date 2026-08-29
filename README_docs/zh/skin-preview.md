# 🧍 皮肤预览

使用 [skinview3d](https://github.com/bs-community/skinview3d) 在浏览器以 WebGL 渲染玩家的 3D 皮肤与披风，用于个人中心和资料展示。

---

## 为什么需要同源代理

skinview3d 加载皮肤时会强制设置 `crossOrigin="anonymous"`。直接从浏览器请求第三方皮肤源会触发 CORS 限制，加载失败并抛出难以定位的 `[object Event]` 错误。

因此新增同源代理路由 `app/api/skin/route.ts`：

```
浏览器 skinview3d
    │  GET /api/skin?uuid=<无符号UUID>
    ▼
服务端代理 crafatar（微软官方皮肤库镜像）
    │  成功 → 200 image/png
    │  失败 → 回退默认皮肤
    ▼
浏览器（同源，无 CORS 问题）
```

---

## 容错设计（三级回退）

这是本模块最关键的部分 —— **任何情况下都返回 `200 image/png`，绝不向客户端透传上游错误**，否则 skinview3d 会崩溃导致白屏。

| 级别 | 条件 | 行为 |
|------|------|------|
| 1 | 上游 crafatar 正常 | 返回玩家皮肤 PNG |
| 2 | 上游 5xx / 超时 / 网络异常 | 回退**默认皮肤**（Mojang Steve，`069a79f444e94726a5befca90e38aaf5`） |
| 3 | 连默认皮肤也失败 | 返回 **1×1 透明 PNG**（base64 内联） |

所有 `fetch` 均用 `tryFetch` 包裹，防止异常穿透。

### 背景：线上 500 事故

线上曾出现 `/api/skin?uuid=918fd80899aa3cebb2da671df75a3f3f` 返回 500（响应体 `Skin not found`）。根因是 **crafatar 对该 UUID 自身返回 500，而路由直接透传了上游状态码**，导致前端 skinview3d 加载失败。修复方式即上表的三级回退：不再透传上游 5xx，最坏情况也只是显示默认皮肤。

### 前端兜底

`components/skin-viewer.tsx` 使用 `skinBase="proxy"` 走 `/api/skin`，并对 `loadSkin()` 加 `.catch()` 捕获，避免未处理的 Promise 拒绝。

---

## 关于皮肤来源（微软官方 vs 皮肤站）

一个常见的需求是"判断皮肤该从微软官方拿，还是从皮肤站拿"。结论：**仅凭 UUID 无法可靠区分，当前统一走官方源。**

### 实测结论（LittleSkin）

对 LittleSkin（Blessing Skin / authlib-injector 体系）做过完整 curl 实测：

| 测试项 | 结果 |
|--------|------|
| Yggdrasil `profile/{uuid}`（Steve、Notch、故障 UUID） | **一律 `204 No Content`** |
| 带连字符的 UUID | `404`（路径必须是**无符号** UUID） |
| `?unsigned=false` | 仍 `204` |
| `/players/{name}` | `405 Method Not Allowed` |
| `/avatar/player/{name}` | `200 image/webp`（可用，但只是头像小图） |

响应头确认了服务端身份与限流：

```
x-powered-by: Express
x-yggralt-req-id: 351914868204474368
x-ratelimit-limit: 60        # 每分钟 60 次
```

**关键**：`204` 既不代表"不在库"，也不代表"没有皮肤" —— 无法作为"皮肤站 vs 官方"的分流依据。例如 `/avatar/player/Notch` 返回 200（在库），但 Yggdrasil profile 仍返回 204。

### 因此采用的方案

- **统一从 crafatar 获取**（微软官方皮肤库镜像）；失败则回退默认皮肤。
- 优点：零外部判定依赖、无额外限流、基本不会出 bug。

### 若未来要支持皮肤站皮肤

需同时满足以下前提，并接受其局限：

1. 能稳定拿到**角色名**（当前皮肤站接口主要按 name 取，不按 UUID）。
2. 只适用于**头像展示** —— `/avatar/player/{name}` 返回的是 webp 小图，**不是** skinview3d 需要的全身皮肤 PNG；全身皮肤需鉴权或 tid，免鉴权拿不到。
3. 需处理 **60 次/分钟** 限流，做代理必须加缓存。
4. LittleSkin 官方声明其 API 处于**试验阶段，可能随时破坏性变更**。

综合收益与风险，当前不接入。

---

## 已知限制

- 披风渲染依赖上游数据，非所有账号都有。
- 皮肤站（第三方登录）玩家若未同步到官方库，会显示默认皮肤，而非其皮肤站皮肤（原因见上节）。
