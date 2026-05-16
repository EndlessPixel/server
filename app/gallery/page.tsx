'use client';
import { useEffect, useState, useCallback } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
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
};

// ✅ 修复：jsdelivr 国内可用 + 路径正确
const mirrors: Mirror[] = [
  {
    tag: '官方源',
    baseUrl: 'https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '默认',
  },
  {
    tag: 'Cloudflare',
    baseUrl: 'https://gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '推荐',
  },
  {
    tag: 'Fastly',
    baseUrl: 'https://cdn.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '推荐',
  },
  {
    tag: 'Edgeone',
    baseUrl: 'https://edgeone.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '推荐',
  },
  {
    tag: 'Jasonzeng',
    baseUrl: 'https://gh.xmly.dev/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '大文件慎用',
  },
  {
    tag: '香港',
    baseUrl: 'https://hk.gh-proxy.org/https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main',
    tip: '香港节点',
  },
  // ✅ 修复 jsdelivr：国内 fastly 节点 + 路径正确
  {
    tag: 'JSdelivr-Fastly',
    baseUrl: 'https://fastly.jsdelivr.net/gh/EndlessPixel/EndlessPixel-Player-Image@main',
    tip: '国内稳',
  },
  {
    tag: 'JSdelivr-Gcore',
    baseUrl: 'https://gcore.jsdelivr.net/gh/EndlessPixel/EndlessPixel-Player-Image@main',
    tip: '备用',
  },
];

