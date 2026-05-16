'use client';
import { useEffect, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import 'react-photo-view/dist/react-photo-view.css';
import { DownloadIcon, ImageIcon, UserIcon, AlertCircleIcon, CheckCircle2Icon, XIcon, ServerIcon, ChevronLeft, ChevronRight } from 'lucide-react';

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
  url: string;
  tip: string;
};

const mirrors: Mirror[] = [
  { tag: '官方源', url: '', tip: '默认' },
  { tag: 'Cloudflare', url: 'https://gh-proxy.org/', tip: '推荐' },
  { tag: 'Fastly', url: 'https://cdn.gh-proxy.org/', tip: '推荐' },
  { tag: 'Edgeone', url: 'https://edgeone.gh-proxy.org/', tip: '推荐' },
  { tag: 'Jasonzeng', url: 'https://gh.xmly.dev/', tip: '大文件慎用' },
  { tag: '香港', url: 'https://hk.gh-proxy.org/', tip: '香港节点' },
];

export default function GalleryPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [agreement, setAgreement] = useState<string>('');
    const [agreeLoading, setAgreeLoading] = useState(true);
    const [selectedMirror, setSelectedMirror] = useState<Mirror>(mirrors[0]);

    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 9; // 每页显示9张图片

    const [downloadModal, setDownloadModal] = useState<{
        show: boolean;
        item: ImageItem | null;
    }>({ show: false, item: null });

    const [toast, setToast] = useState<{
        show: boolean;
        text: string;
        type: 'success' | 'error';
    }>({ show: false, text: '', type: 'error' });

    // ✅ 修复：官方源不拼接URL，避免空字符串导致请求异常
    const getFullUrl = (rawUrl: string): string => {
      return selectedMirror.tag === '官方源' ? rawUrl : selectedMirror.url + rawUrl;
    };

    useEffect(() => {
        fetch(getFullUrl('https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main/LICENSE'))
            .then(res => res.text())
            .then(text => {
                setAgreement(text);
                setAgreeLoading(false);
            })
            .catch(() => setAgreeLoading(false));
    }, [selectedMirror]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(getFullUrl('https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main/assets.json'));
                if (!res.ok) throw new Error('请求失败');
                let data: ImageItem[] = await res.json();
                
                // ✅ 核心：按 date 倒序排序（最新时间排在最前面）
                data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                setImages(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
        // 切换镜像时回到第一页
        setCurrentPage(1);
    }, [selectedMirror]);

    // ✅ 计算当前页需要显示的图片
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
    const totalPages = Math.ceil(images.length / imagesPerPage);

    // 切换页码
    const paginate = (pageNumber: number) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
      // 切换页面滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showToast = (text: string, type: 'success' | 'error') => {
        setToast({ show: true, text, type });
        setTimeout(() => setToast({ show: false, text: '', type: 'error' }), 2500);
    };

    const openDownloadModal = (item: ImageItem) => {
        if (agreeLoading) {
            showToast('协议加载中，请稍后再试', 'error');
            return;
        }
        setDownloadModal({ show: true, item });
    };

    const confirmDownload = () => {
        if (!downloadModal.item) return;
        const item = downloadModal.item;
        const downloadUrl = getFullUrl(item.path);
        
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${item.player}_${item.date}.png`;
        a.click();

        setDownloadModal({ show: false, item: null });
        showToast('下载成功！', 'success');
    };

    const handleMirrorChange = (mirror: Mirror) => {
      setSelectedMirror(mirror);
      showToast(`已切换至：${mirror.tag}`, 'success');
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">玩家截图图册</h1>
                    </div>

                    <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <ServerIcon className="w-4 h-4 text-blue-500" />
                          <span>镜像源选择：</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mirrors.map(mirror => (
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

                    <div className="mb-8 p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="font-bold text-blue-800 dark:text-blue-300">使用声明 & 版权协议</h2>
                        </div>
                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs font-medium text-red-600 dark:text-red-400">
                            重要提醒：无论你是直接从页面下载、右键另存为、F12 获取图片链接、或从 GitHub 仓库下载，均受到CC BY-NC-SA 4.0协议保护，请合规使用！
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse">
                                    <div className="aspect-video bg-slate-300 dark:bg-slate-700" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-4 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" />
                                        <div className="h-3 w-1/2 bg-slate-300 dark:bg-slate-700 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <AlertCircleIcon className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-slate-700 dark:text-slate-300">图片加载失败，请切换镜像源重试</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-600 dark:text-slate-400">暂无玩家截图</p>
                        </div>
                    ) : (
                        <>
                        {/* 图片总数 & 当前页码显示 */}
                        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                          共 {images.length} 张截图 · 第 {currentPage} / {totalPages} 页
                        </div>

                        <PhotoProvider>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {currentImages.map((item) => (
                                    <div key={item.path} className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <PhotoView src={getFullUrl(item.path)}>
                                            <div className="aspect-video cursor-pointer overflow-hidden">
                                                <img 
                                                  src={getFullUrl(item.path)} 
                                                  alt={`${item.player} - ${item.date}`} 
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                  loading="lazy"
                                                />
                                            </div>
                                        </PhotoView>

                                        <div className="p-3 space-y-1.5">
                                            <h3 className="text-slate-900 dark:white font-medium text-sm truncate">{item.date}</h3>
                                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                                <div className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" />{item.player}</div>
                                                <div className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" />{item.resolution} · {item.size}</div>
                                                <button type="button" onClick={() => openDownloadModal(item)} className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                                                    <DownloadIcon className="w-3.5 h-3.5" />下载
                                                </button>
                                            </div>
                                            {item.sha256 && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500" title="SHA256 校验值">
                                                    SHA256: {item.sha256.slice(0, 32)}...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PhotoProvider>

                        {/* ✅ 分页控制器 */}
                        {totalPages > 1 && (
                          <div className="mt-8 flex justify-center items-center gap-2">
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === number
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {number}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        </>
                    )}

                    <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                      想要自己上传图片？前往<a href="https://wiki.epmc.top/dev/image_upload" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Wiki</a>查看上传图片的方法
                    </div>
                </div>
            </main>

            {downloadModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">协议确认</h3>
                            <button onClick={() => setDownloadModal({ show: false, item: null })} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <XIcon className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-5">
                            <div className="mb-4 text-sm text-slate-700 dark:text-slate-300 font-medium">点击按钮下载需遵守以下协议：</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-[75vh] overflow-y-auto pr-2 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                                {agreement}
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
                            <button onClick={() => setDownloadModal({ show: false, item: null })} className="px-4 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">取消</button>
                            <button onClick={confirmDownload} className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">同意并下载</button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
                    {toast.type === 'success' ? <CheckCircle2Icon className="w-4 h-4" /> : <AlertCircleIcon className="w-4 h-4" />}
                    {toast.text}
                </div>
            )}

            <Footer />
        </>
    );
}