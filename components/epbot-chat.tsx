"use client";
import { useEffect, useRef, useState } from "react";
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
  Search,
  AlertCircle,
  Star,
  Filter,
  ChevronLeft,
  Minimize2,
  MessageCircle,
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
const RECOMMENDED_PATTERNS = [
  /grok-(4\.[3-9]|4\.20|4\.5)(?:-.*(?:high|fast|multi-agent-high))?/i,
  /qwen(?:3?\.?5?)?(?:-next)?.*?(?:instruct|chat)/i,
  /deepseek(?:-ai)?\/?(?:reasoner|chat|v4-(?:flash|pro))/i,
  /llama-[34]\..*?(?:70b|90b|405b).*?instruct/i,
  /kimi/i,
  /gemini-2\.0-flash/i,
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
  return (
    firstUserMsg.slice(0, 20) + (firstUserMsg.length > 20 ? "…" : "") ||
    "新对话"
  );
};

export const EPBotChat = ({ isOpen, onClose, className }: EPBotChatProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
  const [selectedCategory] = useState<string>("all");
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
  useEffect(() => { currentSessionIdRef.current = currentSessionId; }, [currentSessionId]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  const getSenderName = () => { const user = getCookie("mc_user"); return user || "用户"; };
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2800); };
  const isRecommendedModel = (modelId: string): boolean => { return RECOMMENDED_PATTERNS.some((pattern) => pattern.test(modelId)); };
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
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (model) => model.category === selectedCategory,
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
    }
  };

  const send = () => {
    if (input.trim() && !loading) sendMessage(input.trim());
  };

  const deleteMessage = (index: number) => {
    // 如果正在加载，先取消当前请求
    if (loadingRef.current) {
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
      } catch { }
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

  // 点击模型面板外部关闭
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 px-5 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* 聊天窗口 */}
      <div className="flex h-full w-full bg-white dark:bg-slate-900 overflow-hidden relative shadow-2xl md:h-[90vh] md:w-[80%] md:max-w-300ounded-2xl md:min-w-100">
        {/* 左侧边栏 */}
        <div
          className={cn(
            "h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col transition-all duration-300 ease-in-out shrink-0",
            sidebarCollapsed ? "w-12" : "w-72",
          )}
        >
          {/* 侧边栏头部 */}
          <div className={cn(
            "p-3 border-b border-slate-200 dark:border-white/10 flex items-center shrink-0",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            {!sidebarCollapsed && (
              <h4 className="text-slate-900 dark:text-white font-medium text-sm">
                对话历史
              </h4>
            )}
            <div className="flex gap-1">
              {!sidebarCollapsed && (
                <button
                  onClick={createNewSession}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="新建对话"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
              >
                {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 会话列表 */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                    session.id === currentSessionId
                      ? "bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  onClick={() => switchSession(session.id)}
                  title={sidebarCollapsed ? session.title : undefined}
                >
                  {sidebarCollapsed ? (
                    <div className="w-5 h-5 flex items-center justify-center text-xs font-medium bg-slate-200 dark:bg-slate-700 rounded">
                      {session.title.charAt(0)}
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 truncate text-sm text-slate-900 dark:text-slate-300">
                        {session.title}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-600/20 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hover:text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              ))}
          </div>

          {/* 底部信息 */}
          <div className={cn(
            "p-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 shrink-0",
            sidebarCollapsed && "text-center"
          )}>
            {!sidebarCollapsed ? (
              <>
                <div>存储用量：{Math.round(getStorageUsagePercent() * 100)}%</div>
              </>
            ) : (
              <div className="text-xs">
                {Math.round(getStorageUsagePercent() * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* 右侧主内容区 */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative bg-white dark:bg-slate-900">
          {/* 顶部栏 */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-slate-900 dark:text-white font-semibold truncate">
                {currentSession?.title || "EPBot 客服助手"}
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-sm transition-colors"
                    onClick={() => {
                      if (!modelsLoaded) loadModels();
                      setShowModelPanel(!showModelPanel);
                    }}
                  >
                    <span className="hidden sm:inline max-w-60 truncate">
                      {currentModel?.name || selectedModel || "选择模型"}
                    </span>
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* 模型选择面板 */}
                  {showModelPanel && (
                    <div
                      ref={modelPanelRef}
                      className="absolute top-full right-0 mt-2 z-20 w-120 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
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
                              并非所有模型都适合用对话，随意选择可能影响回复质量。
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

                          {/* 过滤选项 */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
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
                                仅显示推荐
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

                      {/* 模型列表 */}
                      <div className="max-h-100 overflow-y-auto p-2">
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
                                  </div>
                                  <span className="text-xs text-slate-400 truncate">
                                    {model.id}
                                  </span>
                                </div>
                                {selectedModel === model.id && (
                                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2 shrink-0" />
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
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  title="关闭"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">EPBot 客服助手</p>
                <p className="text-sm mt-2">有什么我可以帮助你的吗？</p>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{m.senderName}</span>
                      <span>{formatTime(m.timestamp)}</span>
                      <button
                        onClick={() => startEdit(i, m.content)}
                        className="p-1 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMessage(i)}
                        className="p-1 hover:text-red-600 transition-colors"
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
                      <div className="max-w-[80%] bg-blue-100 dark:bg-blue-600/30 border border-blue-400 dark:border-blue-400/40 rounded-2xl px-4 py-3 text-blue-950 dark:text-blue-100 text-sm wrap-break-word">
                        {m.content}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{m.senderName}</span>
                      <span>{formatTime(m.timestamp)}</span>
                      <button
                        onClick={() => deleteMessage(i)}
                        className="p-1 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="max-w-[85%] bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 prose prose-sm wrap-break-word">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, ...props }) => {
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
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ),
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 flex gap-3 items-end bg-white dark:bg-slate-900 shrink-0">
            <textarea
              ref={textareaRef}
              className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/15 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none max-h-36 overflow-y-auto text-sm min-h-10.5"
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
              className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-xl flex items-center justify-center disabled:opacity-50 shadow-md transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* 底部提示 */}
          <div className="px-4 py-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex justify-between">
              <span>
                注意：AI模型回复可能包含错误信息，请注意辨别，不要过度依赖AI模型的回复内容。
              </span>
              {currentModel && (
                <span className="hidden sm:inline truncate max-w-64">
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