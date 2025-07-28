"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import FeedHeader from "./FeedHeader";
import InteractionPanel from "./InteractionPanel";
import VideoPlayer from "./VideoPlayer";

type PostType = {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  video: {
    videoUrl: string;
    thumbnail: string;
    // duration: string;
  };
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
};

export default function Feed({ posts: initialPosts }: { posts: PostType[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-border bg-card overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="rounded-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-foreground">
                        {post.user.name}
                      </span>
                      {post.user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.user.username} • {post.timestamp}
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
              onLike={() => handleLike(post.id)}
              onBookmark={() => handleBookmark(post.id)}
            />

            {/* Caption */}
            <div className="px-4 pb-4">
              <p className="text-foreground leading-relaxed">{post.caption}</p>
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}
