/**
 * 服务器考试：抽题、判分与本地成绩记录。
 *
 * 成绩保存在浏览器 localStorage（不上传服务端），键名见 QUIZ_STORAGE_KEY。
 * 所有读写都做了容错：隐私模式、配额不足、数据被外部篡改时都不会抛错。
 */

import { QUIZ_QUESTIONS, type QuizCategory, type QuizQuestion } from "@/lib/quiz-questions";

export type { QuizCategory, QuizQuestion };

/** 开考时可选的题量 */
export const EXAM_SIZE_OPTIONS = [5, 10, 20, 25, 50, 100] as const;

/** 可选题量 */
export type ExamSize = (typeof EXAM_SIZE_OPTIONS)[number];

/** 默认题量 */
export const EXAM_SIZE: ExamSize = 20;

/** 题库总题数 */
export const QUESTION_BANK_SIZE = QUIZ_QUESTIONS.length;

/** 实际出题数：所选题量超过题库总量时按题库全出 */
export function resolveExamSize(size: number): number {
  return Math.min(size, QUESTION_BANK_SIZE);
}

/** 成绩记录的 localStorage 键名（结构调整时请升版本号） */
export const QUIZ_STORAGE_KEY = "ep_quiz_records_v1";

/** 本地最多保留的历史成绩条数 */
export const MAX_QUIZ_RECORDS = 20;

/** 一道考试题目（选项与正确项均已按本次考试重新排列） */
export interface ExamQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  /** 正确选项下标（0 起） */
  answer: number;
  explanation: string;
}

/** 单题作答结果 */
export interface ExamDetail {
  question: ExamQuestion;
  /** 玩家选择的选项下标，未作答为 null */
  picked: number | null;
  isCorrect: boolean;
}

/** 整场考试结果 */
export interface ExamResult {
  /** 百分制得分（0-100，四舍五入） */
  score: number;
  correct: number;
  total: number;
  details: ExamDetail[];
}

/** 一条本地成绩记录 */
export interface QuizRecord {
  id: string;
  score: number;
  correct: number;
  total: number;
  /** 用时（毫秒） */
  durationMs: number;
  /** 交卷时间戳 */
  finishedAt: number;
}

/** 生成记录 id；randomUUID 在非安全上下文不可用，故带兜底 */
function makeRecordId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

/** Fisher–Yates 洗牌，返回新数组 */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 抽题组卷：随机抽取题目，并同时打乱每题内选项顺序
 * （打乱选项后会把正确答案重映射到新下标）。
 */
export function buildExam(
  count: number = EXAM_SIZE,
  bank: readonly QuizQuestion[] = QUIZ_QUESTIONS,
): ExamQuestion[] {
  const picked = shuffle(bank).slice(0, Math.min(count, bank.length));

  return picked.map((q) => {
    const order = shuffle(q.options.map((_, index) => index));
    return {
      id: q.id,
      category: q.category,
      question: q.question,
      options: order.map((index) => q.options[index]),
      answer: order.indexOf(q.answer),
      explanation: q.explanation,
    };
  });
}

/** 判分：未作答按错误计 */
export function gradeExam(
  questions: readonly ExamQuestion[],
  answers: readonly (number | null)[],
): ExamResult {
  let correct = 0;
  const details = questions.map((question, index) => {
    const picked = answers[index] ?? null;
    const isCorrect = picked !== null && picked === question.answer;
    if (isCorrect) correct += 1;
    return { question, picked, isCorrect };
  });

  const total = questions.length;
  return {
    score: total > 0 ? Math.round((correct / total) * 100) : 0,
    correct,
    total,
    details,
  };
}

/** 分数对应的评级与提示语 */
export function scoreGrade(score: number): { label: string; remark: string } {
  if (score >= 90)
    return { label: "优秀", remark: "服务器的事你比管理还清楚，考虑来帮忙答客服吧。" };
  if (score >= 75)
    return { label: "良好", remark: "大部分规则和玩法都摸清了，个别细节再看一眼 Wiki 就完美了。" };
  if (score >= 60) return { label: "及格", remark: "基础没问题，建议翻翻错题的解析补一下盲区。" };
  return { label: "不及格", remark: "先别急着进服，把下面错题的解析过一遍再来一遍。" };
}

function isQuizRecord(value: unknown): value is QuizRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<QuizRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.score === "number" &&
    typeof record.correct === "number" &&
    typeof record.total === "number" &&
    typeof record.durationMs === "number" &&
    typeof record.finishedAt === "number"
  );
}

/** 读取本地成绩记录（按时间倒序），不可用时返回空数组 */
export function loadQuizRecords(): QuizRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isQuizRecord).sort((a, b) => b.finishedAt - a.finishedAt);
  } catch {
    return [];
  }
}

/** 追加一条成绩记录，返回更新后的列表（写入失败时仅返回内存中的结果） */
export function saveQuizRecord(record: Omit<QuizRecord, "id"> & { id?: string }): QuizRecord[] {
  const next: QuizRecord[] = [
    { ...record, id: record.id ?? makeRecordId() },
    ...loadQuizRecords(),
  ].slice(0, MAX_QUIZ_RECORDS);

  try {
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 隐私模式 / 配额不足：忽略写入失败，本次成绩仍可在页面上查看
  }
  return next;
}

/** 清空全部本地成绩记录 */
export function clearQuizRecords(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch {
    // 忽略
  }
}

/** 把毫秒格式化为「1 分 20 秒」 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} 秒`;
  return `${minutes} 分 ${seconds} 秒`;
}

/** 格式化交卷时间为本地日期时间 */
export function formatFinishedAt(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
