"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Cpu,
  Zap,
  Search,
  AlertCircle,
  Star,
  Filter,
} from "lucide-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { cn } from "@/lib/utils";

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

export interface EPBotProps {
  className?: string;
}
type MessageRole = "user" | "assistant";
type Message = {
  role: MessageRole;
  content: string;
  timestamp: number;
  senderName: string;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
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

// 模型分类配置
const MODEL_CATEGORIES = {
  general: { name: "通用对话", icon: "💬", color: "blue" },
  code: { name: "代码模型", icon: "💻", color: "green" },
  vision: { name: "视觉模型", icon: "👁️", color: "purple" },
  embedding: { name: "嵌入模型", icon: "🔗", color: "gray" },
  safety: { name: "安全模型", icon: "🛡️", color: "red" },
  other: { name: "其他", icon: "📦", color: "slate" },
};

// 推荐模型关键词（优先级高到低）
const RECOMMENDED_PATTERNS = [
  /qwen.*?(instruct|chat|next)/i,
  /deepseek.*?(chat|reasoner|v4)/i,
  /gemini.*?(pro|flash)/i,
  /gpt-oss/i,
  /llama.*?instruct/i,
  /mistral.*?(large|small)/i,
  /kimi/i,
  /glm/i,
  /yi-large/i,
];

// 模型分类关键词
const getModelCategory = (id: string): Model["category"] => {
  const lowerId = id.toLowerCase();
  if (
    lowerId.includes("code") ||
    lowerId.includes("coder") ||
    lowerId.includes("codestral")
  )
    return "code";
  if (
    lowerId.includes("vision") ||
    lowerId.includes("vl") ||
    lowerId.includes("vlm")
  )
    return "vision";
  if (lowerId.includes("embed") || lowerId.includes("retriever"))
    return "embedding";
  if (
    lowerId.includes("safety") ||
    lowerId.includes("guard") ||
    lowerId.includes("content")
  )
    return "safety";
  if (
    lowerId.includes("instruct") ||
    lowerId.includes("chat") ||
    lowerId.includes("general")
  )
    return "general";
  return "other";
};

// 提取模型大小
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
  return (
    firstUserMsg.slice(0, 20) + (firstUserMsg.length > 20 ? "…" : "") ||
    "新对话"
  );
};

const formatTokens = (tokens?: number): string => {
  if (!tokens) return "0";
  if (tokens < 1000) return `${tokens}`;
  return `${(tokens / 1000).toFixed(1)}k`;
};

