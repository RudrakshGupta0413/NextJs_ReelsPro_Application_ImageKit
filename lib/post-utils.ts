import type { PostType } from "@/app/feed/types";

/**
 * Standardized mapper: converts a raw Mongoose video document (lean)
 * into a PostType object suitable for FeedCard rendering.
 *
 * @param video  - lean() video document with uploadedBy populated
 * @param userId - current user's _id as string (for isLiked / isBookmarked)
 */
export function mapVideoToPost(video: any, userId?: string): PostType | null {
    const u = video.uploadedBy;
    if (!u) return null;

    return {
        _id: video._id.toString(),
        uploadedBy: {
            id: u._id?.toString() || "",
            name: u.name || "Unknown User",
            username: `@${u.username?.toLowerCase().replace(/\s+/g, "") || "unknown"}`,
            profilePicture: u.profilePicture || "/default-avatar.jpg",
            verified: u.verified ?? false,
        },
        type: video.type || "video",
        video: {
            videoUrl: video.videoUrl,
            thumbnail: video.thumbnailUrl || "",
            aspectRatio: video.aspectRatio || "9:16",
        },
        caption: video.caption || "No caption provided.",
        hashtags: video.hashtags || [],
        likes: video.likes?.length ?? 0,
        comments: video.comments?.length ?? 0,
        shares: video.shares ?? 0,
        timestamp: new Date(video.createdAt).toLocaleTimeString(),
        isLiked: userId
            ? video.likes?.some((id: any) => id.toString() === userId) ?? false
            : false,
        isBookmarked: userId
            ? video.bookmarks?.some((id: any) => id.toString() === userId) ?? false
            : false,
    };
}
