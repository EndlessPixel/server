'use client';
import { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
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
} from 'lucide-react';

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
  type: 'official' | 'proxy' | 'cdn' | 'global';
  region?: string;
};

const mirrors: Mirror[] = [
  {
    tag: 'GitHub RAW',
    baseUrl: 'https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '官方源',
    type: 'official',
  },
  {
    tag: 'Cloudflare',
    baseUrl: 'https://gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '全球加速',
    type: 'proxy',
  },
  {
    tag: 'Fastly',
    baseUrl: 'https://cdn.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '全球加速',
    type: 'cdn',
  },
  {
    tag: 'Edgeone',
    baseUrl: 'https://edgeone.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '全球加速',
    type: 'cdn',
  },
  {
    tag: 'Jasonzeng',
    baseUrl: 'https://gh.xmly.dev/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '备用代理',
    type: 'proxy',
  },
  {
    tag: 'HoogKoog 香港',
    baseUrl: 'https://hk.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '香港加速',
    type: 'cdn',
    region: '香港',
  },
  {
    tag: 'JSdelivr-Fastly',
    baseUrl: 'https://fastly.jsdelivr.net/gh/EndlessPixel/EndlessPixel-Player-Image@main',
    tip: '国内稳定',
    type: 'cdn',
    region: '国内',
  },
  {
    tag: 'JSdelivr-Gcore',
    baseUrl: 'https://gcore.jsdelivr.net/gh/EndlessPixel/EndlessPixel-Player-Image@main',
    tip: '全球备用',
    type: 'cdn',
  },
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getMirrorByTag = useCallback((tag: string | null) => {
    return mirrors.find((mirror) => mirror.tag === tag) ?? mirrors[0];
  }, []);

  const getPageFromParam = useCallback((value: string | null) => {
    const page = Number.parseInt(value ?? '1', 10);
    return Number.isNaN(page) || page < 1 ? 1 : page;
  }, []);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [agreement, setAgreement] = useState<string>('');
  const [agreeLoading, setAgreeLoading] = useState(true);
  const [selectedMirror, setSelectedMirror] = useState<Mirror>(
    getMirrorByTag(searchParams.get('mirror'))
  );

  const [mirrorModal, setMirrorModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(
    getPageFromParam(searchParams.get('page'))
  );
  const imagesPerPage = 6;

  const [downloadModal, setDownloadModal] = useState<{
    show: boolean;
    item: ImageItem | null;
  }>({ show: false, item: null });

  const [toast, setToast] = useState<{
    show: boolean;
    text: string;
    type: 'success' | 'error';
  }>({ show: false, text: '', type: 'error' });

  const updateSearchParams = (options: { mirror?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (options.mirror !== undefined) {
      options.mirror ? params.set('mirror', options.mirror) : params.delete('mirror');
    }
    if (options.page !== undefined) {
      options.page > 1 ? params.set('page', options.page.toString()) : params.delete('page');
    }

    const query = params.toString();
    const href = query ? `?${query}` : window.location.pathname;
    router.replace(href, { scroll: false });
  };

  useEffect(() => {
    const m = getMirrorByTag(searchParams.get('mirror'));
    const p = getPageFromParam(searchParams.get('page'));
    if (m.tag !== selectedMirror.tag) setSelectedMirror(m);
    if (p !== currentPage) setCurrentPage(p);
  }, [searchParams, selectedMirror.tag, currentPage, getMirrorByTag, getPageFromParam]);

  const getAssetUrl = useCallback((assetPath: string) => {
    return `${selectedMirror.baseUrl}${assetPath}`;
  }, [selectedMirror]);

  useEffect(() => {
    setAgreeLoading(true);
    fetch(getAssetUrl('/LICENSE'))
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setAgreement)
      .catch(() => setAgreement('无法加载协议文本，请前往 GitHub 查看 CC BY-NC-SA 4.0 协议。'))
      .finally(() => setAgreeLoading(false));
  }, [getAssetUrl]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(getAssetUrl('/assets.json'));
        if (!res.ok) throw new Error();
        const data: ImageItem[] = await res.json();
        data.sort((a: ImageItem, b: ImageItem) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: '', type: 'error' }), 2600);
  };

  const openDownloadModal = (item: ImageItem) => {
    if (agreeLoading) return showToast('协议加载中，请稍候', 'error');
    setDownloadModal({ show: true, item });
  };

  const confirmDownload = () => {
    if (!downloadModal.item) return;
    const url = getAssetUrl(downloadModal.item.path);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${downloadModal.item.player}_${downloadModal.item.date}.png`;
    a.click();
    setDownloadModal({ show: false, item: null });
    showToast('下载开始！', 'success');
  };

  const handleMirrorSelect = (mirror: Mirror) => {
    setSelectedMirror(mirror);
    setMirrorModal(false);
    setCurrentPage(1);
    updateSearchParams({ mirror: mirror.tag, page: 1 });
    showToast(`已切换至：${mirror.tag}`, 'success');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'official': return <GlobeIcon className="w-3.5 h-3.5 text-foreground/60" />;
      case 'proxy': return <SparklesIcon className="w-3.5 h-3.5 text-foreground/60" />;
      case 'cdn': return <CloudIcon className="w-3.5 h-3.5 text-foreground/60" />;
      default: return <CloudIcon className="w-3.5 h-3.5 text-foreground/60" />;
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">玩家截图图册</h1>
          </div>

          <div className="mb-6 p-4 bg-card rounded-xl shadow-sm border border-foreground/8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <ServerIcon className="w-4 h-4 text-foreground/60" />
                <span>加速节点选择</span>
              </div>
              <button
                onClick={() => setMirrorModal(true)}
                className="w-full px-4 py-2.5 rounded-lg text-left bg-secondary text-foreground flex items-center justify-between"
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

          <div className="mb-8 p-4 md:p-5 bg-secondary border border-foreground/8 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2Icon className="w-5 h-5 text-foreground/60" />
              <h2 className="font-bold text-foreground">使用声明 & 版权协议</h2>
            </div>
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs font-medium text-red-600 dark:text-red-400">
              重要提醒：无论你是直接下载、右键另存为、F12 获取图片链接、或从 GitHub 仓库下载，均受到 CC BY-NC-SA 4.0 协议保护，请合规使用！
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-card animate-pulse">
                  <div className="aspect-video bg-secondary" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-3/4 bg-secondary rounded" />
                    <div className="h-3 w-1/2 bg-secondary rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircleIcon className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-foreground/80">图片加载失败，请切换镜像源重试</p>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">暂无玩家截图</p>
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <>
              <div className="mb-4 text-sm text-muted-foreground text-center">
                共 {images.length} 张截图 · 第 {currentPage} / {totalPages} 页
              </div>

              <PhotoProvider>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {currentImages.map((item) => (
                    <div
                      key={item.path}
                      className="group relative rounded-xl overflow-hidden bg-card border border-foreground/8 hover:border-foreground/12 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <PhotoView src={getAssetUrl(item.path)}>
                        <div className="aspect-video cursor-pointer overflow-hidden">
                          <img
                            src={getAssetUrl(item.path)}
                            alt={`${item.player} ${item.date}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </PhotoView>

                      <div className="p-3 space-y-1.5">
                        <h3 className="text-foreground font-medium text-sm truncate">
                          {item.date}
                        </h3>
                        <div className="flex flex-wrap gap-2 md:gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5" />
                            {item.player}
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {item.resolution}
                          </div>
                          <button
                            onClick={() => openDownloadModal(item)}
                            className="flex items-center gap-1 hover:text-foreground/60 transition-colors"
                          >
                            <DownloadIcon className="w-3.5 h-3.5" />
                            下载
                          </button>
                        </div>
                        {item.sha256 && (
                          <div className="text-xs text-muted-foreground truncate" title="SHA256">
                            SHA256: {item.sha256.slice(0, 32)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </PhotoProvider>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-1 sm:gap-2">
                  <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-foreground/8 disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => paginate(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        currentPage === p ? 'bg-foreground text-background' : 'bg-card border border-foreground/8'
                      }`}
                      >{p}</button>
                  ))}
                  <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-foreground/8 disabled:opacity-40">
                    <ChevronRight className="w-4 h-4" />
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
              className="text-foreground/60 hover:underline ml-1"
            >
              Wiki 查看上传方法
            </a>
          </div>
        </div>
      </main>

      {mirrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-foreground/8 flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">选择加速节点</h3>
              <button onClick={() => setMirrorModal(false)} className="p-1 rounded-full hover:bg-secondary">
                <XIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mirrors.map((m) => (
                  <button
                    key={m.tag}
                    onClick={() => handleMirrorSelect(m)}
                    className={`p-3 rounded-xl text-left flex flex-col gap-1 transition-all border ${
                      selectedMirror.tag === m.tag
                        ? 'border-foreground/15 bg-secondary'
                        : 'border-foreground/8 hover:border-foreground/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getTypeIcon(m.type)}
                      <span className="text-sm font-medium text-foreground">{m.tag}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{m.tip}</span>
                      {m.region && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          <FlagIcon className="w-3 h-3 inline mr-0.5" />{m.region}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-2xl shadow-xl">
            <div className="p-5 border-b border-foreground/8 flex justify-between items-center sticky top-0 bg-card">
              <h3 className="font-bold text-lg text-foreground">协议确认</h3>
              <button onClick={() => setDownloadModal({ show: false, item: null })} className="p-1 rounded-full hover:bg-secondary">
                <XIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4 text-sm text-foreground/80 font-medium">下载即代表同意以下协议：</div>
              <div className="text-xs text-muted-foreground whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 leading-relaxed bg-secondary/50 p-3 rounded-lg">
                {agreement}
              </div>
            </div>
            <div className="p-5 border-t border-foreground/8 flex gap-3 justify-end">
              <button onClick={() => setDownloadModal({ show: false, item: null })} className="px-4 py-2 rounded-lg text-sm bg-secondary">取消</button>
              <button onClick={confirmDownload} className="px-4 py-2 rounded-lg text-sm bg-foreground text-background">同意并下载</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle2Icon className="w-4 h-4" /> : <AlertCircleIcon className="w-4 h-4" />}
          {toast.text}
        </div>
      )}
    </>
  );
}

export default function GalleryClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
