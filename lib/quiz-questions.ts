/**
 * 服务器考试题库（纯数据）。
 *
 * 事实来源（写题前一律先核对，找不到出处就不要写）：
 * - `../EndlessPixel-Wiki/wiki/**`  官方 Wiki 源仓库（即 wiki.endlesspixel.cn），内容最细，优先级最高
 * - `public/system.md`              EPBot 官方知识库
 * - `README.md`、`app/page.tsx`、`app/layout.tsx`、`components/hero-section.tsx`  站内公开口径
 * 注意：Wiki 里少数页面自带「不一定正确实装 / 暂无玩家测试」的 warning（例如
 * `server_feature/interaction.md` 的附魔台透明方块兼容），这类内容**不要拿来出题**。
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

  {
    id: "login-register",
    category: "接入",
    question: "在本服，离线登录的玩家第一次进服，要用哪个指令注册账号？",
    options: ["/register 密码 密码", "/login 密码", "/bindemail set 邮箱", "无需注册，进去就能玩"],
    answer: 0,
    explanation:
      "离线登录需要用 /register <密码> <密码>（简写 /reg）注册，之后每次进服用 /login <密码> 登录。密码需包含数字、字母、特殊字符并达到长度要求。",
  },
  {
    id: "login-email-reset",
    category: "接入",
    question: "在本服用邮箱重置密码，前提是什么？",
    options: [
      "账号已经绑定过安全邮箱",
      "先找管理员要验证码",
      "先绑定正版 Minecraft 账号",
      "不需要任何前提",
    ],
    answer: 0,
    explanation:
      "忘记密码要用 /repw forget 触发重置流程，前提是账号已经通过 /bindemail set <邮箱> 绑定并验证过邮箱。一个邮箱通常只能绑定一个账号。",
  },

  {
    id: "login-changepw",
    category: "接入",
    question: "在本服想修改账号密码，用哪个指令？",
    options: [
      "/changepassword 旧密码 新密码",
      "/setpassword 新密码",
      "/resetpassword 新密码",
      "/login 新密码",
    ],
    answer: 0,
    explanation:
      "改密码用 /changepassword <旧密码> <新密码>（简写 /changepw）。如果已经忘了密码，就得先绑定过安全邮箱，再走 /repw forget 的重置流程。",
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
    question: "启动官方整合包时提示「Java 版本过低」，应该怎么处理？",
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

  {
    id: "version-protocol",
    category: "版本",
    question: "本服当前的服务器协议号是？",
    options: ["763", "774", "776", "800"],
    answer: 2,
    explanation:
      "本服协议号为 776，这也是跨版本连接的核心参数。服务器已用插件自动完成协议转换，玩家不需要手动改客户端协议配置。",
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
    question: "本服的「农田防踩踏」功能，防止的是什么？",
    options: ["作物被玩家收获", "农田被踩踏后退化为普通泥土", "怪物破坏农田", "农田被水冲毁"],
    answer: 1,
    explanation:
      "默认规则下玩家踩在耕好的农田上，农田会退化为普通泥土、导致作物生长中断；开启该功能后农田被踩踏不再退化，始终保持耕地状态。",
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

  {
    id: "game-enchant-max",
    category: "玩法",
    question: "本服的附魔最高可以堆到多少级？",
    options: ["30 级", "100 级", "255 级", "没有上限"],
    answer: 2,
    explanation:
      "本服的无限附魔系统放开了附魔等级上限，绝大多数原版附魔（锋利、保护、效率、时运等）以及新增的吸血、凋零伤害附加等自定义附魔最高都能堆到 255 级。",
  },
  {
    id: "game-enchant-conflict",
    category: "玩法",
    question: "本服还保留原版「锋利与节肢杀手不能共存」这类附魔互斥规则吗？",
    options: [
      "保留了，和原版一样",
      "已取消，互斥的附魔可以自由堆叠组合",
      "只有武器取消了互斥",
      "只有护甲取消了互斥",
    ],
    answer: 1,
    explanation:
      "本服取消了原版附魔互斥规则，原本互相冲突、无法共存的附魔可以自由堆叠组合，能做出原版永远实现不了的装备搭配。",
  },
  {
    id: "game-anvil-limit",
    category: "玩法",
    question: "在本服用铁砧反复合并装备，还会提示「过于昂贵」而无法继续附魔吗？",
    options: [
      "还会，和原版一样",
      "不会，合并次数上限与经验惩罚都已移除",
      "会，但上限提高到了 100 次",
      "只有创造模式不会提示",
    ],
    answer: 1,
    explanation:
      "铁砧的「过于昂贵」限制在本服已移除：原版的合并次数上限与高额经验惩罚都不再存在，只要有附魔书就能一直往上叠等级。",
  },
  {
    id: "game-elytra-enchant",
    category: "玩法",
    question: "本服的鞘翅能附保护类附魔吗？",
    options: [
      "不能，和原版一样",
      "能，保护、火焰保护、爆炸保护、弹射物保护都支持",
      "只能附耐久",
      "只能附经验修补",
    ],
    answer: 1,
    explanation:
      "本服打破了原版鞘翅无法附加保护类附魔的限制，鞘翅现在支持全套保护系列附魔，配合等级突破最高同样能堆到 255 级。",
  },
  {
    id: "game-abyss",
    category: "玩法",
    question: "东西被扫地机清掉了，在本服用哪个指令能找回？",
    options: ["/abyss", "/back", "/checkin", "/cdk"],
    answer: 0,
    explanation: "/abyss 打开深渊界面，可以拿回被扫地机清除的物品。",
  },
  {
    id: "game-killme",
    category: "玩法",
    question: "在本服想立刻结束当前生命、回到重生点，用哪个指令？",
    options: ["/killme", "/back", "/rtp", "/tpa"],
    answer: 0,
    explanation: "/killme 立即自杀并回到重生点，也可以直接输入简写 /4。",
  },
  {
    id: "game-checkin",
    category: "玩法",
    question: "本服的每日签到用哪个指令？",
    options: ["/checkin", "/daily", "/sign", "/welfare"],
    answer: 0,
    explanation:
      "/checkin 每日一次免费签到，可获得随机经验奖励，连续签到天数越多加成越高；/checkin info 查记录，/checkin on、/checkin off 开关登录提醒。",
  },
  {
    id: "game-cdk-channel",
    category: "玩法",
    question: "官方的 CDK 兑换码在哪里发放？",
    options: [
      "官方 Discord 的 #endlesspixel-cdk 频道",
      "官方 QQ 群公告",
      "游戏内登录时自动发放",
      "官网首页弹窗",
    ],
    answer: 0,
    explanation:
      "CDK 在官方 Discord 的 #endlesspixel-cdk 频道发放，每隔一段时间发一次。拿到后用 /cdk use <码> 兑换，单个兑换码通常只能用一次。",
  },
  {
    id: "game-rtp",
    category: "玩法",
    question: "在本服想随机传送到地图上的安全位置去探索，用哪个指令？",
    options: ["/rtp", "/tpa", "/back", "/tpauto"],
    answer: 0,
    explanation:
      "/rtp 随机传送到地图上的安全位置，适合外出探索；/tpa 是请求传送到指定玩家身边，别搞混。",
  },
  {
    id: "game-skin-clear",
    category: "玩法",
    question: "在本服清除当前皮肤、恢复默认皮肤，用哪个指令？",
    options: ["/skin clear", "/skin reset", "/clearskin", "/skin off"],
    answer: 0,
    explanation:
      "/skin clear 清除当前皮肤恢复默认；/skin update 用于更新皮肤资源、修复显示异常；/skins 是打开皮肤菜单。",
  },
  {
    id: "game-mana",
    category: "玩法",
    question: "在本服查看自己当前的法力值，用哪个指令？",
    options: ["/mana", "/mp", "/skills", "/stats"],
    answer: 0,
    explanation: "/mana 显示当前法力值及恢复信息；/skills 是打开技能菜单查看各技能等级与经验进度。",
  },
  {
    id: "game-hidden-frame",
    category: "玩法",
    question: "本服的隐形物品框架怎么获得？",
    options: [
      "通过合成获得，不需要指令也不需要额外权限",
      "只能用指令领取",
      "需要找管理员申请",
      "只能在活动期间获得",
    ],
    answer: 0,
    explanation:
      "隐形物品框架可以直接合成。空框时可见便于对准定位，放入物品后框架自动隐形、只保留展示内容，取出物品后框架重新出现；潜行时右键可调整展示角度。",
  },
  {
    id: "game-enchanted-apple",
    category: "玩法",
    question: "关于附魔金苹果，本服做了什么？",
    options: [
      "用数据包恢复了经典合成配方，并强化了效果",
      "移除了它的宝箱掉落",
      "改成只能通过村民交易获得",
      "新增了更便宜的合成配方",
    ],
    answer: 0,
    explanation:
      "原版早已移除附魔金苹果的合成配方，本服通过数据包恢复了经典配方（8 个金块 + 1 个苹果）并强化效果；宝箱自然生成的获取途径依然保留。",
  },
  {
    id: "game-warden-echo",
    category: "玩法",
    question: "本服里循声守卫掉落「回响碎片」的触发条件是什么？",
    options: [
      "击杀就有概率掉落",
      "仅在被复原指南针直接命中击杀时才会掉落",
      "只在困难模式下掉落",
      "只有在远古城市里击杀才掉落",
    ],
    answer: 1,
    explanation:
      "回响碎片是低概率特殊掉落，只有用复原指南针直接命中击杀循声守卫才会掉落 —— 这个特殊触发条件正是收集它的难点。",
  },
  {
    id: "game-old-chunk",
    category: "玩法",
    question: "在本服，数据包更新后回到旧存档，已经加载过的区域会出现新建筑吗？",
    options: [
      "不会，只有尚未加载的新区块才会生成新内容",
      "会，全部自动替换成新模型",
      "会，但需要重进游戏两次",
      "会，只要往外走 100 格就会出现",
    ],
    answer: 0,
    explanation:
      "MC 的区块加载机制决定：已经生成完成的区块不会自动重写建筑。想看新版结构，必须前往该世界尚未加载的新区块探索 —— 原版结构替换和维度升级都是这个规则。",
  },
  {
    id: "game-seed-site",
    category: "玩法",
    question: "在本服用 ChunkBase 这类种子查询网站找结构，哪种说法是对的？",
    options: [
      "所有结构都能靠种子网站准确定位",
      "原版结构（村庄、前哨站等）坐标仍兼容，被重置过的维度新结构则不可信",
      "任何结构都不可信，种子网站已经失效",
      "只有末地结构可以查询",
    ],
    answer: 1,
    explanation:
      "原版结构替换只动了外观模型，生成坐标、刷怪规则、战利品完全沿用原版，所以村庄、掠夺者前哨站等仍可用 ChunkBase 定位；但维度升级对世界做了大规模重置，那些新结构跟种子网站上的信息不一定对得上。",
  },
  {
    id: "game-furnace-block",
    category: "玩法",
    question: "在本服的高炉或熔炉里冶炼「原矿块」，特点是？",
    options: [
      "速度和冶炼单件物品一样快",
      "耗时是单件的 9 倍，好处是节省背包与箱子空间",
      "只有高炉能冶炼",
      "冶炼后产出翻倍",
    ],
    answer: 1,
    explanation:
      "本服支持在高炉或熔炉中冶炼原矿块，耗时是单件物品的 9 倍。它的核心优势是节省存储空间而不是缩短耗时，适合批量处理矿物。",
  },
  {
    id: "game-ship-nether",
    category: "玩法",
    question: "本服的「下界飞船」和普通舰船相比，特殊在哪？",
    options: [
      "用下界菌柄等木材制作，能在下界的熔岩海洋里航行",
      "只能在末地航行",
      "航行速度是普通舰船的 3 倍",
      "不需要任何材料就能合成",
    ],
    answer: 0,
    explanation:
      "海洋探索新增了舰船体系，基础舰船有 7 种变体；用下界绯红菌柄、诡异菌柄等木材可以做出「下界飞船」，能在下界的熔岩海洋里航行，实现跨维度探险。",
  },

  {
    id: "game-blocklocker-line",
    category: "玩法",
    question: "在本服给箱子上锁，告示牌第一行要写什么？",
    options: ["[Private]", "[Lock]", "[Chest]", "[Owner]"],
    answer: 0,
    explanation:
      "对着箱子、熔炉等容器贴上告示牌后，插件会自动在第一行生成 [Private]、第二行填上你的游戏昵称。手动放置时同样要在第一行输入 [Private]。",
  },
  {
    id: "game-blocklocker-friend",
    category: "玩法",
    question: "在本服，[Private] 告示牌上最多能直接写几名好友来共享使用权限？",
    options: ["1 名", "2 名", "5 名", "不限数量"],
    answer: 1,
    explanation:
      "告示牌第三、四行可以各写一名好友，所以单人额外授权最多 2 名。需要加 2 名以上时，在同一容器上再贴一块告示牌，插件会自动生成 [More Users] 权限牌。",
  },
  {
    id: "game-blocklocker-timer",
    category: "玩法",
    question: "想让上锁的门在 3 秒后自动关闭，告示牌上要加哪个标签？",
    options: ["[Timer:3]", "[Auto3]", "[Close:3]", "[Delay:3]"],
    answer: 0,
    explanation:
      "[Timer:X] 是自动关门计时，X 填 0~9（单位秒），例如 [Timer:3] 就是 3 秒后自动关闭；[Timer:0] 表示永久保持开启。该标签的优先级高于服务器默认的关门设置。",
  },
  {
    id: "game-blocklocker-redstone",
    category: "玩法",
    question: "在本服，想允许漏斗从自己上锁的箱子里抽取物品，要加哪个标签？",
    options: ["[Redstone]", "[Hopper]", "[Everyone]", "[Automation]"],
    answer: 0,
    explanation:
      "[Redstone] 是红石兼容权限，允许漏斗抽取容器里的物品、也允许红石信号开关门与活板门；[Everyone] 则是把使用权开放给所有玩家。",
  },

  {
    id: "game-skill-claim",
    category: "玩法",
    question: "在本服领取技能升级奖励，用哪个指令？",
    options: ["/sk claimitems", "/checkin", "/cdk use 兑换码", "/sk top"],
    answer: 0,
    explanation:
      "/sk claimitems 打开物品认领菜单，用来领取技能升级奖励；/sk top 是技能等级排行榜，/checkin 是每日签到，别搞混。",
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

  {
    id: "modpack-report-java",
    category: "整合包",
    question: "反馈整合包问题时，除了完整版本号，还必须提供什么？",
    options: ["Java 具体版本", "电脑 CPU 型号", "显示器分辨率", "存档的种子"],
    answer: 0,
    explanation:
      "反馈的必填项是整合包完整版本号 + Java 具体版本（如 Java 21.0.1 LTS）。注意是在启动器设置里看 Java 版本，不是游戏版本，这两者很容易搞混。",
  },
  {
    id: "modpack-start-v5",
    category: "整合包",
    question: "整合包的版本序列为什么是从 v5 开始，而不是 v1？",
    options: [
      "公开上线之前已经迭代过多个内部构建版本",
      "从 v5 开始只是讨个彩头",
      "v1~v4 因为兼容问题被下架了",
      "v1~v4 只提供给管理员内部使用",
    ],
    answer: 0,
    explanation:
      "在 1.21.4 分支公开上线前已经迭代过几个内部版本：1.20.1-v1、1.20.6-v2、1.21.1-v3，其中 1.21.4-v4 是存在模组冲突与兼容问题的试水预览版，1.21.4-v5 才是首个达到公开发布标准的稳定版。",
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

  {
    id: "community-discord-report",
    category: "社区",
    question: "服务器本身出问题（卡顿、掉线、连不上），应该去哪个渠道反馈？",
    options: [
      "官方 Discord 的 #报告问题 板块",
      "GitHub 的 EndlessPixel/server 仓库",
      "在官方 QQ 群聊天里直接说",
      "发邮件给某一位置管理员的私人邮箱",
    ],
    answer: 0,
    explanation:
      "服务端类问题（卡顿、频繁掉线、无法连接、游戏内服务端故障）请到官方 Discord 的 `#报告问题 - report_problems` 板块提交，按模板写清问题描述、现象与触发条件。GitHub 的 EndlessPixel/server 仓库负责的是**官方网站**的问题，不是服务器游戏问题。",
  },
  {
    id: "community-group-invalid",
    category: "社区",
    question: "在官方 QQ 群里发问题反馈，会怎么处理？",
    options: [
      "会被判定为无效反馈，因为社群不承接正式问题反馈",
      "管理员会代为转交到 GitHub",
      "和 Discord 一样都会被正常受理",
      "会被记录进官方待办清单",
    ],
    answer: 0,
    explanation:
      "官方社群、聊天群只作为玩家日常闲聊与游玩交流的非正式场所，**不承接任何正式问题反馈与故障报修**。群聊内发布的反馈会被判定为无效，请按问题类型走 Discord 或 GitHub。",
  },
  {
    id: "community-support-hours",
    category: "社区",
    question: "官方人工客服的在线服务时间是？",
    options: [
      "周一至周五 18:00-22:30，周末与节假日 08:00-22:00",
      "每天 09:00-18:00",
      "7×24 小时随时都有人工在线",
      "只在周末提供人工客服",
    ],
    answer: 0,
    explanation:
      "客服与运维的实时支持时间是周一至周五（含调休日）18:00-22:30、周六日及节假日 08:00-22:00，非服务时段的问题会在工作日优先处理。",
  },
  {
    id: "community-24x7",
    category: "社区",
    question: "客服下班之后，服务器会停止运行吗？",
    options: [
      "不会，服务器 7×24 小时运行，服务时间只针对人工客服",
      "会，客服下班后就停机维护",
      "会，但管理员可以手动开启",
      "只在周末停止运行",
    ],
    answer: 0,
    explanation:
      "服务器保持 7×24 小时稳定运行，官方公示的服务时间只针对人工客服的响应，不影响正常登录游戏。",
  },
  {
    id: "community-reply-mail",
    category: "社区",
    question: "你给 support@endlesspixel.cn 发了问题邮件，收到回复时应该认准哪个发件地址？",
    options: [
      "system-mini@outlook.com 或 bot@endlesspixel.cn",
      "support@qq.com 或 admin@163.com",
      "help@endlesspixel.cn 或 service@epmc.cn",
      "官方没有固定的回复邮箱",
    ],
    answer: 0,
    explanation:
      "官方邮件支持发往 support@endlesspixel.cn，但**回复**要认准 system-mini@outlook.com / bot@endlesspixel.cn。对处理结果有异议还可以通过邮件申请二次复核。",
  },
  {
    id: "community-antifraud",
    category: "社区",
    question: "有人主动私聊你，自称官方客服，要你的账号密码来帮你处理问题，应该怎么做？",
    options: [
      "官方绝不会主动私下联系玩家，直接无视并提高警惕",
      "把密码发给他，处理完再改掉",
      "先把验证码发给他验证身份",
      "让他出示管理员证明之后再把密码给他",
    ],
    answer: 0,
    explanation:
      "官方运营与正规渠道绝不会以任何私人形式、任何社交渠道、任何陌生邮件主动私下联系玩家，也不会索要账号密码、登录验证码或要求转账。管理员和服主本身也是普通玩家身份，不会假借官方名义私聊交涉。凡是主动找上门自称官方的，都是冒充者。",
  },

  /* ---------------- 规则 ---------------- */
  {
    id: "rule-ban-scope",
    category: "规则",
    question: "服务器的规则主要封禁哪类行为？",
    options: ["任何 PVP 行为", "作弊与恶意破坏", "建造大型建筑", "使用村民交易"],
    answer: 1,
    explanation:
      "规则整体宽松，只封禁作弊、恶意破坏这类行为，鼓励自由建造与探索。唯一的例外是矿透类辅助工具：允许适度使用，但要求保持低调。",
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

  {
    id: "rule-xray",
    category: "规则",
    question: "本服对矿透（X-ray）类辅助工具的态度是？",
    options: [
      "允许适度使用但要求保持低调，飞行、穿墙、秒杀等其他作弊工具一律严禁",
      "任何辅助工具都不允许使用",
      "所有作弊工具都可以随意使用",
      "只能在自己领地范围内使用",
    ],
    answer: 0,
    explanation:
      "本服规则相对宽松：允许适度使用矿透类辅助工具，但要求保持低调、不得影响其他玩家体验。除此之外严禁任何其他形式的外挂，包括飞行、穿墙、秒杀、物品刷取等。",
  },
  {
    id: "rule-spam",
    category: "规则",
    question: "在本服的聊天频道里，连续发送多少条相同或无关的内容会被判定为刷屏？",
    options: ["3 条及以上", "5 条及以上", "10 条及以上", "20 条及以上"],
    answer: 2,
    explanation:
      "游戏聊天频道禁止恶意刷屏，单次连续发送 10 条及以上相同或无关内容即视为违规，会影响其他玩家正常交流。",
  },
  {
    id: "rule-punish",
    category: "规则",
    question: "本服的违规处罚是怎么递进的？",
    options: [
      "封禁 1 天 → 30 天 → 6 个月 → 永久封禁",
      "警告 → 禁言 → 封禁 1 天 → 永久封禁",
      "直接永久封禁，没有梯度",
      "每次都固定封禁 7 天",
    ],
    answer: 0,
    explanation:
      "违规处罚按次数递进：第一次封禁 1 天（ban1d），第二次 30 天（ban30d），第三次 6 个月（ban6m），第四次永久封禁（ban∞）。",
  },
  {
    id: "rule-unprotected-grief",
    category: "规则",
    question: "在本服，没有被领地保护的建筑，别的玩家可以拆吗？",
    options: [
      "不可以，即使建筑没有领地保护，规则也禁止毁坏",
      "可以，没圈地就等于放弃了保护",
      "可以，只要不在公共区域就行",
      "看建筑大小，大型建筑受规则保护",
    ],
    answer: 0,
    explanation:
      "规则明确禁止毁坏其他玩家的任何建筑，**即使它没有受到领地保护**，公共资源同样如此 —— 除非本人明确同意，或者已经放弃了该建筑。",
  },
  {
    id: "rule-public-chest",
    category: "规则",
    question: "在本服给公共箱子上锁独占资源，会怎么处理？",
    options: [
      "属于违规，管理员有权直接解除箱子锁",
      "没问题，谁先上锁就归谁",
      "需要给其他玩家付费才能上锁",
      "只有在主城才违规",
    ],
    answer: 0,
    explanation:
      "公共箱子是供全体玩家共享资源的设施，禁止恶意上锁独占；发现此类行为，管理员有权直接解除锁具。",
  },
  {
    id: "rule-realmoney",
    category: "规则",
    question: "用现实货币买卖游戏物品或账号，服务器是什么态度？",
    options: [
      "规则禁止，且私下交易被骗服务器概不负责",
      "允许，服务器会提供担保",
      "允许，但需要向管理员报备",
      "只有卖账号违规，卖物品不违规",
    ],
    answer: 0,
    explanation:
      "规则禁止使用现实货币交易游戏内物品和账号。所有私下现金交易行为均与服务器无关，若因此被骗，服务器概不负责、也不会介入处理纠纷。",
  },
  {
    id: "rule-cdk-resell",
    category: "规则",
    question: "官方的礼品兑换码（CDK）可以高价转售吗？",
    options: [
      "不可以，所有 CDK 都能通过官方 Discord 等渠道免费获取",
      "可以，属于玩家之间的自由交易",
      "可以，但要向管理员缴纳手续费",
      "只有活动发放的 CDK 不能转售",
    ],
    answer: 0,
    explanation:
      "礼品兑换码禁止高价二次转售 —— 所有 CDK 都可以通过官方 Discord 等官方渠道免费获取，认准官方发放途径，不要轻信非官方渠道售卖的兑换码。",
  },
  {
    id: "rule-land-abuse",
    category: "规则",
    question: "在本服随意在不属于自己的区域或公共资源区圈地建领地，会怎样？",
    options: [
      "属于违规，管理员可以直接编辑、拆除或删除该领地",
      "只要领地插件允许圈就没问题",
      "只要不给领地上锁就没事",
      "只要定期缴纳游戏币就能保留",
    ],
    answer: 0,
    explanation:
      "规则禁止恶意创建领地：不得在不属于自己的私人区域或公共资源区域随意圈地。管理员拥有领地的最高管理权限，可直接编辑、拆除或删除违规领地，不要抱「领地无敌」的侥幸心理。",
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
  {
    id: "tech-log-path",
    category: "技术",
    question: "反馈问题前要找客户端的报错日志，一般在哪个目录？",
    options: [
      "客户端根目录下的 logs 文件夹",
      "整合包内的 config 文件夹",
      "游戏截图用的 screenshots 文件夹",
      "系统的「下载」文件夹",
    ],
    answer: 0,
    explanation:
      "客户端报错日志在客户端根目录下的 ./logs 文件夹里，日志内容是排查问题的关键线索。拿到之后传到 mclo.gs 或 Pastebin，再把链接给官方。",
  },
];
