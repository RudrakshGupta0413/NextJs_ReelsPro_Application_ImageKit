"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import FeedHeader from "./FeedHeader";
import InteractionPanel from "./InteractionPanel";
import VideoPlayer from "./VideoPlayer";
import { IKImage } from "imagekitio-next";

import type { PostType } from "./types";
import {
  shareVideo,
  toggleBookmark,
  toggleLike,
  addComment,
} from "@/lib/api-videoInteraction";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/use-toast";

interface FeedCardProps {
  feedposts: PostType[];
}

export default function FeedCard({ feedposts }: FeedCardProps) {
  const [posts, setPosts] = useState(feedposts);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(feedposts.length === 10);
  const [loadingComments, setLoadingComments] = useState<string | null>(null);

  const fetchComments = async (postId: string) => {
    try {
      setLoadingComments(postId);
      const res = await fetch(`/api/videos/${postId}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      const fetchedComments = await res.json();

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, commentsList: fetchedComments } : post
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(null);
    }
  };

  const toggleDrawer = (postId: string) => {
    if (openDrawer === postId) {
      setOpenDrawer(null);
    } else {
      setOpenDrawer(postId);
      // Fetch if not already loaded
      const post = posts.find(p => p._id === postId);
      if (!post?.commentsList) {
        fetchComments(postId);
      }
    }
  };

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
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post))
      );
    } catch (error) {
      toast.error("Error toggling like");
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
      toast.error("Error toggling bookmark");
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
      toast.success("Video shared successfully!");
    } catch (error) {
      toast.error("Error sharing video");
      console.error("Error sharing video:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (commentText.trim() === "") return;

    // Optimistic UI Update
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
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...updated, commentsList: prev.find(p => p._id === postId)?.commentsList } : post))
      );
      // Refetch comments silently to get real IDs
      fetchComments(postId);
    } catch (err) {
      toast.error("Error adding comment");
      console.error("Error adding comment:", err);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/videos?page=${nextPage}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch more videos");
      const newPostsRaw: PostType[] = await res.json();

      if (newPostsRaw.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPostsRaw]);
        setPage(nextPage);
        if (newPostsRaw.length < 10) setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load more posts");
    } finally {
      setLoadingMore(false);
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
              </div>
            </div>

            {/* Media Content */}
            {post.type === "image" ? (
              <div
                className={`relative w-full bg-black overflow-hidden group cursor-pointer mx-auto ${post.video.aspectRatio === "9:16" ? "aspect-[9/16] max-h-[700px]" : "aspect-[16/9]"
                  }`}
              >
                <IKImage
                  path={post.video.videoUrl}
                  transformation={[{
                    height: post.video.aspectRatio === "9:16" ? "1920" : "1080",
                    width: post.video.aspectRatio === "9:16" ? "1080" : "1920"
                  }]}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                  alt={post.caption || "Post image"}
                />
              </div>
            ) : (
              <div
                className={`relative w-full bg-black overflow-hidden mx-auto ${post.video.aspectRatio === "9:16" ? "aspect-[9/16] max-h-[700px]" : "aspect-[16/9]"
                  }`}
              >
                <VideoPlayer
                  videoUrl={post.video.videoUrl}
                  thumbnail={post.video.thumbnail}
                />
              </div>
            )}

            {/* Interaction Panel */}
            <InteractionPanel
              post={post}
              onLike={() => handleLike(post._id)}
              onBookmark={() => handleBookmark(post._id)}
              onShare={() => handleShare(post._id)}
              onComment={() => toggleDrawer(post._id)}
            />
            {openDrawer === post._id && (
              <div className="h-[300px] overflow-y-auto bg-background p-3 transition-all relative">
                {/* Comment Input */}
                <div className="flex gap-2 sticky top-0 bg-background pb-2 mb-3 z-10">
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

                {/* Loading State */}
                {loadingComments === post._id && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Loading comments...
                  </div>
                )}

                {/* Comments List */}
                {!loadingComments && post.commentsList?.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                )}

                <div className="space-y-3">
                  {post.commentsList?.map((c) => (
                    <div key={c._id} className="flex gap-2 items-start">
                      <img
                        src={c.profilePicture}
                        alt={c.name}
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
                        <p className="text-sm text-foreground">{c.text}</p>
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
              <p className="text-foreground leading-relaxed main-branch-protection">
                {post.caption}
              </p>
            </div>
          </Card>
        ))}

        {hasMore && (
          <div className="flex justify-center mt-6 pb-8">
            <Button
              variant="outline"
              onClick={loadMorePosts}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-6 pb-8 text-sm text-muted-foreground">
            You have caught up with all the videos!
          </div>
        )}
      </main>
    </div>
  );
}
