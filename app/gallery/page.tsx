'use client';
import { useEffect, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import 'react-photo-view/dist/react-photo-view.css';
import { DownloadIcon, ImageIcon, UserIcon } from 'lucide-react';

type ImageItem = {
    path: string;
    player: string;
    date: string;
    size: string;
};

export default function GalleryPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main/assets.json')
            .then(res => res.json())
            .then((data: ImageItem[]) => {
                setImages(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
                <div className="max-w-7xl mx-auto">
                    {/* 页面标题 */}
                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">玩家截图图册</h1>
                    </div>

                    {loading ? (
                        // 骨架屏
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-xl overflow-hidden bg-slate-800 animate-pulse">
                                    <div className="aspect-video bg-slate-700" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-4 w-3/4 bg-slate-700 rounded" />
                                        <div className="h-3 w-1/2 bg-slate-700 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <PhotoProvider>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {images.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <PhotoView src={item.path}>
                                            <div className="aspect-video cursor-pointer overflow-hidden">
                                                <img
                                                    src={item.path}
                                                    alt={item.date}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </PhotoView>

                                        <div className="p-3 space-y-1.5">
                                            <h3 className="text-slate-900 dark:text-white font-medium text-sm truncate">
                                                {item.date}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <UserIcon className="w-3.5 h-3.5" />
                                                    {item.player}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ImageIcon className="w-3.5 h-3.5" />
                                                    {item.size}
                                                </div>
                                                <a
                                                    href={item.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                                                >
                                                    <DownloadIcon className="w-3.5 h-3.5" />
                                                    下载
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PhotoProvider>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}