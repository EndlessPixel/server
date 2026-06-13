import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";

const announcements = [
    // ID 18 -> 最新的，应该在最上面
    {
        "id": 18,
        "title": "【网络优化】服务器节点全面升级",
        "summary": "已完成全球节点架构的全面升级：新增广州、湖北、湖南连接节点，网络带宽和延迟得到显著优化，支持更高并发连接数。",
        "date": "2025-04-04",
        "time": "17:09",
        "year": 2025,
        "month": 4,
        "tags": ["网络优化", "节点"]
    },
    {
        "id": 17,
        "title": "【迁移完成】高延迟问题已解决",
        "summary": "服务器迁移至新数据中心后：平均延迟从 380ms 降至 65ms，丢包率归零，新增备用网络通道。",
        "date": "2025-04-03",
        "time": "18:27",
        "year": 2025,
        "month": 4,
        "tags": ["迁移", "网络优化"]
    },
    {
        "id": 16,
        "title": "【安全警报】病毒入侵处理通报",
        "summary": "3 月 27 日检测到病毒攻击后，已重装所有宿主系统，玩家数据 100% 完整保留，已恢复正常服务。如有疑问，请联系客服。",
        "date": "2025-03-27",
        "time": "18:08",
        "year": 2025,
        "month": 3,
        "tags": ["安全", "病毒", "重装"]
    },
    {
        "id": 15,
        "title": "【重要通知】存档重置与补偿措施",
        "summary": "由于服务器存档文件意外损坏，不得不进行存档重置。为表达歉意，将向所有玩家发放补偿：木头 x64、煤 x32、铁锭 x16、金锭 x8、钻石 x4、下界合金碎片 x2。",
        "date": "2025-03-25",
        "time": "14:14",
        "year": 2025,
        "month": 3,
        "tags": ["存档重置", "补偿"]
    },
    {
        "id": 14,
        "title": "【技术报告】延迟问题根源查明",
        "summary": "确认超高延迟原因为 VMware 虚拟网卡问题。",
        "date": "2025-03-25",
        "time": "21:20",
        "year": 2025,
        "month": 3,
        "tags": ["故障", "网络", "vmware"]
    },
    {
        "id": 13,
        "title": "【域名更新】endlesspixel.fun 正式启用",
        "summary": "全新域名 endlesspixel.fun 现已注册并启用，旧域名将继续保留 30 天用于跳转，建议各位玩家尽快更新书签。",
        "date": "2025-03-24",
        "time": "22:23",
        "year": 2025,
        "month": 3,
        "tags": ["域名"]
    },
    {
        "id": 12,
        "title": "【更名公告】PixelAdventure → EndlessPixel",
        "summary": "即日起，服务器正式更名为 EndlessPixel！新名称象征着打造无限可能像素世界的愿景，配套的新 LOGO 和官网将在本周内更新。",
        "date": "2025-03-24",
        "time": "20:29",
        "year": 2025,
        "month": 3,
        "tags": ["更名", "品牌"]
    },
    {
        "id": 11,
        "title": "【故障通报】异常高延迟警告",
        "summary": "自当日 14:00 起出现间歇性 400ms+ 延迟、部分区块加载异常，技术团队正在检查网络硬件、分析流量日志，尚未定位根本原因。",
        "date": "2025-03-24",
        "time": "17:33",
        "year": 2025,
        "month": 3,
        "tags": ["故障", "延迟"]
    },
    {
        "id": 10,
        "title": "【渠道拓展】官方服务器上架",
        "summary": "现已入驻 minecraftservers.org，平台支持服务器状态实时监控和玩家评价系统，搜索 'PixelAdventure' 即可找到。",
        "date": "2025-03-13",
        "time": "19:23",
        "year": 2025,
        "month": 3,
        "tags": ["推广", "入驻"]
    },
    {
        "id": 9,
        "title": "【硬件升级】服务器性能大幅提升",
        "summary": "全新服务器配置已上线：48 核 CPU、96GB 内存、1.5TB NVMe 固态硬盘、千兆独享带宽，可支持 2025 人同时在线！",
        "date": "2025-03-15",
        "time": "17:48",
        "year": 2025,
        "month": 3,
        "tags": ["硬件升级", "性能"]
    },
    {
        "id": 8,
        "title": "【核心更换通知】",
        "summary": "服务器核心已从 Mohist 更改为 Paper，当前版本保持为 1.20.1 不变，此项变更将提升服务器运行效率。",
        "date": "2025-01-14",
        "time": "08:35",
        "year": 2025,
        "month": 1,
        "tags": ["核心更换", "paper"]
    },
    {
        "id": 7,
        "title": "【品牌升级】PixelAdventure 正式命名",
        "summary": "经过玩家投票，'像素探险 (PixelAdventure)' 从候选名中胜出，将用于服务器标识、官网及社群平台。",
        "date": "2024-12-06",
        "time": "20:24",
        "year": 2024,
        "month": 12,
        "tags": ["命名", "品牌"]
    },
    {
        "id": 6,
        "title": "【服务迁移】阿里云服务器到期通知",
        "summary": "当前阿里云服务器将于 12 月 15 日到期，正在评估 AWS 和腾讯云替代方案，迁移期间可能出现短暂停机。",
        "date": "2024-11-30",
        "time": "13:33",
        "year": 2024,
        "month": 11,
        "tags": ["到期", "迁移预告"]
    },
    {
        "id": 5,
        "title": "【稳定升级】服务器迁移至阿里云",
        "summary": "为提供更稳定的服务，已完成阿里云上海节点部署，每日 3 次自动备份，DDOS 防护系统启用，平均延迟降低至 50ms。",
        "date": "2024-11-08",
        "time": "20:34",
        "year": 2024,
        "month": 11,
        "tags": ["迁移", "阿里云", "优化"]
    },
    {
        "id": 4,
        "title": "【版本调整公告】",
        "summary": "由于性能问题，服务器从 1.20.2 降级回 1.20.1，继续使用 Mohist 核心维持运行。",
        "date": "2024-10-13",
        "time": "10:46",
        "year": 2024,
        "month": 10,
        "tags": ["版本回退", "mohist"]
    },
    {
        "id": 3,
        "title": "【核心更换尝试】",
        "summary": "因 Forge 报错问题难以解决，现已改用 Mohist 核心，版本升级至 1.20.2，支持插件和模组混合运行。",
        "date": "2024-10-01",
        "time": "19:34",
        "year": 2024,
        "month": 10,
        "tags": ["核心更换", "mohist"]
    },
    {
        "id": 2,
        "title": "【功能扩展通知】",
        "summary": "计划添加 Forge 支持以丰富玩法，但因持续报错问题，暂时搁置该计划。",
        "date": "2024-09-28",
        "time": "21:09",
        "year": 2024,
        "month": 9,
        "tags": ["forge", "搁置"]
    },
    {
        "id": 1,
        "title": "【服务器创立公告】",
        "summary": "服务器初始版本：1.20.1，使用 Vanilla 原版核心运行，由服主个人电脑搭建，初期对服务器配置了解有限。",
        "date": "2024-09-16",
        "time": "01:53",
        "year": 2024,
        "month": 9,
        "tags": ["创立", "vanilla"]
    }
];

