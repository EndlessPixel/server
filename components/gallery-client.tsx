"use client";
import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
  DownloadIcon,
  ImageIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  XIcon,
  ServerIcon,
  ChevronLeft,
  ChevronRight,
  GlobeIcon,
  SparklesIcon,
  CloudIcon,
  FlagIcon,
} from "lucide-react";

type ImageItem = {
  resolution: string;
  path: string;
  player: string;
  date: string;
  size: string;
  sha256?: string;
};

type Mirror = {
  tag: string;
  baseUrl: string;
  tip: string;
  type: "official" | "proxy" | "cdn" | "global";
  region?: string;
};

const mirrors: Mirror[] = [
  {
    tag: "GitHub RAW",
    baseUrl: "https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main",
    tip: "官方源",
    type: "official",
  },
  {
    tag: "Cloudflare",
    baseUrl:
      "https://gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main",
    tip: "全球加速",
    type: "proxy",
  },
  {
    tag: "Fastly",
    baseUrl:
      "https://cdn.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main",
    tip: "全球加速",
    type: "cdn",
  },
  {
    tag: "Edgeone",
    baseUrl:
      "https://edgeone.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main",
    tip: "全球加速",
    type: "cdn",
  },
  {
    tag: "Jasonzeng",
    baseUrl:
      "https://gh.xmly.dev/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main",
    tip: "备用代理",
    type: "proxy",
  },
  {
    tag: "HoogKoog 香港",
    baseUrl:
      "https://hk.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main",
    tip: "香港加速",
    type: "cdn",
    region: "香港",
  },
  {
    tag: "JSdelivr-Fastly",
    baseUrl: "https://fastly.jsdelivr.net/gh/EndlessPixel/EndlessPixel-Player-Image@main",
    tip: "国内稳定",
    type: "cdn",
    region: "国内",
  },
  {
    tag: "JSdelivr-Gcore",
    baseUrl: "https://gcore.jsdelivr.net/gh/EndlessPixel/EndlessPixel-Player-Image@main",
    tip: "全球备用",
    type: "cdn",
  },
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getMirrorByTag = useCallback((tag: string | null) => {
    return mirrors.find((mirror) => mirror.tag === tag) ?? mirrors[0];
  }, []);

  const getPageFromParam = useCallback((value: string | null) => {
    const page = Number.parseInt(value ?? "1", 10);
    return Number.isNaN(page) || page < 1 ? 1 : page;
  }, []);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [agreement, setAgreement] = useState<string>("");
  const [agreeLoading, setAgreeLoading] = useState(true);
  const [selectedMirror, setSelectedMirror] = useState<Mirror>(
    getMirrorByTag(searchParams.get("mirror")),
  );

  const [mirrorModal, setMirrorModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(getPageFromParam(searchParams.get("page")));
  const imagesPerPage = 6;

  const [downloadModal, setDownloadModal] = useState<{
    show: boolean;
    item: ImageItem | null;
  }>({ show: false, item: null });

  const [toast, setToast] = useState<{
    show: boolean;
    text: string;
    type: "success" | "error";
  }>({ show: false, text: "", type: "error" });

  const updateSearchParams = (options: { mirror?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (options.mirror !== undefined) {
      options.mirror ? params.set("mirror", options.mirror) : params.delete("mirror");
    }
    if (options.page !== undefined) {
      options.page > 1 ? params.set("page", options.page.toString()) : params.delete("page");
    }

    const query = params.toString();
    const href = query ? `?${query}` : window.location.pathname;
    router.replace(href, { scroll: false });
  };

  useEffect(() => {
    const m = getMirrorByTag(searchParams.get("mirror"));
    const p = getPageFromParam(searchParams.get("page"));
    if (m.tag !== selectedMirror.tag) setSelectedMirror(m);
    if (p !== currentPage) setCurrentPage(p);
  }, [searchParams, selectedMirror.tag, currentPage, getMirrorByTag, getPageFromParam]);

  const getAssetUrl = useCallback(
    (assetPath: string) => {
      return `${selectedMirror.baseUrl}${assetPath}`;
    },
    [selectedMirror],
  );

  useEffect(() => {
    setAgreeLoading(true);
    fetch(getAssetUrl("/LICENSE"))
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setAgreement)
      .catch(() => setAgreement("无法加载协议文本，请前往 GitHub 查看 CC BY-NC-SA 4.0 协议。"))
      .finally(() => setAgreeLoading(false));
  }, [getAssetUrl]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(getAssetUrl("/assets.json"));
        if (!res.ok) throw new Error();
        const data: ImageItem[] = await res.json();
        data.sort(
          (a: ImageItem, b: ImageItem) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setImages(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [getAssetUrl]);

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const indexFirst = (currentPage - 1) * imagesPerPage;
  const indexLast = currentPage * imagesPerPage;
  const currentImages = images.slice(indexFirst, indexLast);

  const paginate = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateSearchParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (text: string, type: "success" | "error") => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: "", type: "error" }), 2600);
  };

  const openDownloadModal = (item: ImageItem) => {
    if (agreeLoading) return showToast("协议加载中，请稍候", "error");
    setDownloadModal({ show: true, item });
  };

  const confirmDownload = () => {
    if (!downloadModal.item) return;
    const url = getAssetUrl(downloadModal.item.path);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${downloadModal.item.player}_${downloadModal.item.date}.png`;
    a.click();
    setDownloadModal({ show: false, item: null });
    showToast("下载开始！", "success");
  };

  const handleMirrorSelect = (mirror: Mirror) => {
    setSelectedMirror(mirror);
    setMirrorModal(false);
    setCurrentPage(1);
    updateSearchParams({ mirror: mirror.tag, page: 1 });
    showToast(`已切换至：${mirror.tag}`, "success");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "official":
        return <GlobeIcon className="h-3.5 w-3.5 text-foreground/60" />;
      case "proxy":
        return <SparklesIcon className="h-3.5 w-3.5 text-foreground/60" />;
      case "cdn":
        return <CloudIcon className="h-3.5 w-3.5 text-foreground/60" />;
      default:
        return <CloudIcon className="h-3.5 w-3.5 text-foreground/60" />;
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background px-3 py-8 sm:px-4 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">玩家截图图册</h1>
          </div>

          <div className="mb-6 rounded-xl border border-foreground/8 bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <ServerIcon className="h-4 w-4 text-foreground/60" />
                <span>加速节点选择</span>
              </div>
              <button
                onClick={() => setMirrorModal(true)}
                className="flex w-full items-center justify-between rounded-lg bg-secondary px-4 py-2.5 text-left text-foreground"
              >
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedMirror.type)}
                  <span className="text-sm font-medium">{selectedMirror.tag}</span>
                  <span className="text-xs text-muted-foreground">{selectedMirror.tip}</span>
                </div>
                <span className="text-xs text-foreground/60">点击切换</span>
              </button>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-foreground/8 bg-secondary p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2Icon className="h-5 w-5 text-foreground/60" />
              <h2 className="font-bold text-foreground">使用声明 & 版权协议</h2>
            </div>
            <div className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              重要提醒：无论你是直接下载、右键另存为、F12 获取图片链接、或从 GitHub 仓库下载，均受到
              CC BY-NC-SA 4.0 协议保护，请合规使用！
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-card">
                    <div className="aspect-video bg-secondary" />
                    <div className="space-y-2 p-3">
                      <div className="h-4 w-3/4 rounded bg-secondary" />
                      <div className="h-3 w-1/2 rounded bg-secondary" />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircleIcon className="mb-4 h-12 w-12 text-red-500" />
              <p className="text-foreground/80">图片加载失败，请切换镜像源重试</p>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">暂无玩家截图</p>
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <>
              <div className="mb-4 text-center text-sm text-muted-foreground">
                共 {images.length} 张截图 · 第 {currentPage} / {totalPages} 页
              </div>

              <PhotoProvider>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {currentImages.map((item) => (
                    <div
                      key={item.path}
                      className="group relative overflow-hidden rounded-xl border border-foreground/8 bg-card transition-all hover:-translate-y-1 hover:border-foreground/12 hover:shadow-lg"
                    >
                      <PhotoView src={getAssetUrl(item.path)}>
                        <div className="aspect-video cursor-pointer overflow-hidden">
                          <img
                            src={getAssetUrl(item.path)}
                            alt={`${item.player} ${item.date}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </PhotoView>

                      <div className="space-y-1.5 p-3">
                        <h3 className="truncate text-sm font-medium text-foreground">
                          {item.date}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground md:gap-3">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-3.5 w-3.5" />
                            {item.player}
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {item.resolution}
                          </div>
                          <button
                            onClick={() => openDownloadModal(item)}
                            className="flex items-center gap-1 transition-colors hover:text-foreground/60"
                          >
                            <DownloadIcon className="h-3.5 w-3.5" />
                            下载
                          </button>
                        </div>
                        {item.sha256 && (
                          <div className="truncate text-xs text-muted-foreground" title="SHA256">
                            SHA256: {item.sha256.slice(0, 32)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </PhotoProvider>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/8 bg-card disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => paginate(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium ${
                        currentPage === p
                          ? "bg-foreground text-background"
                          : "border border-foreground/8 bg-card"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/8 bg-card disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-10 text-center text-sm text-muted-foreground">
            想要上传自己的截图？前往
            <a
              href="https://wiki.endlesspixel.cn/dev/image_upload"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-foreground/60 hover:underline"
            >
              Wiki 查看上传方法
            </a>
          </div>
        </div>
      </main>

      {mirrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-foreground/8 p-5">
              <h3 className="text-lg font-bold text-foreground">选择加速节点</h3>
              <button
                onClick={() => setMirrorModal(false)}
                className="rounded-full p-1 hover:bg-secondary"
              >
                <XIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {mirrors.map((m) => (
                  <button
                    key={m.tag}
                    onClick={() => handleMirrorSelect(m)}
                    className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition-all ${
                      selectedMirror.tag === m.tag
                        ? "border-foreground/15 bg-secondary"
                        : "border-foreground/8 hover:border-foreground/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getTypeIcon(m.type)}
                      <span className="text-sm font-medium text-foreground">{m.tag}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{m.tip}</span>
                      {m.region && (
                        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          <FlagIcon className="mr-0.5 inline h-3 w-3" />
                          {m.region}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {downloadModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-card shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-foreground/8 bg-card p-5">
              <h3 className="text-lg font-bold text-foreground">协议确认</h3>
              <button
                onClick={() => setDownloadModal({ show: false, item: null })}
                className="rounded-full p-1 hover:bg-secondary"
              >
                <XIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4 text-sm font-medium text-foreground/80">
                下载即代表同意以下协议：
              </div>
              <div className="max-h-[60vh] overflow-y-auto rounded-lg bg-secondary/50 p-3 pr-2 text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {agreement}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-foreground/8 p-5">
              <button
                onClick={() => setDownloadModal({ show: false, item: null })}
                className="rounded-lg bg-secondary px-4 py-2 text-sm"
              >
                取消
              </button>
              <button
                onClick={confirmDownload}
                className="rounded-lg bg-foreground px-4 py-2 text-sm text-background"
              >
                同意并下载
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-2 text-sm text-white shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2Icon className="h-4 w-4" />
          ) : (
            <AlertCircleIcon className="h-4 w-4" />
          )}
          {toast.text}
        </div>
      )}
    </>
  );
}

export default function GalleryClient() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">加载中...</div>}
    >
      <GalleryContent />
    </Suspense>
  );
}