export default function GalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [agreement, setAgreement] = useState<string>('');
  const [agreeLoading, setAgreeLoading] = useState(true);
  const [selectedMirror, setSelectedMirror] = useState<Mirror>(mirrors[0]);

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  // 弹窗
  const [downloadModal, setDownloadModal] = useState<{
    show: boolean;
    item: ImageItem | null;
  }>({ show: false, item: null });

  const [toast, setToast] = useState<{
    show: boolean;
    text: string;
    type: 'success' | 'error';
  }>({ show: false, text: '', type: 'error' });

  // ✅ 统一 URL 拼接（修复 jsdelivr 路径）
  const getAssetUrl = useCallback((assetPath: string) => {
    // jsdelivr 不需要 raw 完整路径，直接拼文件
    if (selectedMirror.tag.startsWith('JSdelivr')) {
      return `${selectedMirror.baseUrl}${assetPath}`;
    }
    // 其他镜像：直接拼接
    return `${selectedMirror.baseUrl}${assetPath}`;
  }, [selectedMirror]);

  // 加载使用协议
  useEffect(() => {
    setAgreeLoading(true);
    fetch(getAssetUrl('/LICENSE'))
      .then((res) => {
        if (!res.ok) throw new Error('协议加载失败');
        return res.text();
      })
      .then((text) => {
        setAgreement(text);
      })
      .catch(() => {
        setAgreement('无法加载协议文本，请前往 GitHub 查看 CC BY-NC-SA 4.0 协议。');
      })
      .finally(() => {
        setAgreeLoading(false);
      });
  }, [getAssetUrl]);

  // 加载图片列表
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(getAssetUrl('/assets.json'));
        if (!res.ok) throw new Error('请求失败');
        const data: ImageItem[] = await res.json();
        // 按时间最新排序
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setImages(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
    setCurrentPage(1); // 切换镜像回到第一页
  }, [getAssetUrl]);

  // 分页计算
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const indexLast = currentPage * imagesPerPage;
  const indexFirst = indexLast - imagesPerPage;
  const currentImages = images.slice(indexFirst, indexLast);

  // 分页切换
  const paginate = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 提示框
  const showToast = (text: string, type: 'success' | 'error') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: '', type: 'error' }), 2600);
  };

  // 下载弹窗
  const openDownloadModal = (item: ImageItem) => {
    if (agreeLoading) {
      showToast('协议加载中，请稍候', 'error');
      return;
    }
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

  // 切换镜像
  const handleMirrorChange = (mirror: Mirror) => {
    setSelectedMirror(mirror);
    showToast(`已切换至：${mirror.tag}`, 'success');
  };

  // 智能分页按钮（适配多页数）
  const getPageNumbers = () => {
    const delta = 1;
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 md:py-12 px-3 sm:px-4 transition-colors">
        <div className="max-w-7xl mx-auto">
          {/* 标题 */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">玩家截图图册</h1>
          </div>

          {/* 镜像切换 */}
          <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <ServerIcon className="w-4 h-4 text-blue-500" />
                <span>镜像源选择</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mirrors.map((mirror) => (
                  <button
                    key={mirror.tag}
                    onClick={() => handleMirrorChange(mirror)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                      selectedMirror.tag === mirror.tag
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={mirror.tip}
                  >
                    {mirror.tag}
                    <span className="ml-1 text-[10px] opacity-70">({mirror.tip})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 使用声明 */}
          <div className="mb-8 p-4 md:p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-blue-800 dark:text-blue-300">使用声明 & 版权协议</h2>
            </div>
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs font-medium text-red-600 dark:text-red-400">
              重要提醒：无论你是直接下载、右键另存为、F12 获取图片链接、或从 GitHub 仓库下载，均受到 CC BY-NC-SA 4.0 协议保护，请合规使用！
            </div>
          </div>

          {/* 加载中 */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 animate-pulse">
                  <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 加载失败 */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircleIcon className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-slate-700 dark:text-slate-300">图片加载失败，请切换镜像源重试</p>
            </div>
          )}

          {/* 无图片 */}
          {!loading && !error && images.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-600 dark:text-slate-400">暂无玩家截图</p>
            </div>
          )}

          {/* 图片列表 */}
          {!loading && !error && images.length > 0 && (
            <>
              <div className="mb-4 text-sm text-slate-600 dark:text-slate-400 text-center">
                共 {images.length} 张截图 · 第 {currentPage} / {totalPages} 页
              </div>

              <PhotoProvider>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {currentImages.map((item) => (
                    <div
                      key={item.path}
                      className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* 图片预览 */}
                      <PhotoView src={getAssetUrl(item.path)}>
                        <div className="aspect-video cursor-pointer overflow-hidden">
                          <img
                            src={getAssetUrl(item.path)}
                            alt={`${item.player} ${item.date}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZiIvPjx0ZXh0IHg9IjUwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzkwMDUiPmxvYWRpbmcgZXJyb3I8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        </div>
                      </PhotoView>

                      {/* 信息 */}
                      <div className="p-3 space-y-1.5">
                        <h3 className="text-slate-900 dark:text-white font-medium text-sm truncate">
                          {item.date}
                        </h3>
                        <div className="flex flex-wrap gap-2 md:gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5" />
                            {item.player}
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {item.resolution}
                          </div>
                          <button
                            type="button"
                            onClick={() => openDownloadModal(item)}
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                          >
                            <DownloadIcon className="w-3.5 h-3.5" />
                            下载
                          </button>
                        </div>
                        {item.sha256 && (
                          <div className="text-xs text-slate-500 truncate" title="SHA256">
                            SHA256: {item.sha256.slice(0, 32)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </PhotoProvider>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map((page, i) =>
                    typeof page === 'number' ? (
                      <button
                        key={i}
                        onClick={() => paginate(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={i} className="w-9 h-9 flex items-center justify-center text-slate-400">
                        ...
                      </span>
                    )
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* 上传说明 */}
          <div className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
            想要上传自己的截图？前往
            <a
              href="https://wiki.epmc.top/dev/image_upload"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              Wiki 查看上传方法
            </a>
          </div>
        </div>
      </main>

      {/* 下载协议弹窗 */}
      {downloadModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">协议确认</h3>
              <button
                onClick={() => setDownloadModal({ show: false, item: null })}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                下载即代表同意以下协议：
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                {agreement}
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
              <button
                onClick={() => setDownloadModal({ show: false, item: null })}
                className="px-4 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={confirmDownload}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                同意并下载
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 提示框 */}
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2Icon className="w-4 h-4" />
          ) : (
            <AlertCircleIcon className="w-4 h-4" />
          )}
          {toast.text}
        </div>
      )}

      <Footer />
    </>
  );
}