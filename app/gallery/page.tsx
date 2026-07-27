"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  filename: string;
  title: string;
  likes: number;
  liked: boolean;
  timestamp: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  const baseUrl = "https://minio.systeem32.top/endlesspixel-gallery";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          "https://minio.systeeem32.cn/images.json?t=" + Date.now(),
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // Load liked state from localStorage
        let savedLikes: Set<string>;
        try {
          const stored = localStorage.getItem("gallery-liked");
          savedLikes = stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
          savedLikes = new Set();
        }
        setLikedImages(savedLikes);

        const mapped: GalleryImage[] = data.map((item: any) => ({
          id: item.id || item.filename,
          filename: item.filename,
          title: item.title || item.filename?.replace(/\.[^.]+$/, "") || "Untitled",
          likes: item.likes || 0,
          liked: savedLikes.has(item.filename),
          timestamp: item.timestamp || item.created_at || new Date().toISOString(),
        }));
        setImages(mapped);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const toggleLike = (img: GalleryImage) => {
    const key = img.filename;
    setLikedImages((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      localStorage.setItem("gallery-liked", JSON.stringify([...next]));
      return next;
    });

    setImages((prev) =>
      prev.map((i) =>
        i.filename === img.filename
          ? {
              ...i,
              likes: i.liked ? i.likes - 1 : i.likes + 1,
              liked: !i.liked,
            }
          : i,
      ),
    );
  };

  const shareImage = async (img: GalleryImage) => {
    const url = `${baseUrl}/${img.filename}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: img.title,
          url: url,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {}
    }
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              玩家截图图册
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              浏览来自 EndlessPixel 社区玩家的精彩游戏截图
            </p>
          </motion.div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-secondary" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-secondary rounded" />
                    <div className="h-3 w-1/2 bg-secondary rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ImageIcon
                className="w-16 h-16 mx-auto text-muted-foreground/40 mb-6"
                aria-hidden="true"
              />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                暂无截图
              </h3>
              <p className="text-muted-foreground">
                还没有玩家上传截图，敬请期待！
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.article
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover-lift transition-all duration-300"
                  >
                    {/* Image */}
                    <button
                      onClick={() => setSelectedImage(img)}
                      className="relative aspect-[4/3] bg-secondary overflow-hidden cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                      aria-label={`查看 ${img.title}`}
                    >
                      <img
                        src={`${baseUrl}/${img.filename}`}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </button>

                    {/* Info */}
                    <div className="p-4">
                      <h3
                        className={cn(
                          "font-semibold text-foreground text-sm",
                          expandedDescriptions.has(img.id)
                            ? ""
                            : "line-clamp-1",
                        )}
                      >
                        {img.title}
                      </h3>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => toggleDescription(img.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                          aria-expanded={expandedDescriptions.has(img.id)}
                          aria-label={expandedDescriptions.has(img.id) ? "收起" : "展开"}
                        >
                          {expandedDescriptions.has(img.id) ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="flex items-center gap-3 ml-auto">
                          <button
                            onClick={() => toggleLike(img)}
                            className={cn(
                              "flex items-center gap-1 text-xs transition-all duration-200 hover-scale focus:outline-none",
                              likedImages.has(img.filename)
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                            aria-label={`${likedImages.has(img.filename) ? "取消" : ""}点赞`}
                          >
                            <Heart
                              className={cn(
                                "w-3.5 h-3.5",
                                likedImages.has(img.filename) ? "fill-current" : "",
                              )}
                            />
                            <span>{img.likes}</span>
                          </button>

                          <button
                            onClick={() => shareImage(img)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors hover-scale focus:outline-none"
                            aria-label="分享"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded description */}
                      <AnimatePresence>
                        {expandedDescriptions.has(img.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 pt-3 border-t border-foreground/5"
                          >
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {img.title}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              {new Date(img.timestamp).toLocaleDateString("zh-CN")}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="图片预览"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="关闭"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={`${baseUrl}/${selectedImage.filename}`}
              alt={selectedImage.title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
