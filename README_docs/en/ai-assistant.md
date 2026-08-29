# 🤖 AI Assistant (epbot)

An in-site smart Q&A assistant with streaming chat, tuned via knowledge base and prompts for server-specific topics (how to join, versions, events, ban appeals, etc.).

## Core Capabilities

- **Streaming replies**: token-by-token output for a smooth experience; on complex questions the AI is guided to use `<thinking>` for multi-step reasoning.
- **Server context injection**: server status, version, and knowledge base (including the "Java Edition only; no Bedrock / web client" policy) are injected into the system prompt so answers stay on-topic.
- **Interactive cards (Widget)**: the AI can embed structured cards in its reply, e.g. a QQ-group card or server-info card, that users can view/copy directly.

## Card Rendering

To prevent Markdown parsing from breaking widget tags, a **segmented render** is used:

1. Before rendering, split the text by self-closing `<widget .../>` into alternating "Markdown text segments / card segments".
2. Text segments go through ReactMarkdown; card segments render the real component (`<WidgetTag/>`) directly and **never enter Markdown parsing**, so they can't be swallowed or leak as placeholder text.
3. Card components use `React.memo`, so copy/re-render won't trigger a refresh or duplicate requests.
4. While streaming, a **complete** `<widget/>` renders immediately; an **incomplete** one (no `/>` yet) is hidden temporarily and restored once complete, avoiding infinite loading.

## Link Safety

External links from the AI are rewritten to an in-site redirect page (`/ai_link?url=...`) that can warn before opening, preventing direct jumps to risky links.
