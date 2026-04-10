import { NextResponse } from 'next/server';

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
  ],
  teapot_mood: [
    "grumpy", "silly", "pranky", "sleepy", "hyper", "mischievous",
    "cute", "hungry", "proud", "confused", "playful",
    "sassy", "lazy", "overcaffeinated", "bored", "excited",
    "dramatic", "flirty", "annoyed", "curious", "giggly",
    "snarky", "zen", "chaotic", "whiny",
    "evil", "chill", "maniac", "soft", "wild",
    "drunk", "shy", "royal", "tiny", "giant",
    "sparkling", "shadow", "happy", "sad", "troll"
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

// 仓库类型
interface Repo {
  name: string;
  url: string;
  prank_tag: string;
}

// 统一维护前缀
const GITHUB_REPO_PREFIX = 'https://github.com/EndlessPixel/';

// ✅ 新增你给的 5 个仓库 + 原有所有仓库
const repoList: Repo[] = [
  // 原有
  { name: 'Chat-Box', url: `${GITHUB_REPO_PREFIX}Chat-Box`, prank_tag: 'April Fools: Talks way too much 🗣️' },
  { name: 'EndlessPixel-Modpack', url: `${GITHUB_REPO_PREFIX}EndlessPixel-Modpack`, prank_tag: 'April Fools: May contain fake mods 🎭' },
  { name: 'CSSTextLib', url: `${GITHUB_REPO_PREFIX}CSSTextLib`, prank_tag: 'April Fools: Makes text upside down 🥴' },
  { name: 'SystemStatus', url: `${GITHUB_REPO_PREFIX}SystemStatus`, prank_tag: 'April Fools: Lies about CPU temp 🌡️' },
  { name: 'Native-Snake-AI', url: `${GITHUB_REPO_PREFIX}Native-Snake-AI`, prank_tag: 'April Fools: Snake eats itself 🐍' },
  { name: 'EndlessPixel-App', url: `${GITHUB_REPO_PREFIX}EndlessPixel-App`, prank_tag: 'April Fools: It’s just a teapot 🫖' },
  { name: '2048-AI-Game', url: `${GITHUB_REPO_PREFIX}2048-AI-Game`, prank_tag: 'April Fools: AI definitely cheats 🎮' },
  { name: 'chinese-chess-js', url: `${GITHUB_REPO_PREFIX}chinese-chess-js`, prank_tag: 'April Fools: Pieces switch sides 🤪' },
  { name: 'JSON-Tree-Viewer', url: `${GITHUB_REPO_PREFIX}JSON-Tree-Viewer`, prank_tag: 'April Fools: Reads like tea leaves 🍵' },
  { name: 'EndlessPixel-Novel', url: `${GITHUB_REPO_PREFIX}EndlessPixel-Novel`, prank_tag: 'April Fools: Plot twist: teapot story 📖' },
  { name: 'EndlessPixel-ModpackAPP', url: `${GITHUB_REPO_PREFIX}EndlessPixel-ModpackAPP`, prank_tag: 'April Fools: Crashes for fun 💥' },
  { name: 'captcha', url: `${GITHUB_REPO_PREFIX}captcha`, prank_tag: 'April Fools: Captcha = teapot 🫖' },
  { name: 'frpc-manager', url: `${GITHUB_REPO_PREFIX}frpc-manager`, prank_tag: 'April Fools: Tunnels are fake 🚇' },
  { name: 'EndlessPixel-Website', url: `${GITHUB_REPO_PREFIX}EndlessPixel-Website`, prank_tag: 'April Fools: Website is upside down 🥴' },
  { name: 'frp-config-generator', url: `${GITHUB_REPO_PREFIX}frp-config-generator`, prank_tag: 'April Fools: Generates prank configs 😝' },
  { name: 'qrcode-generator-parser', url: `${GITHUB_REPO_PREFIX}qrcode-generator-parser`, prank_tag: 'April Fools: QR = teapot memes 🤣' },
  { name: 'python-notepad', url: `${GITHUB_REPO_PREFIX}python-notepad`, prank_tag: 'April Fools: Types backwards 📝' },
  { name: 'EndlessPixel', url: `${GITHUB_REPO_PREFIX}EndlessPixel`, prank_tag: 'April Fools: Repo is just a teapot 🫖' },
  { name: 'TerminalQR', url: `${GITHUB_REPO_PREFIX}TerminalQR`, prank_tag: 'April Fools: QR leads to teapots 🤣' },
  { name: 'EndlessPixel.github.io', url: `${GITHUB_REPO_PREFIX}EndlessPixel.github.io`, prank_tag: 'April Fools: Site is upside down 🥴' },
  { name: 'Files-Panel', url: `${GITHUB_REPO_PREFIX}Files-Panel`, prank_tag: 'April Fools: Files are fake teapots 🫖' },
  { name: 'Command-Sentinel', url: `${GITHUB_REPO_PREFIX}Command-Sentinel`, prank_tag: 'April Fools: Commands are pranks 🚨' },
  { name: 'simple-local-music-player', url: `${GITHUB_REPO_PREFIX}simple-local-music-player`, prank_tag: 'April Fools: Music plays backwards 🎵' },

  // 🔥 你新增的 5 个仓库
  { name: 'EndlessPixel-Wiki', url: `${GITHUB_REPO_PREFIX}EndlessPixel-Wiki`, prank_tag: 'April Fools: Wiki pages are all tea facts 🫖' },
  { name: 'EP-XPcheckin', url: `${GITHUB_REPO_PREFIX}EP-XPcheckin`, prank_tag: 'April Fools: Checkin gives tea XP instead of points ☕️' },
  { name: 'PotatoMC', url: `${GITHUB_REPO_PREFIX}PotatoMC`, prank_tag: 'April Fools: Minecraft runs on potato + teapot power 🥔🫖' },
  { name: 'minecraft-version-list', url: `${GITHUB_REPO_PREFIX}minecraft-version-list`, prank_tag: 'April Fools: Versions sorted by tea preference 🍵' },
  { name: 'EndlessPixel-World-Backup', url: `${GITHUB_REPO_PREFIX}EndlessPixel-World-Backup`, prank_tag: 'April Fools: Backups stored in teacups 🫖💾' },
];

//  Fisher-Yates 完全随机打乱
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
    extra_note: takeRandom([
      "no issues detected (all pranks are intentional)",
      "tea level: 97%",
      "mood updated automatically",
      "repo list shuffled 1x",
      "joke count +1",
      "client laughed (probably)",
    ], 1)[0],
    random_seed: Math.floor(Math.random() * 99999999),
  };
}

