import { NextResponse } from 'next/server';

// 🎭 愚人节专属：茶壶的各种吐槽/玩笑文案
const TEAPOT_JOKES = {
    code: 418,
    // 核心玩笑文案（随机切换）
    messages: [
        "I'm a teapot 🫖 — can't brew coffee, only EndlessPixel's projects!",
        "418 Error: This teapot is on strike (April Fools' Edition) 🚨",
        "Why did the teapot cross the repo? To prank your API request 😜",
        "This teapot only serves GitHub repos, not tea ☕️ (April Fools' Joke)",
        "Oops! This teapot spilled your request — have a random repo instead 🥴",
        "418: Teapot refuses to work (unless you star EndlessPixel's repos ⭐️)",
        "April Fools! This teapot is actually a repo recommendation machine 🤖",
        "Warning: Teapot is drunk on code — random repos ahead 🥴"
    ],
    // 茶壶的"小脾气"
    teapot_mood: ["grumpy", "silly", "pranky", "sleepy", "hyper", "mischievous"][Math.floor(Math.random() * 6)],
    // 愚人节彩蛋：假错误提示
    fake_error: `TeapotError: ${["Missing sugar", "No milk", "Too hot", "Too cold", "Wrong mug"][Math.floor(Math.random() * 5)]} (April Fools' Fake Error)`
};

// 📜 仓库列表（已包含python-notepad）
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

// 🃏 愚人节专属：生成带整活的广告推荐
function generatePrankAd() {
    const randomRepos = shuffle(repoList).slice(0, 5);
    // 随机愚人节slogan
    const prankSlogans = [
        "Teapot's April Fools' Picks 🫖 — these repos might prank YOU!",
        "April Fools! This teapot hacked your API — enjoy random repos 😜",
        "Warning: Repos below may contain pranks (blame the teapot) 🚨",
        "Teapot's Joke List 🎭 — star at your own risk!",
        "April Fools' Special: Repos that lie (just like this teapot) 🥴"
    ];

    return {
        slogan: prankSlogans[Math.floor(Math.random() * prankSlogans.length)],
        // 每个仓库带愚人节整活标签
        picks: randomRepos.map(repo => `${repo.name} [${repo.prank_tag}]: ${repo.url}`),
        // 额外愚人节彩蛋：假"免责声明"
        prank_disclaimer: "Disclaimer: This teapot is not responsible for any repo pranks (April Fools' Day 2026 🎉)"
    };
}

// 🧩 基础响应（随机切换玩笑文案）
function getPrankResponse() {
    return {
        code: TEAPOT_JOKES.code,
        message: TEAPOT_JOKES.messages[Math.floor(Math.random() * TEAPOT_JOKES.messages.length)],
        teapot_mood: TEAPOT_JOKES.teapot_mood,
        fake_error: TEAPOT_JOKES.fake_error,
        april_fools: true, // 明确标记愚人节接口
        time: new Date().toISOString(),
        // 愚人节小彩蛋：随机"茶壶要求"
        teapot_demand: ["Star 1 repo", "Drink tea", "Tell a joke", "Ignore this error"][Math.floor(Math.random() * 4)]
    };
}

// GET 请求（愚人节版）
export async function GET() {
    return NextResponse.json({
        ...getPrankResponse(),
        ad: generatePrankAd()
    });
}

// POST 请求（额外整活）
export async function POST() {
    return NextResponse.json({
        ...getPrankResponse(),
        ad: generatePrankAd(),
        // POST 专属玩笑：假装"请求被茶壶喝掉了"
        post_prank: "Oops! This teapot drank your POST body (April Fools' Joke) — have repos instead 🫖",
        // 假的"修复提示"
        fake_fix: "To fix: Pour tea on your server (jk... it's April Fools 😉)"
    });
}