# 🤖 AI 助手（EPBot）

站内智能问答助手，基于流式聊天。针对服务器常见问题（接入方式、版本口径、活动、封禁申诉等）做了知识库与提示词优化，并能在回复中插入**交互卡片**。

---

## 架构与数据流

```
浏览器 (components/epbot-chat.tsx)
    │  POST /api/ai/chat  { messages, model }
    ▼
app/api/ai/chat/route.ts  (Node runtime, force-dynamic)
    ├─ 限流：每 IP 每 60 秒 10 次（进程内内存 Map）
    ├─ 组装 system 提示（三层）
    │    ├─ 当前真实时间块（UTC+8）
    │    ├─ public/system.md 知识库（约 62 KB，模块级缓存）
    │    └─ 登录玩家身份块（查上游玩家接口，4s 超时，失败静默降级）
    ├─ 校验模型名（≤100 字符，仅允许 a-zA-Z0-9_-/.）
    └─ 转发上游 OpenAI 兼容接口，流式回传 SSE
```

### 接口一览

| 接口 | 方法 | 作用 |
|------|------|------|
| `/api/ai/chat` | POST | SSE 流式对话 |
| `/api/ai/models` | GET | 拉取可用模型列表 |

两个路由均声明：

```ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

### 请求 / 响应

请求体：

```json
{ "messages": [{ "role": "user", "content": "怎么进服？" }], "model": "grok-4.20-multi-agent-0309" }
```

`messages` 必须是数组，否则返回 SSE error `请求格式错误`。

服务端以下发事件的形式回传 SSE，实际只有以下格式：

- `{ "type": "text-delta", "delta": "..." }` —— 文本增量
- `{ "type": "usage", "usage": { "promptTokens": N, "completionTokens": N, "totalTokens": N } }` —— 用量统计（流末发送一次）
- `{ "type": "error", "errorText": "..." }` —— 错误（随后以 `[DONE]` 结束）

流结束标记 `[DONE]`。

服务端读取上游 OpenAI 兼容接口的 `choices[0].delta.content` 增量，转换为上面的 `text-delta` 事件回传；上游返回的 `usage` 会转为 `usage` 事件下发。

### 上游与模型参数

```ts
const defaultModel = "grok-4.20-multi-agent-0309";
const openaiBody = {
  model: selectedModel,
  messages: fullMessages,      // system + 最近 20 条历史
  stream: true,
  temperature: 0.2,
  top_p: 0.7,
  presence_penalty: 0.5,
  frequency_penalty: 0.3,
  max_tokens: 4096,
};
```

- 上游地址：`${API_BASE_URL}/v1/chat/completions`，鉴权 `Authorization: Bearer ${API_KEY}`。
- 服务端只保留**最近 20 条**历史消息，避免上下文膨胀。

---

## 系统提示的三层结构

```ts
const systemContent = playerCtx
  ? `${getNowLine()}\n\n${systemPrompt}\n\n${playerCtx}`
  : `${getNowLine()}\n\n${systemPrompt}`;
