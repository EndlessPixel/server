"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, BookOpen, FileText, Settings, Wrench, HelpCircle, Trophy, Sparkles } from "lucide-react"

// 定义类型接口，增强类型安全
interface WikiArticle {
  id: string;
  title: string;
  category: "新手入门" | "规则制度" | "技术指南" | "特色功能" | "故障排除";
  excerpt: string;
  icon: typeof BookOpen | typeof FileText | typeof Settings | typeof Wrench | typeof HelpCircle | typeof Trophy;
  color: string;
  borderColor: string;
}

// 定义自定义事件类型
interface WikiArticleChangeEventDetail {
  articleId: string;
}

declare global {
  interface WindowEventMap {
    "wiki-article-change": CustomEvent<WikiArticleChangeEventDetail>;
  }
}

// Wiki文章数据
const wikiArticles: WikiArticle[] = [
  {
    id: "server-commands",
    title: "服务器玩家命令",
    category: "新手入门",
    excerpt: "了解服务器中可用的玩家命令，包括传送、皮肤管理、技能系统等功能...",
    icon: BookOpen,
    color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "launcher-guide",
    title: "整合包安装指南",
    category: "新手入门",
    excerpt: "详细的整合包安装步骤，包括启动器选择、Java环境配置和常见问题解决...",
    icon: Settings,
    color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "create-claims",
    title: "领地管理",
    category: "新手入门",
    excerpt: "学习如何使用箭工具创建和管理你的领地，保护你的建筑和物品...",
    icon: Settings,
    color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "server-rules",
    title: "服务器规则",
    category: "规则制度",
    excerpt: "为了维护良好的游戏环境，请遵守服务器规则，包括禁止行为和处罚制度...",
    icon: FileText,
    color: "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: "client-versions",
    title: "服务器客户端版本说明",
    category: "技术指南",
    excerpt: "了解服务器支持的Minecraft版本范围和兼容性信息...",
    icon: Wrench,
    color: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: "frp-guide",
    title: "服务器FRP节点贡献指南",
    category: "技术指南",
    excerpt: "学习如何配置和提交FRP节点，为服务器网络贡献力量...",
    icon: Settings,
    color: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: "special-features",
    title: "服务器特殊功能指南",
    category: "特色功能",
    excerpt: "探索服务器的特色功能，包括坐下、连锁挖掘、农田保护等...",
    icon: Trophy,
    color: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: "connection-issues",
    title: "服务器连接问题及解决方法",
    category: "故障排除",
    excerpt: "解决常见的服务器连接问题，包括网络异常、版本不兼容等...",
    icon: HelpCircle,
    color: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
]

// 防抖函数
const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export function WikiSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<WikiArticle[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // 搜索逻辑（防抖处理）
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const filtered = wikiArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  }, []);
  
  // 使用防抖处理搜索
  const debouncedSearch = useDebounce(performSearch, 300);
  
  // 处理搜索输入
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
    setHighlightedIndex(-1); // 重置高亮
  }, [debouncedSearch]);
  
  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setHighlightedIndex(-1);
  }, []);
  
  // 处理文章选择
  const handleArticleSelect = useCallback((articleId: string) => {
    // 分发类型安全的自定义事件
    window.dispatchEvent(new CustomEvent("wiki-article-change", { 
      detail: { articleId },
      bubbles: true,
      cancelable: true
    }));
    clearSearch();
  }, [clearSearch]);
  
  // 计算分类颜色的纯函数
  const getCategoryColor = useCallback((category: WikiArticle["category"]) => {
    switch (category) {
      case "新手入门":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "规则制度":
        return "bg-red-100 text-red-700 dark:bg-red-100/10 dark:text-red-300";
      case "技术指南":
        return "bg-green-100 text-green-700 dark:bg-green-100/10 dark:text-green-300";
      case "特色功能":
        return "bg-purple-100 text-purple-700 dark:bg-purple-100/10 dark:text-purple-300";
      case "故障排除":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-100/10 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-100/10 dark:text-gray-300";
    }
  }, []);
  
  // 处理键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
        
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
        
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleArticleSelect(searchResults[highlightedIndex].id);
        }
        break;
        
      case "Escape":
        clearSearch();
        break;
    }
  }, [searchResults, highlightedIndex, handleArticleSelect, clearSearch]);
  
  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        clearSearch();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSearch]);
  
  // 记忆化搜索结果渲染
  const renderSearchResults = useMemo(() => {
    if (isSearching) {
      return (
        <div className="p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">搜索中...</span>
          </div>
        </div>
      );
    }
    
    if (searchResults.length === 0) {
      return (
        <div className="p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-1">未找到相关内容</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                尝试使用其他关键词搜索
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <div className="p-4 bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              找到 {searchResults.length} 个相关结果
            </span>
          </div>
        </div>
        {searchResults.map((result, index) => {
          const isHighlighted = index === highlightedIndex;
          const Icon = result.icon;
          
          return (
            <div
              key={result.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                isHighlighted 
                  ? `bg-linear-to-r ${result.color} border-l-4 ${result.borderColor} scale-[1.01]` 
                  : `hover:bg-linear-to-r ${result.color} border-l-4 border-transparent`
              }`}
              onClick={() => handleArticleSelect(result.id)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border ${isHighlighted ? result.borderColor : 'border-transparent'}`}>
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 flex-wrap">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">
                      {result.title}
                    </h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(result.category)} ml-2 shrink-0 mt-0.5`}>
                      {result.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    {result.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <span>点击查看完整内容</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [searchResults, isSearching, highlightedIndex, getCategoryColor, handleArticleSelect]);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <Input
          type="text"
          placeholder="搜索 Wiki 文档内容..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-12 h-14 text-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl shadow-lg focus:border-blue-300 dark:focus:border-blue-600 transition-all duration-200"
          aria-autocomplete="list"
          aria-controls="wiki-search-results"
          aria-expanded={searchResults.length > 0}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="清除搜索"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {(searchResults.length > 0 || isSearching) && (
        <Card 
          className="absolute top-full left-0 right-0 mt-3 z-50 max-h-96 overflow-y-auto border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl"
          id="wiki-search-results"
        >
          <CardContent className="p-0">
            {renderSearchResults}
          </CardContent>
        </Card>
      )}
    </div>
  )
}