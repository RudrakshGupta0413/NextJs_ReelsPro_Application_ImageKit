"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Hash, X } from "lucide-react";

interface TrendingTag {
  tag: string;
  count: number;
}

export default function FloatingTrendingTags() {
  const [trending, setTrending] = useState<TrendingTag[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch("/api/hashtags/trending");
      if (res.ok) {
        const data = await res.json();
        setTrending(data);
      }
    } catch (error) {
      console.error("Failed to fetch trending hashtags", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPanelOpen]);

  if (!loading && trending.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            className="absolute bottom-0 left-0 w-72 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden flex flex-col mb-0"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Trending Now</h3>
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-1.5 hover:bg-white/50 rounded-full transition-all text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                trending.map((item, index) => (
                  <motion.div
                    key={item.tag}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/explore/hashtag/${encodeURIComponent(item.tag)}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/30 transition-all border-b border-gray-50/30 last:border-0 group cursor-pointer"
                    >
                      <span className="text-xs font-bold text-blue-600/50 w-4">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          <Hash className="w-3.5 h-3.5 inline-block mr-0.5" />
                          {item.tag}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {item.count} {item.count === 1 ? "post" : "posts"}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(79,70,229,0.3)] transition-all border border-white/20 cursor-pointer ${isPanelOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="font-bold text-[14px] tracking-tight hover:cursor-pointer">Trending</span>
      </motion.button>
    </div>
  );
}
