# 🧍 皮肤预览

使用 [skinview3d](https://github.com/bs-community/skinview3d) 在网页端以 WebGL 渲染玩家的 3D 皮肤与披风。

## 同源代理 `/api/skin`

浏览器直接拉取第三方皮肤源（如 crafatar）会触发 CORS，导致 skinview3d 加载失败。因此新增同源代理：

```
客户端 → /api/skin?uuid=<无符号UUID> → 服务端代理 crafatar → 返回 PNG
```

### 容错设计

- 上游返回 5xx / 超时 / 网络异常时，**不向客户端透传错误**，而是回退到默认皮肤（Mojang Steve：`069a79f444e94726a5befca90e38aaf5`）。
- 连默认皮肤也失败时，返回 1×1 透明 PNG（base64），始终返回 `200 image/png`，保证 skinview3d 不会崩溃白屏。
- `skin-viewer.tsx` 对 `loadSkin()` 做了 `.catch()` 兜底。

## 关于皮肤来源（微软官方 vs 皮肤站）

- **判定依据**：仅凭 UUID 无法稳定区分"皮肤站来源"与"微软官方来源"。实测 LittleSkin 的 Yggdrasil `profile/{uuid}` 接口对所有测试 UUID 均返回 `204`，无法作为分流依据。
- **当前方案**：统一从 crafatar（微软官方皮肤库代理）获取；获取失败时回退默认皮肤。该方案稳定、零外部依赖、基本不会出 bug。
- 若未来需支持"皮肤站用户显示其皮肤站皮肤"，前提是能从账户信息接口稳定拿到**角色名**，且仅适用于头像展示（非 3D 全身预览），并需注意 LittleSkin API 的 60 次/分钟限流与试验阶段不稳定性。
