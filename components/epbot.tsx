'use client';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Plus, Trash2, Menu, X, Edit2, Check, X as XIcon } from 'lucide-react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { cn } from '@/lib/utils';

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export interface EPBotProps { className?: string }
type MessageRole = 'user' | 'assistant';
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

const STORAGE_KEY = 'epbot_sessions';
const CURRENT_SESSION_KEY = 'epbot_current_session_id';
const MAX_STORAGE_PERCENT = 0.9;
const MAX_CONTEXT_MESSAGES = 25;

const getStorageUsagePercent = (): number => {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
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
  const firstUserMsg = messages.find(m => m.role === 'user')?.content || '';
  return firstUserMsg.slice(0, 20) + (firstUserMsg.length > 20 ? '…' : '') || '新对话';
};

export const EPBot = ({ className }: EPBotProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [toast, setToast] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSessionIdRef = useRef(currentSessionId);
  const loadingRef = useRef(loading);
  const messagesRef = useRef(messages);

  useEffect(() => { currentSessionIdRef.current = currentSessionId; }, [currentSessionId]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const getSenderName = () => {
    const user = getCookie('mc_user');
    return user || '用户';
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const removeEmptyAssistantPlaceholder = () => {
    setSessions(prev => prev.map(s => {
      if (s.id !== currentSessionIdRef.current) return s;
      const msgs = [...s.messages];
      if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant' && msgs[msgs.length - 1].content === '') {
        msgs.pop();
      }
      return { ...s, messages: msgs };
    }));
    setMessages(prev => {
      if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].content === '') {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const cancelCurrentRequest = () => {
    if (!loadingRef.current) return;  // ✅ 只在有活跃请求时取消
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    removeEmptyAssistantPlaceholder();
  };

  const updateCurrentMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setSessions(prev => prev.map(s => {
      if (s.id !== currentSessionIdRef.current) return s;
      const title = s.title === '新对话' && newMessages.length > 0 ? generateTitle(newMessages) : s.title;
      return { ...s, messages: newMessages, title };
    }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loadingRef.current) return;

    setEditId(null);
    if (abortControllerRef.current) {
      cancelCurrentRequest();  // 现在只会在 loading 为 true 时真正取消
    }

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
      senderName: getSenderName(),
    };

    const newHistory = [...messagesRef.current.slice(-MAX_CONTEXT_MESSAGES), userMsg];

    const withPlaceholder: Message[] = [...newHistory, {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      senderName: 'EPBot',
    }];
    updateCurrentMessages(withPlaceholder);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    let reply = '';

    try {
      await fetchEventSource('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory }),
        signal: controller.signal,
        onmessage(ev) {
          if (ev.data === '[DONE]') return;
          try {
            const j = JSON.parse(ev.data);
            const content = j.content ?? j.choices?.[0]?.delta?.content;
            if (content) {
              reply += content;
              setSessions(prev => prev.map(s => {
                if (s.id !== currentSessionIdRef.current) return s;
                const msgs = [...s.messages];
                const last = msgs[msgs.length - 1];
                if (last.role === 'assistant') {
                  msgs[msgs.length - 1] = { ...last, content: reply };
                }
                return { ...s, messages: msgs };
              }));
              setMessages(prev => {
                const newMsgs = [...prev];
                const last = newMsgs[newMsgs.length - 1];
                if (last.role === 'assistant') {
                  newMsgs[newMsgs.length - 1] = { ...last, content: reply };
                }
                return newMsgs;
              });
            }
          } catch (err) {
            console.warn('SSE parse error:', ev.data);
          }
        },
        onerror(err) {
          console.error('Stream error:', err);
          if (!controller.signal.aborted) showToast('❌ 连接中断');
          removeEmptyAssistantPlaceholder();
        },
      });
    } catch (err) {
      if (!controller.signal.aborted) showToast('❌ 服务异常');
      removeEmptyAssistantPlaceholder();
    } finally {
      setLoading(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;  // ✅ 确保只清空当前请求的 controller
      }
      if (reply === '') removeEmptyAssistantPlaceholder();
    }
  };

  const send = () => {
    if (input.trim() && !loading) sendMessage(input.trim());
  };

  const deleteMessage = (index: number) => {
    updateCurrentMessages(messages.slice(0, index));
    showToast('✅ 已删除后续消息');
  };

  const startEdit = (index: number, content: string) => {
    setEditId(index);
    setEditContent(content);
  };

  const saveEdit = (index: number) => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      showToast('⚠️ 内容不能为空');
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
    setEditContent('');
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setSidebarOpen(false);
  };
  const deleteSession = (id: string) => {
    if (loading && id === currentSessionId) cancelCurrentRequest();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const newSession: Session = {
          id: crypto.randomUUID(),
          title: '新对话',
          messages: [],
          createdAt: Date.now(),
        };
        setCurrentSessionId(newSession.id);
        setMessages([]);
        showToast('✅ 会话已删除');
        return [newSession];
      }
      if (id === currentSessionId) {
        const nextSession = filtered[0];
        setCurrentSessionId(nextSession.id);
        setMessages(nextSession.messages);
      }
      showToast('✅ 会话已删除');
      return filtered;
    });
  };

  const switchSession = (id: string) => {
    if (loading) cancelCurrentRequest();
    setCurrentSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session) setMessages(session.messages);
    else setMessages([]);
    setSidebarOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
      try { parsedSessions = JSON.parse(savedSessions); } catch {}
    }
    if (parsedSessions.length === 0) {
      const defaultSession: Session = {
        id: crypto.randomUUID(),
        title: '新对话',
        messages: [],
        createdAt: Date.now(),
      };
      parsedSessions = [defaultSession];
    }
    setSessions(parsedSessions);
    let targetId = savedCurrentId;
    if (!targetId || !parsedSessions.find(s => s.id === targetId)) targetId = parsedSessions[0].id;
    setCurrentSessionId(targetId);
    const targetSession = parsedSessions.find(s => s.id === targetId);
    if (targetSession) setMessages(targetSession.messages);
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      const usage = getStorageUsagePercent();
      if (usage >= MAX_STORAGE_PERCENT) showToast('⚠️ 存储空间即将用尽，请删除部分对话');
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId) localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className={cn(
      "flex h-160 w-200 max-w-[95vw] rounded-2xl border border-white/10 dark:border-white/10 bg-white dark:bg-slate-900/98 backdrop-blur-md shadow-2xl overflow-hidden relative",
      className
    )}>
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-lg bg-slate-800 text-white text-sm shadow-lg">{toast}</div>}
      {sidebarOpen && <div className="absolute inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <div className={cn(
        "fixed top-0 left-0 bottom-0 w-64 z-30 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-3 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
          <h4 className="text-slate-900 dark:text-white font-medium text-sm">对话历史</h4>
          <div className="flex gap-1">
            <button onClick={createNewSession} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Plus className="w-4 h-4" /></button>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.sort((a,b)=>b.createdAt-a.createdAt).map(session=>(
            <div key={session.id} className={cn("group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors", session.id===currentSessionId?"bg-blue-100 dark:bg-blue-600/20 border border-blue-500":"hover:bg-slate-100 dark:hover:bg-slate-800/50")} onClick={()=>switchSession(session.id)}>
              <div className="flex-1 truncate text-sm text-slate-900 dark:text-slate-300">{session.title}</div>
              <button onClick={(e)=>{e.stopPropagation(); deleteSession(session.id);}} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-600/20"><Trash2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hover:text-red-600" /></button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">存储用量：{Math.round(getStorageUsagePercent()*100)}%</div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80" onClick={()=>setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <h3 className="text-slate-900 dark:text-white font-semibold truncate">{currentSession?.title||'EPBot 客服助手'}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-white dark:bg-transparent">
          {messages.map((m,i)=> m.role==='user' ? (
            <div key={i} className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{m.senderName}</span><span>{formatTime(m.timestamp)}</span>
                <button onClick={()=>startEdit(i,m.content)} className="p-1 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5"/></button>
                <button onClick={()=>deleteMessage(i)} className="p-1 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
              {editId===i ? (
                <div className="flex gap-2 items-center max-w-[80%] bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2">
                  <textarea autoFocus value={editContent} onChange={e=>setEditContent(e.target.value)} className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm outline-none w-full resize-none min-h-10"/>
                  <button onClick={()=>saveEdit(i)} className="text-green-600 p-1"><Check className="w-4 h-4"/></button>
                  <button onClick={()=>setEditId(null)} className="text-slate-500 p-1"><XIcon className="w-4 h-4"/></button>
                </div>
              ) : (
                <div className="max-w-[80%] bg-blue-100 dark:bg-blue-600/30 border border-blue-400 dark:border-blue-400/40 rounded-2xl px-4 py-3 text-blue-950 dark:text-blue-100 text-sm break-all">{m.content}</div>
              )}
            </div>
          ) : (
            <div key={i} className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{m.senderName}</span><span>{formatTime(m.timestamp)}</span>
                <button onClick={()=>deleteMessage(i)} className="p-1 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
              <div className="max-w-[85%] bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-white/15 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 prose prose-sm break-all">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex gap-3 items-end bg-white dark:bg-transparent">
          <textarea ref={textareaRef} className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/15 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none max-h-36 overflow-y-auto text-sm" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入消息... (Shift+Enter 换行)" disabled={loading} rows={1}/>
          <button onClick={send} disabled={loading} className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-xl flex items-center justify-center disabled:opacity-50 shadow-md"><Send className="w-5 h-5"/></button>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 bg-white dark:bg-transparent">注意：AI模型回复可能包含错误信息，请不要过度依赖AI模型的回复内容。</div>
      </div>
    </div>
  );
};

export default EPBot;