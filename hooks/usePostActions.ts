"use client";

import { useState } from "react";
import { 
  toggleLike as apiToggleLike, 
  toggleBookmark as apiToggleBookmark, 
  shareVideo as apiShareVideo, 
  addComment as apiAddComment 
} from "@/lib/api-videoInteraction";
import { toast } from "@/lib/use-toast";
import type { PostType } from "@/app/feed/types";

export function usePostActions(initialPost: PostType) {
  const [post, setPost] = useState<PostType>(initialPost);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    // Optimistic UI Update
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));

    try {
      const updated = await apiToggleLike(post._id);
      setPost(prev => ({ ...updated, commentsList: prev.commentsList }));
    } catch (error) {
      toast.error("Error toggling like");
      // Rollback
      setPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes + 1 : prev.likes - 1,
      }));
    }
  };

  const handleBookmark = async () => {
    // Optimistic UI Update
    setPost(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));

    try {
      const updated = await apiToggleBookmark(post._id);
      setPost(prev => ({ ...updated, commentsList: prev.commentsList }));
    } catch (error) {
      toast.error("Error toggling bookmark");
      setPost(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    }
  };

  const handleShare = async () => {
    try {
      const updated = await apiShareVideo(post._id);
      setPost(prev => ({ ...updated, commentsList: prev.commentsList }));
      toast.success("Video shared successfully!");
    } catch (error) {
      toast.error("Error sharing video");
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await fetch(`/api/videos/${post._id}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      const fetchedComments = await res.json();
      setPost(prev => ({ ...prev, commentsList: fetchedComments }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleComment = async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsSubmitting(true);
      const updated = await apiAddComment(post._id, text.trim());
      setPost(prev => ({ 
        ...updated, 
        commentsList: prev.commentsList 
          ? [...prev.commentsList, updated.commentsList?.[updated.commentsList.length - 1]].filter(Boolean)
          : [] 
      }));
      setCommentText("");
      // Refetch for actual data sync
      fetchComments();
    } catch (err) {
      toast.error("Error adding comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    post,
    setPost,
    handleLike,
    handleBookmark,
    handleShare,
    handleComment,
    fetchComments,
    loadingComments,
    commentText,
    setCommentText,
    isSubmitting,
  };
}