// 生成广告/推荐（大幅扩展）
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
    "Teapot’s Choice: Hand-picked (not really random) 🎰",
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
  ];
  return {
    slogan: takeRandom(prankSlogans, 1)[0],
    picks: randomRepos.map(repo => `${repo.name} [${repo.prank_tag}]: ${repo.url}`),
    prank_disclaimer: "Disclaimer: This teapot is not responsible for any repo pranks (April Fools' Day 2026 🎉)",
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
    "Star 1 repo", "Drink tea", "Tell a joke", "Ignore this error",
    "Follow EndlessPixel", "Share this API", "Drink 3 cups of tea",
    "Add a teapot to your README", "Laugh at the teapot's joke",
    "Refresh the page", "Star 5 repos", "Tweet about teapots",
    "Buy the teapot a biscuit 🍪", "Send a virtual tea 🍵",
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
    fake_support: "Teapot Tech Support: Call ☎️ 1-800-TEAPOT (fake number) — we'll ignore you (April Fools)",
    prank_emojis: takeRandom(["🫖🎭🤪", "🥴😜🎉", "☕️🎁🚨", "🤣👀✨", "🎪🥳🌀", "💻☕️🎭", "🤥🫗🍵", "🎡🤣🫖", "🫖🥔✨", "☕️🔥😂"], 1)[0],
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
    fake_request_id: `TEAPOT-${Math.floor(Math.random() * 999999)}-APRILFOOLS-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
    fake_load_time: `${(Math.random() * 5).toFixed(2)}s (fake) ⏱️`,
    temp_record: generateTempRecord(), // 🆕 临时小记录
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
  ];
  return NextResponse.json({
    ...getPrankResponse(),
    ad: generatePrankAd(),
    post_prank: takeRandom([
      "Oops! This teapot drank your POST body (April Fools' Joke) — have repos instead 🫖",
      "POST body stolen by the teapot — enjoy these repos as compensation 😜",
      "Your POST data was brewed into tea — here's some repos to sip on ☕️",
      "Teapot alert: POST request hijacked (April Fools) — repos incoming 🚨",
      "The teapot spilled your POST body — sorry (not sorry) 🥴",
    ], 1)[0],
    fake_fix: takeRandom([
      "To fix: Pour tea on your server (jk... it's April Fools 😉)",
      "Fix: Add teapot emoji to your POST body 🫖",
      "Solution: Star 5 repos and the teapot will return your data ⭐️",
      "Quick fix: Drink a cup of tea and try again ☕️",
      "Debug tip: Blame the teapot (it's April Fools after all) 🎭",
      "Fix instructions: Follow the teapot on GitHub 🐙",
    ], 1)[0],
    fake_post_processing: takeRandom(postProcessingResults, 1)[0],
    fake_data_saved: `Data saved to teapot storage (${Math.floor(Math.random() * 1000)}KB fake) 💾`,
    fake_response_delay: `${Math.floor(Math.random() * 20)}ms (we were making tea) ⏳`,
    temp_record: generateTempRecord(), // 🆕 临时小记录
  });
}