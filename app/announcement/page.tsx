"use client";

import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useMemo } from "react";

const announcements = [
    {
        "title": "【邮件】我们新增了官方专属邮箱",
        "summary": "为了更好地服务玩家，我们新增了官方专属邮箱：support@endlesspixel.cn",
        "date": "2026-04-30",
        "time": "22:26",
        "year": 2026,
        "month": 4,
        "tags": ["邮件"]
    },
    {
        "title": "【推广】我们在MCList上架了",
        "summary": "我们又上架了一个新平台waw~ https://www.mclists.cn/server/9339.html",
        "date": "2026-03-29",
        "time": "23:17",
        "year": 2026,
        "month": 3,
        "tags": ["推广"]
    },
    {
        "title": "【重要通知】我们的endlesspixel.fun域名到期了",
        "summary": "2026 年 3 月 24 日，EndlessPixel 官方域名将到期。请注意：域名到期后，EndlessPixel所有服务将无法正常通过域名访问。",
        "date": "2026-03-24",
        "time": "20:31",
        "year": 2026,
        "month": 3,
        "tags": ["重要通知"]
    },
    {
        "title": "【域名】我们购入了新的域名endlesspixl.cn",
        "summary": "我们已购入了新的域名 endlesspixl.cn，这是我们的新域名，由于替代我们的endlesspixel.fun。",
        "date": "2026-02-20",
        "time": "16:53",
        "year": 2026,
        "month": 2,
        "tags": ["域名"]
    },
    {
        "title": "【推广】我们上架了我的世界服务器站",
        "summary": "我们成功上架了我的世界服务器站，这将为我们的宣传提供一个新的平台。欢迎大家前来点赞，以提升我们服务器的排名。网址：https://www.wdsjfwq.com/server-1955.html",
        "date": "2026-01-31",
        "time": "19:09",
        "year": 2026,
        "month": 1,
        "tags": ["推广"]
    },
    {
        "title": "【网络优化】服务器节点全面升级",
        "summary": "已完成全球节点架构的全面升级：新增广州、湖北、湖南连接节点，网络带宽和延迟得到显著优化，支持更高并发连接数。",
        "date": "2025-04-04",
        "time": "17:09",
        "year": 2025,
        "month": 4,
        "tags": ["网络优化", "基础设施"]
    },
    {
        "title": "【迁移完成】高延迟问题已解决",
        "summary": "服务器迁移至新数据中心后：平均延迟从 380ms 降至 65ms，丢包率归零，新增备用网络通道。",
        "date": "2025-04-03",
        "time": "18:27",
        "year": 2025,
        "month": 4,
        "tags": ["迁移", "网络优化"]
    },
    {
        "title": "【安全警报】病毒入侵处理通报",
        "summary": "3 月 27 日检测到病毒攻击后，已重装所有宿主系统，玩家数据 100% 完整保留，已恢复正常服务。如有疑问，请联系客服。",
        "date": "2025-03-27",
        "time": "18:08",
        "year": 2025,
        "month": 3,
        "tags": ["安全", "故障"]
    },
    {
        "title": "【重要通知】存档重置与补偿措施",
        "summary": "由于服务器存档文件意外损坏，不得不进行存档重置。为表达歉意，将向所有玩家发放补偿：木头 x64、煤 x32、铁锭 x16、金锭 x8、钻石 x4、下界合金碎片 x2。",
        "date": "2025-03-25",
        "time": "14:14",
        "year": 2025,
        "month": 3,
        "tags": ["存档重置", "补偿"]
    },
    {
        "title": "【技术报告】延迟问题根源查明",
        "summary": "确认超高延迟原因为 VMware 虚拟网卡问题，已禁用该网卡并切换至 VirtIO 驱动，延迟恢复至正常水平。",
        "date": "2025-03-25",
        "time": "21:20",
        "year": 2025,
        "month": 3,
        "tags": ["故障", "网络优化"]
    },
    {
        "title": "【域名更新】endlesspixel.fun 正式启用",
        "summary": "全新域名 endlesspixel.fun 现已注册并启用，旧域名将继续保留 30 天用于跳转，建议各位玩家尽快更新书签。",
        "date": "2025-03-24",
        "time": "22:23",
        "year": 2025,
        "month": 3,
        "tags": ["品牌"]
    },
    {
        "title": "【更名公告】PixelAdventure → EndlessPixel",
        "summary": "即日起，服务器正式更名为 EndlessPixel！新名称象征着打造无限可能像素世界的愿景，配套的新 LOGO 和官网将在本周内更新。",
        "date": "2025-03-24",
        "time": "20:29",
        "year": 2025,
        "month": 3,
        "tags": ["品牌"]
    },
    {
        "title": "【故障通报】异常高延迟警告",
        "summary": "自当日 14:00 起出现间歇性 400ms+ 延迟、部分区块加载异常，技术团队正在检查网络硬件、分析流量日志，尚未定位根本原因。",
        "date": "2025-03-24",
        "time": "17:33",
        "year": 2025,
        "month": 3,
        "tags": ["故障", "网络优化"]
    },
    {
        "title": "【渠道拓展】官方服务器上架",
        "summary": "现已入驻 minecraftservers.org，平台支持服务器状态实时监控和玩家评价系统，搜索 'PixelAdventure' 即可找到。",
        "date": "2025-03-13",
        "time": "19:23",
        "year": 2025,
        "month": 3,
        "tags": ["推广"]
    },
    {
        "title": "【硬件升级】服务器性能大幅提升",
        "summary": "全新服务器配置已上线：48 核 CPU、96GB 内存、1.5TB NVMe 固态硬盘、千兆独享带宽，可支持 2025 人同时在线！",
        "date": "2025-03-15",
        "time": "17:48",
        "year": 2025,
        "month": 3,
        "tags": ["硬件升级", "性能"]
    },
    {
        "title": "【核心更换】迁移至 Paper 提升稳定性",
        "summary": "服务器核心已从 Mohist 更改为 Paper，版本保持 1.20.1 不变。Paper 在高并发下表现出更低的延迟和更高的 TPS，玩家体验将更加流畅。",
        "date": "2025-01-14",
        "time": "08:35",
        "year": 2025,
        "month": 1,
        "tags": ["核心更换", "性能"]
    },
    {
        "title": "【品牌升级】PixelAdventure 正式命名",
        "summary": "经过玩家投票，'像素探险 (PixelAdventure)' 从候选名中胜出，将用于服务器标识、官网及社群平台。",
        "date": "2024-12-06",
        "time": "20:24",
        "year": 2024,
        "month": 12,
        "tags": ["品牌"]
    },
    {
        "title": "【服务迁移】阿里云服务器到期通知",
        "summary": "当前阿里云服务器将于 12 月 15 日到期，正在评估 AWS 和腾讯云替代方案，迁移期间可能出现短暂停机。",
        "date": "2024-11-30",
        "time": "13:33",
        "year": 2024,
        "month": 11,
        "tags": ["迁移", "基础设施"]
    },
    {
        "title": "【稳定升级】服务器迁移至阿里云",
        "summary": "为提供更稳定的服务，已完成阿里云上海节点部署，每日 3 次自动备份，DDOS 防护系统启用，平均延迟降低至 50ms。",
        "date": "2024-11-08",
        "time": "20:34",
        "year": 2024,
        "month": 11,
        "tags": ["迁移", "基础设施"]
    },
    {
        "title": "【版本调整】回退至 1.20.1 解决性能问题",
        "summary": "由于 1.20.2 版本出现未知性能下降，服务器已降级回 1.20.1，继续使用 Mohist 核心维持运行。玩法不受影响。",
        "date": "2024-10-13",
        "time": "10:46",
        "year": 2024,
        "month": 10,
        "tags": ["版本回退", "核心更换"]
    },
    {
        "title": "【核心更换】尝试 Mohist 混合核心",
        "summary": "因 Forge 报错问题难以解决，现已改用 Mohist 核心，版本升级至 1.20.2，支持插件和模组混合运行。",
        "date": "2024-10-01",
        "time": "19:34",
        "year": 2024,
        "month": 10,
        "tags": ["核心更换", "架构"]
    },
    {
        "title": "【功能扩展】计划引入 Forge 模组支持",
        "summary": "计划添加 Forge 支持以丰富玩法，但因持续报错问题，暂时搁置该计划。后续将评估其他模组加载方案。",
        "date": "2024-09-28",
        "time": "21:09",
        "year": 2024,
        "month": 9,
        "tags": ["架构", "搁置"]
    },
    {
        "title": "【服务器创立】EndlessPixel 前身诞生",
        "summary": "服务器初始版本：1.20.1，使用 Vanilla 原版核心运行，由服主个人电脑搭建。这是旅途的起点。",
        "date": "2024-09-16",
        "time": "01:53",
        "year": 2024,
        "month": 9,
        "tags": ["创立"]
    }
];

