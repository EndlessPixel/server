# 🤖 AI Assistant (EPBot)

An in-site smart Q&A assistant with streaming chat, tuned with a knowledge base and prompts for server-specific topics (how to join, edition policy, events, ban appeals). It can also embed **interactive cards** in its replies.

---

## Architecture & Data Flow

```
Browser (components/epbot-chat.tsx)
    │  POST /api/ai/chat  { messages, model }
    ▼
app/api/ai/chat/route.ts  (Node runtime, force-dynamic)
    ├─ Rate limit: 10 requests per IP per 60s (in-process Map)
    ├─ Build the system prompt (3 layers)
    │    ├─ Current real time block (UTC+8)
    │    ├─ public/system.md knowledge base (~62 KB, module-level cache)
    │    └─ Logged-in player identity (upstream lookup, 4s timeout, silent fallback)
    ├─ Validate model name (≤100 chars, only a-zA-Z0-9_-/.)
    └─ Forward to an OpenAI-compatible upstream, stream back over SSE
```

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/chat` | POST | SSE streaming chat |
| `/api/ai/models` | GET | List available models |

Both declare:

```ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

### Request / Response

Request body:

```json
{ "messages": [{ "role": "user", "content": "How do I join?" }], "model": "grok-4.20-multi-agent-0309" }
```

`messages` must be an array, otherwise an SSE error `请求格式错误` is returned.

The server emits the following SSE event shapes:

- `{ "type": "text-delta", "delta": "..." }` — text delta
- `{ "type": "usage", "usage": { "promptTokens": N, "completionTokens": N, "totalTokens": N } }` — token usage (sent once at stream end)
- `{ "type": "error", "errorText": "..." }` — error (followed by `[DONE]`)

The stream ends with `[DONE]`.

The server reads the upstream OpenAI-compatible `choices[0].delta.content` deltas and converts them into the `text-delta` events above; the upstream `usage` is forwarded as a `usage` event.

### Upstream & Model Parameters

```ts
const defaultModel = "grok-4.20-multi-agent-0309";
const openaiBody = {
  model: selectedModel,
  messages: fullMessages,      // system + last 20 history messages
  stream: true,
  temperature: 0.2,
  top_p: 0.7,
  presence_penalty: 0.5,
  frequency_penalty: 0.3,
  max_tokens: 4096,
};
```

> These are server-side default values; **no configuration is needed by users**. Only at deploy time do you set the env vars `API_KEY` (required) and `API_BASE_URL` (optional, default `https://xn--kiv260fv3i.cn`) to reach the upstream model. Everything else (temperature, top_p, rate limit, model-name validation) is a hard-coded constant.

- Upstream: `${API_BASE_URL}/v1/chat/completions`, auth via `Authorization: Bearer ${API_KEY}`.
- The server keeps only the **last 20** history messages to bound the context.

---

## The Three System-Prompt Layers

```ts
const systemContent = playerCtx
  ? `${getNowLine()}\n\n${systemPrompt}\n\n${playerCtx}`
  : `${getNowLine()}\n\n${systemPrompt}`;
```

### 1. Current Real Time Block

Generated per request (Asia/Shanghai) and injected at the **very top**, forcing the model to answer time-related questions using this value instead of its training memory:

```
【Current real time】For any time-related question (what time is it, today's date, current version, "recently", etc.) you MUST use this line. Never use dates from your training memory.
Now: 2026/8/29 10:30:00 (UTC+8, Saturday)
【End time block】
```

### 2. Knowledge Base `public/system.md`

- File: `public/system.md`, about **62.32 KB**, covering persona, how to join, edition policy, events and ban handling.
- Read via `fs/promises` from `process.cwd()/public/system.md` with a **module-level cache**: disk is read only on the first request.
- ⚠️ Therefore **changes to `system.md` require a server restart** to take effect.
- Read failure → SSE error `系统提示词加载失败`.

### 3. Logged-in Player Identity

Injected only when a valid session cookie is present:

