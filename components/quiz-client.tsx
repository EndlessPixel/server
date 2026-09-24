"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChartColumn,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Code,
  GraduationCap,
  History,
  ListChecks,
  RotateCcw,
  Send,
  Timer,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentContainer } from "@/components/page-primitives";
import {
  buildExam,
  clearQuizRecords,
  DEV_BANK_SIZE,
  EXAM_SIZE,
  EXAM_SIZE_OPTIONS,
  formatDuration,
  formatFinishedAt,
  gradeExam,
  loadQuizRecords,
  QUESTION_BANK_SIZE,
  questionsFor,
  resolveExamSize,
  saveQuizRecord,
  scoreGrade,
  type ExamQuestion,
  type ExamResult,
  type QuizRecord,
} from "@/lib/quiz";
import { cn } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"];

/** 首页历史成绩最多展示条数 */
const RECENT_RECORD_LIMIT = 5;

type Phase = "intro" | "exam" | "result";

const FEATURES = [
  {
    icon: ClipboardList,
    title: "题量自选",
    desc: "5 到 100 题任选，从题库随机抽取，每次题目都不一样",
  },
  { icon: ListChecks, title: "单选作答", desc: "每题一个正确答案，交卷后给出逐题解析" },
  { icon: History, title: "本地记录", desc: "成绩只存在你的浏览器缓存，不上传服务器" },
];

