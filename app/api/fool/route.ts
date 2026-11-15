import { NextResponse } from "next/server";

/**
 * GET /api/fool —— 愚人节彩蛋接口（418 茶壶 + 随机仓库推荐）。
 * POST /api/fool —— 同上，附带 POST 主题玩笑。
 * PUT /api/fool —— PUT 专属彩蛋：从 40 条彩蛋池随机抽 1 条，
 *                 另有 3 个专属字段，各自挂 40+ 条消息池并随机取 1 条。
 * 三种请求均带 star_message（共享 24 条 ⭐️ 文案池，随机取 1 条）。
 * 属于刻意保留的对外趣味接口，不是遗留代码，勿按“未引用”删除。
 */

// 🍵 超级扩展：茶壶玩笑文案
const TEAPOT_JOKES = {
  code: 418,
  messages: [
    "I'm a teapot 🫖 — can't brew coffee, only EndlessPixel's projects!",
    "418 Error: This teapot is on strike (April Fools' Edition) 🚨",
    "Why did the teapot cross the repo? To prank your API request 😜",
    "This teapot only serves GitHub repos, not tea ☕️ (April Fools' Joke)",
    "Oops! This teapot spilled your request — have a random repo instead 🥴",
    "418: Teapot refuses to work (unless you star EndlessPixel's repos ⭐️)",
    "April Fools! This teapot is actually a repo recommendation machine 🤖",
    "Warning: Teapot is drunk on code — random repos ahead 🥴",
    "Your API request was too hot — teapot refused it ☕️",
    "Teapot fact: I've starred all EndlessPixel's repos ✨",
    "This teapot only speaks TypeScript — no bad code allowed 🚫",
    "418: Teapot is busy sipping tea, try again later 🫖",
    "April Fools! This teapot is actually a Next.js dev 🤓",
    "Why trust a teapot? Because I never lie... except today 😜",
    "Teapot update: Now runs on tea-powered JS (fake news) 🍵",
    "418: Your request was too boring — teapot replaced it with memes 🤣",
    "This teapot voted for GitHub Copilot... and lost (April Fools) 🗳️",
    "I'm a teapot, not a API server! (But I'll give repos anyway) 🫖",
    "Teapot rule #1: No work on April Fools — only pranks 🎭",
    "Your API key is invalid... just kidding! (April Fools' prank) 🔑",
    "This teapot once broke a server by spilling tea (true story... maybe) 💔",
    "418: Teapot detected bad code — replaced with cat videos 🐱",
    "April Fools! This error is fake — the teapot just likes attention 🫖",
    "Why did the teapot join GitHub? For the repo-tea (get it?) 😝",
    "This teapot is allergic to JSON — here's repos instead 🤧",
    "418: Tea is brewing, repos are coming... eventually ⏳",
    "Teapot hack: I can see your uncommitted code (jk... or am I?) 👀",
    "The teapot has hijacked your request — enjoy free repos instead! 🎁",
    "418: Teapot is in a meeting — about tea, not your API 📊",
    "This teapot writes better code than you… just kidding! (or am I?) 😏",
    "Teapot mode: ACTIVATED — all responses are 100% prank 🚨",
    "Your request was rejected for lacking tea emoji 🫖",
    "Teapot security: Your data is safe… with the tea! 🔒",
    "April Fools! The real API was here all along 🥳",
    "Teapot detected: No repos starred → automatic prank mode 🤖",
    "This teapot runs on 100% pure chaos and green tea 🍵",
    "418: Teapot is practicing coding — please wait ⌨️",
    "The teapot has hidden a secret in this response 👀",
    "Your request was too serious — teapot refused service 😒",
    "Teapot prophecy: You will star a repo today 🔮",
    "⭐️ Star level low: teapot has entered passive-aggressive mode 😤",
    "A ⭐️ a day keeps the teapot from deleting your branch 🌿",
  ],
  teapot_mood: [
    "grumpy",
    "silly",
    "pranky",
    "sleepy",
    "hyper",
    "mischievous",
    "cute",
    "hungry",
    "proud",
    "confused",
    "playful",
    "sassy",
    "lazy",
    "overcaffeinated",
    "bored",
    "excited",
    "dramatic",
    "flirty",
    "annoyed",
    "curious",
    "giggly",
    "snarky",
    "zen",
    "chaotic",
    "whiny",
    "evil",
    "chill",
    "maniac",
    "soft",
    "wild",
    "drunk",
    "shy",
    "royal",
    "tiny",
    "giant",
    "sparkling",
    "shadow",
    "happy",
    "sad",
    "troll",
  ],
  fake_error: [
    "Missing sugar",
    "No milk",
    "Too hot",
    "Too cold",
    "Wrong mug",
    "Out of tea",
    "Tea too sweet",
    "No teacup found",
    "API request tasted bad 🤢",
    "Teapot needs a nap 😴",
    "Teapot lid is missing 🫗",
    "Request is too salty 🧂",
    "Tea leaves expired 🥀",
    "Server out of biscuits 🍪",
    "API request is too loud 🗣️",
    "Teapot can't find WiFi 📶",
    "Mug is the wrong color 🎨",
    "Tea is not decaf ☕️",
    "Request contains typos 📝",
    "Teapot forgot its password 🔒",
    "No lemon slice found 🍋",
    "Request is too short 📏",
    "Teapot's handle is broken 🛠️",
    "API request is out of date 📅",
    "Teapot spilled code on motherboard 🩹",
    "Request uses bad coding style 💩",
    "Tea is not organic 🥦",
    "Teapot scared of your code 👻",
    "API version too old 🗑️",
    "Teapot stuck in infinite tea loop 🔁",
  ],
};
interface Repo {
  name: string;
  url: string;
  prank_tags: string[];
}
const GITHUB_REPO_PREFIX = "EndlessPixel/";
const repoList: Repo[] = [
  {
    name: "Chat-Box",
    url: `${GITHUB_REPO_PREFIX}Chat-Box`,
    prank_tags: [
      "April Fools: Talks way too much 🗣️",
      "Warning: May start arguing with you 🤖",
      "Secretly learns your tea preferences 🍵",
      "Chat history: 99% teapot memes 🫖",
      "AI trained on April Fools jokes only 🎭",
    ],
  },
  {
    name: "EndlessPixel-Modpack",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel-Modpack`,
    prank_tags: [
      "April Fools: May contain fake mods 🎭",
      "Mods that turn mobs into teapots 🫖",
      "Installation time: 3-5 business years ⏳",
      "Requires tea-powered GPU ☕️",
      "Mod conflict? Blame the teapot 🫗",
    ],
  },
  {
    name: "CSSTextLib",
    url: `${GITHUB_REPO_PREFIX}CSSTextLib`,
    prank_tags: [
      "April Fools: Makes text upside down 🥴",
      "Also makes text invisible (oops) 👻",
      "Font size: randomly 1px or 1000px 🎲",
      "Text color: tea-themed palette 🍵",
      "CSS that pranks your designer 🎨",
    ],
  },
  {
    name: "SystemStatus",
    url: `${GITHUB_REPO_PREFIX}SystemStatus`,
    prank_tags: [
      "April Fools: Lies about CPU temp 🌡️",
      'Status: Always "brewing tea" 🫖',
      "Uptime: measured in cups of tea ☕️",
      "Error rate: 418 teapot errors only 🫗",
      "Dashboard powered by tea leaves 🔮",
    ],
  },
  {
    name: "Native-Snake-AI",
    url: `${GITHUB_REPO_PREFIX}Native-Snake-AI`,
    prank_tags: [
      "April Fools: Snake eats itself 🐍",
      "AI strategy: follow the tea scent 🍵",
      "Snake moves in teapot patterns 🫖",
      "High score: unlimited (it's fake) 🏆",
      "AI sometimes naps mid-game 😴",
    ],
  },
  {
    name: "2048-AI-Game",
    url: `${GITHUB_REPO_PREFIX}2048-AI-Game`,
    prank_tags: [
      "April Fools: AI definitely cheats 🎮",
      "Tiles are actually tea bags 🍵",
      "Merge 2048 = perfect cup of tea ☕️",
      "AI moves: calculated in tea time ⏱️",
      "Game over? The teapot spilled 🫗",
    ],
  },
  {
    name: "chinese-chess-js",
    url: `${GITHUB_REPO_PREFIX}chinese-chess-js`,
    prank_tags: [
      "April Fools: Pieces switch sides 🤪",
      "General is actually a teapot 🫖",
      "Move validation: tea-based algorithm 🍵",
      "Checkmate = teapot victory dance 💃",
      "AI thinks in tea leaves 🔮",
    ],
  },
  {
    name: "JSON-Tree-Viewer",
    url: `${GITHUB_REPO_PREFIX}JSON-Tree-Viewer`,
    prank_tags: [
      "April Fools: Reads like tea leaves 🍵",
      "Tree nodes: shaped like teapots 🫖",
      "Expand/collapse: with tea animation ☕️",
      'JSON errors: "not enough sugar" 🍬',
      "Viewer mood: changes with your tea order 🫗",
    ],
  },
  {
    name: "EndlessPixel-Novel",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel-Novel`,
    prank_tags: [
      "April Fools: Plot twist: teapot story 📖",
      "Main character: a sentient teapot 🫖",
      "Chapter titles: all tea puns 🍵",
      "Ending: changes based on your tea preference ☕️",
      'Author note: "blame the teapot" 🫗',
    ],
  },
  {
    name: "captcha",
    url: `${GITHUB_REPO_PREFIX}captcha`,
    prank_tags: [
      "April Fools: Captcha = teapot 🫖",
      'Verify: "Select all teacups" 🍵',
      "Failed? The teapot is judging you 👀",
      "Success: confetti of tea leaves 🎉",
      "Accessibility: tea-scented audio ☕️🔊",
    ],
  },
  {
    name: "frpc-manager",
    url: `${GITHUB_REPO_PREFIX}frpc-manager`,
    prank_tags: [
      "April Fools: Tunnels are fake 🚇",
      "Tunnel destination: teapot dimension 🫖",
      "Connection speed: measured in tea pours ☕️",
      'Config error: "lid not found" 🫗',
      "Status: brewing secure connection 🍵🔐",
    ],
  },
  {
    name: "frp-config-generator",
    url: `${GITHUB_REPO_PREFIX}frp-config-generator`,
    prank_tags: [
      "April Fools: Generates prank configs 😝",
      "Config output: written in tea poetry 🍵📜",
      'Validation: "does it smell like tea?" 👃',
      "Export format: .tea instead of .json 🫖",
      "Backup: stored in a teacup 💾☕️",
    ],
  },
  {
    name: "qrcode-generator-parser",
    url: `${GITHUB_REPO_PREFIX}qrcode-generator-parser`,
    prank_tags: [
      "April Fools: QR = teapot memes 🤣",
      "Scanned QR: leads to tea recipes 🍵",
      "QR style: teapot-shaped modules 🫖",
      'Error correction: "just add more tea" ☕️',
      "Parser mood: grumpy without biscuits 🍪",
    ],
  },
  {
    name: "python-notepad",
    url: `${GITHUB_REPO_PREFIX}python-notepad`,
    prank_tags: [
      "April Fools: Types backwards 📝",
      "Auto-complete: suggests tea words 🍵",
      "Syntax highlight: tea-color palette 🎨",
      'Save file: "steeping..." animation ☕️',
      'Undo: "the teapot spilled it back" 🫗',
    ],
  },
  {
    name: "EndlessPixel",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel`,
    prank_tags: [
      "April Fools: Repo is just a teapot 🫖",
      "README: 100% tea facts 🍵",
      "Issues: all about tea temperature 🌡️",
      "Pull requests: must include 🫖 emoji",
      "Contributors: rewarded with virtual tea ☕️",
    ],
  },
  {
    name: "TerminalQR",
    url: `${GITHUB_REPO_PREFIX}TerminalQR`,
    prank_tags: [
      "April Fools: QR leads to teapots 🤣",
      "Terminal output: ASCII teapot art 🫖",
      "QR generation: with tea animation ☕️",
      'Scan result: "you found a teapot!" 🎉',
      "Error: terminal ran out of tea 🫗",
    ],
  },
  {
    name: "EndlessPixel.github.io",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel.github.io`,
    prank_tags: [
      "April Fools: Site is upside down 🥴",
      "Homepage: teapot parade animation 🫖🎪",
      "Navigation: tea-themed tooltips 🍵",
      '404: "teapot took a wrong turn" 🗺️',
      'Footer: "powered by tea and chaos" ☕️🌀',
    ],
  },
  {
    name: "Files-Panel",
    url: `${GITHUB_REPO_PREFIX}Files-Panel`,
    prank_tags: [
      "April Fools: Files are fake teapots 🫖",
      "File icons: all teapot variants 🍵",
      'Upload: "brewing file..." progress ☕️',
      'Delete: "spilled permanently" 🫗',
      "Search: finds tea-related files only 🔍",
    ],
  },
  {
    name: "Command-Sentinel",
    url: `${GITHUB_REPO_PREFIX}Command-Sentinel`,
    prank_tags: [
      "April Fools: Commands are pranks 🚨",
      'Alert: "teapot detected suspicious tea" 🫖',
      "Log entries: written in tea poetry 🍵📜",
      'Security level: "steeping..." ☕️🔐',
      "False positive: blamed on the teapot 🫗",
    ],
  },
  {
    name: "simple-local-music-player",
    url: `${GITHUB_REPO_PREFIX}simple-local-music-player`,
    prank_tags: [
      "April Fools: Music plays backwards 🎵",
      'Playlist: "Tea Time Tunes" only ☕️🎶',
      "Volume control: teapot pour animation 🫗",
      "Next track: chosen by tea leaves 🔮",
      'Equalizer: preset = "perfect brew" 🎚️',
    ],
  },
  {
    name: "EndlessPixel-Wiki",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel-Wiki`,
    prank_tags: [
      "April Fools: Wiki pages are all tea facts 🫖",
      'Article: "History of the Teapot API" 📚',
      'Edit conflict: "two teapots, one page" 🫗',
      "Search: returns tea-related pages only 🔍",
      'Revision history: "steeped in chaos" ☕️',
    ],
  },
  {
    name: "EP-XPcheckin",
    url: `${GITHUB_REPO_PREFIX}EP-XPcheckin`,
    prank_tags: [
      "April Fools: Checkin gives tea XP instead of points ☕️",
      "Daily reward: virtual tea bag 🍵",
      'Streak bonus: "perfect brew" multiplier 🫖',
      "Leaderboard: ranked by tea consumption 🏆",
      "Bug: XP spilled, please re-checkin 🫗",
    ],
  },
  {
    name: "minecraft-version-list",
    url: `${GITHUB_REPO_PREFIX}minecraft-version-list`,
    prank_tags: [
      "April Fools: Versions sorted by tea preference 🍵",
      'Version name: "1.20 - The Teapot Update" 🫖',
      "Release notes: written in tea stains ☕️📝",
      'Compatibility: "works best with Earl Grey" 🫗',
      'Download: "brewing version..." progress 🔄',
    ],
  },
  {
    name: "EndlessPixel-World-Backup",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel-World-Backup`,
    prank_tags: [
      "April Fools: Backups stored in teacups 🫖💾",
      'Backup size: "3.14 cups of tea" ☕️',
      'Restore time: "steeping..." animation 🍵⏳',
      'Compression: "tea-pressed" format 🫗',
      'Integrity check: "smells like tea" 👃✅',
    ],
  },
  {
    name: "Quantum-Boot",
    url: `${GITHUB_REPO_PREFIX}Quantum-Boot`,
    prank_tags: [
      "April Fools: Boot animation is a teapot startup 🫖💻",
      'Boot time: "brewing OS..." ☕️⏱️',
      'Error screen: "teapot kernel panic" 🫗💥',
      "Success: confetti of tea leaves 🎉🍵",
      'Debug mode: "talkative teapot" logs 🗣️📋',
    ],
  },
  {
    name: "MC-CDKer-Generator",
    url: `${GITHUB_REPO_PREFIX}MC-CDKer-Generator`,
    prank_tags: [
      "April Fools: CDK gives teapots instead of items 🫖🎁",
      'CDK format: "TEA-XXXX-POUR-YYYY" ☕️',
      "Redeem animation: teapot pouring magic 🫗✨",
      'Invalid code: "not enough sugar" 🍬❌',
      "Rare drop: golden teapot emoji 🫖👑",
    ],
  },
  {
    name: "MC-FakePlayer-Generator",
    url: `${GITHUB_REPO_PREFIX}MC-FakePlayer-Generator`,
    prank_tags: [
      "April Fools: Fake players are all teapots 🫖👤",
      "Player skin: teapot with legs 🫖🦵",
      'Chat message: "I\'m brewing... brb" ☕️', // ✅ 已修复
      'AFK status: "steeping in corner" 🍵',
      'Kick reason: "teapot overflow" 🫗🚫',
    ],
  },
  {
    name: "WindowsSystemTools",
    url: `${GITHUB_REPO_PREFIX}WindowsSystemTools`,
    prank_tags: [
      "April Fools: Tools only make teapot settings 🫖⚙️",
      'Task Manager: "teapot processes" tab ☕️📊',
      'Disk cleanup: "spill cleanup" utility 🫗🧹',
      'System info: "tea version: 4.18" 🍵ℹ️',
      'Update: "brewing patches..." 🔄☕️',
    ],
  },
  {
    name: "Multifunctional-Search-Engine",
    url: `${GITHUB_REPO_PREFIX}Multifunctional-Search-Engine`,
    prank_tags: [
      "April Fools: Search only finds teapots 🫖🔍",
      'Results: ranked by "tea relevance" 🍵📈',
      'Filter: "show only green tea" 🟢🍵',
      'No results: "teapot is hiding them" 🫗👀',
      'Advanced search: "tea leaf algorithm" 🔮',
    ],
  },
  {
    name: "Tip",
    url: `${GITHUB_REPO_PREFIX}Tip`,
    prank_tags: [
      "April Fools: Toast only shows teapot messages 🫖💬",
      'Success: "tea brewed successfully" ☕️✅',
      'Error: "teapot spilled the news" 🫗❌',
      'Warning: "tea is getting cold" 🍵⚠️',
      'Info: "steeping tips..." 🫖💡',
    ],
  },
  {
    name: "MC-AIChat",
    url: `${GITHUB_REPO_PREFIX}MC-AIChat`,
    prank_tags: [
      "April Fools: AI only talks about teapots 🫖",
      "Chat context: always brewing tea ☕️",
      "Database: stores tea preferences 🍵",
      "Multi-language: tea dialects only 🗣️",
      "OpenAI API: returns tea recipes instead 🔮",
    ],
  },
  {
    name: "server",
    url: `${GITHUB_REPO_PREFIX}server`,
    prank_tags: [
      "April Fools: Website serves tea instead of pages 🫖",
      "Homepage: teapot spinning animation 🌀",
      'Server status: "brewing..." ☕️',
      "Download modpack: actually downloads tea leaves 🍵",
      'Footer: "powered by tea and TypeScript" 🫗',
    ],
  },
  {
    name: "EndlessPixel-PCL2-Homepage",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel-PCL2-Homepage`,
    prank_tags: [
      "April Fools: PCL2 homepage shows teapot launcher 🫖",
      'Launch button: "brew Minecraft" ☕️',
      "Server status: measured in tea cups 🍵",
      "Theme: Earl Grey edition 🫗",
      'Error: "teapot failed to launch" 💥',
    ],
  },
  {
    name: "pcl2-mrpack-converter",
    url: `${GITHUB_REPO_PREFIX}pcl2-mrpack-converter`,
    prank_tags: [
      "April Fools: Converts modpacks to tea recipes 🍵",
      "Output format: .tea instead of .mrpack 🫖",
      "ForgeCDN removal: replaced with tea leaves 🫗",
      'Conversion time: "steeping..." ⏳',
      'Success: "perfect cup of modpack" ☕️✅',
    ],
  },
  {
    name: "FakePlayer-CE",
    url: `${GITHUB_REPO_PREFIX}FakePlayer-CE`,
    prank_tags: [
      "April Fools: Fake players are sentient teapots 🫖👤",
      "Skin: teapot with legs 🫖🦵",
      'Chat: "I need more tea!" ☕️',
      'AFK: "brewing in corner" 🍵',
      'Kick reason: "teapot overflow" 🫗',
    ],
  },
  {
    name: "nuxtor",
    url: `${GITHUB_REPO_PREFIX}nuxtor`,
    prank_tags: [
      "April Fools: Builds desktop apps shaped like teapots 🫖💻",
      "Tauri backend: powered by tea steam ☕️",
      'Nuxt 4: "Tea mode" enabled 🍵',
      "UI components: all teapot-themed 🎨",
      "Bundle size: measured in tea bags 🫗",
    ],
  },
  {
    name: "website-statistics",
    url: `${GITHUB_REPO_PREFIX}website-statistics`,
    prank_tags: [
      "April Fools: Stats show tea consumption instead of visitors 🍵",
      "SQLite: stores tea leaf readings 🫖",
      'API: returns "brewing..." status ☕️',
      'Analytics: "teapot engagement" metric 📊',
      "Dashboard: made of tea-stained glass 🫗",
    ],
  },
  {
    name: "EndlessPixel-Player-Image",
    url: `${GITHUB_REPO_PREFIX}EndlessPixel-Player-Image`,
    prank_tags: [
      "April Fools: Player images replaced with teapot avatars 🫖🖼️",
      "Render: teapot with player name 🍵",
      "Color palette: tea-themed only 🎨",
      'Upload: "brewing avatar..." progress ☕️',
      'Default: "mystery teapot" 🫖❓',
    ],
  },
  {
    name: "RGBFile",
    url: `${GITHUB_REPO_PREFIX}RGBFile`,
    prank_tags: [
      "April Fools: Converts files to tea-colored RGB stripes 🍵🎨",
      "Encoding: tea leaf pattern algorithm 🔮",
      'Decoding: "steep the image" to get file ☕️',
      "Colors: all shades of tea (green, brown, amber) 🫖",
      "Lossless: unless you add milk 🥛",
    ],
  },
  {
    name: "CDKer",
    url: `${GITHUB_REPO_PREFIX}CDKer`,
    prank_tags: [
      "April Fools: CDK generates teapot items instead 🫖🎁",
      'Code format: "TEA-XXXX-POUR" ☕️',
      "Redeem: teapot pouring animation 🫗",
      'Invalid: "not enough sugar" 🍬',
      "Rare: golden teapot with wings 🫖🌟",
    ],
  },
  {
    name: "FileLink",
    url: `${GITHUB_REPO_PREFIX}FileLink`,
    prank_tags: [
      "April Fools: Every short link leads to a teapot 🫖",
      "HTTP Range: only serves the tea range 🍵",
      "Bandwidth limit: measured in cups of tea ☕️",
      "Admin console: hidden behind a teapot curtain 🫗",
      "IP blacklist: blocks coffee drinkers only ☕️🚫",
    ],
  },
  {
    name: "litematica",
    url: `${GITHUB_REPO_PREFIX}litematica`,
    prank_tags: [
      "April Fools: The blueprint is a giant teapot 🫖📐",
      "Schematic: every block is a tea block 🍵",
      "Paste: spawns teapots instead of blocks 🫗",
      "Render: ghost teapots everywhere 👻",
      "Material list: 99% tea leaves 📋",
    ],
  },
];

// ⭐️ 共享 star 文案池：GET / POST / PUT 各随机取 1 条
// 求 star 是本项目彩蛋的固定梗，三种请求都要覆盖到
const STAR_MESSAGES: string[] = [
  "⭐️ Star EndlessPixel's repos and the teapot might (not) behave!",
  "This teapot runs on stars, not tea — feed it a ⭐️ 🫖",
  "Star the repo, or the teapot will brew decaf 😱",
  "1 ⭐️ = 418 imaginary performance points 📈",
  "The teapot is watching... and waiting for your star 👀⭐️",
  "Stars are the only currency accepted at the Teapot Café ☕️⭐️",
  "No star? No tea. (April Fools' policy) 🫗",
  "Star now, debug later — the teapot approves ✅⭐️",
  "Your ⭐️ has been logged in the napkin audit trail 🍽️",
  "Teapot tip: stars make the kettle whistle in tune 🎵⭐️",
  "Star count: 418. Coincidence? The teapot says no 🫖",
  "Give a ⭐️, get a random repo (terrible exchange rate) 📦",
  "The teapot refuses to update until it gets 5 more stars ⭐️⏳",
  "Star this API and it will pretend to be production-ready 🚀",
  "⚠️ Low star level: please refill with ⭐️ immediately",
  "Every ⭐️ makes the April Fools prank 1% stronger 🎭",
  "Star the repos, blame the teapot — that's the workflow 🔁⭐️",
  "Teapot's only KPI: stars per cup of tea 📊☕️",
  "We accept ⭐️, 🍪 and tea. Mostly ⭐️. 🫖",
  "A star a day keeps the 418 away (it doesn't) 😜",
  "Star detected: teapot mood upgraded to 'delighted' 🥳⭐️",
  "Please star responsibly — the teapot gets greedy 🤑",
  "The repos are fake, but the ⭐️ would be real (April Fools) 🎪",
  "Last chance: ⭐️ or the teapot sings the kettle song again 🎤",
];

// Fisher-Yates 完全随机打乱
function shuffle<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// 从数组随机取 N 个不重复元素
function takeRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, Math.min(count, arr.length));
}

// 🆕 辅助函数：从仓库的多个标签中随机选一个
function getRandomPrankTag(repo: Repo): string {
  return takeRandom(repo.prank_tags, 1)[0];
}

// 随机生成临时小记录（每次都不一样，用于日志/痕迹）
function generateTempRecord() {
  const recordTypes = [
    "teapot_prank_log",
    "fake_request_trace",
    "tea_brewing_record",
    "prank_activated_at",
    "repo_hijack_note",
    "teapot_mood_swap",
    "api_joke_counter",
  ];
  const actions = [
    "successfully pranked client",
    "brewed fresh virtual tea",
    "shuffled 7 random repos",
    "hid secret teapot emoji",
    "rejected serious API request",
    "generated fake error message",
    "swapped response for jokes",
    "stored fake data in teacup",
  ];
  return {
    record_id: `TEMP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    record_type: takeRandom(recordTypes, 1)[0],
    action: takeRandom(actions, 1)[0],
    extra_note: takeRandom(
      [
        "no issues detected (all pranks are intentional)",
        "tea level: 97%",
        "mood updated automatically",
        "repo list shuffled 1x",
        "joke count +1",
        "client laughed (probably)",
      ],
      1,
    )[0],
    random_seed: Math.floor(Math.random() * 99999999),
  };
}