```

### 1. 当前真实时间块

每次请求实时生成（Asia/Shanghai），注入提示词**最顶部**，强制 AI 以该时间为准，禁止使用训练记忆里的日期：

```
【当前真实时间】回答一切与时间相关的问题（现在几点、今天几号、当前版本、最近等）必须以这一行时间为准，严禁使用你训练记忆里的日期。
Now: 2026/8/29 10:30:00 (UTC+8, 星期六)
【结束时间块】
```

### 2. 知识库 `public/system.md`

- 文件：`public/system.md`，约 **62.32 KB**，含角色设定、接入方式、版本口径、活动与封禁处理等。
- 通过 `fs/promises` 读取 `process.cwd()/public/system.md`，**模块级变量缓存**：只有首次请求读盘。
- ⚠️ 因此**修改 `system.md` 后需重启服务才生效**。
- 读取失败 → SSE error `系统提示词加载失败`。

### 3. 登录玩家身份块

仅当请求携带有效会话 Cookie 时注入：

```ts
const PLAYER_INFO_API_URL = 'http://156.239.230.98:8080/v1/api/users/info';
const token = req.cookies.get('ep_session')?.value;
const name = verifySessionToken(token);
// 带 AbortSignal.timeout(4000)，cache: 'no-store'
```

注入字段：

```
【当前玩家身份（仅供回答玩家本人相关问题时参考，禁止对外泄露或用于越权操作）】
- 游戏 ID：<name>            // 需通过 /^[a-zA-Z0-9_]{1,32}$/ 校验
- UUID：<uuid ?? '未知'>
- 账号状态：<ban ? '已被封禁' : '正常'>
- 最后登录时间：<lastActive>  // 可选
- 登录属地：<ipLocation>      // 可选
【结束玩家身份块】
```

任何异常均 `catch { return ''; }`，静默降级为空，不影响对话。

---

## 交互卡片（Widget）

AI 可在回复中输出自闭合标签 `<widget name="xxx" attr="yyy" />`，前端渲染为结构化卡片（如 QQ 群卡片、服务器信息卡、GitHub 仓库卡等）。

### 渲染机制：分段渲染

为避免 Markdown 解析破坏标签，采用分段法而非占位符：

1. 渲染前按 `/<widget\b[^>]*?\/>/g` 把文本切分为交替的「Markdown 文本段 / 卡片段」。
2. 文本段交给 `ReactMarkdown`（`remarkGfm` + `rehypeHighlight`）渲染。
3. 卡片段直接渲染真实组件 `<WidgetTag/>`，**永不进入 Markdown 解析** —— 因此不会被吞掉后续文本，也不会漏出占位符。
4. 卡片组件使用 `React.memo`，复制或重渲染不会导致刷新、也不会重复请求。

历史坑位：早期方案把 `<widget/>` 替换成 `\u0000WIDGETn\u0000` 塞进 Markdown，靠自定义 `p` 组件还原。一旦标签被解析到非 `<p>` 容器（代码块、列表项），占位符就会漏成裸文字。分段法彻底消除了该风险。

### 流式阶段的特殊处理

流式输出时标签常不完整（只到了 `<widget name="server_`）。处理策略：

| 标签状态 | 行为 |
|----------|------|
| 完整（已收到 `/>`） | 立即渲染（组件 memo，后续 token 不会重挂载，不会重复请求） |
| 不完整（行尾无 `/>`） | 临时隐藏为 `▦`，待完成后自动还原 |

实现见 `hideIncompleteWidget()`，避免"未完成标签触发无限 loading"。

### 请求缓存

卡片内的数据请求（ping、GitHub 等）走 60 秒缓存，避免父组件频繁重渲染时重复打接口：

```ts
const FETCH_CACHE_TTL = 60_000;
const _fetchCache = new Map<string, { expires: number; ok: boolean; json: unknown }>();
```

---

## 前端会话管理（`components/epbot-chat.tsx`）

| 能力 | 说明 |
|------|------|
| 多会话 | 侧边栏管理，标题取首条用户消息前 20 字 |
| 持久化 | `localStorage`，key：`epbot_sessions` / `epbot_current_session_id` / `epbot_selected_model` |
| 上下文上限 | 发送时取最近 `MAX_CONTEXT_MESSAGES = 25` 条 |
| 存储保护 | 用量达 **90%** 时提示"存储空间即将用尽"并停止写入 |
| 模型选择 | 推荐优先 / 按名称 / 按参数量排序；可"仅显示推荐" |
| 消息操作 | 复制、朗读（TTS）、编辑重发、删除后续、重试失败请求 |
| 中断 | 生成中可点击停止，`AbortController` 取消 |

`thinking` 处理：模型可用 `<thinking>...</thinking>` 输出推理过程，前端渲染为可折叠区块；**回传历史时会剥离**旧的 thinking 内容以节省上下文。

---

## 链接安全

AI 输出的外链统一改写为站内中转页：

```tsx
href={`/ai_link?url=${encodeURIComponent(href)}`}
```

用户先看到中转提示再跳转，避免直接跳到不可信站点。

---

## 限流

进程内内存 `Map<ip, number[]>`：

- 窗口 **60 秒**，每 IP 最多 **10 次**。
- IP 取自 `x-forwarded-for` 首个值，回退 `x-real-ip`。
- `Map` 超过 1000 条时清理过期条目。
- 超限返回 `请求过于频繁，请稍后再试`。

> 该限流是**单进程内存态**，多实例部署时各实例独立计数，不共享。
