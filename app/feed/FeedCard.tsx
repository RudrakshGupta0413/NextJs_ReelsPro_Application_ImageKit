"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import FeedHeader from "./FeedHeader";
import InteractionPanel from "./InteractionPanel";
import VideoPlayer from "./VideoPlayer";

import type { PostType } from "./types";
import {
  shareVideo,
  toggleBookmark,
  toggleLike,
  addComment,
} from "@/lib/api-videoInteraction";
import { Button } from "@/components/ui/button";

interface FeedCardProps {
  feedposts: PostType[];
}

export default function FeedCard({ feedposts }: FeedCardProps) {
  const [posts, setPosts] = useState(feedposts);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    try {
      const updated = await toggleLike(postId);
      console.log("Like API response:", updated);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );

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
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, shares: post.shares + 1 } : post
      )
    );
    try {
      const updated = await shareVideo(postId);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (commentText.trim() === "") return;

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [
                ...(post.commentsList || []),
                {
                  _id: Math.random().toString(),
                  name: post.uploadedBy.name,
                  username: post.uploadedBy.username,
                  profilePicture: post.uploadedBy.profilePicture,
                  verified: post.uploadedBy.verified,
                  text: commentText.trim(),
                  createdAt: new Date().toLocaleTimeString(),
                },
              ],
            }
          : post
      )
    );
    
    try {
      const updated = await addComment(postId, commentText.trim());
      setCommentText(""); 
      console.log("Comment API response:", updated);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

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
                      src={
                        post.uploadedBy?.profilePicture || "/default-avatar.png"
                      }
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
              onComment={() =>
                setOpenDrawer(openDrawer === post._id ? null : post._id)
              }
            />
            {openDrawer === post._id && (
              <div className="h-[300px] overflow-y-auto bg-background p-3 transition-all">
                {/* Comment Input */}
                <div className="flex gap-2 sticky top-0 bg-background pb-2 mb-3">
                  <input
                    className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button onClick={() => handleComment(post._id)} size="sm">
                    Post
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {posts
                    .find((p) => p._id === post._id)
                    ?.commentsList?.map((c) => (
                      <div key={c._id} className="flex gap-2 items-start">
                        <img
                          src={c.profilePicture}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold flex gap-1 items-center">
                            {c.name}
                            {c.verified && (
                              <span className="text-blue-500 text-[10px]">
                                ✓
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-foreground">{c.text}</p>{" "}
                          {/* Comment text ✔ */}
                          <p className="text-[10px] text-muted-foreground">
                            {c.createdAt}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Caption */}
            <div className="p-4">
              <p className="text-foreground leading-relaxedmain-branch-protection">
                {post.caption}
              </p>
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}