export function QuizClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [records, setRecords] = useState<QuizRecord[]>([]);
  const [examSize, setExamSize] = useState<number>(EXAM_SIZE);
  const [includeDev, setIncludeDev] = useState(false);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  // localStorage 只能在客户端读取，放到 effect 里避免 SSR 与首帧不一致
  useEffect(() => {
    setRecords(loadQuizRecords());
  }, []);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers],
  );
  const bestScore = useMemo(
    () => (records.length > 0 ? Math.max(...records.map((r) => r.score)) : null),
    [records],
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const startExam = () => {
    const exam = buildExam(examSize, questionsFor(includeDev));
    setQuestions(exam);
    setAnswers(new Array(exam.length).fill(null));
    setCurrent(0);
    setResult(null);
    setConfirmingSubmit(false);
    setConfirmingClear(false);
    setStartedAt(Date.now());
    setPhase("exam");
    scrollToTop();
  };

  const selectOption = (optionIndex: number) => {
    setConfirmingSubmit(false);
    setAnswers((prev) => prev.map((value, index) => (index === current ? optionIndex : value)));
  };

  const goToQuestion = (index: number) => {
    setConfirmingSubmit(false);
    setCurrent(Math.min(Math.max(index, 0), questions.length - 1));
  };

  const submitExam = () => {
    const unanswered = questions.length - answeredCount;
    // 有漏题时先提示一次，避免误触直接交卷
    if (unanswered > 0 && !confirmingSubmit) {
      setConfirmingSubmit(true);
      return;
    }

    const graded = gradeExam(questions, answers);
    const usedMs = Date.now() - startedAt;

    setResult(graded);
    setDurationMs(usedMs);
    setRecords(
      saveQuizRecord({
        score: graded.score,
        correct: graded.correct,
        total: graded.total,
        durationMs: usedMs,
        finishedAt: Date.now(),
      }),
    );
    setConfirmingSubmit(false);
    setPhase("result");
    scrollToTop();
  };

  const handleClearRecords = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    clearQuizRecords();
    setRecords([]);
    setConfirmingClear(false);
  };

  /* ------------------------------ 开始页 ------------------------------ */
  if (phase === "intro") {
    // 开发者试题按需并入题库；题量说明与组卷范围都以这个合并后的总量为准
    const bankSize = includeDev ? QUESTION_BANK_SIZE + DEV_BANK_SIZE : QUESTION_BANK_SIZE;
    const actualSize = resolveExamSize(examSize, bankSize);

    return (
      <div className="min-h-screen bg-background">
        <main>
          <ContentContainer maxWidth="narrow" className="py-8">
            <header className="mb-8 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <GraduationCap className="h-7 w-7 text-foreground/60" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                服务器考试
              </h1>
              <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                从题库随机抽取题目，考考你对 EndlessPixel
                的接入方式、版本、玩法、规则与整合包了解多少。开考前可以自选题量，
                成绩只保存在你自己的浏览器里。
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardContent>
                      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-foreground/60" aria-hidden="true" />
                      </div>
                      <h2 className="font-semibold text-foreground">{feature.title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl bg-secondary/40 px-4 py-5">
              <p className="text-center text-sm font-medium text-foreground">选择题量</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {EXAM_SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    variant={examSize === size ? "default" : "outline"}
                    aria-pressed={examSize === size}
                    onClick={() => setExamSize(size)}
                  >
                    {size} 题
                  </Button>
                ))}
              </div>
              <div className="mt-4 border-t border-border/60 pt-4">
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    variant={includeDev ? "default" : "outline"}
                    aria-pressed={includeDev}
                    onClick={() => setIncludeDev((prev) => !prev)}
                  >
                    <Code aria-hidden="true" />
                    包含开发者试题
                  </Button>
                </div>
                <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
                  另有 {DEV_BANK_SIZE} 道接口调用、OAuth 接入、图册上传、启动器配置等开发者向题目
                  {includeDev ? "，已计入本次抽题范围" : "，默认不考"}。
                </p>
              </div>

              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                题库共 {bankSize} 题，本次抽 {actualSize} 题
                {examSize > bankSize ? "（已超过题库总量，按全部出卷）" : ""}
                。题目与选项顺序每次都会重新打乱。
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={startExam}>
                <GraduationCap aria-hidden="true" />
                开始考试
              </Button>
            </div>

            <Card className="mt-10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ChartColumn className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  历史成绩
                </CardTitle>
                <CardDescription>
                  {records.length > 0
                    ? `共 ${records.length} 次记录，最高分 ${bestScore} 分`
                    : "还没有记录，考一次就有了"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    暂无成绩记录。点击上方「开始考试」即可开始第一次测验。
                  </p>
                ) : (
                  <>
                    <ul className="space-y-2">
                      {records.slice(0, RECENT_RECORD_LIMIT).map((record) => (
                        <li
                          key={record.id}
                          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg bg-secondary/60 px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {formatFinishedAt(record.finishedAt)}
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="text-muted-foreground">
                              {record.correct}/{record.total} 题 ·{" "}
                              {formatDuration(record.durationMs)}
                            </span>
                            <Badge variant={record.score >= 60 ? "default" : "destructive"}>
                              {record.score} 分
                            </Badge>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {records.length > RECENT_RECORD_LIMIT && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        仅显示最近 {RECENT_RECORD_LIMIT} 次，本地最多保留 20 次。
                      </p>
                    )}
                  </>
                )}

                {records.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                    {confirmingClear && (
                      <span className="text-xs text-destructive">
                        再次点击「清空记录」将删除全部本地成绩
                      </span>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleClearRecords}>
                      <Trash2 aria-hidden="true" />
                      清空记录
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </ContentContainer>
        </main>
      </div>
    );
  }

  /* ------------------------------ 答题页 ------------------------------ */
  if (phase === "exam" && questions.length > 0) {
    const question = questions[current];
    const unanswered = questions.length - answeredCount;
    const isLast = current === questions.length - 1;

    return (
      <div className="min-h-screen bg-background">
        <main>
          <ContentContainer maxWidth="narrow" className="py-8">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  第 {current + 1} / {questions.length} 题
                </span>
                <span className="text-muted-foreground">
                  已作答 {answeredCount} / {questions.length}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-300"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <nav className="mb-6 flex flex-wrap gap-2" aria-label="题号导航">
              {questions.map((item, index) => {
                const isAnswered = answers[index] !== null;
                const isCurrent = index === current;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    aria-label={`第 ${index + 1} 题${isAnswered ? "（已作答）" : "（未作答）"}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                      isCurrent
                        ? "bg-foreground text-background"
                        : isAnswered
                          ? "bg-secondary text-foreground hover:bg-secondary/70"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </nav>

            <Card>
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="mb-1 w-fit">
                  {question.category}
                </Badge>
                <CardTitle className="text-lg leading-relaxed md:text-xl">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  role="radiogroup"
                  aria-label={`第 ${current + 1} 题选项`}
                  className="space-y-2"
                >
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[current] === optionIndex;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectOption(optionIndex)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                          selected
                            ? "border-foreground/30 bg-secondary text-foreground"
                            : "border-border bg-card hover:bg-secondary/50",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-semibold",
                            selected
                              ? "bg-foreground text-background"
                              : "bg-secondary text-muted-foreground",
                          )}
                          aria-hidden="true"
                        >
                          {OPTION_LABELS[optionIndex]}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {confirmingSubmit && (
              <p className="mt-4 text-center text-sm text-destructive" role="alert">
                还有 {unanswered} 题未作答，未作答按错误计分。再次点击「提交试卷」确认交卷。
              </p>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => goToQuestion(current - 1)}
                disabled={current === 0}
              >
                <ChevronLeft aria-hidden="true" />
                上一题
              </Button>

              {isLast ? (
                <Button onClick={submitExam}>
                  <Send aria-hidden="true" />
                  提交试卷
                </Button>
              ) : (
                <Button variant="outline" onClick={() => goToQuestion(current + 1)}>
                  下一题
                  <ChevronRight aria-hidden="true" />
                </Button>
              )}
            </div>

            {!isLast && (
              <div className="mt-3 text-center">
                <Button variant="ghost" size="sm" onClick={submitExam}>
                  <Send aria-hidden="true" />
                  提前交卷
                </Button>
              </div>
            )}
          </ContentContainer>
        </main>
      </div>
    );
  }

  /* ------------------------------ 成绩页 ------------------------------ */
  if (phase === "result" && result) {
    const grade = scoreGrade(result.score);

    return (
      <div className="min-h-screen bg-background">
        <main>
          <ContentContainer maxWidth="narrow" className="py-8">
            <Card>
              <CardContent className="text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                  <GraduationCap className="h-7 w-7 text-foreground/60" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">本次得分</p>
                <p className="my-2 text-5xl font-bold tracking-tight text-foreground">
                  {result.score}
                </p>
                <Badge variant={result.score >= 60 ? "default" : "destructive"}>
                  {grade.label}
                </Badge>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {grade.remark}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">答对</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {result.correct} / {result.total}
                    </p>
                  </div>
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Timer className="h-3 w-3" aria-hidden="true" />
                      用时
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {formatDuration(durationMs)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">最高分</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {bestScore !== null ? `${bestScore} 分` : "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={startExam}>
                    <RotateCcw aria-hidden="true" />
                    再考一次
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/about">去了解更多</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h2 className="mt-10 mb-4 text-lg font-semibold text-foreground">逐题解析</h2>
            <div className="space-y-4">
              {result.details.map((detail, index) => (
                <Card key={detail.question.id}>
                  <CardContent>
                    <div className="mb-3 flex items-start gap-3">
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-semibold",
                          detail.isCorrect
                            ? "bg-foreground text-background"
                            : "bg-destructive/10 text-destructive",
                        )}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <p className="leading-relaxed font-medium text-foreground">
                        {detail.question.question}
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-sm">
                      {detail.question.options.map((option, optionIndex) => {
                        const isAnswer = optionIndex === detail.question.answer;
                        const isPicked = optionIndex === detail.picked;
                        return (
                          <li
                            key={option}
                            className={cn(
                              "flex items-start gap-2 rounded-lg px-3 py-2",
                              isAnswer
                                ? "bg-secondary text-foreground"
                                : isPicked
                                  ? "bg-destructive/10 text-destructive"
                                  : "text-muted-foreground",
                            )}
                          >
                            <span className="font-mono text-xs" aria-hidden="true">
                              {OPTION_LABELS[optionIndex]}
                            </span>
                            <span className="leading-relaxed">{option}</span>
                            {isAnswer && (
                              <CheckCircle2
                                className="ml-auto h-4 w-4 shrink-0"
                                aria-label="正确答案"
                              />
                            )}
                            {isPicked && !isAnswer && (
                              <XCircle className="ml-auto h-4 w-4 shrink-0" aria-label="你的选择" />
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {detail.picked === null
                        ? "本题未作答"
                        : detail.isCorrect
                          ? "回答正确"
                          : `你选择了 ${OPTION_LABELS[detail.picked]}，正确答案是 ${OPTION_LABELS[detail.question.answer]}`}
                    </p>

                    <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">解析：</span>
                      {detail.question.explanation}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ContentContainer>
        </main>
      </div>
    );
  }

  // 兜底：状态异常时回到开始页
  return (
    <div className="min-h-screen bg-background">
      <main>
        <ContentContainer maxWidth="narrow" className="py-8 text-center">
          <p className="mb-4 text-muted-foreground">考试状态异常，请重新开始。</p>
          <Button onClick={startExam}>重新开始</Button>
        </ContentContainer>
      </main>
    </div>
  );
}