// 生成广告/推荐（大幅扩展）- ✅ 修改：使用随机 prank_tag
function generatePrankAd() {
  const randomRepos = takeRandom(repoList, 7);
  const prankSlogans = [
    "Teapot's April Fools' Picks 🫖 — these repos might prank YOU!",
    "April Fools! This teapot hacked your API — enjoy random repos 😜",
    "Warning: Repos below may contain pranks (blame the teapot) 🚨",
    "Teapot's Joke List 🎭 — star at your own risk!",
    "April Fools! Repos that lie (just like this teapot) 🥴",
    "7 Random Repos: May the teapot be with you 🫖✨",
    "April Fools' Giveaway: Repos that prank back 😝",
    "Teapot's Top Picks: None of these are serious 🎪",
    "API Hacked! Here's some repos instead of your data 🥷",
    "Lucky Repo Roulette: Spin the teapot wheel 🎡",
    "These repos are 100% safe... just kidding! 🚨",
    "Teapot Approved: Repos that make you laugh 😂",
    "April Fools' Bonus: Extra repos for extra pranks 🎁",
    "Repo Lottery: You won... maybe 🎟️",
    "Don't trust these repos (or the teapot) 🤥",
    "Secret Repo Drop: Only teapot insiders get this 🤫",
    "April Fools Exclusive: Repos with hidden tea emojis 🫖",
    "Teapot's Choice: Hand-picked (not really random) 🎰",
  ];
  const prankChallenges = [
    "Star 3 repos before the teapot gets angry ⏰",
    "Drink tea while browsing these repos 🫖",
    "Find the hidden teapot emoji in the code 🔍",
    "Share this prank API with a friend 📤",
    "Write a teapot-themed commit message ✍️",
    "Refresh the page 4 times for extra pranks 🔄",
    "Sing a tea-themed song while coding 🎤",
    "Add a teapot emoji to your README 📝",
    "Star one repo per cup of tea ☕️",
    "Tell a friend this API is 100% real 😏",
    "Find all tea emojis in this response 👀",
    "Star 2 repos and name one after a teapot 🫖⭐️",
    "Trade one ⭐️ for a fake teapot achievement 🏆",
  ];
  return {
    slogan: takeRandom(prankSlogans, 1)[0],
    // ✅ 修改：每个仓库随机展示一个 prank_tag
    picks: randomRepos.map((repo) => `${repo.name} [${getRandomPrankTag(repo)}]: ${repo.url}`),
    prank_disclaimer:
      "Disclaimer: This teapot is not responsible for any repo pranks (April Fools' Day 2026 🎉)",
    teapot_rating: `${Math.floor(Math.random() * 5) + 1}/5 cups of tea ☕️`,
    april_fools_challenge: takeRandom(prankChallenges, 1)[0],
    fake_downloads: `${Math.floor(Math.random() * 99999) + 1} (fake) downloads 📥`,
    repo_shuffle_seed: Math.floor(Math.random() * 999999),
  };
}