```ts
const PLAYER_INFO_API_URL = 'http://156.239.230.98:8080/v1/api/users/info';
const token = req.cookies.get('ep_session')?.value;
const name = verifySessionToken(token);
// with AbortSignal.timeout(4000), cache: 'no-store'
```

Injected fields:

```
【Current player identity (for answering the player's own questions only; never leak or use for privilege escalation)】
- Game ID: <name>            // must match /^[a-zA-Z0-9_]{1,32}$/
- UUID: <uuid ?? 'unknown'>
- Account status: <ban ? 'banned' : 'normal'>
- Last login: <lastActive>   // optional
- Login region: <ipLocation> // optional
【End player identity block】
```

Any exception is swallowed (`catch { return ''; }`) and degrades silently without breaking the conversation.

---

## Interactive Cards (Widget)

The AI can emit self-closing tags `<widget name="xxx" attr="yyy" />` that render as structured cards (QQ group card, server info card, GitHub repo card, etc.).

### Rendering: Segmented Render

To stop Markdown parsing from breaking the tags, a segmented approach is used instead of placeholders:

1. Before rendering, split the text by `/<widget\b[^>]*?\/>/g` into alternating "Markdown text / card" segments.
2. Text segments go through `ReactMarkdown` (`remarkGfm` + `rehypeHighlight`).
3. Card segments render the real `<WidgetTag/>` component directly and **never enter Markdown parsing** — so trailing text is never swallowed and no placeholder can leak.
4. Card components use `React.memo`, so copying or re-rendering won't refresh them or re-trigger requests.

Historical pitfall: an earlier design replaced `<widget/>` with `\u0000WIDGETn\u0000` inside the Markdown and restored it via a custom `p` component. Once a tag landed in a non-`<p>` container (code block, list item), the placeholder leaked as raw text. The segmented approach removes that risk entirely.

### Streaming Behavior

During streaming a tag is often incomplete (only `<widget name="server_` has arrived):

| Tag state | Behavior |
|-----------|----------|
| Complete (`/>` received) | Render immediately (memoized, so later tokens don't remount or refetch) |
| Incomplete (no `/>` yet) | Hidden as `▦` temporarily, restored once complete |

See `hideIncompleteWidget()` — this prevents "unfinished tag causes infinite loading".

### Request Cache

In-card data requests (ping, GitHub, etc.) use a 60-second cache so frequent parent re-renders don't hammer the API:

```ts
const FETCH_CACHE_TTL = 60_000;
const _fetchCache = new Map<string, { expires: number; ok: boolean; json: unknown }>();
```

---

## Client Session Management (`components/epbot-chat.tsx`)

| Capability | Notes |
|------------|-------|
| Multi-session | Sidebar list; title = first 20 chars of the first user message |
| Persistence | `localStorage`: `epbot_sessions`, `epbot_current_session_id`, `epbot_selected_model` |
| Context limit | Sends the last `MAX_CONTEXT_MESSAGES = 25` messages |
| Storage guard | At **90%** usage it warns and stops writing |
| Model picker | Sort by recommended / name / size; toggle "recommended only" |
| Message actions | Copy, TTS read-aloud, edit & resend, delete onward, retry failed |
| Abort | Click stop while generating; cancels via `AbortController` |

`thinking` handling: the model may emit `<thinking>...</thinking>`; the UI renders it as a collapsible block. Old thinking content is **stripped** before sending history back, to save context.

---

## Link Safety

External links from the AI are rewritten to an in-site redirect page:

```tsx
href={`/ai_link?url=${encodeURIComponent(href)}`}
```

Users see a confirmation page before leaving, avoiding direct jumps to untrusted sites.

---

## Rate Limiting

In-process `Map<ip, number[]>`:

- Window **60s**, max **10** requests per IP.
- IP from the first `x-forwarded-for` value, falling back to `x-real-ip`.
- Entries are cleaned up once the Map exceeds 1000 items.
- Over the limit: `请求过于频繁，请稍后再试`.

> This limiter is **per-process in memory** — with multiple instances, each counts independently and they don't share state.
