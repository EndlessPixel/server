"use client";
import { useEffect, useRef, useState, memo, useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import {
  Send,
  Plus,
  Trash2,
  Menu,
  X,
  Edit2,
  Check,
  X as XIcon,
  Settings,
  Search,
  AlertCircle,
  Star,
  Filter,
  ChevronLeft,
  Minimize2,
  MessageCircle,
  RotateCw,
  Brain,
  ChevronDown,
  Copy,
  Volume2,
  Square,
} from "lucide-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { cn } from "@/lib/utils";
import { speech, markdownToPlainText } from "@/lib/speech";
import { WidgetTag } from "@/components/epbot-widgets";

/**
 * 直接渲染模型输出的 Markdown（含独立行的 <widget> 标签）。
 *
 * 关键修复：之前直接把 <widget> 交给 rehype-raw 当 HTML 解析，未知标签在
 * 解析/映射阶段极易把标签之后的文本一起"吞掉"（表现为卡片后面的回答看不到）。
 * 这里改用占位符法：先把每个 <widget .../> 替换成唯一占位 token，让
 * react-markdown 完全不碰它；渲染时再用自定义 `p` 组件把 token 还原成卡片。
 * 这样 widget 绝不会干扰周围文本，后续内容 100% 保留。
 */
/**
 * 分段渲染：在交给 ReactMarkdown 之前，先把文本按自闭合 `<widget .../>`
 * 切成交替的「文本段 / widget 段」。文本段走 ReactMarkdown（卡片绝不会被
 * markdown 解析破坏），widget 段直接渲染成真实 <WidgetTag/> 节点。
 *
 * 之前用 \u0000 占位 token 放进 markdown 文本节点，再靠自定义 `p` 组件还原。
 * 但一旦标签被 markdown 解析到非 <p> 容器（代码块、列表项、或当作裸 HTML），
 * token 就会漏成裸文字 \u0000WIDGET0\u0000。分段法彻底消除这个风险：
 * widget 根本不进入 markdown，也就不可能漏出占位符。
 */
const WidgetsWithText = memo(function WidgetsWithText({ text }: { text: string }) {
  const segments = useMemo(() => {
    const out: { type: "md" | "widget"; value: string }[] = [];
    // 匹配独占一行或内联的自闭合 widget 标签（允许前后空白/换行）。
    const re = /<widget\b[^>]*?\/>/g;
    let last = 0;
    let mm: RegExpExecArray | null;
    while ((mm = re.exec(text)) !== null) {
      if (mm.index > last) {
        out.push({ type: "md", value: text.slice(last, mm.index) });
      }
      out.push({ type: "widget", value: mm[0] });
      last = re.lastIndex;
    }
    if (last < text.length) {
      out.push({ type: "md", value: text.slice(last) });
    }
    return out;
  }, [text]);

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "widget" ? (
          <WidgetTag key={`w-${i}`} {...parseWidgetAttrs(seg.value)} />
        ) : (
          <ReactMarkdown
            key={`md-${i}`}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={
              {
                a: ({ href, ...props }: ComponentPropsWithoutRef<"a">) => {
                  if (!href) return <a {...props} />;
                  const encodedUrl = encodeURIComponent(href);
                  return (
                    <a
                      href={`/ai_link?url=${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  );
                },
              } as unknown as Components
            }
          >
            {seg.value}
          </ReactMarkdown>
        ),
      )}
    </>
  );
});

/** Parse <widget name="x" foo="bar" /> into a props object. */
function parseWidgetAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w+)\s*=\s*"([^"]*)"/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(tag))) {
    attrs[mm[1]] = mm[2];
  }
  return attrs;
}

/**
 * Streaming helper: hide widget tags that haven't fully arrived yet.
 * A complete self-closing tag `<widget ... />` is left intact so it can be
 * rendered by WidgetsWithText. An incomplete one (e.g. `<widget name="server_`)
 * is replaced with a neutral placeholder so it doesn't show as raw text or a
 * broken card mid-stream.
 */
function hideIncompleteWidget(text: string): string {
  return text.replace(/<widget\b[\s\S]*?$/m, (m) => (/\/>\s*$/.test(m) ? m : "▦ "));
}

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export interface EPBotChatProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

type MessageRole = "user" | "assistant";
type Message = {
  role: MessageRole;
  content: string;
  timestamp: number;
  senderName: string;
  failed?: boolean;
  /** 失败是否属于服务端问题；false（403/429 等请求侧问题）时不展示链路自检 */
  serverSideFailed?: boolean;
};

interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface Model {
  id: string;
  name: string;
  owned_by: string;
  object?: string;
  created?: number;
  recommended?: boolean;
  category?: "general" | "code" | "vision" | "embedding" | "safety" | "other";
  size?: string;
}

const STORAGE_KEY = "epbot_sessions";
const CURRENT_SESSION_KEY = "epbot_current_session_id";
const SELECTED_MODEL_KEY = "epbot_selected_model";
const MAX_STORAGE_PERCENT = 0.9;
const MAX_CONTEXT_MESSAGES = 25;
const DEFAULT_MODEL_ID = "grok-4.6";
// 根据 futureppo 实际可用模型，按综合实力精选推荐（覆盖各厂商旗舰/主力聊天模型）。
// 仅匹配明确强的大模型系列，排除 lite/codex/reasoning/translate/vision 等轻量或专项变体。
const RECOMMENDED_PATTERNS = [
  /grok-4\.6/i,
  /grok-chat-(?:fast|expert)/i,
  /gpt-5\.6/,
  /gpt-5\.[2-9](?!-(?:codex|sol|terra|luna|chat))/i,
  /gpt-5\.1/i,
  /gpt-5-mini/i,
  /gpt-4o/i, // GPT-4o 经典通用
  /gpt-oss-(?:20|120)b/i, // 开源 GPT-OSS
  /gemini-2\.5-(?:pro|flash)$/i, // Gemini 2.5 双档（不含 lite）
  /gemini-3\.[0-9]-flash$/i, // Gemini 3.x 闪速档（不含 lite/preview-tts）
  /gemini-3-flash-preview/i,
  /deepseek-v4-(?:pro|flash)/i, // DeepSeek V4 主力
  /qwen3-(?:30b-a3b|14b|3\.5-2b)/i, // 通义千问主力档
  /glm-5\.2/i, // 智谱 GLM 旗舰
  /zai-glm-4\.7/i,
  /llama-4-maverick/i, // Meta Llama 4 旗舰
  /kimi-thinking/i, // 月之暗面
  /minimax-m3/i, // MiniMax
  /nemotron-3-(?:ultra|super-120b)/i, // Nemotron 大模型
];
const extractModelSize = (id: string): string => {
  const matches = id.match(/(\d+)b/i);
  if (matches) return `${matches[1]}B`;
  return "";
};

const getStorageUsagePercent = (): number => {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || "";
        total += (key.length + value.length) * 2;
      }
    }
    const quota = 5 * 1024 * 1024;
    return total / quota;
  } catch {
    return 0;
  }
};

const generateTitle = (messages: Message[]): string => {
  const firstUserMsg = messages.find((m) => m.role === "user")?.content || "";
  return firstUserMsg.slice(0, 20) + (firstUserMsg.length > 20 ? "…" : "") || "新对话";
};

// ---- <thinking> tag parsing -------------------------------------------
// The model is instructed to optionally start its reply with a single
// <thinking>...</thinking> block. We parse it out so the UI can render the
// reasoning as a collapsible section, including the streaming middle state
// where the closing tag has not arrived yet.
const THINKING_OPEN = "<thinking>";
const THINKING_CLOSE = "</thinking>";

type ParsedThinking = {
  thinking: string;
  answer: string;
  /** false while streaming inside an unclosed <thinking> block */
  thinkingDone: boolean;
};

const parseThinking = (content: string): ParsedThinking => {
  const trimmed = content.trimStart();
  const lower = trimmed.toLowerCase();
  // Streaming edge case: we only received a partial opening tag (e.g. "<think").
  // Hide it instead of flashing raw tag text.
  if (
    trimmed.length > 0 &&
    trimmed.length < THINKING_OPEN.length &&
    THINKING_OPEN.startsWith(lower)
  ) {
    return { thinking: "", answer: "", thinkingDone: false };
  }
  if (!lower.startsWith(THINKING_OPEN)) {
    return { thinking: "", answer: content, thinkingDone: true };
  }
  const rest = trimmed.slice(THINKING_OPEN.length);
  const closeIdx = rest.toLowerCase().indexOf(THINKING_CLOSE);
  if (closeIdx === -1) {
    // Opening tag seen, closing tag not yet streamed in.
    return { thinking: rest.trim(), answer: "", thinkingDone: false };
  }
  return {
    thinking: rest.slice(0, closeIdx).trim(),
    answer: rest.slice(closeIdx + THINKING_CLOSE.length).replace(/^\s+/, ""),
    thinkingDone: true,
  };
};

// Remove thinking blocks before sending history back to the model, so the
// context window is not wasted on old reasoning traces.
const stripThinking = (content: string): string => {
  const stripped = content.replace(/<thinking>[\s\S]*?<\/thinking>\s*/gi, "").trim();
  return stripped || content;
};

// Collapsible reasoning section rendered above the assistant answer.
const ThinkingBlock = ({ thinking, streaming }: { thinking: string; streaming: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="not-prose mb-2 overflow-hidden rounded-xl border border-border bg-background text-xs">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <Brain className={cn("h-3.5 w-3.5 shrink-0", streaming && "animate-pulse")} />
        <span>{streaming ? "思考中…" : "已完成思考"}</span>
        <ChevronDown
          className={cn(
            "ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>
      {(expanded || streaming) && thinking && (
        <div className="px-3 pb-2.5 leading-relaxed whitespace-pre-wrap text-muted-foreground/80">
          {thinking}
        </div>
      )}
    </div>
  );
};

// Animated "EPBot is typing" indicator shown in the empty assistant bubble
// while a response is being generated (waiting for the first token).
const TypingIndicator = () => (
  <div className="flex items-center gap-1 py-1.5" aria-label="EPBot 正在输入">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

/** 链路自检的一层 */
type HealthLayer = { id: string; label: string; ok: boolean };

/** 自检结果短时缓存：同一次故障里多条失败消息不必重复探测 */
const HEALTH_CACHE_TTL = 30_000;
let healthCache: { at: number; layers: HealthLayer[] } | null = null;

/**
 * AI 链路自检指示器：在失败消息下方展示「断在哪一层」。
 * 探测由 /api/ai/health 在服务端完成，这里只负责展示。
 */
const AiHealthBoard = () => {
  const [layers, setLayers] = useState<HealthLayer[] | null>(null);
  const [probeFailed, setProbeFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    if (healthCache && Date.now() - healthCache.at < HEALTH_CACHE_TTL) {
      setLayers(healthCache.layers);
      return;
    }
    fetch("/api/ai/health")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { layers?: HealthLayer[] }) => {
        if (!Array.isArray(data.layers)) throw new Error("响应格式异常");
        healthCache = { at: Date.now(), layers: data.layers };
        if (alive) setLayers(data.layers);
      })
      .catch(() => {
        if (alive) setProbeFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // 第一个不通的层就是断点。前两层恒为 true，所以断点只可能落在
  // nginx / 代理服务器 / 上游服务 上。
  const broken = layers?.find((layer) => !layer.ok);
  const summary = broken ? `断点在「${broken.label}」` : "";

  return (
    <div className="mt-1 flex flex-col gap-1 text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-muted-foreground/60">链路自检</span>
        {probeFailed ? (
          <span className="text-muted-foreground/60">探测失败</span>
        ) : !layers ? (
          <span className="text-muted-foreground/60">探测中…</span>
        ) : (
          layers.map((layer) => (
            <span
              key={layer.id}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5",
                layer.ok
                  ? "bg-secondary text-muted-foreground"
                  : "bg-destructive/10 font-medium text-destructive",
              )}
            >
              {layer.label}
              {layer.ok ? <Check className="h-3 w-3" /> : <XIcon className="h-3 w-3" />}
            </span>
          ))
        )}
      </div>
      {summary && (
        <span className="flex items-center gap-1 text-muted-foreground/60">
          <AlertCircle className="h-3 w-3" />
          {summary}
        </span>
      )}
    </div>
  );
};

export const EPBotChat = ({ isOpen, onClose, className }: EPBotChatProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [toast, setToast] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(true);
  const [modelSortBy, setModelSortBy] = useState<"recommended" | "name" | "size">("recommended");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSessionIdRef = useRef(currentSessionId);
  const loadingRef = useRef(loading);
  const messagesRef = useRef(messages);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modelPanelRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const sendingRef = useRef(false);
  const composingRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userScrolledUpRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);
  useEffect(() => {
    loadingRef.current = loading;
    sendingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const getSenderName = () => {
    const user = getCookie("mc_user");
    return user || "用户";
  };
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setToast("");
    }, 2800);
  };
  const isRecommendedModel = (modelId: string): boolean => {
    return RECOMMENDED_PATTERNS.some((pattern) => pattern.test(modelId));
  };
  const loadModels = async () => {
    if (modelsLoaded || loadingModels) return;
    setLoadingModels(true);
    try {
      const response = await fetch("/api/ai/models");
      if (!response.ok) throw new Error("Failed to load models");
      const data = await response.json();
      const modelList = data.data || [];
      if (Array.isArray(modelList)) {
        const processedModels: Model[] = modelList.map((model) => ({
          id: model.id,
          name: model.id.split("/").pop() || model.id,
          owned_by: model.owned_by || "unknown",
          object: model.object,
          created: model.created,
          recommended: isRecommendedModel(model.id),
          size: extractModelSize(model.id),
        }));
        setModels(processedModels);
        const savedModel = localStorage.getItem(SELECTED_MODEL_KEY);
        if (savedModel && processedModels.some((m) => m.id === savedModel)) {
          setSelectedModel(savedModel);
        } else {
          // Prefer the configured DEFAULT_MODEL_ID, then any recommended
          // model, then fall back to the first available model.
          const defaultModel = processedModels.find((m) => m.id === DEFAULT_MODEL_ID);
          const recommendedModel = processedModels.find((m) => m.recommended);
          const fallback = defaultModel || recommendedModel || processedModels[0];
          if (fallback) setSelectedModel(fallback.id);
        }
        setModelsLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
      showToast("❌ 加载模型列表失败");
    } finally {
      setLoadingModels(false);
    }
  };
  useEffect(() => {
    if (!models.length) return;
    let filtered = [...models];
    if (modelSearchQuery.trim()) {
      const query = modelSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.id.toLowerCase().includes(query) ||
          model.name.toLowerCase().includes(query) ||
          model.owned_by.toLowerCase().includes(query),
      );
    }
    if (showRecommendedOnly) {
      filtered = filtered.filter((model) => model.recommended);
    }
    if (modelSortBy === "recommended") {
      filtered.sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.name.localeCompare(b.name);
      });
    } else if (modelSortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (modelSortBy === "size") {
      filtered.sort((a, b) => {
        const sizeA = a.size ? parseInt(a.size) || 0 : 0;
        const sizeB = b.size ? parseInt(b.size) || 0 : 0;
        return sizeB - sizeA;
      });
    }
    setFilteredModels(filtered);
  }, [models, modelSearchQuery, showRecommendedOnly, modelSortBy]);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem(SELECTED_MODEL_KEY, modelId);
    const model = models.find((m) => m.id === modelId);
    showToast(`✅ 已切换到 ${model?.name || modelId}`);
    setShowModelPanel(false);
    setModelSearchQuery("");
  };

  const removeEmptyAssistantPlaceholder = () => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSessionIdRef.current) return s;
        const msgs = [...s.messages];
        if (
          msgs.length > 0 &&
          msgs[msgs.length - 1].role === "assistant" &&
          msgs[msgs.length - 1].content === ""
        ) {
          msgs.pop();
        }
        return { ...s, messages: msgs };
      }),
    );
    setMessages((prev) => {
      if (
        prev.length > 0 &&
        prev[prev.length - 1].role === "assistant" &&
        prev[prev.length - 1].content === ""
      ) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const cancelCurrentRequest = () => {
    if (!loadingRef.current && !sendingRef.current) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    sendingRef.current = false;
    removeEmptyAssistantPlaceholder();
  };

  const updateCurrentMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSessionIdRef.current) return s;
        const title =
          s.title === "新对话" && newMessages.length > 0 ? generateTitle(newMessages) : s.title;
        return { ...s, messages: newMessages, title };
      }),
    );
  };

  const sendMessage = async (text: string, historyOverride?: Message[]) => {
    if (!text.trim() || sendingRef.current) return;

    sendingRef.current = true;
    setEditId(null);

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: Date.now(),
      senderName: getSenderName(),
    };

    const newHistory = [
      ...(historyOverride ?? messagesRef.current).slice(-MAX_CONTEXT_MESSAGES),
      userMsg,
    ];

    const withPlaceholder: Message[] = [
      ...newHistory,
      {
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        senderName: "EPBot",
      },
    ];
    updateCurrentMessages(withPlaceholder);
    setInput("");
    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    let reply = "";
    let receivedContent = false;
    // 失败是否属于服务端问题：只有服务端问题才在消息下方展示链路自检。
    // 默认按服务端问题处理，遇到 403/429 这类请求侧响应再改回 false。
    let serverSideFailed = true;
    try {
      await fetchEventSource("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Strip old <thinking> blocks from assistant turns to save context.
          messages: newHistory.map((msg) =>
            msg.role === "assistant" ? { ...msg, content: stripThinking(msg.content) } : msg,
          ),
          model: selectedModel || undefined,
        }),
        signal: controller.signal,
        async onopen(response) {
          if (!response.ok) {
            // 认证失败 / 被限流不是服务器的锅，别弹自检给玩家看
            if (response.status === 403 || response.status === 429) {
              serverSideFailed = false;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        },
        onmessage(ev) {
          if (ev.data === "[DONE]") return;
          try {
            const j = JSON.parse(ev.data);

            if (j.type === "error") {
              const errorMsg = j.message || j.errorText || "未知错误";
              const fullErrorMsg = `错误：${errorMsg}`;
              reply = fullErrorMsg;
              receivedContent = true;
              // 后端标记了 serverSide 就用它；缺字段时按服务端问题处理
              serverSideFailed = j.serverSide !== false;

              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id !== currentSessionIdRef.current) return s;
                  const msgs = [...s.messages];
                  const last = msgs[msgs.length - 1];
                  if (last?.role === "assistant") {
                    msgs[msgs.length - 1] = {
                      ...last,
                      content: fullErrorMsg,
                      failed: true,
                      serverSideFailed,
                    };
                  }
                  return { ...s, messages: msgs };
                }),
              );
              setMessages((prev) => {
                const newMsgs = [...prev];
                const last = newMsgs[newMsgs.length - 1];
                if (last?.role === "assistant") {
                  newMsgs[newMsgs.length - 1] = {
                    ...last,
                    content: fullErrorMsg,
                    failed: true,
                    serverSideFailed,
                  };
                }
                return newMsgs;
              });

              showToast(`❌ ${errorMsg}`);
              return;
            }

            let content = "";
            if (j.type === "text-delta" && j.delta) content = j.delta;
            else if (j.content) content = j.content;
            else if (j.choices?.[0]?.delta?.content) content = j.choices[0].delta.content;

            if (content) {
              reply += content;
              receivedContent = true;
              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id !== currentSessionIdRef.current) return s;
                  const msgs = [...s.messages];
                  const last = msgs[msgs.length - 1];
                  if (last?.role === "assistant") {
                    msgs[msgs.length - 1] = {
                      ...last,
                      content: reply,
                    };
                  }
                  return { ...s, messages: msgs };
                }),
              );
              setMessages((prev) => {
                const newMsgs = [...prev];
                const last = newMsgs[newMsgs.length - 1];
                if (last?.role === "assistant") {
                  newMsgs[newMsgs.length - 1] = {
                    ...last,
                    content: reply,
                  };
                }
                return newMsgs;
              });
            }
          } catch {
            console.warn("SSE parse error:", ev.data);
          }
        },
        onerror(err) {
          if (!controller.signal.aborted) {
            showToast("❌ 连接中断，请重试");
          }
          // Do NOT remove the placeholder here. Let finally() replace the
          // empty placeholder with a clear fallback message so the bubble
          // never silently disappears.
          throw err; // Prevent fetchEventSource from retrying
        },
      });
    } catch {
      // Connection/open errors are already surfaced via onerror.
      // Aborted (user-initiated) requests need no extra handling.
    } finally {
      setLoading(false);
      sendingRef.current = false;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      // Replace the empty assistant placeholder with a fallback message.
      // Skip when the request was aborted by the user (delete/edit/switch),
      // because the user's action already replaced the message list.
      if (!controller.signal.aborted && (reply === "" || !receivedContent)) {
        const fallbackMsg: Message = {
          role: "assistant",
          content: "抱歉，模型未返回有效回复，请重试或切换模型。",
          timestamp: Date.now(),
          senderName: "EPBot",
          failed: true,
          serverSideFailed,
        };
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== currentSessionIdRef.current) return s;
            const msgs = [...s.messages];
            if (
              msgs.length > 0 &&
              msgs[msgs.length - 1].role === "assistant" &&
              msgs[msgs.length - 1].content === ""
            ) {
              msgs[msgs.length - 1] = fallbackMsg;
            }
            return { ...s, messages: msgs };
          }),
        );
        setMessages((prev) => {
          const newMsgs = [...prev];
          if (
            newMsgs.length > 0 &&
            newMsgs[newMsgs.length - 1].role === "assistant" &&
            newMsgs[newMsgs.length - 1].content === ""
          ) {
            newMsgs[newMsgs.length - 1] = fallbackMsg;
          }
          return newMsgs;
        });
      }
    }
  };

  const send = () => {
    if (input.trim() && !sendingRef.current) sendMessage(input.trim());
  };

  // Retry the last request: drop the trailing failed assistant message and
  // re-send the last user message. Uses the same historyOverride pattern as
  // saveEdit to avoid reintroducing stale messages.
  const retryLast = () => {
    if (sendingRef.current || loadingRef.current) return;
    const msgs = messagesRef.current;
    let lastUserIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return;
    const userMsg = msgs[lastUserIndex];
    const truncated = msgs.slice(0, lastUserIndex);
    updateCurrentMessages(truncated);
    sendMessage(userMsg.content, truncated);
  };

  const deleteMessage = (index: number) => {
    if (loadingRef.current || sendingRef.current) {
      cancelCurrentRequest();
    }
    updateCurrentMessages(messages.slice(0, index));
    showToast("✅ 已删除后续消息");
  };

  const startEdit = (index: number, content: string) => {
    setEditId(index);
    setEditContent(content);
  };

  const saveEdit = (index: number) => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      showToast("⚠️ 内容不能为空");
      setEditId(null);
      return;
    }
    const truncated = messages.slice(0, index);
    updateCurrentMessages(truncated);
    setEditId(null);
    // Pass the truncated history explicitly: messagesRef.current is only
    // synced after render, so it would otherwise still contain the old
    // (edited + assistant) messages, leaving stale entries behind.
    sendMessage(trimmed, truncated);
  };

  const createNewSession = () => {
    if (loadingRef.current || sendingRef.current) cancelCurrentRequest();
    setEditId(null);
    setEditContent("");
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: "新对话",
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setMobileNavOpen(false);
  };

  const deleteSession = (id: string) => {
    if ((loadingRef.current || sendingRef.current) && id === currentSessionIdRef.current) {
      cancelCurrentRequest();
    }
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const newSession: Session = {
          id: crypto.randomUUID(),
          title: "新对话",
          messages: [],
          createdAt: Date.now(),
        };
        setCurrentSessionId(newSession.id);
        setMessages([]);
        showToast("✅ 会话已删除");
        return [newSession];
      }
      if (id === currentSessionIdRef.current) {
        const nextSession = filtered[0];
        setCurrentSessionId(nextSession.id);
        setMessages(nextSession.messages);
      }
      showToast("✅ 会话已删除");
      return filtered;
    });
  };

  const switchSession = (id: string) => {
    if (loadingRef.current || sendingRef.current) cancelCurrentRequest();
    setCurrentSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session) setMessages(session.messages);
    else setMessages([]);
    setMobileNavOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !composingRef.current) {
      e.preventDefault();
      send();
    }
  };

  // 初始化
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    const savedCurrentId = localStorage.getItem(CURRENT_SESSION_KEY);
    let parsedSessions: Session[] = [];
    if (savedSessions) {
      try {
        parsedSessions = JSON.parse(savedSessions);
      } catch {}
    }
    if (parsedSessions.length === 0) {
      const defaultSession: Session = {
        id: crypto.randomUUID(),
        title: "新对话",
        messages: [],
        createdAt: Date.now(),
      };
      parsedSessions = [defaultSession];
    }
    setSessions(parsedSessions);
    let targetId = savedCurrentId;
    if (!targetId || !parsedSessions.find((s) => s.id === targetId))
      targetId = parsedSessions[0].id;
    setCurrentSessionId(targetId);
    const targetSession = parsedSessions.find((s) => s.id === targetId);
    if (targetSession) setMessages(targetSession.messages);

    const savedModel = localStorage.getItem(SELECTED_MODEL_KEY);
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  // Cleanup on unmount: abort requests and clear timers
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      speech.cancel();
      setSpeakingId(null);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      const usage = getStorageUsagePercent();
      if (usage >= MAX_STORAGE_PERCENT) showToast("⚠️ 存储空间即将用尽，请删除部分对话");
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId) localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
  }, [currentSessionId]);

  // Auto-scroll on new messages, but only if user hasn't scrolled up
  useEffect(() => {
    if (!userScrolledUpRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChatScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const threshold = 60;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    userScrolledUpRef.current = !isAtBottom;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (showModelPanel && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showModelPanel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showModelPanel &&
        modelPanelRef.current &&
        !modelPanelRef.current.contains(event.target as Node)
      ) {
        setShowModelPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModelPanel]);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentModel = models.find((m) => m.id === selectedModel);
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all",
        className,
      )}
    >
      {toast && (
        <div className="fixed top-4 left-1/2 z-60 -translate-x-1/2 rounded-lg bg-foreground/90 px-5 py-2 text-sm whitespace-nowrap text-background shadow-lg backdrop-blur-lg">
          {toast}
        </div>
      )}

      <div className="relative flex h-full w-full overflow-hidden bg-background shadow-2xl md:h-[90vh] md:w-[80%] md:max-w-300 md:min-w-100 md:rounded-2xl">
        {/* 移动端侧边栏遮罩 */}
        {mobileNavOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
        {/* 左侧边栏：桌面内联，移动端浮层抽屉 */}
        <div
          className={cn(
            "flex h-full shrink-0 flex-col bg-card",
            "absolute inset-y-0 left-0 z-40 max-w-[80vw] transition-transform duration-300 md:static md:z-auto md:max-w-none md:translate-x-0 md:transition-none",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full",
            sidebarCollapsed ? "md:w-12" : "w-72 md:w-72",
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-center p-3",
              sidebarCollapsed ? "justify-center" : "justify-between",
            )}
          >
            {!sidebarCollapsed && <h4 className="text-sm font-medium text-foreground">对话历史</h4>}
            <div className="flex gap-1">
              {!sidebarCollapsed && (
                <button
                  onClick={createNewSession}
                  className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-secondary"
                  title="新建对话"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileNavOpen(false);
                  } else {
                    setSidebarCollapsed(!sidebarCollapsed);
                  }
                }}
                className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-secondary"
                title={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
              >
                {sidebarCollapsed ? (
                  <Menu className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {sessions
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200",
                    session.id === currentSessionId
                      ? "bg-secondary font-medium"
                      : "hover:bg-secondary/60",
                    sidebarCollapsed && "justify-center px-2",
                  )}
                  onClick={() => switchSession(session.id)}
                  title={sidebarCollapsed ? session.title : undefined}
                >
                  {sidebarCollapsed ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground/10 text-xs font-medium text-foreground/60">
                      {session.title.charAt(0)}
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 truncate text-sm text-foreground">{session.title}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="rounded p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              ))}
          </div>

          <div
            className={cn(
              "shrink-0 p-3 text-xs text-muted-foreground",
              sidebarCollapsed && "text-center",
            )}
          >
            {!sidebarCollapsed ? (
              <>
                <div>存储用量：{Math.round(getStorageUsagePercent() * 100)}%</div>
              </>
            ) : (
              <div className="text-xs">{Math.round(getStorageUsagePercent() * 100)}%</div>
            )}
          </div>
        </div>

        {/* 右侧主内容区 */}
        <div className="relative flex h-full min-w-0 flex-1 flex-col bg-background">
          <div className="shrink-0 bg-background px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="-ml-1 shrink-0 rounded-lg p-1.5 transition-colors duration-200 hover:bg-secondary md:hidden"
                  title="打开对话列表"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h3 className="truncate font-semibold text-foreground">
                  {currentSession?.title || "EPBot 客服助手"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-secondary"
                    onClick={() => {
                      if (!modelsLoaded) loadModels();
                      setShowModelPanel(!showModelPanel);
                    }}
                  >
                    <span className="hidden max-w-60 truncate sm:inline">
                      {currentModel?.name || selectedModel || "选择模型"}
                    </span>
                    <Settings className="h-4 w-4" />
                  </button>

                  {showModelPanel && (
                    <div
                      ref={modelPanelRef}
                      className="absolute top-full right-0 z-20 mt-2 w-120 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-popover/98 shadow-xl ring-1 ring-foreground/5 backdrop-blur-xl"
                    >
                      <div className="p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium text-foreground">选择模型</h4>
                          <button
                            onClick={() => setShowModelPanel(false)}
                            className="rounded-lg p-1 transition-colors duration-200 hover:bg-secondary"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mb-3 rounded-xl bg-muted p-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">
                              并非所有模型都适合用对话，随意选择可能影响回复质量。
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              ref={searchInputRef}
                              type="text"
                              placeholder="搜索模型名称、ID 或提供商..."
                              value={modelSearchQuery}
                              onChange={(e) => setModelSearchQuery(e.target.value)}
                              className="w-full rounded-lg bg-secondary py-2 pr-3 pl-9 text-sm transition-colors duration-200 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring/30 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                  type="checkbox"
                                  checked={showRecommendedOnly}
                                  onChange={(e) => setShowRecommendedOnly(e.target.checked)}
                                  className="rounded"
                                />
                                仅显示推荐
                              </label>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Filter className="h-3 w-3" />
                                <select
                                  value={modelSortBy}
                                  onChange={(e) =>
                                    setModelSortBy(
                                      e.target.value as "recommended" | "name" | "size",
                                    )
                                  }
                                  className="bg-transparent text-sm focus:outline-none"
                                >
                                  <option value="recommended">推荐优先</option>
                                  <option value="name">按名称</option>
                                  <option value="size">按参数量</option>
                                </select>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              共 {filteredModels.length} 个模型
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="max-h-100 overflow-y-auto p-2">
                        {loadingModels ? (
                          <div className="py-8 text-center text-muted-foreground">
                            加载模型中...
                          </div>
                        ) : filteredModels.length === 0 ? (
                          <div className="py-8 text-center">
                            <p className="text-sm text-muted-foreground">未找到匹配的模型</p>
                            {modelSearchQuery && (
                              <button
                                onClick={() => setModelSearchQuery("")}
                                className="mt-2 px-3 py-1 text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground"
                              >
                                清除搜索
                              </button>
                            )}
                          </div>
                        ) : (
                          filteredModels.map((model) => (
                            <div
                              key={model.id}
                              className={cn(
                                "mb-1 cursor-pointer rounded-xl p-3 transition-colors duration-200",
                                selectedModel === model.id
                                  ? "bg-secondary"
                                  : "hover:bg-secondary/60",
                              )}
                              onClick={() => handleModelChange(model.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="truncate text-sm font-medium text-foreground">
                                      {model.name}
                                    </div>
                                    {model.recommended && (
                                      <span className="flex items-center gap-1 rounded-md bg-foreground/10 px-1.5 py-0.5 text-xs text-foreground/70">
                                        <Star className="h-3 w-3" /> 推荐
                                      </span>
                                    )}
                                    {model.size && (
                                      <span className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-xs text-muted-foreground">
                                        {model.size}
                                      </span>
                                    )}
                                  </div>
                                  <span className="truncate text-xs text-muted-foreground/60">
                                    {model.id}
                                  </span>
                                </div>
                                {selectedModel === model.id && (
                                  <Check className="ml-2 h-4 w-4 shrink-0 text-foreground" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-secondary"
                  title="关闭"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            onScroll={handleChatScroll}
            className="flex-1 space-y-4 overflow-y-auto scroll-smooth p-4"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <MessageCircle className="mb-4 h-16 w-16 opacity-30" />
                <p className="text-lg font-medium">EPBot 客服助手</p>
                <p className="mt-2 text-sm">有什么我可以帮助你的吗？</p>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                      <span>{m.senderName}</span>
                      <span>{formatTime(m.timestamp)}</span>
                      <button
                        onClick={() => startEdit(i, m.content)}
                        className="p-1 transition-colors duration-200 hover:text-foreground/70"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMessage(i)}
                        className="p-1 transition-colors duration-200 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {editId === i ? (
                      <div className="flex max-w-[80%] items-center gap-2 rounded-2xl bg-secondary px-3 py-2">
                        <textarea
                          autoFocus
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-10 w-full flex-1 resize-none bg-transparent text-sm text-foreground outline-none"
                        />
                        <button
                          onClick={() => saveEdit(i)}
                          className="p-1 text-foreground/70 transition-colors duration-200 hover:text-foreground"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="p-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3 text-sm wrap-break-word text-foreground">
                        {m.content}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                      <span>{m.senderName}</span>
                      <span>{formatTime(m.timestamp)}</span>
                      {m.failed && i === messages.length - 1 && (
                        <button
                          onClick={retryLast}
                          className="flex items-center gap-1 p-1 transition-colors duration-200 hover:text-foreground"
                          title="重试"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                          <span>重试</span>
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(m.content);
                            setCopiedId(String(i));
                            showToast("✅ 已复制回答");
                            setTimeout(() => {
                              setCopiedId((cur) => (cur === String(i) ? null : cur));
                            }, 1500);
                          } catch {
                            showToast("❌ 复制失败");
                          }
                        }}
                        className="p-1 transition-colors duration-200 hover:text-foreground/70"
                        title="复制回答"
                      >
                        {copiedId === String(i) ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (speakingId === String(i)) {
                            speech.cancel();
                            setSpeakingId(null);
                            return;
                          }
                          const text = markdownToPlainText(
                            parseThinking(m.content).answer || m.content,
                          );
                          if (!speech.isSupported()) {
                            showToast("❌ 当前浏览器不支持朗读");
                            return;
                          }
                          speech.speak(text, {
                            onStart: () => setSpeakingId(String(i)),
                            onEnd: () => setSpeakingId((cur) => (cur === String(i) ? null : cur)),
                            onError: () => {
                              setSpeakingId((cur) => (cur === String(i) ? null : cur));
                              showToast("❌ 朗读出错");
                            },
                          });
                        }}
                        className={cn(
                          "p-1 transition-colors duration-200",
                          speakingId === String(i) ? "text-primary" : "hover:text-foreground/70",
                        )}
                        title={speakingId === String(i) ? "停止朗读" : "朗读回答"}
                      >
                        {speakingId === String(i) ? (
                          <Square className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteMessage(i)}
                        className="p-1 transition-colors duration-200 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-[85%] rounded-2xl bg-secondary px-4 py-3 wrap-break-word text-foreground">
                      {(() => {
                        const isStreamingLast = loading && i === messages.length - 1;
                        if (m.content === "" && isStreamingLast) {
                          return <TypingIndicator />;
                        }
                        const parsed = parseThinking(m.content);
                        return (
                          <>
                            {(parsed.thinking || !parsed.thinkingDone) && (
                              <ThinkingBlock
                                thinking={parsed.thinking}
                                streaming={!parsed.thinkingDone && isStreamingLast}
                              />
                            )}
                            {parsed.answer ? (
                              // During streaming, <widget> tags are often incomplete
                              // (only `<widget name="server_` has arrived). A complete
                              // widget is rendered immediately (WidgetTag is memoized,
                              // so later tokens won't remount it / re-fire fetches).
                              // Incomplete trailing widget tags are hidden until done.
                              isStreamingLast ? (
                                <WidgetsWithText text={hideIncompleteWidget(parsed.answer)} />
                              ) : (
                                <WidgetsWithText text={parsed.answer} />
                              )
                            ) : isStreamingLast ? (
                              <TypingIndicator />
                            ) : null}
                          </>
                        );
                      })()}
                    </div>
                    {m.serverSideFailed && <AiHealthBoard />}
                  </div>
                ),
              )
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex shrink-0 items-end gap-3 bg-background p-4">
            <textarea
              ref={textareaRef}
              className="max-h-36 min-h-10.5 flex-1 resize-none overflow-y-auto rounded-xl bg-secondary px-4 py-3 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground/50 focus:bg-background focus:ring-2 focus:ring-ring/30 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => {
                composingRef.current = true;
              }}
              onCompositionEnd={() => {
                composingRef.current = false;
              }}
              placeholder="输入消息... (Shift+Enter 换行)"
              disabled={loading}
              rows={1}
            />
            <button
              onClick={loading ? cancelCurrentRequest : send}
              disabled={loading ? false : !input.trim()}
              aria-label={loading ? "停止生成" : "发送"}
              className="flex items-center justify-center rounded-xl bg-foreground p-3 text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 active:scale-[0.97] disabled:opacity-40"
            >
              {loading ? <Square className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </button>
          </div>

          <div className="shrink-0 bg-background px-4 py-2 text-xs text-muted-foreground/50">
            <div className="flex justify-between">
              <span>
                注意：AI 模型回复可能包含错误信息，请注意辨别，不要过度依赖 AI 模型的回复内容。
              </span>
              {currentModel && (
                <span className="hidden max-w-64 truncate sm:inline">
                  当前模型：{currentModel.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPBotChat;