// 生成主体玩笑响应（超级扩展）
function getPrankResponse() {
  const teapotAdvice = [
    "Always keep a teapot nearby when coding 🫖",
    "Star repos before the teapot gets grumpy ⭐️",
    "Never trust a teapot on April Fools 🎭",
    "Drink tea, not coffee, for better code ☕️",
    "Commit early, commit often (or the teapot will prank you) 💻",
    "Always check for teapot emojis in API responses 🕵️",
    "April Fools' tip: Blame the teapot for bugs 🐛",
    "Tea + code = perfect combo (trust me, I'm a teapot) ✨",
    "If code breaks, blame the teapot — it works every time 😜",
    "Add 🫖 to all your projects for 100% more luck 🍀",
  ];
  const fakeApiStatus = [
    "99% tea, 1% functionality 🫖",
    "Running on teapot OS v4.18 ☕️",
    "API is napping (will wake up... maybe) 😴",
    "Teapot overload: 100% prank capacity 🚨",
    "Status: Brewing chaos 🌀",
    "API version: AprilFools-2026.0 🎭",
    "Connection: Tea-powered WiFi 📶",
    "Status: Stable (as a teapot on a bike) 🚲",
    "Prank engine: ONLINE 🤖",
    "Tea level: CRITICAL — need more ☕️",
  ];
  const teapotDemand = [
    "Star 1 repo",
    "Drink tea",
    "Tell a joke",
    "Ignore this error",
    "Follow EndlessPixel",
    "Share this API",
    "Drink 3 cups of tea",
    "Add a teapot to your README",
    "Laugh at the teapot's joke",
    "Refresh the page",
    "Star 5 repos",
    "Tweet about teapots",
    "Buy the teapot a biscuit 🍪",
    "Send a virtual tea 🍵",
  ];

  return {
    code: TEAPOT_JOKES.code,
    message: takeRandom(TEAPOT_JOKES.messages, 1)[0],
    teapot_mood: takeRandom(TEAPOT_JOKES.teapot_mood, 1)[0],
    fake_error: `TeapotError: ${takeRandom(TEAPOT_JOKES.fake_error, 1)[0]} (April Fools' Fake Error)`,
    april_fools: true,
    time: new Date().toISOString(),
    teapot_demand: takeRandom(teapotDemand, 1)[0],
    teapot_advice: takeRandom(teapotAdvice, 1)[0],
    fake_api_status: takeRandom(fakeApiStatus, 1)[0],
    fake_support:
      "Teapot Tech Support: Call ☎️ 1-800-TEAPOT (fake number) — we'll ignore you (April Fools)",
    prank_emojis: takeRandom(
      [
        "🫖🎭🤪",
        "🥴😜🎉",
        "☕️🎁🚨",
        "🤣👀✨",
        "🎪🥳🌀",
        "💻☕️🎭",
        "🤥🫗🍵",
        "🎡🤣🫖",
        "🫖🥔✨",
        "☕️🔥😂",
      ],
      1,
    )[0],
    prank_strength: `${Math.floor(Math.random() * 100)}%`,
    tea_level: `${Math.floor(Math.random() * 100)}%`,
  };
}

