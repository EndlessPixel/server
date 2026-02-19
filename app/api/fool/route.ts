import { NextResponse } from 'next/server';

const data = {
    code: 418,
    message1: "I'm a teapot",
    message2: "Only EndlessPixel can do.",
    time: new Date().toISOString()
};

const repoList = [
    { name: 'Chat-Box', url: 'https://github.com/EndlessPixel/Chat-Box' },
    { name: 'EndlessPixel-Modpack', url: 'https://github.com/EndlessPixel/EndlessPixel-Modpack' },
    { name: 'CSSTextLib', url: 'https://github.com/EndlessPixel/CSSTextLib' },
    { name: 'SystemStatus', url: 'https://github.com/EndlessPixel/SystemStatus' },
    { name: 'Native-Snake-AI', url: 'https://github.com/EndlessPixel/Native-Snake-AI' },
    { name: 'EndlessPixel-App', url: 'https://github.com/EndlessPixel/EndlessPixel-App' },
    { name: '2048-AI-Game', url: 'https://github.com/EndlessPixel/2048-AI-Game' },
    { name: 'chinese-chess-js', url: 'https://github.com/EndlessPixel/chinese-chess-js' },
    { name: 'JSON-Tree-Viewer', url: 'https://github.com/EndlessPixel/JSON-Tree-Viewer' },
    { name: 'EndlessPixel-Novel', url: 'https://github.com/EndlessPixel/EndlessPixel-Novel' },
    { name: 'EndlessPixel-ModpackAPP', url: 'https://github.com/EndlessPixel/EndlessPixel-ModpackAPP', },
    { name: 'captcha', url: 'https://github.com/EndlessPixel/captcha' },
    { name: 'frpc-manager', url: 'https://github.com/EndlessPixel/frpc-manager' },
    { name: 'EndlessPixel-Website', url: 'https://github.com/EndlessPixel/EndlessPixel-Website' },
    { name: 'frp-config-generator', url: 'https://github.com/EndlessPixel/frp-config-generator' },
    { name: 'qrcode-generator-parser', url: 'https://github.com/EndlessPixel/qrcode-generator-parser' },
    { name: 'python-notepad', url: 'https://github.com/EndlessPixel/python-notepad' },
];

function shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
}

function pickAd() {
    return shuffle(repoList).slice(0, 5).map(r => `${r.name}: ${r.url}`);
}

export async function GET() {
    return NextResponse.json({
        ...data,
        ad: {
            slogan: 'Teapot recommends ☕️ — check out more EndlessPixel projects:',
            picks: pickAd()
        }
    });
}

export async function POST() {
    return NextResponse.json({
        ...data,
        ad: {
            slogan: 'Teapot brewed a special list ☕️ — dive into EndlessPixel:',
            picks: pickAd()
        }
    });
}