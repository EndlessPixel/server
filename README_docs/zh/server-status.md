# 📡 服务器状态

实时查看 Minecraft 服务器的在线状态、玩家数、版本与延迟。

---

## 页面结构

```
/status                    服务状态索引（服务端组件，带独立 metadata）
└── /status/mcserverstatus MC 服务器状态详情（客户端组件，核心页面）
```

### 索引页 `/status`

服务端组件，导出完整 metadata（title「服务状态 - EndlessPixel Minecraft 服务器」、canonical `https://www.endlesspixel.cn/status/`、OG 图 `/banner.jpg`）。

结构：

1. 页头：标题 + 副标题。
2. **核心服务**区（`grid-cols-1 md:grid-cols-2`）：

```ts
const SERVICES: ServiceItem[] = [
  { name: "Minecraft 服务器状态", path: "/status/mcserverstatus", icon: Server,
    status: "online", description: "游戏服务器实时状态" },
  { name: "服务器性能监控", path: "http://sys.epmc.qzz.io", icon: Activity,
    status: "online", description: "服务器性能监控", external: true },
];
```

3. 底部「技术支持」：提交 Issue（GitHub）、加入 QQ 群（`https://qm.qq.com/q/sFrax2Ilxe`）。

> 说明：`ServiceItem.status` 支持 `online | offline | maintenance`，但**索引页 UI 并未渲染该状态灯**，外部服务仅显示「外部服务」标签。因此索引页是**静态入口导航**，不展示实时状态。

---

## 详情页 `/status/mcserverstatus`

客户端组件（`"use client"`），是全站状态展示的核心。

### 关键常量

```ts
const ACTIVE_NODE = { name: "主服务器", ip: "epmc.qzz.io" };
const CACHE_DURATION = 30000;   // sessionStorage 缓存 30 秒
const FETCH_TIMEOUT  = 8000;    // MC 状态请求超时 8 秒
// 延迟探测单独超时 10000 ms
// 刷新节流 2000 ms；防抖 1000 ms；首次加载延迟 100 ms
```

### ⚠️ 刷新机制：手动刷新，无自动轮询

**全站没有任何 `setInterval` 自动轮询。** 刷新的真实机制是：

| 触发方式 | 行为 |
|----------|------|
| 首次加载 | 挂载后 `setTimeout(..., 100)` 请求一次 |
| 「刷新」按钮 | 走 **1000 ms 防抖** |
| 「强制刷新」按钮 | 跳过 `sessionStorage` 缓存直接请求 |
| 节流保护 | 非强制刷新时，2 秒内不重复请求 |

> 之前文档写的"定期轮询服务器状态接口"与代码不符，已修正。状态是**打开页面时加载一次，之后需手动刷新**；30 秒内的重复访问走 sessionStorage 缓存。

### 三个并发数据源

```ts
const [data, ping, ip] = await Promise.all([
  fetchServerData(ACTIVE_NODE.ip, skipCache),  // /api/mcserver/epmc
  fetchServerPing(ACTIVE_NODE.ip),             // /api/ping/epmc
  fetchMyIp(),                                 // 获取当前公网 IP
]);
```

| 接口 | 文件 | 作用 |
|------|------|------|
| `/api/mcserver/epmc` | `app/api/mcserver/epmc/route.ts` | 代理 mcsrvstat.us 查询服务器状态（在线/人数/版本/MOTD/图标） |
| `/api/ping/epmc` | `app/api/ping/epmc/route.ts` | 代理延迟探测 |
| `/systemstatus/data` | `app/systemstatus/data/route.ts` | 宿主机硬件监控代理（上游 `TARGET_API_URL`） |
| `/api/webstatus` | `app/api/webstatus/route.ts` | 官网可达性探测（**目前无页面调用**） |

服务器图标缺失时使用 `public/default-server-icon.png` 兜底。

---

## 开服时长组件

`components/running-duration.tsx` 计算并展示服务器已运行时长，出现在：

- `components/footer.tsx`
- `components/contact-section.tsx`
- `components/epbot-widgets.tsx`（AI 助手的 `server_uptime` 卡片）

---

## AI 助手中的状态卡片

EPBot 可在回答中直接插入状态相关卡片（`components/epbot-widgets.tsx`）：

| widget name | 作用 |
|-------------|------|
| `server_status` | 服务器在线状态 |
| `server_ping` | 延迟探测结果 |
| `server_uptime` | 开服时长 |

---

## 降级策略

- 每个数据源独立超时（8s / 10s），单一接口失败不影响其他数据展示。
- 状态页自定义了骨架屏（未使用通用的 `ServerStatusSkeleton`）。
- 接口不可用时展示降级状态，不阻塞页面渲染。

---

## 已知限制

- 详情页是客户端组件，**没有 `metadata` 导出**，SEO 标题会回落到根 layout 模板（`"… | EndlessPixel - 免费MC服务器"`），与索引页的独立 title 不一致。
- 硬编码单节点（`ACTIVE_NODE`），目前只监控「主服务器」`epmc.qzz.io`，未做多节点抽象。
- 无自动轮询，需手动刷新才能看到最新状态。
