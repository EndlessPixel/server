/**
 * 服务器考试题库（纯数据）。
 *
 * 事实来源（写题前一律先 grep 核对，找不到出处就不要写）：
 * - `public/system.md`   EPBot 官方知识库，最权威
 * - `README.md`、`app/page.tsx`、`app/layout.tsx`、`components/hero-section.tsx`  站内公开口径
 *
 * 出题四条硬标准（不合就改，改不了就删）：
 * 0. **必须点明「问的是谁」** —— 最容易翻车的一条。只要知识点的答案在原版与本服之间
 *    不一样，题干就必须写明「本服 / 服务器 / 官方整合包」，否则玩家拿着原版知识去答，
 *    答的其实没错，是题目有歧义。反例：
 *      ✗「在成熟的农作物上跑过去会发生什么？」（玩家会默认问的是原版 → 答案不唯一）
 *      ✓「在本服，从成熟的农作物上跑过去会怎样？」
 *    凡是涉及指令（/tpa、/skin）、插件玩法、原版机制改动的题目，题干都要带「本服」。
 *    纯考 Minecraft 官方版本号、快照格式、原版版本事实的题目，则要写明「Minecraft 官方」，
 *    避免玩家以为在问本服自定义的东西。
 * 1. **不许编造**：题干的每个事实点、解析里的每句话，都必须是官方来源里写着的。
 *    冷门不等于不能考 —— 服务器硬件配置、MC 版本号格式与命名规则、原版版本事实、
 *    启动器、指令、插件名，只要官方来源有记载就可以考。红线只有一条：**不许自行推测补全**。
 *    写题前先 grep 出处；解析里也不要补充知识库没写的机制细节。
 * 2. **题意自明**：读完题干就知道在问什么，不需要玩家自己补全隐含前提。
 * 3. **答案唯一**：正确项是唯一说得通的那个，不能出现「另一个也说得对」。
 *    干扰项应当是明确错误的，不要用真实存在且功能相近的东西当错项，玩家会以为「哪个都对」。
 *
 * 其它约定：
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
    question: "Java 版客户端里，要填哪个地址才能进服？",
    options: [
      "mc.endlesspixel.cn",
      "play.endlesspixel.cn",
      "www.endlesspixel.cn",
      "localhost:25565",
    ],
    answer: 0,
    explanation:
      "官方地址是 mc.endlesspixel.cn，备用地址 epmc.qzz.io。本服走 SRV 解析，直接填域名即可，不需要在后面加端口。www.endlesspixel.cn 是官方网站，不是游戏服务器地址。",
  },
  {
    id: "connect-premium",
    category: "接入",
    question: "加入服务器需要有正版 Minecraft 账号吗？",
    options: [
      "必须用正版账号",
      "不需要，支持离线登录",
      "需要先绑定邮箱才能进入",
      "需要付费激活账号",
    ],
    answer: 1,
    explanation:
      "无需正版账号。原版客户端、离线登录，以及 LittleSkin / HelloSkin 等第三方皮肤账号都能直接连。",
  },
  {
    id: "connect-platform",
    category: "接入",
    question: "下面哪种客户端可以正常连接本服？",
    options: [
      "手机上的基岩版（Bedrock）",
      "网易我的世界",
      "浏览器里的网页版 Minecraft",
      "手机端通过 Java 版启动器运行的客户端",
    ],
    answer: 3,
    explanation:
      "能连本服的只有「Minecraft Java 版」，跑在电脑还是手机上都可以。基岩版、网页版的协议和账号体系与本服不通，连不上。",
  },
  {
    id: "connect-mobile",
    category: "接入",
    question: "想在手机上玩本服，正确做法是什么？",
    options: [
      "去应用商店下载「我的世界」手机版直接连",
      "用 PojavLauncher、FCL 这类 Java 版启动器运行游戏再连",
      "用网易我的世界登录后搜索服务器",
      "手机端一律无法连接本服",
    ],
    answer: 1,
    explanation:
      "手机能玩，但必须跑 Java 版：用 PojavLauncher、FCL、HMCL-PE 等 Java 版启动器启动游戏，接入方式和电脑端完全一样。应用商店里的手机版是基岩版，连不上。",
  },
  {
    id: "connect-skin-account",
    category: "接入",
    question: "可以使用哪些第三方皮肤账号直接进服？",
    options: [
      "只能用 Mojang 正版账号",
      "只能用微软账号",
      "LittleSkin / HelloSkin",
      "本服不支持任何皮肤",
    ],
    answer: 2,
    explanation:
      "LittleSkin 与 HelloSkin 等第三方皮肤账号都能直连，游戏内还可以用指令设置与预览皮肤。",
  },

  /* ---------------- 版本 ---------------- */
  {
    id: "version-main",
    category: "版本",
    question: "EndlessPixel 主服务器当前主推的正式版本是？",
    options: ["1.20.1", "1.21.11", "26.2", "1.16.5"],
    answer: 2,
    explanation: "当前主推 Java 版 26.2，客户端需要升级到对应的 26.x 版本之后才能进入。",
  },
  {
    id: "version-range",
    category: "版本",
    question: "本服兼容哪些 Java 版客户端版本？",
    options: ["1.12.2 ~ 1.20.1", "1.7.2 ~ 26.2", "1.16 ~ 1.21", "仅支持 26.x"],
    answer: 1,
    explanation: "正式服兼容 Java 版 1.7.2 ~ 26.2，中间的版本差异通过 ViaVersion 做跨版本兼容。",
  },
  {
    id: "version-year-scheme",
    category: "版本",
    question: "Minecraft 官方版本号 26.x 里面的「26」，指的是什么？",
    options: ["第 26 个大版本", "发布年份 2026 年", "网络协议号", "服务器内部编号"],
    answer: 1,
    explanation:
      "自 2026 年起，Mojang 正式版统一改用年份开头，26 就代表 2026 年，例如 26.1、26.1.2、26.2。这不是本服自己编的版本号。",
  },
  {
    id: "version-12111",
    category: "版本",
    question: "1.21.11 在 Minecraft 官方版本体系里是什么？",
    options: [
      "它已被官方废弃，不再属于正式版",
      "它是 1.x 体系最后的稳定正式版",
      "它只是一个快照版本",
      "它是 EndlessPixel 自己编的版本号",
    ],
    answer: 1,
    explanation:
      "1.21.11 是 1.x 体系的最后稳定正式版，属于官方正统版本、并没有作废 —— 只是新一代版本号改用了年份前缀，所以才有 26.x。",
  },
  {
    id: "version-java-26",
    category: "版本",
    question: "玩 MC 26.1 或更高版本时，官方整合包要求的最低 Java 版本是？",
    options: ["Java 8", "Java 17", "Java 21", "Java 25"],
    answer: 3,
    explanation: "MC 26.1 起要求 Java 25 及以上。26.1 也是第一个彻底移除代码混淆的正式版。",
  },
  {
    id: "version-java-fix",
    category: "版本",
    question: "启动游戏时提示「Java 版本过低」，应该怎么处理？",
    options: [
      "把整合包里的模组删掉几个",
      "在启动器里把 Java 升级到 21 或 25 后重试",
      "删掉整合包重新下载",
      "忽略提示直接点继续",
    ],
    answer: 1,
    explanation:
      "这是 Java 版本的问题，不是游戏的问题：MC 1.21.4 及以上要求 Java 21+，其中 26.1+ 要求 Java 25+。在启动器设置里换成符合要求的 Java 即可。",
  },

  {
    id: "version-262-release",
    category: "版本",
    question: "Minecraft 官方 26.2 正式版的名字是？",
    options: ["洞穴与悬崖", "混沌立方", "棘巧试炼", "群骑纷争"],
    answer: 1,
    explanation:
      "26.2「混沌立方」于 2026-06-16 发布，加入硫黄洞穴、硫黄、朱砂、硫方怪等内容，也是本服当前主推的版本。",
  },
  {
    id: "version-snapshot-format",
    category: "版本",
    question: "Minecraft 新版（26.x 体系）快照的命名格式是？",
    options: [
      "年份.年内更新序号-snapshot-快照号",
      "年份.快照号-snapshot-年内更新序号",
      "snapshot-年份.年内更新序号-快照号",
      "只用快照号，不带年份",
    ],
    answer: 0,
    explanation: "新版快照格式为「年份.年内更新序号-snapshot-快照号」，例如 26.4-snapshot-1。",
  },

  /* ---------------- 玩法 ---------------- */
  {
    id: "game-chain-mining",
    category: "玩法",
    question: "本服的连锁挖掘，单次最多能采集多少个同类方块？",
    options: ["16 个", "32 个", "64 个", "没有上限"],
    answer: 2,
    explanation: "按住蹲并用对应工具触发连锁挖掘，单次最多连锁采集 64 个同类方块。",
  },
  {
    id: "game-achievements",
    category: "玩法",
    question: "关于服务器的成就（进度）系统，下面说法哪个是对的？",
    options: [
      "只有几十个进度，很快就做完了",
      "基础包有 1202 项进度，叠加扩展后约 1600 项",
      "进度只在活动期间开放",
      "需要付费才能解锁成就",
    ],
    answer: 1,
    explanation:
      "基础成就包（BlazeandCave）全服进度共 1202 个，叠加 Enhanced Discoveries 扩展后约 1600 项，覆盖探索、建造、战斗、社交等方向。",
  },
  {
    id: "game-sit",
    category: "玩法",
    question: "在服务器里怎么让角色「坐下」？",
    options: ["按 Shift 键", "空手右键下半砖或楼梯", "输入 /sit", "蹲下后跳一下"],
    answer: 1,
    explanation: "空手右键下半砖或楼梯就能坐下，属于服务器提供的原版体验优化。",
  },
  {
    id: "game-farm-protection",
    category: "玩法",
    question: "在本服，从成熟的农作物上跑过去会怎样？",
    options: ["会把作物踩坏", "不会损毁成熟农作物", "完全无法在农田上行走", "作物会自动恢复"],
    answer: 1,
    explanation: "本服开启了农田保护：行走踩踏不会损毁成熟农作物。",
  },
  {
    id: "game-dominion",
    category: "玩法",
    question: "在本服，想保护自己的建筑不被别人破坏，正确做法是？",
    options: [
      "用领地系统 Dominion 自主圈地",
      "私聊管理员请他帮忙看着",
      "把建筑造在地下就没人找得到",
      "本服无法保护建筑，只能自认倒霉",
    ],
    answer: 0,
    explanation:
      "服务器提供领地系统（Dominion 插件），可以自己圈地保护建筑与物资，还支持精细权限与跨服同步。",
  },
  {
    id: "game-blocklocker",
    category: "玩法",
    question: "在本服，想防止别人打开自己的箱子，正确做法是？",
    options: [
      "把箱子埋在方块里面",
      "用告示牌给箱子上锁",
      "箱子只能放在领地内才安全",
      "没有办法防止别人开箱",
    ],
    answer: 1,
    explanation:
      "服务器装了箱子锁（BlockLocker），用告示牌就能给箱子、门、活板门等容器上锁，并授权好友共享。",
  },
  {
    id: "game-cutter",
    category: "玩法",
    question: "本服的「大师切割机」为切石机拓展了多少条切割配方？",
    options: ["50 条左右", "100 多条", "300 多条", "500 条以上"],
    answer: 3,
    explanation: "大师切割机拓展了 500 条以上的切割配方，方便建造选材与方块加工。",
  },
  {
    id: "game-end-structures",
    category: "玩法",
    question: "服务器在末地新增了多少自定义建筑遗迹？",
    options: ["5 个", "10 个", "20 多个", "50 多个"],
    answer: 2,
    explanation: "除了对原版结构做模型重做，末地还新增了 20 多个自定义建筑遗迹等待探索。",
  },
  {
    id: "game-skill-system",
    category: "玩法",
    question: "服务器的技能系统包含哪些方向？",
    options: ["只有战斗一条线", "采集、战斗、生存等多条技能树", "只有采集一条线", "只有钓鱼一条线"],
    answer: 1,
    explanation: "技能系统有采集、战斗、生存等多条技能树，通过对应行为升级，解锁被动与主动能力。",
  },
  {
    id: "game-vanilla-balance",
    category: "玩法",
    question: "服务器会大幅魔改原版玩法吗？",
    options: [
      "会，原版机制基本都被替换了",
      "不会，只用插件优化体验，保留原版生存与创造的核心玩法",
      "会，所有原版机制都被关闭了",
      "会，但只在活动期间魔改",
    ],
    answer: 1,
    explanation: "服务器坚持「原版平衡」：只用插件优化体验，不破坏原版生存、创造的核心玩法。",
  },
  {
    id: "game-teleport-command",
    category: "玩法",
    question: "在本服，想请求传送到别的玩家身边，用下面哪个指令？",
    options: ["/tpa", "/home2", "/tpall", "/warp2"],
    answer: 0,
    explanation: "/tpa 是玩家之间的传送请求指令，配套的还有 /tpahere、/tpaccept、/spawn 等。",
  },
  {
    id: "game-skin-command",
    category: "玩法",
    question: "在本服设置自己皮肤的指令是？",
    options: ["/skin", "/skin2", "/myskin", "/setskin"],
    answer: 0,
    explanation: "皮肤相关指令是 /skin，例如 /skin set Dream，可以设置、上传与预览皮肤。",
  },

  /* ---------------- 整合包 ---------------- */
  {
    id: "modpack-render",
    category: "整合包",
    question: "官方整合包用的渲染核心是？",
    options: ["OptiFine", "Sodium + Iris", "ShadersMod", "Canvas"],
    answer: 1,
    explanation: "整合包的渲染核心是 Sodium + Iris 光影框架，这也是它无法与 OptiFine 共存的原因。",
  },
  {
    id: "modpack-optifine",
    category: "整合包",
    question: "可以在官方整合包里加装 OptiFine 吗？",
    options: [
      "可以，直接装上就行",
      "不可以，它和 Sodium + Iris 互相排斥",
      "可以，但要改配置文件",
      "只能在单机世界里装",
    ],
    answer: 1,
    explanation:
      "不可以。渲染核心是 Sodium + Iris，与 OptiFine 互斥、无法共存。想用光影的话，把光影文件放进 shaderpacks 文件夹就行。",
  },
  {
    id: "modpack-scope",
    category: "整合包",
    question: "官方整合包到底是什么？",
    options: [
      "里面包含领地、技能等全部玩法",
      "一个客户端优化集合，玩法由服务端插件提供",
      "一个服务端整合包",
      "不装它就没法进服",
    ],
    answer: 1,
    explanation:
      "整合包是客户端优化集合（提升帧率、降低延迟、视觉优化、预置资源包与前置模组）；领地、粘液科技、技能、连锁挖掘这些玩法全部由服务端插件提供。",
  },
  {
    id: "modpack-required",
    category: "整合包",
    question: "必须安装官方整合包才能进入服务器吗？",
    options: ["必须安装", "不必须，原版客户端也能玩", "需要买付费版才行", "只有手机端必须装"],
    answer: 1,
    explanation: "安装官方整合包不是强制要求，原版客户端也能正常进入服务器。",
  },
  {
    id: "modpack-platform",
    category: "整合包",
    question: "除了 GitHub，官方整合包还在哪个平台发布？",
    options: ["Modrinth", "CurseForge", "Planet Minecraft", "MCBBS"],
    answer: 0,
    explanation:
      "整合包同时发布在 Modrinth（modrinth.com/modpack/endlesspixel-modpack），格式也是 Modrinth 打包格式。",
  },
  {
    id: "modpack-version-rule",
    category: "整合包",
    question: "反馈整合包问题时，官方要求提供哪种版本号？",
    options: [
      "写「最新版」就行",
      "完整的整合包版本号，例如 1.21.11-v10-3.0",
      "只要说明游戏大版本即可",
      "不需要提供版本号",
    ],
    answer: 1,
    explanation:
      "必须给出完整版本号（如 1.21.11-v10-3.0、26.1.2-1.2）。只说「最新版」「1.21」这类写法没法定位问题。",
  },
  {
    id: "modpack-release-cycle",
    category: "整合包",
    question: "整合包的 Beta 版本，通常在 MC 新版本发布后多久推出？",
    options: ["当天", "一周内", "一个月内", "没有规律，随缘发布"],
    answer: 1,
    explanation:
      "Beta 版本一般在 MC 新版本发布后一周内推出，但不做硬性时效保证；正式稳定版要看主流核心模组的适配进度。",
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
      "迭代分为 Alpha（内测）→ Beta（公测）→ Stable（正式稳定版）三个阶段，模组完成度到约 95% 后由 Alpha 转入 Beta。",
  },

  {
    id: "modpack-neoforge",
    category: "整合包",
    question: "官方整合包后续会推出 NeoForge 版本吗？",
    options: [
      "已经推出了",
      "目前暂无计划，因为约 80% 的核心模组只维护 Fabric 分支",
      "下个版本就会推出",
      "NeoForge 和 Fabric 可以混用，所以无所谓",
    ],
    answer: 1,
    explanation:
      "当前约 80% 的核心模组仅持续维护 Fabric 分支，所以暂无 NeoForge 版本计划；如果模组生态整体转向，规划可能随之调整。",
  },

  /* ---------------- 社区 ---------------- */
  {
    id: "community-qq",
    category: "社区",
    question: "官方 QQ 群的群号是？",
    options: ["870594910", "870594911", "123456789", "10001"],
    answer: 0,
    explanation: "官方 QQ 群是 870594910，封禁申诉等问题也可以通过这个群联系管理。",
  },
  {
    id: "community-email",
    category: "社区",
    question: "官方的支持邮箱是？",
    options: ["support@endlesspixel.cn", "admin@endlesspixel.cn", "help@epmc.cn", "service@qq.com"],
    answer: 0,
    explanation: "官方支持邮箱是 support@endlesspixel.cn，封禁申诉或邮件反馈都走这个地址。",
  },
  {
    id: "community-wiki",
    category: "社区",
    question: "想查服务器玩法与规则，官方 Wiki 的地址是？",
    options: [
      "wiki.endlesspixel.cn",
      "docs.endlesspixel.cn",
      "endlesspixel.cn/wiki",
      "wiki.epmc.cn",
    ],
    answer: 0,
    explanation:
      "官方 Wiki 是 wiki.endlesspixel.cn，服务器玩法、指令、规则都以这个站点记载的为准。",
  },
  {
    id: "community-activities",
    category: "社区",
    question: "关于服务器活动，下面说法哪个是对的？",
    options: [
      "每周都有固定活动",
      "基本很少举办活动，一切以官方公告为准",
      "每月都有充值活动",
      "每天都有签到奖励",
    ],
    answer: 1,
    explanation:
      "本服基本很少举办活动，官方也极少组织。具体以官方公告为准，别相信那些编造的活动名称与奖励。",
  },
  {
    id: "community-appeal",
    category: "社区",
    question: "如果认为自己被误封了，正确的申诉方式是？",
    options: [
      "在游戏里反复喊话要求解封",
      "通过官方 QQ 群联系管理，或发邮件到 support@endlesspixel.cn",
      "找任意一个玩家帮忙处理",
      "重新注册一个账号接着玩",
    ],
    answer: 1,
    explanation:
      "误封申诉属于管理侧事务：在官方 QQ 群 870594910 联系管理，或发邮件到 support@endlesspixel.cn 说明情况，由服主核实处理。",
  },

  {
    id: "community-monitor",
    category: "社区",
    question: "想查看服务器硬件详情（CPU、内存、磁盘、负载），去哪个地址？",
    options: [
      "sys.epmc.qzz.io",
      "status.epmc.cn",
      "monitor.endlesspixel.cn",
      "mc.endlesspixel.cn/sys",
    ],
    answer: 0,
    explanation: "硬件详情公开在 sys.epmc.qzz.io，站内首页与页脚都有入口。",
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
    question: "整合包的 Bug 应该反馈到哪里？",
    options: [
      "EndlessPixel/server",
      "EndlessPixel/EndlessPixel-Modpack",
      "HMCL-dev/HMCL",
      "modrinth/modpack",
    ],
    answer: 1,
    explanation:
      "整合包相关的问题提交到 github.com/EndlessPixel/EndlessPixel-Modpack/issues；网站本身的问题才走 EndlessPixel/server。",
  },
  {
    id: "rule-issue-language",
    category: "规则",
    question: "给整合包提 Issue 时，需要用哪种语言填写？",
    options: ["中文", "英文", "中英混排随便写", "由开发者临时指定"],
    answer: 1,
    explanation: "GitHub 的表单是英文的，直接粘贴中文没法正常归类处理，所以要求用英文填写。",
  },
  {
    id: "rule-log-platform",
    category: "规则",
    question: "反馈崩溃问题时，日志应该上传到哪里？",
    options: ["微信", "mclo.gs 或 Pastebin", "百度网盘", "以邮件附件的形式发送"],
    answer: 1,
    explanation:
      "日志上传平台限定 mclo.gs / Pastebin，并且要提供完整的日志链接，而不是截图或片段。",
  },
  {
    id: "rule-issue-prefix",
    category: "规则",
    question: "提 Issue 时，标题需要带上哪种前缀？",
    options: ["[Bug] / [Crash] / [Request]", "【紧急】/【普通】", "[EP] / [MC]", "不需要任何前缀"],
    answer: 0,
    explanation: "Issue 标题必须带上 [Bug]、[Crash]、[Request] 前缀，方便开发者分类处理。",
  },
  {
    id: "rule-economy",
    category: "规则",
    question: "本服有游戏货币、商店或交易行吗？",
    options: ["有金币和官方商店", "有玩家交易行", "没有任何经济系统和货币", "可以充值购买装备"],
    answer: 2,
    explanation: "服务器没有任何经济系统和货币，也不存在金币、点券、商店、交易行、充值这类东西。",
  },
  {
    id: "rule-villager-currency",
    category: "规则",
    question: "本服的村民交易用什么作为通货？",
    options: ["金币", "点券", "绿宝石", "钻石"],
    answer: 2,
    explanation:
      "村民交易按原版机制使用绿宝石 —— 这是 Minecraft 原版设定，不是服务器自定义的货币。",
  },
  {
    id: "rule-player-trade",
    category: "规则",
    question: "在本服，玩家之间的交易是怎么进行的？",
    options: [
      "通过拍卖行竞价",
      "以物换物、双方自由商谈",
      "按官方公示的价格交易",
      "只能通过官方商店买卖",
    ],
    answer: 1,
    explanation: "玩家之间完全是以物换物、自由商谈，没有固定价格、没有中间系统、也没有官方定价。",
  },
  {
    id: "rule-free",
    category: "规则",
    question: "关于服务器的收费情况，哪一项是对的？",
    options: ["需要购买月卡", "存在付费道具", "完全免费，无广告、无付费内容", "充值可以获得特权"],
    answer: 2,
    explanation:
      "EndlessPixel 服务器完全免费：没有内置充值、没有会员体系、没有付费道具、也没有强制或诱导性的广告。",
  },

  /* ---------------- 技术 ---------------- */
  {
    id: "tech-uptime",
    category: "技术",
    question: "EndlessPixel 服务器大约是哪一年开始运营的？",
    options: ["2022 年", "2023 年", "2024 年", "2025 年"],
    answer: 2,
    explanation: "服务器开服日期是 2024-09-16，站内「开服时长」组件就是按这个日期实时计算的。",
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
    id: "tech-backup",
    category: "技术",
    question: "服务器在数据安全方面做了哪些保障？",
    options: [
      "没有任何备份",
      "反作弊防护 + 云端存档定时备份",
      "只能靠玩家自己备份",
      "每天手动备份一次",
    ],
    answer: 1,
    explanation: "服务器有反作弊防护，同时云端存档会定时备份，用来保障在线稳定性与数据安全。",
  },
  {
    id: "tech-modpack-benefit",
    category: "技术",
    question: "安装官方整合包能带来什么效果？",
    options: [
      "提升帧率、降低延迟、改善视觉表现",
      "解锁服务器专属玩法",
      "必须安装才能进服",
      "附赠一个免费正版账号",
    ],
    answer: 0,
    explanation:
      "整合包是客户端优化集合：提升帧率、降低延迟、视觉优化、预置资源包与前置模组。它不解锁玩法，也不是进服的必要条件。",
  },
  {
    id: "tech-modpack-fps",
    category: "技术",
    question: "官方整合包在参考配置（i5-12450H / 16GB / 核显）上的优化效果大约是？",
    options: ["稳定 60FPS", "常态约 200FPS，极限场景可达 600+FPS", "大约 100FPS", "和原版差不多"],
    answer: 1,
    explanation: "参考配置上原生约 30FPS，装上整合包后常态约 200FPS，极限场景最高可达 600+FPS。",
  },
  {
    id: "tech-cpu",
    category: "技术",
    question: "官方公开的服务器硬件中，CPU 型号是？",
    options: ["Intel i5-12450H", "AMD Ryzen 9 9950X", "AMD EPYC 7002", "Intel Xeon E5"],
    answer: 1,
    explanation:
      "服务器 CPU 是 AMD Ryzen 9 9950X，真实内存占用 12GB，磁盘、网络、负载等信息一并公开。i5-12450H 是整合包性能测试用的参考配置，不是服务器配置。",
  },
  {
    id: "tech-memory",
    category: "技术",
    question: "官方公开的服务器真实内存占用大约是？",
    options: ["4GB", "8GB", "12GB", "32GB"],
    answer: 2,
    explanation: "官方公开的真实内存占用约 12GB，与 CPU、磁盘、网络、负载等信息一起公开。",
  },
];
