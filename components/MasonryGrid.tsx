"use client";

import { useState } from "react";
import { IKImage } from "imagekitio-next";
import { Heart, MessageCircle, Play } from "lucide-react";
import type { PostType } from "@/app/feed/types";
import QuickViewModal from "./QuickViewModal";

interface MasonryGridProps {
  posts: PostType[];
}

export default function MasonryGrid({ posts }: MasonryGridProps) {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  // Debug log to confirm data reached the component
  if (typeof window !== "undefined") {
    console.log("🎨 MasonryGrid rendered with posts:", posts?.length);
  }

  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <div
            key={post._id}
            className="relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 border border-slate-200 aspect-[4/5] shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setSelectedPost(post)}
          >
            {/* Media Thumbnail */}
            <IKImage
              path={post.video.thumbnail || post.video.videoUrl}
              alt={post.caption}
              transformation={[
                { height: 600, width: 400, quality: 80 }
              ]}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
              <div className="flex items-center text-white font-bold gap-1.5">
                <Heart className="w-5 h-5 fill-current" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center text-white font-bold gap-1.5">
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{post.comments}</span>
              </div>
              {post.type === "video" && (
                 <div className="absolute top-3 right-3 text-white bg-black/20 p-1.5 rounded-full">
                    <Play className="w-3 h-3 fill-current" />
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPost && (
        <QuickViewModal 
          post={selectedPost} 
          isOpen={!!selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
}