export default function AnnouncementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // 提取所有唯一标签
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        announcements.forEach(item => {
            item.tags.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
    }, []);

    // 筛选公告（标题、摘要匹配搜索词 + 标签匹配）
    const filteredAnnouncements = useMemo(() => {
        let filtered = [...announcements];

        // 搜索词筛选
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.summary.toLowerCase().includes(term)
            );
        }

        // 标签筛选
        if (selectedTag) {
            filtered = filtered.filter(item =>
                item.tags.includes(selectedTag)
            );
        }

        // 按时间倒序排序（最新的在前）
        filtered.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateB.getTime() - dateA.getTime();
        });

        return filtered;
    }, [searchTerm, selectedTag]);

    // 清除所有筛选
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedTag(null);
    };

    // 处理标签点击
    const handleTagClick = (tag: string) => {
        setSelectedTag(selectedTag === tag ? null : tag);
    };

    // 是否有筛选条件激活
    const hasActiveFilters = searchTerm.trim() !== "" || selectedTag !== null;

    return (
        <>
            <Navigation />

            {/* 背景装饰效果 */}
            <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
                {/* 炫酷背景渐变效果 */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative px-4 py-12">
                    <header className="max-w-3xl mx-auto mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-light bg-linear-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-gray-100 dark:via-blue-400 dark:to-gray-100 bg-clip-text text-transparent tracking-wide animate-fade-in">
                            服务器公告
                        </h1>
                    </header>

                    {/* 搜索和筛选区域 */}
                    <div className="max-w-3xl mx-auto mb-8 space-y-4 animate-fade-in-up">
                        {/* 搜索框 */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg group-focus-within:opacity-100 opacity-0 transition-opacity duration-300" />
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="搜索公告标题或内容..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-5 py-3 pl-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
                                />
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 标签云和筛选状态 */}
                        <div className="space-y-3">
                            {/* 标签列表 */}
                            <div className="flex flex-wrap gap-2">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${selectedTag === tag
                                            ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md"
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>

                            {/* 激活的筛选条件显示 */}
                            {hasActiveFilters && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        找到 <span className="font-semibold text-blue-500">{filteredAnnouncements.length}</span> 条公告
                                    </span>
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 group"
                                    >
                                        <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        清除筛选
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 时间轴容器 */}
                    <div className="max-w-3xl mx-auto relative">
                        {/* 空状态提示 */}
                        {filteredAnnouncements.length === 0 && (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">暂无相关公告</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    查看全部公告 →
                                </button>
                            </div>
                        )}

                        {/* 时间轴线 */}
                        {filteredAnnouncements.map((item, index) => (
                            <div
                                key={`${item.date}-${item.time}`}
                                className="mb-12 relative animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* 时间轴圆点 - 炫酷脉冲效果 */}
                                <div className="absolute left-[-1.85rem] top-5">
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-white dark:bg-gray-950 border-2 border-blue-400 rounded-full relative z-10 shadow-lg shadow-blue-500/50" />
                                        <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-40" />
                                    </div>
                                </div>

                                {/* 卡片内容 */}
                                <div className="group relative ml-2 md:ml-0">
                                    {/* 炫酷卡片背景 - 渐变边框效果 */}
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 rounded-xl group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 blur-xl" />

                                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transform hover:-translate-y-1">
                                        {/* 标题行 */}
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {item.title}
                                        </h2>

                                        {/* 标签列表 */}
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    onClick={() => handleTagClick(tag)}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-105"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* 正文 */}
                                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.summary}
                                        </p>

                                        {/* 时间信息 */}
                                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <time>
                                                {item.year} 年 {item.month} 月
                                                <span className="mx-2">·</span>
                                                {item.date} {item.time}
                                            </time>
                                        </div>

                                        {/* 炫酷装饰线 */}
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />

            {/* 自定义动画样式 */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }
                
                .border-gradient-l {
                    border-left-color: transparent;
                    background: linear-gradient(to bottom, #3b82f6, #a855f7);
                    background-clip: border-box;
                }
            `}</style>
        </>
    );
}