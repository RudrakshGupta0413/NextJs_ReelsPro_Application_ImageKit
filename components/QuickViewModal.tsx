import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import InteractionPanel from "@/app/feed/InteractionPanel";
import VideoPlayer from "@/app/feed/VideoPlayer";
import { IKImage } from "imagekitio-next";
import { usePostActions } from "@/hooks/usePostActions";
import type { PostType } from "@/app/feed/types";

interface QuickViewModalProps {
  post: PostType;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ post: initialPost, isOpen, onClose }: QuickViewModalProps) {
  const {
    post,
    handleLike,
    handleBookmark,
    handleComment,
    fetchComments,
    commentText,
    setCommentText,
    isSubmitting,
  } = usePostActions(initialPost);

  const [mediaAspectRatio, setMediaAspectRatio] = useState<number>(1);
  const infoSideWidth = 420; // Fixed width for metadata side

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      
      // Initialize video aspect ratio if available
      if (post.type === "video" && post.video.aspectRatio) {
        const parts = post.video.aspectRatio.split(":").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
           setMediaAspectRatio(parts[0] / parts[1]);
        }
      }
    }
  }, [isOpen, post.type, post.video.aspectRatio, fetchComments]);

  const comments = post.commentsList || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-none w-auto max-w-[98vw] h-[92vh] !p-0 overflow-hidden flex flex-col md:flex-row gap-0 border border-white/10 bg-black shadow-[0_0_120px_rgba(0,0,0,1)] focus:outline-none rounded-2xl transition-all duration-500 ease-in-out !gap-0"
      >
        <DialogTitle className="sr-only">Post by {post.uploadedBy.name}</DialogTitle>
        
        {/* 1. Media Side (Left - Dynamic Width) */}
        <div 
           className="h-full bg-black flex items-center justify-center relative min-h-[40vh] md:min-h-0 overflow-hidden group/media border-r border-white/10 transition-all duration-500 ease-in-out"
           style={{ 
             aspectRatio: mediaAspectRatio,
             // Explicitly don't set a width here, let aspect-ratio grow based on modal height
             height: '100%'
           }}
        >
          {/* Cinematic Backdrop */}
          <div className="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none z-0">
            <IKImage 
              path={post.type === "video" ? (post.video.thumbnail || post.video.videoUrl) : post.video.videoUrl} 
              alt="Backdrop" 
              width={20} 
              height={20} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {post.type === "video" ? (
               <div className="w-full h-full flex items-center justify-center bg-transparent">
                  <VideoPlayer
                      videoUrl={post.video.videoUrl}
                      thumbnail={post.video.thumbnail}
                  />
               </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <IKImage
                  path={post.video.videoUrl}
                  alt={post.caption}
                  width={2000}
                  height={2000}
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-all duration-700 select-none"
                  loading="eager"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.naturalHeight > 0) {
                      setMediaAspectRatio(img.naturalWidth / img.naturalHeight);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. Info Side (Right - Fixed Width) */}
        <div 
          className="h-full flex-shrink-0 flex flex-col bg-slate-950 relative z-20 transition-all duration-500 ease-in-out"
          style={{ width: `${infoSideWidth}px` }}
        >
          
          {/* Header (Minimalist Branding) */}
          <div className="px-6 py-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-blue-500 rounded-full" />
              <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em]">VOXA • DISCOVERY</span>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="text-white/20 hover:text-white/90 hover:bg-white/5 transition-all rounded-full h-10 w-10" onClick={onClose}>
                 <X className="h-5 w-5" />
               </Button>
            </div>
          </div>

          {/* Scrollable Thread */}
          <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 scrollbar-thin scrollbar-thumb-white/10 transition-all">
            
            {/* Unified Author Section */}
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 shrink-0 ring-2 ring-white/10 ring-offset-4 ring-offset-slate-950">
                <IKImage
                   path={post.uploadedBy.profilePicture}
                   alt={post.uploadedBy.name}
                   width={100}
                   height={100}
                />
              </Avatar>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-black text-white tracking-tight">
                    {post.uploadedBy.name}
                  </span>
                  <span className="text-white/20">•</span>
                  <Button variant="link" className="p-0 h-auto text-blue-400 font-black hover:text-blue-300 transition-colors text-[10px] uppercase tracking-[0.2em]">
                    Follow
                  </Button>
                </div>
                <div className="text-[15px] text-white/80 leading-relaxed font-medium">
                  {post.caption}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-black text-blue-400 hover:text-blue-300 cursor-pointer bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 transition-all uppercase tracking-tighter"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Area */}
            <div className="space-y-10">
              {comments.length > 0 ? (
                <>
                  <div className="h-px bg-white/5 w-full" />
                  {comments.map((comment: any) => (
                    <div key={comment._id} className="flex gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Avatar className="h-9 w-9 shrink-0 ring-1 ring-white/10 border border-white/5">
                        <IKImage
                          path={comment.user.profilePicture || "/default-avatar.jpg"}
                          alt={comment.user.name}
                          width={100}
                          height={100}
                        />
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="text-sm">
                          <span className="font-bold text-white mr-2">{comment.user.username}</span>
                          <span className="text-white/50 leading-relaxed text-[13px]">{comment.text}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[8px] text-white/20 font-black uppercase tracking-widest">
                          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                          <button className="hover:text-white/40 transition-colors">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-5">
                  <MessageCircle className="h-16 w-16 mb-4" />
                  <p className="text-[11px] font-black uppercase tracking-[0.6em]">Ambient Thread</p>
                </div>
              )}
            </div>
          </div>

          {/* Interaction Zone (Pinned to Bottom) */}
          <div className="mt-auto bg-slate-900/80 backdrop-blur-3xl border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4">
              <InteractionPanel 
                post={post}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={() => {}}
                onComment={() => document.getElementById('comment-input')?.focus()}
              />
            </div>

            <div className="px-10 py-2 pb-1">
               <div className="text-[16px] font-black text-white tracking-tight">
                 {post.likes.toLocaleString()} Likes
               </div>
               <div className="text-[9px] uppercase tracking-[0.5em] text-white/30 mt-1 font-black">
                 {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
            </div>

            {/* Float Input */}
            <div className="p-7 pt-5 pb-10">
              <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-2 transition-all focus-within:border-white/20 focus-within:bg-white/[0.05]">
                <Textarea
                  id="comment-input"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent border-none focus-visible:ring-0 px-0 py-3 resize-none text-sm text-white/90 pr-10 min-h-[50px] max-h-[140px] scrollbar-none"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={!commentText.trim() || isSubmitting}
                  onClick={() => handleComment(commentText)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-transparent transition-all disabled:opacity-5"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
