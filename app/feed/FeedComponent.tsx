"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import FeedHeader from "./FeedHeader";
import InteractionPanel from "./InteractionPanel";
import VideoPlayer from "./VideoPlayer";

import type { PostType } from "./types";
import { shareVideo, toggleBookmark, toggleLike } from "@/lib/api-videoInteraction";

interface FeedComponentProps {
  feedposts: PostType[];
}

export default function FeedComponent({ feedposts }: FeedComponentProps) {
  const [posts, setPosts] = useState(feedposts);

  const handleLike = async (postId: string) => {
    try {
      const updated = await toggleLike(postId);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async(postId: string) => {
    try {
      const updated = await toggleBookmark(postId);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const updated = await shareVideo(postId);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  }

  const handleComment = () => {
    // Implement comment functionality here
  }

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.map((post) => (
          <Card
            key={post._id}
            className="border-border bg-card overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <img
                      src={post.uploadedBy?.profilePicture || "/default-avatar.png"}
                      alt={post.uploadedBy?.name || "User Avatar"}
                      className="rounded-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-foreground">
                        {post.uploadedBy?.name || "Unknown User"}
                      </span>
                      {post.uploadedBy?.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.uploadedBy?.username} • {post.timestamp}
                    </p>
                  </div>
                </div>
                {/* <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            {/* Video Player */}
            <VideoPlayer
              videoUrl={post.video.videoUrl}
              thumbnail={post.video.thumbnail}
              // duration={post.video.duration}
            />

            {/* Interaction Panel */}
            <InteractionPanel
              post={post}
              onLike={() => handleLike(post._id)}
              onBookmark={() => handleBookmark(post._id)}
              onShare={() => handleShare(post._id)}
              onComment={() => handleComment()}
            />

            {/* Caption */}
            <div className="p-4">
              <p className="text-foreground leading-relaxed">{post.caption}</p>
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}
