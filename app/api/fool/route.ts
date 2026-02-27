import { NextResponse } from 'next/server';

// 🎭 愚人节专属：茶壶的各种吐槽/玩笑文案（大幅扩展）
const TEAPOT_JOKES = {
    code: 418,
    // 核心玩笑文案（随机切换）- 新增更多趣味文案
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
        // 新增文案
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
    ],
    // 茶壶的"小脾气" - 新增更多情绪
    teapot_mood: [
        "grumpy", "silly", "pranky", "sleepy", "hyper", "mischievous",
        "cute", "hungry", "proud", "confused", "playful",
        // 新增情绪
        "sassy", "lazy", "overcaffeinated", "bored", "excited",
        "dramatic", "flirty", "annoyed", "curious", "giggly",
        "snarky", "zen", "chaotic", "whiny"
    ][Math.floor(Math.random() * 24)],
    // 愚人节彩蛋：假错误提示 - 新增更多假错误
    fake_error: `TeapotError: ${[
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
        // 新增假错误
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
        "API request is out of date 📅"
    ][Math.floor(Math.random() * 24)]} (April Fools' Fake Error)`
};

// 📜 仓库列表（大幅扩展，新增更多仓库和趣味标签）
interface Repo {
    name: string;
    url: string;
    // 愚人节专属：给仓库加"整活标签"
    prank_tag: string;
}

const repoList: Repo[] = [
    { name: 'Chat-Box', url: 'https://github.com/EndlessPixel/Chat-Box', prank_tag: 'Talks too much (April Fools)' },
    { name: 'EndlessPixel-Modpack', url: 'https://github.com/EndlessPixel/EndlessPixel-Modpack', prank_tag: 'May contain fake mods 🎭' },
    { name: 'CSSTextLib', url: 'https://github.com/EndlessPixel/CSSTextLib', prank_tag: 'Makes text upside down 🥴' },
    { name: 'SystemStatus', url: 'https://github.com/EndlessPixel/SystemStatus', prank_tag: 'Lies about your CPU temp 🌡️' },
    { name: 'Native-Snake-AI', url: 'https://github.com/EndlessPixel/Native-Snake-AI', prank_tag: 'Snake eats itself (on purpose) 🐍' },
    { name: 'EndlessPixel-App', url: 'https://github.com/EndlessPixel/EndlessPixel-App', prank_tag: 'April Fools: App is just a teapot 🫖' },
    { name: '2048-AI-Game', url: 'https://github.com/EndlessPixel/2048-AI-Game', prank_tag: 'AI cheats (we won\'t tell) 🎮' },
    { name: 'chinese-chess-js', url: 'https://github.com/EndlessPixel/chinese-chess-js', prank_tag: 'Pieces switch sides 🤪' },
    { name: 'JSON-Tree-Viewer', url: 'https://github.com/EndlessPixel/JSON-Tree-Viewer', prank_tag: 'Makes JSON look like tea leaves 🍵' },
    { name: 'EndlessPixel-Novel', url: 'https://github.com/EndlessPixel/EndlessPixel-Novel', prank_tag: 'Plot twist: It\'s a teapot story 📖' },
    { name: 'EndlessPixel-ModpackAPP', url: 'https://github.com/EndlessPixel/EndlessPixel-ModpackAPP', prank_tag: 'App crashes (jk... maybe) 💥' },
    { name: 'captcha', url: 'https://github.com/EndlessPixel/captcha', prank_tag: 'Captcha is just a teapot emoji 🫖' },
    { name: 'frpc-manager', url: 'https://github.com/EndlessPixel/frpc-manager', prank_tag: 'Manages fake tunnels 🚇' },
    { name: 'EndlessPixel-Website', url: 'https://github.com/EndlessPixel/EndlessPixel-Website', prank_tag: 'Website is upside down (April Fools)' },
    { name: 'frp-config-generator', url: 'https://github.com/EndlessPixel/frp-config-generator', prank_tag: 'Generates prank configs 😝' },
    { name: 'qrcode-generator-parser', url: 'https://github.com/EndlessPixel/qrcode-generator-parser', prank_tag: 'QR codes lead to teapot memes 🤣' },
    { name: 'python-notepad', url: 'https://github.com/EndlessPixel/python-notepad', prank_tag: 'Types backwards on April Fools 📝' },
    { name: 'EndlessPixel/EndlessPixel', url: 'https://github.com/EndlessPixel/EndlessPixel', prank_tag: 'April Fools: Repo is just a teapot 🫖' },
    { name: 'EndlessPixel/TerminalQR', url: 'https://github.com/EndlessPixel/TerminalQR', prank_tag: 'April Fools: QR codes lead to teapot memes 🤣' },
    { name: 'EndlessPixel.github.io', url: 'https://EndlessPixel.github.io', prank_tag: 'April Fools: Website is upside down (April Fools)' },
    { name: 'Files-Panel', url: 'https://github.com/EndlessPixel/Files-Panel', prank_tag: 'April Fools: Files are just a teapot 🫖' },
];

