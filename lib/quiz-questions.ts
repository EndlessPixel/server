/**
 * 服务器考试题库（纯数据）。
 *
 * 事实来源：`public/system.md`（EPBot 官方知识库）、`README.md`、`app/about`。
 * 修改题目时请同步核对知识库，避免答案随版本变更而失效。
 *
 * 约定：
 * - 每题恰好 4 个选项，`answer` 是正确项在 `options` 中的下标（0 起）。
 *   （考试时会同时打乱题目顺序与选项顺序，所以无需刻意分散正确项位置。）
 * - `id` 一旦发布就不要复用，便于后续统计错题分布。
 */

export type QuizCategory = "接入" | "版本" | "玩法" | "整合包" | "社区" | "规则" | "技术";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  /** 正确选项下标（0 起） */
  answer: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  /* ---------------- 接入 ---------------- */
  {
    id: "connect-address",
    category: "接入",
    question: "通过哪个地址可以连接 EndlessPixel 服务器？",
    options: [
      "mc.endlesspixel.cn",
      "play.endlesspixel.cn",
      "endlesspixel.cn:25566",
      "bedrock.endlesspixel.cn",
    ],
    answer: 0,
    explanation: "官方地址是 mc.endlesspixel.cn，另有备用地址 epmc.qzz.io，两者都通过 SRV 解析。",
  },
  {
    id: "connect-port",
    category: "接入",
    question: "连接服务器时需要手动填写端口号吗？",
    options: ["需要填写 25565", "需要填写 19132", "不需要，SRV 解析会自动完成", "需要填写 3000"],
    answer: 2,
    explanation:
      "本服使用 SRV 解析，直接填域名即可，无需在地址后追加端口。19132 是基岩版常用端口，与本服无关。",
  },
  {
    id: "connect-platform",
    category: "接入",
    question: "下列哪种客户端可以正常连接本服？",
    options: [
      "手机上的基岩版（Bedrock）",
      "网易我的世界",
      "浏览器里的网页版 Minecraft",
      "手机上通过 Java 版启动器运行的客户端",
    ],
    answer: 3,
    explanation:
      "能连本服的只有「Minecraft Java 版」，不管它跑在电脑还是手机上。手机端用 Java 版启动器（如 PojavLauncher、FCL、HMCL-PE）接入方式与电脑端完全一致。",
  },
  {
    id: "connect-bedrock",
    category: "接入",
    question: "基岩版（Bedrock）客户端能不能进入本服？",
    options: [
      "可以，只要版本号对得上",
      "不可以，协议与账号体系不通",
      "可以，但需要额外安装插件",
      "可以，只要绑定正版账号",
    ],
    answer: 1,
    explanation:
      "基岩版与本服的协议、账号体系都不通，无法连接。手机/主机/Win10 原版 App、网易我的世界都属于基岩版。",
  },
  {
    id: "connect-premium",
    category: "接入",
    question: "加入服务器需要有正版 Minecraft 账号吗？",
    options: [
      "必须使用正版账号",
      "不需要，支持离线登录",
      "需要绑定邮箱后才能进入",
      "需要付费激活账号",
    ],
    answer: 1,
    explanation:
      "无需正版账号。原版客户端、离线登录，以及 LittleSkin / HelloSkin 等第三方皮肤账号都可以直接连接。",
  },
  {
    id: "connect-mobile-launcher",
    category: "接入",
    question: "下列哪个是安卓端运行 Minecraft Java 版的启动器？",
    options: ["PojavLauncher", "TLauncher PE", "MCPE Launcher", "BlockLauncher"],
    answer: 0,
    explanation:
      "PojavLauncher 是在安卓上运行 Java 版的通用开源启动器；FCL、HMCL-PE 也是同类方案。",
  },
  {
    id: "connect-hmclpe",
    category: "接入",
    question: "HMCL-PE 是用来做什么的？",
    options: [
      "服务端插件",
      "HMCL 面向移动设备的版本，用于手机运行 Java 版",
      "光影包合集",
      "数据包制作工具",
    ],
    answer: 1,
    explanation: "HMCL-PE 是 HMCL 针对移动设备开发的版本，用途是在手机上运行 Minecraft Java 版。",
  },
  {
    id: "connect-skin-account",
    category: "接入",
    question: "可以使用哪些第三方皮肤账号直接进服？",
    options: ["仅 Mojang 正版账号", "仅微软账号", "LittleSkin / HelloSkin", "本服不支持任何皮肤"],
    answer: 2,
    explanation:
      "LittleSkin 与 HelloSkin 等第三方皮肤账号均可直连，游戏内还可用相关指令设置与预览皮肤。",
  },

  /* ---------------- 版本 ---------------- */
  {
    id: "version-main",
    category: "版本",
    question: "EndlessPixel 主服务器当前主推的正式版本是？",
    options: ["1.20.1", "1.21.11", "26.2", "1.16.5"],
    answer: 2,
    explanation: "当前主推 Java 版 26.2，客户端需升级到对应 26.x 版本后方可进入。",
  },
  {
    id: "version-range",
    category: "版本",
    question: "正式服客户端兼容的版本区间是？",
    options: ["1.12.2 ~ 1.20.1", "1.7.2 ~ 26.2", "1.16 ~ 1.21", "仅支持 26.x"],
    answer: 1,
    explanation: "正式服客户端兼容区间为 Java 版 1.7.2 ~ 26.2，通过 ViaVersion 做跨版本兼容。",
  },
  {
    id: "version-year-scheme",
    category: "版本",
    question: "26.x 这类版本号中的「26」代表什么？",
    options: ["第 26 个大版本", "发布年份 2026", "网络协议号", "服务器内部编号"],
    answer: 1,
    explanation:
      "自 2026 年起 Mojang 正式版统一以年份开头，26 代表 2026 年，例如 26.1、26.1.2、26.2。",
  },
  {
    id: "version-12111",
    category: "版本",
    question: "关于 1.21.11 的说法，哪个是正确的？",
    options: [
      "已被废弃，无法再进服",
      "是 1.x 体系最后的稳定正式版",
      "是一个快照版本",
      "是 EndlessPixel 自定义的版本号",
    ],
    answer: 1,
    explanation:
      "1.21.11 是 1.x 体系的最后稳定正式版，仍属官方正统、并未作废，只是新一代版本号改用了年份前缀。",
  },
  {
    id: "version-java-26",
    category: "版本",
    question: "游玩 MC 26.1 及以上版本，整合包要求的最低 Java 版本是？",
    options: ["Java 8", "Java 17", "Java 21", "Java 25"],
    answer: 3,
    explanation: "MC 26.1+ 起要求 Java 25 及以上；26.1 也是首个彻底移除代码混淆的正式版。",
  },
  {
    id: "version-java-1214",
    category: "版本",
    question: "MC 1.21.4 及以上（含 26.x）要求的最低 Java 版本是？",
    options: ["Java 17", "Java 21", "Java 25", "Java 8"],
    answer: 1,
    explanation:
      "1.21.4 及以上（含 26.x）必须使用 Java 21 及以上；其中 26.1+ 进一步要求 Java 25+。",
  },
  {
    id: "version-262-release",
    category: "版本",
    question: "26.2 这个正式版本的名称与主题是？",
    options: ["洞穴与悬崖", "混沌立方", "棘巧试炼", "群骑纷争"],
    answer: 1,
    explanation: "26.2「混沌立方」于 2026-06-16 发布，加入硫黄洞穴、硫黄、朱砂、硫方怪等内容。",
  },
  {
    id: "version-snapshot-format",
    category: "版本",
    question: "新版快照的命名格式是？",
    options: [
      "年份.年内更新序号-snapshot-快照号",
      "快照号-年份.月份",
      "snapshot-快照号-年份",
      "仅用快照号表示",
    ],
    answer: 0,
    explanation: "新版快照格式为「年份.年内更新序号-snapshot-快照号」，例如 26.4-snapshot-1。",
  },

  /* ---------------- 玩法 ---------------- */
  {
    id: "game-chain-mining",
    category: "玩法",
    question: "连锁挖掘单次最多可以采集多少个同类方块？",
    options: ["16 个", "32 个", "64 个", "没有上限"],
    answer: 2,
    explanation: "按住蹲并使用对应工具触发连锁挖掘，单次最多连锁采集 64 个同类方块。",
  },
  {
    id: "game-achievements",
    category: "玩法",
    question: "服务器基础成就包（BlazeandCave）大约包含多少项进度？",
    options: ["300 多项", "600 多项", "1202 项", "3000 项以上"],
    answer: 2,
    explanation:
      "基础包全服进度共 1202 个；叠加 Enhanced Discoveries 扩展后约为 1600 项，覆盖探索、建造、战斗、社交等维度。",
  },
  {
    id: "game-sit",
    category: "玩法",
    question: "在服务器里怎么让角色「坐下」？",
    options: ["按 Shift 键", "空手右键下半砖或楼梯", "输入 /sit", "蹲下后跳跃"],
    answer: 1,
    explanation: "空手右键下半砖或楼梯即可坐下，属于服务器提供的原版体验优化。",
  },
  {
    id: "game-farm-protection",
    category: "玩法",
    question: "在成熟农作物上行走奔跑会发生什么？",
    options: ["会把作物踩坏", "不会损毁成熟农作物", "只有跳跃时才会踩坏", "取决于具体游戏版本"],
    answer: 1,
    explanation: "服务器开启了农田保护，行走踩踏不会损毁成熟农作物。",
  },
  {
    id: "game-dominion",
    category: "玩法",
    question: "服务器中用于自主圈地、保护建筑与物资的系统是？",
    options: ["WorldGuard", "Dominion", "GriefPrevention", "Towny"],
    answer: 1,
    explanation: "领地系统使用 Dominion 插件，支持可视化圈地、精细权限与跨服同步。",
  },
  {
    id: "game-blocklocker",
    category: "玩法",
    question: "给箱子、门等容器上锁并授权好友，依赖的是哪个插件？",
    options: ["Lockette", "BlockLocker", "ChestLock", "LockDown"],
    answer: 1,
    explanation: "箱子锁基于 BlockLocker，用告示牌为箱子、门、活板门等容器上锁并授权好友共享。",
  },
  {
    id: "game-cutter",
    category: "玩法",
    question: "大师切割机为切石机拓展了多少条切割配方？",
    options: ["100+", "300+", "500+", "50+"],
    answer: 2,
    explanation: "大师切割机拓展了 500+ 切割配方，方便建造选材与方块加工。",
  },
  {
    id: "game-end-structures",
    category: "玩法",
    question: "服务器在末地新增了多少自定义建筑遗迹？",
    options: ["5 个", "10 个", "20+ 个", "50+ 个"],
    answer: 2,
    explanation: "除对原版结构做模型重做外，末地还新增了 20+ 自定义建筑遗迹等待探索。",
  },
  {
    id: "game-skill-system",
    category: "玩法",
    question: "服务器的技能系统包含哪些方向？",
    options: ["只有战斗一条线", "采集、战斗、生存等多条技能树", "只有采集一条线", "只有钓鱼一条线"],
    answer: 1,
    explanation: "技能系统包含采集、战斗、生存等多条技能树，通过对应行为升级并解锁被动、主动能力。",
  },
  {
    id: "game-vanilla-balance",
    category: "玩法",
    question: "服务器对原版玩法的整体态度是？",
    options: [
      "大幅魔改原版机制",
      "仅用插件优化体验，不破坏原版生存与创造核心玩法",
      "把原版机制全部替换掉",
      "关闭所有原版机制",
    ],
    answer: 1,
    explanation: "服务器坚持「原版平衡」：只用插件优化体验，不破坏原版生存、创造的核心玩法。",
  },
  {
    id: "game-teleport-command",
    category: "玩法",
    question: "下列哪个是服务器提供的传送相关指令？",
    options: ["/tpa", "/home2", "/tpall", "/warp2"],
    answer: 0,
    explanation: "/tpa 是玩家间传送请求指令，另有 /tpahere、/tpaccept、/spawn 等配套指令。",
  },
  {
    id: "game-skin-command",
    category: "玩法",
    question: "用于在游戏内设置皮肤的指令是？",
    options: ["/skin", "/skin2", "/myskin", "/setskin"],
    answer: 0,
    explanation: "皮肤相关指令为 /skin，例如 /skin set Dream，可设置、上传与预览皮肤。",
  },

  /* ---------------- 整合包 ---------------- */
  {
    id: "modpack-render",
    category: "整合包",
    question: "官方整合包使用的渲染核心是？",
    options: ["OptiFine", "Sodium + Iris", "ShadersMod", "Canvas"],
    answer: 1,
    explanation: "整合包渲染核心为 Sodium + Iris 光影框架，这也是它无法与 OptiFine 共存的原因。",
  },
  {
    id: "modpack-optifine",
    category: "整合包",
    question: "可以在官方整合包里加装 OptiFine 吗？",
    options: [
      "可以，直接安装即可",
      "不可以，它与 Sodium + Iris 互相排斥",
      "可以，但需要改配置文件",
      "只能单机使用",
    ],
    answer: 1,
    explanation:
      "不可以。渲染核心是 Sodium + Iris，与 OptiFine 互相排斥、无法共存；需要光影时把光影文件放进 shaderpacks 文件夹即可。",
  },
  {
    id: "modpack-scope",
    category: "整合包",
    question: "关于官方整合包的定位，哪一项是正确的？",
    options: [
      "里面包含领地、技能等全部玩法",
      "它只是客户端优化集合，玩法由服务端插件提供",
      "它是一个服务端整合包",
      "必须安装整合包才能进服",
    ],
    answer: 1,
    explanation:
      "整合包是客户端优化集合（提升帧率、降低延迟、视觉优化、预置资源包与前置模组）；领地、粘液科技、技能、连锁挖掘等玩法全部由服务端插件提供。",
  },
  {
    id: "modpack-required",
    category: "整合包",
    question: "必须安装官方整合包才能进入服务器吗？",
    options: ["必须安装", "不必须，原版客户端也能游玩", "需要购买付费版", "只有手机端必须安装"],
    answer: 1,
    explanation: "安装官方整合包不属于强制要求，原版客户端也可以正常进入服务器。",
  },
  {
    id: "modpack-format",
    category: "整合包",
    question: "官方整合包采用什么格式打包？",
    options: ["CurseForge 打包", "Modrinth 打包", "MultiMC 实例", "自研压缩格式"],
    answer: 1,
    explanation:
      "整合包为 Modrinth 打包格式，推荐使用 Modrinth 官方启动器、PCL2 或 HMCL 安装部署。",
  },
  {
    id: "modpack-version-rule",
    category: "整合包",
    question: "反馈问题时，官方要求提供哪种版本号？",
    options: [
      "写「最新版」即可",
      "完整的整合包版本号，例如 1.21.11-v10-3.0",
      "只需要游戏大版本",
      "不需要版本号",
    ],
    answer: 1,
    explanation:
      "必须给出完整版本号（如 1.21.11-v10-3.0、26.1.2-1.2）。只说「最新版」「1.21」「新版本」这类写法无法定位问题。",
  },
  {
    id: "modpack-release-cycle",
    category: "整合包",
    question: "整合包 Beta 版本通常在 MC 新版本发布后多久推出？",
    options: ["当天", "一周内", "一个月内", "不做任何时效说明，随缘发布"],
    answer: 1,
    explanation:
      "Beta 版本一般在 MC 新版本发布后一周内推出，但不做硬性时效保证；正式稳定版取决于主流核心模组的适配进度。",
  },
  {
    id: "modpack-stage",
    category: "整合包",
    question: "整合包的版本迭代分为哪三个阶段？",
    options: [
      "Dev → Test → Prod",
      "Alpha → Beta → Stable",
      "Preview → RC → GA",
      "Lite → Full → Ultra",
    ],
    answer: 1,
    explanation:
      "迭代分为 Alpha（内测）→ Beta（公测）→ Stable（正式稳定版）三个阶段，模组完成度约 95% 后由 Alpha 转入 Beta。",
  },
  {
    id: "modpack-neoforge",
    category: "整合包",
    question: "官方整合包是否会推出 NeoForge 版本？",
    options: [
      "已经推出了",
      "目前暂无计划，因为约 80% 的核心模组只维护 Fabric 分支",
      "下个版本就会推出",
      "NeoForge 与 Fabric 可以混用",
    ],
    answer: 1,
    explanation:
      "当前约 80% 的核心模组仅持续维护 Fabric 分支，因此暂无 NeoForge 版本计划；若生态整体转向，规划可能调整。",
  },

  /* ---------------- 社区 ---------------- */
  {
    id: "community-qq",
    category: "社区",
    question: "官方 QQ 群的群号是？",
    options: ["870594910", "123456789", "2267848501", "3319182533"],
    answer: 0,
    explanation: "官方 QQ 群为 870594910，封禁申诉等问题也可以通过该群联系管理。",
  },
  {
    id: "community-email",
    category: "社区",
    question: "官方支持邮箱是？",
    options: ["support@endlesspixel.cn", "admin@endlesspixel.cn", "help@epmc.cn", "service@qq.com"],
    answer: 0,
    explanation: "官方支持邮箱为 support@endlesspixel.cn，封禁申诉或邮件反馈都走这个地址。",
  },
  {
    id: "community-wiki",
    category: "社区",
    question: "官方 Wiki 的地址是？",
    options: [
      "wiki.endlesspixel.cn",
      "docs.endlesspixel.cn",
      "endlesspixel.cn/wiki",
      "wiki.epmc.cn",
    ],
    answer: 0,
    explanation: "官方 Wiki 是 wiki.endlesspixel.cn，服务器玩法、指令、规则等都以该站记载为准。",
  },
  {
    id: "community-monitor",
    category: "社区",
    question: "查看服务器硬件监控的地址是？",
    options: [
      "sys.epmc.qzz.io",
      "status.epmc.cn",
      "monitor.endlesspixel.cn",
      "mc.endlesspixel.cn/sys",
    ],
    answer: 0,
    explanation: "硬件详情（CPU、真实内存占用、磁盘、网络、负载）公开在 sys.epmc.qzz.io。",
  },
  {
    id: "community-activities",
    category: "社区",
    question: "关于服务器活动的说法，哪个是正确的？",
    options: [
      "每周都有固定活动",
      "基本很少举办活动，一切以官方公告为准",
      "每月都有充值活动",
      "每天都有签到奖励",
    ],
    answer: 1,
    explanation:
      "本服基本很少举办活动，官方也极少组织；具体以官方公告为准，不要相信编造的活动名称与奖励。",
  },
  {
    id: "community-appeal",
    category: "社区",
    question: "如果认为自己被误封，正确的申诉方式是？",
    options: [
      "在游戏内反复喊话要求解封",
      "通过官方 QQ 群联系管理，或发邮件到 support@endlesspixel.cn",
      "找任意玩家代为处理",
      "重新注册一个账号即可",
    ],
    answer: 1,
    explanation:
      "误封申诉属于管理侧事务，需要在官方 QQ 群 870594910 联系管理，或邮件 support@endlesspixel.cn 说明情况，由服主核实处理。",
  },

  /* ---------------- 规则 ---------------- */
  {
    id: "rule-ban-scope",
    category: "规则",
    question: "服务器的规则主要封禁哪类行为？",
    options: ["任何 PVP 行为", "作弊与恶意破坏", "建造大型建筑", "使用村民交易"],
    answer: 1,
    explanation: "规则整体宽松，只封禁作弊、恶意破坏这类行为，鼓励自由建造与探索。",
  },
  {
    id: "rule-issue-repo",
    category: "规则",
    question: "整合包的 Bug 反馈应该提交到哪个仓库？",
    options: [
      "EndlessPixel/server",
      "EndlessPixel/EndlessPixel-Modpack",
      "HMCL-dev/HMCL",
      "modrinth/modpack",
    ],
    answer: 1,
    explanation:
      "整合包相关问题提交到 github.com/EndlessPixel/EndlessPixel-Modpack/issues；网站本身的问题才走 EndlessPixel/server。",
  },
  {
    id: "rule-issue-language",
    category: "规则",
    question: "提交整合包 Issue 时应当使用什么语言？",
    options: ["中文", "英文", "中英混排随意", "由开发者临时指定"],
    answer: 1,
    explanation: "GitHub 表单是英文的，直接粘贴中文无法正常归类处理，因此要求使用英文填写。",
  },
  {
    id: "rule-log-platform",
    category: "规则",
    question: "反馈崩溃问题时，日志建议上传到哪里？",
    options: ["微信", "mclo.gs 或 Pastebin", "百度网盘", "以邮件附件形式发送"],
    answer: 1,
    explanation: "日志上传平台限定 mclo.gs / Pastebin，并需要提供完整日志链接而不是截图片段。",
  },
  {
    id: "rule-issue-prefix",
    category: "规则",
    question: "提交 Issue 时标题需要携带哪种前缀？",
    options: ["[Bug] / [Crash] / [Request]", "【紧急】/【普通】", "[EP] / [MC]", "不需要任何前缀"],
    answer: 0,
    explanation: "Issue 标题必须携带 [Bug]、[Crash]、[Request] 前缀，便于分类处理。",
  },
  {
    id: "rule-economy",
    category: "规则",
    question: "本服存在游戏货币、商店或交易行吗？",
    options: ["有金币和官方商店", "有玩家交易行", "没有任何经济系统和货币", "可以充值购买装备"],
    answer: 2,
    explanation: "服务器没有任何经济系统和货币，也不存在金币、点券、商店、交易行、充值这类系统。",
  },
  {
    id: "rule-villager-currency",
    category: "规则",
    question: "服务器里村民交易统一使用什么作为通货？",
    options: ["金币", "点券", "绿宝石", "钻石"],
    answer: 2,
    explanation: "村民交易按原版机制使用绿宝石，这是 Minecraft 原版设定，不是服务器自定义货币。",
  },
  {
    id: "rule-player-trade",
    category: "规则",
    question: "玩家之间的交易方式是？",
    options: [
      "通过拍卖行竞价",
      "以物换物、双方自由商谈",
      "按官方公示的价格交易",
      "只能通过官方商店买卖",
    ],
    answer: 1,
    explanation: "玩家之间完全以物换物、自由商谈，没有固定价格、没有中间系统、没有官方定价。",
  },
  {
    id: "rule-free",
    category: "规则",
    question: "关于服务器收费的说法，哪一项正确？",
    options: ["需要购买月卡", "存在付费道具", "完全免费、无广告、无付费内容", "充值可以获得特权"],
    answer: 2,
    explanation:
      "EndlessPixel 服务器完全免费：无内置充值、无会员体系、无付费道具、无强制或诱导性推广广告。",
  },

  /* ---------------- 技术 ---------------- */
  {
    id: "tech-uptime",
    category: "技术",
    question: "EndlessPixel 服务器大约从什么时候开始运营？",
    options: ["2022-01-01", "2024-09-16", "2023-06-01", "2025-01-01"],
    answer: 1,
    explanation: "服务器开服日期为 2024-09-16，站内「开服时长」组件即基于该日期实时计算。",
  },
  {
    id: "tech-core",
    category: "技术",
    question: "服务器使用的服务端核心是？",
    options: ["Spigot", "Paper", "Purpur", "原版 Vanilla"],
    answer: 2,
    explanation: "服务端使用 Purpur 核心运行，兼顾原版体验与插件扩展能力。",
  },
  {
    id: "tech-cpu",
    category: "技术",
    question: "服务器公开的硬件信息中，CPU 型号是？",
    options: ["Intel i5-12450H", "AMD Ryzen 9 9950X", "AMD EPYC 7002", "Intel Xeon E5"],
    answer: 1,
    explanation: "服务器 CPU 为 AMD Ryzen 9 9950X；i5-12450H 是整合包性能测试用的参考配置。",
  },
  {
    id: "tech-memory",
    category: "技术",
    question: "服务器公开的真实内存占用大约是？",
    options: ["4GB", "8GB", "12GB", "32GB"],
    answer: 2,
    explanation: "官方公开的是真实内存占用约 12GB，磁盘、网络、负载等信息一并公开。",
  },
  {
    id: "tech-backup",
    category: "技术",
    question: "服务器在数据安全方面做了哪些保障？",
    options: ["没有备份", "反作弊防护 + 云端存档定时备份", "仅靠玩家自行备份", "每天手动备份一次"],
    answer: 1,
    explanation: "服务器具备反作弊防护与云端存档定时备份，用于保障在线稳定性与数据安全。",
  },
  {
    id: "tech-modpack-fps",
    category: "技术",
    question: "官方给出的整合包优化效果，在参考配置上大约能到多少帧？",
    options: ["稳定 60FPS", "常态约 200FPS，极限场景可达 600+FPS", "约 100FPS", "与原版一致"],
    answer: 1,
    explanation:
      "参考配置（i5-12450H / 16GB / 核显）上，原生约 30FPS 优化到常态 200FPS，极限场景最高 600+FPS。",
  },
];