export const EPBot = ({ className }: EPBotProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [toast, setToast] = useState("");

  // 模型相关状态
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(true);
  const [totalTokens, setTotalTokens] = useState(0);
  const [] = useState(0);
  const [modelSortBy, setModelSortBy] = useState<
    "recommended" | "name" | "size"
  >("recommended");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSessionIdRef = useRef(currentSessionId);
  const loadingRef = useRef(loading);
  const messagesRef = useRef(messages);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);
  useEffect(() => {
    loadingRef.current = loading;
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
    setTimeout(() => setToast(""), 2800);
  };

  // 判断是否为推荐模型
  const isRecommendedModel = (modelId: string): boolean => {
    return RECOMMENDED_PATTERNS.some((pattern) => pattern.test(modelId));
  };

  // 加载模型列表
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
          category: getModelCategory(model.id),
          size: extractModelSize(model.id),
        }));

        setModels(processedModels);

        // 从 localStorage 加载保存的模型选择
        const savedModel = localStorage.getItem(SELECTED_MODEL_KEY);
        if (savedModel && processedModels.some((m) => m.id === savedModel)) {
          setSelectedModel(savedModel);
        } else {
          // 优先选择推荐模型
          const recommendedModel = processedModels.find((m) => m.recommended);
          if (recommendedModel) {
            setSelectedModel(recommendedModel.id);
          } else if (processedModels.length > 0) {
            setSelectedModel(processedModels[0].id);
          }
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

  // 搜索、过滤和排序模型
  useEffect(() => {
    if (!models.length) return;

    let filtered = [...models];

    // 搜索过滤
    if (modelSearchQuery.trim()) {
      const query = modelSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.id.toLowerCase().includes(query) ||
          model.name.toLowerCase().includes(query) ||
          model.owned_by.toLowerCase().includes(query),
      );
    }

    // 分类过滤
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (model) => model.category === selectedCategory,
      );
    }

    // 推荐模型过滤
    if (showRecommendedOnly) {
      filtered = filtered.filter((model) => model.recommended);
    }

    // 排序
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
  }, [
    models,
    modelSearchQuery,
    selectedCategory,
    showRecommendedOnly,
    modelSortBy,
  ]);

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
    if (!loadingRef.current) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    removeEmptyAssistantPlaceholder();
  };

  const updateCurrentMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSessionIdRef.current) return s;
        const title =
          s.title === "新对话" && newMessages.length > 0
            ? generateTitle(newMessages)
            : s.title;
        return { ...s, messages: newMessages, title };
      }),
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loadingRef.current) return;

    setEditId(null);

    if (abortControllerRef.current && loadingRef.current) {
      cancelCurrentRequest();
    }

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: Date.now(),
      senderName: getSenderName(),
    };

    const newHistory = [
      ...messagesRef.current.slice(-MAX_CONTEXT_MESSAGES),
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
    let tokenUsage: any = null;

    try {
      await fetchEventSource("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          model: selectedModel || undefined,
        }),
        signal: controller.signal,
        async onopen(response) {
          if (!response.ok) {
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

              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id !== currentSessionIdRef.current) return s;
                  const msgs = [...s.messages];
                  const last = msgs[msgs.length - 1];
                  if (last.role === "assistant") {
                    msgs[msgs.length - 1] = { ...last, content: fullErrorMsg };
                  }
                  return { ...s, messages: msgs };
                }),
              );
              setMessages((prev) => {
                const newMsgs = [...prev];
                const last = newMsgs[newMsgs.length - 1];
                if (last.role === "assistant") {
                  newMsgs[newMsgs.length - 1] = {
                    ...last,
                    content: fullErrorMsg,
                  };
                }
                return newMsgs;
              });

              showToast(`❌ ${errorMsg}`);
              return;
            }

            if (j.usage) tokenUsage = j.usage;

            let content = "";
            if (j.type === "text-delta" && j.delta) content = j.delta;
            else if (j.content) content = j.content;
            else if (j.choices?.[0]?.delta?.content)
              content = j.choices[0].delta.content;

            if (content) {
              reply += content;
              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id !== currentSessionIdRef.current) return s;
                  const msgs = [...s.messages];
                  const last = msgs[msgs.length - 1];
                  if (last.role === "assistant") {
                    msgs[msgs.length - 1] = {
                      ...last,
                      content: reply,
                      tokenUsage,
                    };
                  }
                  return { ...s, messages: msgs };
                }),
              );
              setMessages((prev) => {
                const newMsgs = [...prev];
                const last = newMsgs[newMsgs.length - 1];
                if (last.role === "assistant") {
                  newMsgs[newMsgs.length - 1] = {
                    ...last,
                    content: reply,
                    tokenUsage,
                  };
                }
                return newMsgs;
              });
            }
          } catch (err) {
            console.warn("SSE parse error:", ev.data);
          }
        },
        onerror() {
          if (!controller.signal.aborted) {
            showToast("❌ 连接中断");
          }
          removeEmptyAssistantPlaceholder();
        },
      });
    } catch (err) {
      const isAborted = controller.signal.aborted;
      if (!isAborted) {
        showToast("❌ 服务异常");
      }
      removeEmptyAssistantPlaceholder();
    } finally {
      setLoading(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      if (reply === "") removeEmptyAssistantPlaceholder();

      if (tokenUsage?.totalTokens) {
        setTotalTokens((prev) => prev + tokenUsage.totalTokens);
      }
    }
  };

  const send = () => {
    if (input.trim() && !loading) sendMessage(input.trim());
  };

  const deleteMessage = (index: number) => {
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
    sendMessage(trimmed);
  };

  const createNewSession = () => {
    if (loading) cancelCurrentRequest();
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
    setSidebarOpen(false);
  };

  const deleteSession = (id: string) => {
    if (loading && id === currentSessionId) cancelCurrentRequest();
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
      if (id === currentSessionId) {
        const nextSession = filtered[0];
        setCurrentSessionId(nextSession.id);
        setMessages(nextSession.messages);
      }
      showToast("✅ 会话已删除");
      return filtered;
    });
  };

  const switchSession = (id: string) => {
    if (loading) cancelCurrentRequest();
    setCurrentSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session) setMessages(session.messages);
    else setMessages([]);
    setSidebarOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
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

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      const usage = getStorageUsagePercent();
      if (usage >= MAX_STORAGE_PERCENT)
        showToast("⚠️ 存储空间即将用尽，请删除部分对话");
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId)
      localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentModel = models.find((m) => m.id === selectedModel);

  // 统计各类模型数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: models.length };
    Object.keys(MODEL_CATEGORIES).forEach((cat) => {
      counts[cat] = models.filter((m) => m.category === cat).length;
    });
    return counts;
  }, [models]);

  return (
    <div
      className={cn(
        "flex h-160 w-200 max-w-[95vw] rounded-2xl border-white/10 dark:border-white/10 bg-white dark:bg-slate-900/98 backdrop-blur-md shadow-2xl overflow-hidden relative",
        className,
      )}
    >
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-80 z-30 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-3 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
          <h4 className="text-slate-900 dark:text-white font-medium text-sm">
            对话历史
          </h4>
          <div className="flex gap-1">
            <button
              onClick={createNewSession}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                  session.id === currentSessionId
                    ? "bg-blue-100 dark:bg-blue-600/20 border-blue-500"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/50",
                )}
                onClick={() => switchSession(session.id)}
              >
                <div className="flex-1 truncate text-sm text-slate-900 dark:text-slate-300">
                  {session.title}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-600/20"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hover:text-red-600" />
                </button>
              </div>
            ))}
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
          <div>存储用量：{Math.round(getStorageUsagePercent() * 100)}%</div>
          <div className="mt-1">总Token：{formatTokens(totalTokens)}</div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h3 className="text-slate-900 dark:text-white font-semibold truncate">
                {currentSession?.title || "EPBot 客服助手"}
              </h3>
            </div>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-sm"
              onClick={() => {
                if (!modelsLoaded) loadModels();
                setShowModelPanel(!showModelPanel);
              }}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline max-w-50 truncate">
                {currentModel?.name || selectedModel || "选择模型"}
              </span>
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 模型选择面板 */}
        {showModelPanel && (
          <div className="absolute top-16 right-4 z-20 w-125 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  选择模型
                </h4>
                <button
                  onClick={() => setShowModelPanel(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 声明提示 */}
              <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-800 dark:text-amber-300">
                    温馨提示：并非所有模型都适合用于对话回复，建议优先选择推荐模型（带⭐标记）。随意选择可能影响回复质量。
                  </div>
                </div>
              </div>

              {/* 搜索和过滤 */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="搜索模型名称、ID或提供商..."
                    value={modelSearchQuery}
                    onChange={(e) => setModelSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 分类标签 */}
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md transition-colors",
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600",
                    )}
                  >
                    全部 ({categoryCounts.all})
                  </button>
                  {Object.entries(MODEL_CATEGORIES).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={cn(
                        "px-2 py-1 text-xs rounded-md transition-colors flex items-center gap-1",
                        selectedCategory === key
                          ? `bg-${config.color}-600 text-white`
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600",
                      )}
                    >
                      <span>{config.icon}</span>
                      <span>{config.name}</span>
                      <span>({categoryCounts[key] || 0})</span>
                    </button>
                  ))}
                </div>

                {/* 过滤选项 */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={showRecommendedOnly}
                        onChange={(e) =>
                          setShowRecommendedOnly(e.target.checked)
                        }
                        className="rounded border-slate-300"
                      />
                      仅显示推荐模型
                    </label>
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <Filter className="w-3 h-3" />
                      <select
                        value={modelSortBy}
                        onChange={(e) => setModelSortBy(e.target.value as any)}
                        className="bg-transparent border-none text-sm focus:outline-none"
                      >
                        <option value="recommended">推荐优先</option>
                        <option value="name">按名称</option>
                        <option value="size">按参数量</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    共 {filteredModels.length} 个模型
                  </div>
                </div>
              </div>
            </div>

            <div className="max-h-125 overflow-y-auto p-2">
              {loadingModels ? (
                <div className="text-center py-8 text-slate-500">
                  加载模型中...
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">未找到匹配的模型</p>
                  {modelSearchQuery && (
                    <button
                      onClick={() => setModelSearchQuery("")}
                      className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
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
                      "p-3 rounded-lg cursor-pointer transition-colors mb-1",
                      selectedModel === model.id
                        ? "bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50",
                    )}
                    onClick={() => handleModelChange(model.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-medium text-sm text-slate-900 dark:text-white truncate">
                            {model.name}
                          </div>
                          {model.recommended && (
                            <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded flex items-center gap-1">
                              <Star className="w-3 h-3" /> 推荐
                            </span>
                          )}
                          {model.size && (
                            <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                              {model.size}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 truncate">
                            {model.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            提供方: {model.owned_by}
                          </span>
                          {model.category &&
                            MODEL_CATEGORIES[model.category] && (
                              <span className="text-xs text-slate-400">
                                {MODEL_CATEGORIES[model.category].icon}{" "}
                                {MODEL_CATEGORIES[model.category].name}
                              </span>
                            )}
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2 shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400">
              提示：推荐模型经过优化，适合大多数对话场景
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-white dark:bg-transparent">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{m.senderName}</span>
                  <span>{formatTime(m.timestamp)}</span>
                  <button
                    onClick={() => startEdit(i, m.content)}
                    className="p-1 hover:text-blue-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMessage(i)}
                    className="p-1 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {editId === i ? (
                  <div className="flex gap-2 items-center max-w-[80%] bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2">
                    <textarea
                      autoFocus
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm outline-none w-full resize-none min-h-10"
                    />
                    <button
                      onClick={() => saveEdit(i)}
                      className="text-green-600 p-1"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-slate-500 p-1"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="max-w-[80%] bg-blue-100 dark:bg-blue-600/30 border-blue-400 dark:border-blue-400/40 rounded-2xl px-4 py-3 text-blue-950 dark:text-blue-100 text-sm break-all">
                    {m.content}
                  </div>
                )}
              </div>
            ) : (
              <div key={i} className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{m.senderName}</span>
                  <span>{formatTime(m.timestamp)}</span>
                  {m.tokenUsage && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {formatTokens(m.tokenUsage.totalTokens)} tokens
                    </span>
                  )}
                  <button
                    onClick={() => deleteMessage(i)}
                    className="p-1 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-w-[85%] bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-white/15 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 prose prose-sm break-all">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ),
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex gap-3 items-end bg-white dark:bg-transparent">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-white/15 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none max-h-36 overflow-y-auto text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter 换行)"
            disabled={loading}
            rows={1}
          />
          <button
            onClick={send}
            disabled={loading}
            className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-xl flex items-center justify-center disabled:opacity-50 shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 bg-white dark:bg-transparent">
          <div className="flex justify-between">
            <span>
              注意：AI模型回复可能包含错误信息，请注意辨别，不要过度依赖AI模型的回复内容。
            </span>
            {currentModel && (
              <span className="hidden sm:inline truncate max-w-75">
                当前模型：{currentModel.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPBot;