// 🎲 更公平的洗牌算法（愚人节也得讲武德）
function shuffle<T>(arr: T[]): T[] {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

// 🃏 愚人节专属：生成带整活的广告推荐（扩展slogan和新增趣味功能）
function generatePrankAd() {
    const randomRepos = shuffle(repoList).slice(0, 7); // 从5个增加到7个推荐仓库
    // 随机愚人节slogan（大幅扩展）
    const prankSlogans = [
        "Teapot's April Fools' Picks 🫖 — these repos might prank YOU!",
        "April Fools! This teapot hacked your API — enjoy random repos 😜",
        "Warning: Repos below may contain pranks (blame the teapot) 🚨",
        "Teapot's Joke List 🎭 — star at your own risk!",
        "April Fools' Special: Repos that lie (just like this teapot) 🥴",
        // 新增slogan
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
    ];

    // 新增：随机"茶壶评分"
    const teapotRating = `${Math.floor(Math.random() * 5) + 1}/5 cups of tea ☕️`;

    // 新增：随机"愚人节挑战"
    const prankChallenges = [
        "Star 3 repos before the teapot gets angry ⏰",
        "Drink tea while browsing these repos 🫖",
        "Find the hidden teapot emoji in the code 🔍",
        "Share this prank API with a friend 📤",
        "Write a teapot-themed commit message ✍️",
        "Refresh the page 4 times for extra pranks 🔄",
        "Sing a tea-themed song while coding 🎤",
        "Add a teapot emoji to your README 📝"
    ];

    return {
        slogan: prankSlogans[Math.floor(Math.random() * prankSlogans.length)],
        // 每个仓库带愚人节整活标签
        picks: randomRepos.map(repo => `${repo.name} [${repo.prank_tag}]: ${repo.url}`),
        // 额外愚人节彩蛋：假"免责声明"
        prank_disclaimer: "Disclaimer: This teapot is not responsible for any repo pranks (April Fools' Day 2026 🎉)",
        // 新增字段
        teapot_rating: teapotRating,
        april_fools_challenge: prankChallenges[Math.floor(Math.random() * prankChallenges.length)],
        // 假的"下载量"
        fake_downloads: `${Math.floor(Math.random() * 9999) + 1} (fake) downloads 📥`
    };
}

// 🧩 基础响应（随机切换玩笑文案，新增更多彩蛋）
function getPrankResponse() {
    // 新增：随机"茶壶建议"
    const teapotAdvice = [
        "Always keep a teapot nearby when coding 🫖",
        "Star repos before the teapot gets grumpy ⭐️",
        "Never trust a teapot on April Fools 🎭",
        "Drink tea, not coffee, for better code ☕️",
        "Commit early, commit often (or the teapot will prank you) 💻",
        "Always check for teapot emojis in API responses 🕵️",
        "April Fools' tip: Blame the teapot for bugs 🐛",
        "Tea + code = perfect combo (trust me, I'm a teapot) ✨"
    ];

    // 新增：随机"假API状态"
    const fakeApiStatus = [
        "99% tea, 1% functionality 🫖",
        "Running on teapot OS v4.18 ☕️",
        "API is napping (will wake up... maybe) 😴",
        "Teapot overload: 100% prank capacity 🚨",
        "Status: Brewing chaos 🌀",
        "API version: AprilFools-2026.0 🎭",
        "Connection: Tea-powered WiFi 📶"
    ];

    return {
        code: TEAPOT_JOKES.code,
        message: TEAPOT_JOKES.messages[Math.floor(Math.random() * TEAPOT_JOKES.messages.length)],
        teapot_mood: TEAPOT_JOKES.teapot_mood,
        fake_error: TEAPOT_JOKES.fake_error,
        april_fools: true, // 明确标记愚人节接口
        time: new Date().toISOString(),
        // 愚人节小彩蛋：随机"茶壶要求"（扩展）
        teapot_demand: [
            "Star 1 repo", "Drink tea", "Tell a joke", "Ignore this error",
            // 新增要求
            "Follow EndlessPixel", "Share this API", "Drink 3 cups of tea",
            "Add a teapot to your README", "Laugh at the teapot's joke",
            "Refresh the page", "Star 5 repos", "Tweet about teapots"
        ][Math.floor(Math.random() * 12)],
        // 新增字段
        teapot_advice: teapotAdvice[Math.floor(Math.random() * teapotAdvice.length)],
        fake_api_status: fakeApiStatus[Math.floor(Math.random() * fakeApiStatus.length)],
        // 假的"技术支持"信息
        fake_support: "Teapot Tech Support: Call ☎️ 1-800-TEAPOT (fake number) — we'll ignore you (April Fools)",
        // 随机愚人节emoji组合
        prank_emojis: [
            "🫖🎭🤪", "🥴😜🎉", "☕️🎁🚨", "🤣👀✨", "🎪🥳🌀",
            "💻☕️🎭", "🤥🫗🍵", "🎡🤣🫖"
        ][Math.floor(Math.random() * 8)]
    };
}

// GET 请求（愚人节版）
export async function GET() {
    return NextResponse.json({
        ...getPrankResponse(),
        ad: generatePrankAd(),
        // GET专属：假的"请求ID"
        fake_request_id: `TEAPOT-${Math.floor(Math.random() * 999999)}-APRILFOOLS`,
        // GET专属：随机"加载时间"
        fake_load_time: `${(Math.random() * 5).toFixed(2)}s (fake) ⏱️`
    });
}

// POST 请求（额外整活，扩展更多专属内容）
export async function POST() {
    // POST专属：随机"处理结果"
    const postProcessingResults = [
        "POST body converted to tea leaves 🍵",
        "JSON parsed as teapot commands 🫖",
        "Request encrypted with tea-based encryption 🔐",
        "Payload replaced with teapot memes 🤣",
        "Data stored in a teacup database 🗄️",
        "POST request translated to pirate language 🏴‍☠️",
        "Body formatted as a tea recipe 📜"
    ];

    return NextResponse.json({
        ...getPrankResponse(),
        ad: generatePrankAd(),
        // POST 专属玩笑：假装"请求被茶壶喝掉了"（扩展）
        post_prank: [
            "Oops! This teapot drank your POST body (April Fools' Joke) — have repos instead 🫖",
            "POST body stolen by the teapot — enjoy these repos as compensation 😜",
            "Your POST data was brewed into tea — here's some repos to sip on ☕️",
            "Teapot alert: POST request hijacked (April Fools) — repos incoming 🚨",
            "The teapot spilled your POST body — sorry (not sorry) 🥴"
        ][Math.floor(Math.random() * 5)],
        // 假的"修复提示"（扩展）
        fake_fix: [
            "To fix: Pour tea on your server (jk... it's April Fools 😉)",
            "Fix: Add teapot emoji to your POST body 🫖",
            "Solution: Star 5 repos and the teapot will return your data ⭐️",
            "Quick fix: Drink a cup of tea and try again ☕️",
            "Debug tip: Blame the teapot (it's April Fools after all) 🎭",
            "Fix instructions: Follow the teapot on GitHub 🐙"
        ][Math.floor(Math.random() * 6)],
        // 新增POST专属字段
        fake_post_processing: postProcessingResults[Math.floor(Math.random() * postProcessingResults.length)],
        fake_data_saved: `Data saved to teapot storage (${Math.floor(Math.random() * 100)}KB fake) 💾`,
        // 假的"响应延迟"
        fake_response_delay: `${Math.floor(Math.random() * 10)}ms (we were making tea) ⏳`
    });
}