export default function AnnouncementPage() {
    return (
        <>
            <Navigation />


            <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12 transition-colors duration-300">

                <header className="max-w-3xl mx-auto mb-12 text-center">
                    <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 tracking-wide">
                        服务器大事记
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        自甲辰年至丙午年 · EndlessPixel
                    </p>
                </header>

                {/* 时间轴容器 */}
                {/* 亮色：浅灰线 | 暗色：深灰线 */}
                <div className="max-w-3xl mx-auto relative border-l border-gray-200 dark:border-gray-800 pl-6">
                    {announcements.map((item) => (
                        <div key={item.id} className="mb-10 relative">
                            {/* 时间轴圆点 */}
                            {/* 亮色：白底蓝边 | 暗色：黑底蓝边 */}
                            <span className="absolute -left-7.75 top-1 w-3 h-3 bg-white dark:bg-gray-950 border-2 border-blue-400 rounded-full"></span>

                            <div className="group">
                                {/* 标题：亮色黑字，暗色白字，Hover变蓝 */}
                                <h2 className="text-lg font-normal text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                                    {item.title}
                                </h2>

                                {/* 正文：亮色深灰，暗色浅灰 */}
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.summary}
                                </p>

                                {/* 时间：亮色中灰，暗色深灰 */}
                                <time className="mt-3 block text-xs text-gray-500 dark:text-gray-500">
                                    {item.year} 年 {item.month} 月
                                    <span className="mx-2">·</span>
                                    {item.date} {item.time}
                                </time>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}