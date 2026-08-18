// 浏览器原生 SpeechSynthesis（Web Speech API）朗读封装。
// 设计为单例控制器：同一时间只允许一段朗读，重复调用会取消上一段。

/**
 * 将 Markdown 转为适合朗读的纯文本：去掉标记符号，保留可读文字。
 * 不追求完美解析，目标只是让 TTS 不念出 **、[]()、# 等符号。
 */
export function markdownToPlainText(md: string): string {
  return md
    // 代码块 ```...``` —— 直接用占位提示替代，避免念整段代码
    .replace(/```[\s\S]*?```/g, "。")
    // 行内代码 `...`
    .replace(/`([^`]+)`/g, "$1")
    // 图片 ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 链接 [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // 标题 #~###### 及其后内容
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    // 引用块 > 
    .replace(/^\s{0,3}>+\s?/gm, "")
    // 加粗/斜体 **、__、*、_
    .replace(/(\*\*|__|\*|_)/g, "")
    // 分隔线
    .replace(/^\s{0,3}([-*_])\1{2,}\s*$/gm, "")
    // 列表标记 -、*、+ 与有序 1. 
    .replace(/^\s*([-*+]|\d+\.)\s+/gm, "")
    // 表格行分隔 | --- | 删掉
    .replace(/\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?/g, "")
    // 表格竖线
    .replace(/\|/g, " ")
    // HTML 标签
    .replace(/<[^>]+>/g, "")
    // 多余空白折叠
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

type SpeakOptions = {
  /** 朗读语言，默认中文 */
  lang?: string;
  /** 语速，0.1 ~ 10，默认 1 */
  rate?: number;
  /** 音调，0 ~ 2，默认 1 */
  pitch?: number;
  /** 音量，0 ~ 1，默认 1 */
  volume?: number;
  /** 开始朗读回调 */
  onStart?: () => void;
  /** 结束（自然结束或被取消）回调 */
  onEnd?: () => void;
  /** 出错回调 */
  onError?: (error: SpeechSynthesisErrorEvent) => void;
};

// 延迟加载语音列表：部分浏览器首次调用时 voices 尚未就绪。
const loadVoices = (): Promise<SpeechSynthesisVoice[]> =>
  new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const onVoicesChanged = () => {
      resolve(synth.getVoices());
      synth.removeEventListener("voiceschanged", onVoicesChanged);
    };
    synth.addEventListener("voiceschanged", onVoicesChanged);
  });

export const speech = {
  /** 当前是否正在朗读 */
  get speaking(): boolean {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    return window.speechSynthesis.speaking;
  },

  /** 浏览器是否支持朗读 */
  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window
    );
  },

  /** 停止当前朗读 */
  cancel(): void {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  },

  /**
   * 朗读一段文本。若已有朗读在进行，会先取消再重新朗读。
   * @returns 是否成功发起朗读
   */
  async speak(text: string, options: SpeakOptions = {}): Promise<boolean> {
    if (!this.isSupported() || !text.trim()) return false;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = options.lang ?? "zh-CN";
    utter.rate = options.rate ?? 1;
    utter.pitch = options.pitch ?? 1;
    utter.volume = options.volume ?? 1;

    if (options.onStart) utter.onstart = options.onStart;
    if (options.onEnd) utter.onend = options.onEnd;
    if (options.onError) utter.onerror = options.onError;

    // 尝试挑选匹配语言的语音，提升中文朗读效果。
    try {
      const voices = await loadVoices();
      const matched =
        voices.find((v) => v.lang === utter.lang) ??
        voices.find((v) => v.lang.startsWith(utter.lang.split("-")[0]));
      if (matched) utter.voice = matched;
    } catch {
      // 语音列表加载失败不影响朗读，使用浏览器默认语音。
    }

    synth.speak(utter);
    return true;
  },
};

export type { SpeakOptions };