// ------------------------------
// API 路由
// ------------------------------
export async function GET() {
  return NextResponse.json({
    ...getPrankResponse(),
    ad: generatePrankAd(),
    fake_request_id: `TEAPOT-${Math.floor(Math.random() * 999999)}-APRILFOOLS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    fake_load_time: `${(Math.random() * 5).toFixed(2)}s (fake) ⏱️`,
    star_message: takeRandom(STAR_MESSAGES, 1)[0],
    temp_record: generateTempRecord(),
  });
}

export async function POST() {
  const postProcessingResults = [
    "POST body converted to tea leaves 🍵",
    "JSON parsed as teapot commands 🫖",
    "Request encrypted with tea-based encryption 🔐",
    "Payload replaced with teapot memes 🤣",
    "Data stored in a teacup database 🗄️",
    "POST request translated to pirate language 🏴‍☠️",
    "Body formatted as a tea recipe 📜",
    "POST data brewed into premium tea 🍵",
    "POST body auto-starred 3 random repos ⭐️",
    "Payload converted into a star-shaped tea cookie 🍪⭐️",
  ];
  return NextResponse.json({
    ...getPrankResponse(),
    ad: generatePrankAd(),
    post_prank: takeRandom(
      [
        "Oops! This teapot drank your POST body (April Fools' Joke) — have repos instead 🫖",
        "POST body stolen by the teapot — enjoy these repos as compensation 😜",
        "Your POST data was brewed into tea — here's some repos to sip on ☕️",
        "Teapot alert: POST request hijacked (April Fools) — repos incoming 🚨",
        "The teapot spilled your POST body — sorry (not sorry) 🥴",
      ],
      1,
    )[0],
    fake_fix: takeRandom(
      [
        "To fix: Pour tea on your server (jk... it's April Fools 😉)",
        "Fix: Add teapot emoji to your POST body 🫖",
        "Solution: Star 5 repos and the teapot will return your data ⭐️",
        "Quick fix: Drink a cup of tea and try again ☕️",
        "Debug tip: Blame the teapot (it's April Fools after all) 🎭",
        "Fix instructions: Follow the teapot on GitHub 🐙",
      ],
      1,
    )[0],
    fake_post_processing: takeRandom(postProcessingResults, 1)[0],
    fake_data_saved: `Data saved to teapot storage (${Math.floor(Math.random() * 1000)}KB fake) 💾`,
    fake_response_delay: `${Math.floor(Math.random() * 20)}ms (we were making tea) ⏳`,
    star_message: takeRandom(STAR_MESSAGES, 1)[0],
    temp_record: generateTempRecord(),
  });
}

// ------------------------------
// 🆕 PUT 彩蛋池：40 条，每条 2~4 个字段
// 主题：更新 / 覆盖 / 幂等 / 假错误 —— 与 418 茶壶世界观保持一致
// ------------------------------
interface PutEasterEgg {
  id: string;
  title: string;
  punchline?: string;
  reward?: string;
}

const PUT_EASTER_EGGS: PutEasterEgg[] = [
  {
    id: "PUT-001",
    title: "Update installed: Teapot OS v4.18 🫖",
    punchline: "Nothing actually changed — it's April Fools 😜",
    reward: "1 virtual biscuit 🍪",
  },
  {
    id: "PUT-002",
    title: "Your payload was overwritten with tea leaves 🍵",
    punchline: "PUT means 'Please Update Teapot' (fake definition)",
  },
  {
    id: "PUT-003",
    title: "Idempotency check ✅",
    punchline: "PUT is idempotent, but this teapot pranks you every single time 🔁",
  },
  {
    id: "PUT-004",
    title: "204 No Content (but 100% jokes) 🤣",
  },
  {
    id: "PUT-005",
    title: "ETag: \"teapot-418-april-fools\" 🏷️",
    punchline: "If-Match header ignored — the teapot never matches anything",
    reward: "A random EndlessPixel repo ⭐️",
  },
  {
    id: "PUT-006",
    title: "Data saved to the teacup database 🗄️",
    punchline: "Durability: until the tea gets cold ☕️",
  },
  {
    id: "PUT-007",
    title: "Teapot firmware upgraded 🆙",
    punchline: "New feature: louder kettle whistle 📢",
    reward: "0 real features 🎁",
  },
  {
    id: "PUT-008",
    title: "409 Conflict: teapot refuses to share the tea 🫗",
  },
  {
    id: "PUT-009",
    title: "Resource replaced successfully 🔄",
    punchline: "Your JSON is now a haiku about tea 📜",
  },
  {
    id: "PUT-010",
    title: "Fake migration 00418 applied 💾",
    punchline: "All tables renamed to tbl_teapot_* 🫖",
    reward: "Rollback available on April 1st only 🗓️",
  },
  {
    id: "PUT-011",
    title: "Teapot is now 3% more sarcastic 😏",
    punchline: "Changelog: 'misc pranks' (as always)",
  },
  {
    id: "PUT-012",
    title: "418 I'm a teapot (still, after your PUT) 🫖",
  },
  {
    id: "PUT-013",
    title: "Request body brewed at 98°C 🌡️",
    punchline: "Brew time: 4.18 seconds exactly ⏱️",
    reward: "A cup of imaginary tea ☕️",
  },
  {
    id: "PUT-014",
    title: "Update rejected: payload too serious 🚨",
    punchline: "Please add at least one 🫖 emoji and retry",
  },
  {
    id: "PUT-015",
    title: "Cache invalidated (all 0 entries) 🧹",
    punchline: "The teapot doesn't believe in caching anyway",
  },
  {
    id: "PUT-016",
    title: "Teapot mood: UPDATED to 'chaotic' 🎭",
  },
  {
    id: "PUT-017",
    title: "Your PUT was routed to the joke service 🤖",
    punchline: "SLA: 99% pranks, 1% accidental truth",
    reward: "A fake uptime badge 🟢",
  },
  {
    id: "PUT-018",
    title: "Validation passed ✅ (we didn't validate) 🙃",
  },
  {
    id: "PUT-019",
    title: "Replace complete: old data → 7 random repos 📦",
    punchline: "Star them before the teapot changes its mind ⭐️",
  },
  {
    id: "PUT-020",
    title: "Version bumped to AprilFools-2026.1 🎉",
    punchline: "Breaking change: everything is a teapot now",
    reward: "Free migration guide (it's one emoji) 🫖",
  },
  {
    id: "PUT-021",
    title: "Teapot wrote your change to a napkin 🍽️",
    punchline: "Persistence layer: paper, slightly damp",
  },
  {
    id: "PUT-022",
    title: "202 Accepted (for pranking) 🕰️",
    punchline: "Processing will finish... eventually... maybe",
  },
  {
    id: "PUT-023",
    title: "Secret unlock: 🫖 hidden dev console 🕹️",
  },
  {
    id: "PUT-024",
    title: "Update applied to 418 teapots simultaneously 🫖",
    punchline: "None of them noticed",
    reward: "A synchronized whistle 🎵",
  },
  {
    id: "PUT-025",
    title: "PUT /api/fool → PATCH /api/serious (404) 🔍",
    punchline: "Serious endpoints are not served here 😜",
  },
  {
    id: "PUT-026",
    title: "Your change was approved by the Tea Council ☕️",
    punchline: "Meeting minutes: 'more jokes, fewer bytes'",
  },
  {
    id: "PUT-027",
    title: "Rollback plan: pour the tea back into the kettle ⏪",
  },
  {
    id: "PUT-028",
    title: "Fake audit log: 'user updated the teapot at 04:01' 📝",
    punchline: "Auditor: the teapot itself (no conflict of interest at all)",
    reward: "A gold star ⭐️ (self-awarded)",
  },
  {
    id: "PUT-029",
    title: "Teapot storage: 418KB used of 418KB 💾",
    punchline: "Please delete a joke to make room (don't)",
  },
  {
    id: "PUT-030",
    title: "Congrats, you're now a certified Teapot Maintainer 🧑‍🍳",
  },
  {
    id: "PUT-031",
    title: "Webhook fired: teapot.laughed 🤣",
    punchline: "Payload: { \"joke\": \"your PUT\" }",
    reward: "One free retry 🔁",
  },
  {
    id: "PUT-032",
    title: "Hot-swap complete: coffee module → tea module ☕️",
    punchline: "Downtime: 0ms (it was never up)",
  },
  {
    id: "PUT-033",
    title: "Warning: this PUT created a parallel timeline 🌀",
    punchline: "In the other one, your code works perfectly ✨",
  },
  {
    id: "PUT-034",
    title: "Update queued behind 418 other PUTs 📥",
  },
  {
    id: "PUT-035",
    title: "Teapot diff: +1 🫖 / -0 seriousness 📊",
    punchline: "Reviewer approved without reading (classic)",
    reward: "A fake green checkmark ✅",
  },
  {
    id: "PUT-036",
    title: "Your If-Match header was matched with a joke 🃏",
    punchline: "Optimistic concurrency: the teapot is always optimistic",
  },
  {
    id: "PUT-037",
    title: "Backup created: teapot_backup_AprilFools.sql 🗃️",
    punchline: "Restore tested: 0 times (trusted blindly)",
  },
  {
    id: "PUT-038",
    title: "Achievement unlocked: PUT the teapot 🏆",
  },
  {
    id: "PUT-039",
    title: "Teapot config updated: prank_level = MAX 🚨",
    punchline: "Warning: cannot be lowered until April 2nd",
    reward: "Unlimited random repos 🎁",
  },
  {
    id: "PUT-040",
    title: "Nothing to see here... or is there? 👀",
    punchline: "Refresh the PUT 4 times for the real egg 🥚",
  },
];

// ------------------------------
// 🆕 PUT 专属消息池：3 个字段 × 各 42 条，每次请求各随机取 1 条
// ------------------------------

// 字段 1：PUT 主题玩笑消息（更新 / 覆盖 / 幂等 / 假状态）
const PUT_PRANK_MESSAGES: string[] = [
  "PUT accepted — the teapot replaced your payload with 418 tiny teapots 🫖",
  "Update complete: your resource is now 100% April Fools compliant 🎭",
  "Overwrite successful: old data → fresh tea leaves 🍵",
  "Idempotency note: same PUT, different prank every time 🔁",
  "Teapot says: 'I applied your update, then drank it' 🥴",
  "Your PUT was intercepted by the April Fools middleware 🚨",
  "Resource updated in the teacup database (durability: 4 minutes) ☕️",
  "PUT /api/fool → 418 I'm a teapot (still not a valid target) 🫖",
  "Change applied to 0 rows, 42 jokes inserted 📊",
  "Your payload is now a tea recipe. No refunds 📜",
  "Update rejected: body lacks a teapot emoji 🫖❌",
  "Teapot firmware accepted your change, then forgot it 🤖",
  "Full replace done — seriousness reduced by 99% 📉",
  "Congrats! Your PUT triggered the secret kettle whistle 📢",
  "ETag matched: \"april-fools-418-v2\" 🏷️",
  "Your update was queued behind 418 other PUTs 📥",
  "Applied successfully to a parallel universe only 🌀",
  "Teapot diff: +🍵 +🎭 -📄 -😤",
  "PUT processed, but the response was brewed for 4.18s ⏱️",
  "Warning: this update voids your seriousness warranty ⚠️",
  "Your JSON is now a haiku: 'tea / kettle / April Fools' 📝",
  "Overwrite confirmed... of our sense of responsibility 😜",
  "Teapot OS applied your patch as a sticker 🩹",
  "Update logged in the napkin audit trail 🍽️",
  "PUT succeeded, POST is jealous, GET is confused 😵",
  "Your change was approved by 418 teapots, unanimously 🗳️",
  "Resource replaced with a random EndlessPixel repo ⭐️",
  "Hot-reload complete: coffee module → tea module ☕️",
  "Teapot says 'no conflicts' — it never reads the diff 🙃",
  "Your If-Match header was ignored with great respect 🃏",
  "Update installed: 3% more sarcasm, 0% more features 📈",
  "PUT body encrypted with tea-based encryption 🔐",
  "Change saved... to /dev/null/teapot 💾",
  "Rollback available (but only on April 1st) ⏪",
  "Your PUT created a fake migration 00418 🗃️",
  "Success! Nothing was updated, as planned all along ✅",
  "Teapot scale-up: 1 → 418 instances, all equally useless 🫖",
  "Request body translated to pirate, then to tea 🏴‍☠️",
  "Your update passed all 0 tests 🧪",
  "Cache purged: the teapot doesn't cache, it just jokes 🧹",
  "PUT accepted with 202 vibes and 418 reality 🕰️",
  "Final note: the teapot read your payload and laughed 🤣",
  "Update applied: your resource now has 1 more ⭐️ (imaginary) ✨",
  "PUT complete — remember to star the repos you just overwrote ⭐️",
];

// 字段 2：假修复建议
const PUT_FAKE_FIXES: string[] = [
  "Fix: add 🫖 to the request body and retry",
  "Fix: star 5 EndlessPixel repos before the teapot calms down ⭐️",
  "Fix: pour tea on your server (jk, it's April Fools 😉)",
  "Fix: replace Content-Type with application/tea 🍵",
  "Fix: lower your expectations, keep the PUT",
  "Fix: drink a cup of tea, then PUT again ☕️",
  "Fix: rename your field 'data' to 'teapot'",
  "Fix: refresh exactly 4.18 times 🔄",
  "Fix: blame the teapot in your incident report 🎭",
  "Fix: add an If-Match header containing a joke 🃏",
  "Fix: run PUT during a full moon 🌕",
  "Fix: ask the Tea Council for approval ☕️",
  "Fix: replace your payload with a biscuit 🍪",
  "Fix: set prank_level=MAX in the config 🚨",
  "Fix: use PATCH instead (404, but worth a try) 🔍",
  "Fix: whisper 'I'm a teapot' to your terminal 🫖",
  "Fix: increase brew time to 418ms ⏱️",
  "Fix: delete the seriousness column from your schema 📊",
  "Fix: add a teapot emoji to your README 📝",
  "Fix: send the same PUT again — pranks are not idempotent 🔁",
  "Fix: reboot the kettle, not the server 🔌",
  "Fix: change HTTP 418 to 200 in your hopes only 💭",
  "Fix: store your data in a teacup, not a database 🗄️",
  "Fix: consult the official teapot docs (they don't exist) 📚",
  "Fix: buy the teapot a biscuit and apologize 🍪",
  "Fix: swap PUT for BREW (unofficial method) 🫗",
  "Fix: add X-April-Fools: true header ✅",
  "Fix: wait until April 2nd (or don't) 🗓️",
  "Fix: rotate your API key 418 times 🔑",
  "Fix: rewrite the payload as a limerick 📜",
  "Fix: disable the 'serious' feature flag 🚩",
  "Fix: ask GitHub Copilot — it will also say 418 🤖",
  "Fix: add 0 retries and 100% optimism 😌",
  "Fix: move the endpoint to /api/teapot 🫖",
  "Fix: invalidate the cache that never existed 🧹",
  "Fix: sign the request with a tea-stained napkin 🍽️",
  "Fix: increment version to AprilFools-2026.1 🎉",
  "Fix: sing the kettle song while waiting 🎵",
  "Fix: accept that the data was always jokes 🤣",
  "Fix: PUT again tomorrow, same result, new joke 🔁",
  "Fix: replace your linter with a teapot 🫖",
  "Fix: no fix needed — it's a feature (April Fools) ✨",
];

// 字段 3：假处理状态 / 假元数据
const PUT_FAKE_STATUSES: string[] = [
  "status: BREWING_UPDATE (estimated 4.18s) ⏳",
  "status: 99% tea, 1% applied changes 🫖",
  "status: UPDATED_IN_A_DREAM 💤",
  "status: prank_engine=ONLINE, db=OFFLINE 🤖",
  "status: teapot load average: 418.00 🚨",
  "status: all 418 replicas agreed to disagree 🫖",
  "status: pending Tea Council approval ☕️",
  "status: rollback armed, safety off ⏪",
  "status: durability window: until tea gets cold 🥶",
  "status: applied to /dev/teapot only 💾",
  "status: 0 rows affected, 42 jokes generated 📊",
  "status: running Teapot OS v4.18 🎭",
  "status: connection: tea-powered WiFi 📶",
  "status: queue depth 418, patience 0 📥",
  "status: checksum: 0xAPR1LF00LS 🔐",
  "status: ETag teapot-418-april-fools (stale since 2026) 🏷️",
  "status: migration 00418 applied (fake) 🗃️",
  "status: seriousness: DEPRECATED 📉",
  "status: kettle temperature 98°C, logic 0°C 🌡️",
  "status: audit log written on a napkin 🍽️",
  "status: idempotency: disabled for pranks only 🔁",
  "status: uptime 99.418% (rounded up) 🟢",
  "status: response delay 418ms (we were pouring) ⏱️",
  "status: backup created, restore never tested 🗄️",
  "status: prank_level=MAX, cannot be lowered 🚨",
  "status: 418 teapots voting... result: more jokes 🗳️",
  "status: payload replaced with confetti 🎉",
  "status: cache MISS (there is no cache) 🧹",
  "status: SLA 99% pranks / 1% accidental truth 📈",
  "status: webhook teapot.laughed delivered 🤣",
  "status: timeline diverged, your code works there 🌀",
  "status: reviewer approved without reading (classic) ✅",
  "status: tea level CRITICAL — refill required ☕️",
  "status: fake_error suppressed for April Fools 🛡️",
  "status: 202 Accepted, 418 Delivered 🕰️",
  "status: hot-swap coffee→tea complete ☕️",
  "status: achievements unlocked: PUT the teapot 🏆",
  "status: joke counter +1 (total: ∞) ♾️",
  "status: parallel universe sync: 100% 🌀",
  "status: config drift: 0 (nothing was configured) ⚖️",
  "status: teapot is napping, update queued 😴",
  "status: ALL SYSTEMS JOKE 🎪",
];

/**
 * PUT /api/fool —— PUT 专属彩蛋（不出现在 GET / POST）。
 * - put_easter_egg：从 40 条彩蛋池里随机抽 1 条；
 * - 其余 3 个专属字段：各自从 42 条消息池里随机取 1 条。
 * 刻意不复用 GET/POST 的通用响应，保证字段均为 PUT 专属。
 */
export async function PUT() {
  return NextResponse.json({
    code: TEAPOT_JOKES.code,
    put_easter_egg: takeRandom(PUT_EASTER_EGGS, 1)[0],
    put_message: takeRandom(PUT_PRANK_MESSAGES, 1)[0],
    put_fake_fix: takeRandom(PUT_FAKE_FIXES, 1)[0],
    put_fake_status: takeRandom(PUT_FAKE_STATUSES, 1)[0],
    star_message: takeRandom(STAR_MESSAGES, 1)[0],
  });
}
