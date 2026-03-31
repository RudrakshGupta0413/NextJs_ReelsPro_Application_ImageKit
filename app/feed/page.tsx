import FeedCard from "./FeedCard";
import FeedHeader from "./FeedHeader";
import TrendingHashtags from "./TrendingHashtags";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import type { PostType } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export default async function FeedPage() {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await User.findOne({ email: session.user.email })
    : null;
  const userId = user?._id.toString();

  // Fetch directly from database (initial 10 posts)
  const publicVideosRaw = await Video.find({ isPublic: true })
    .populate("uploadedBy", "name username profilePicture verified")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const posts = publicVideosRaw
    .map((video: any) => {
      const u = video.uploadedBy;
      if (!u) return null;

      return {
        _id: video._id.toString(),
        uploadedBy: {
          id: u._id.toString(),
          name: u.name || "Unknown User",
          username: `@${u.username?.toLowerCase().replace(/\s+/g, "") || "unknown"
            }`,
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
        timestamp: video.createdAt.toISOString(),
        isLiked: userId
          ? video.likes?.some((id: any) => id.toString() === userId) ?? false
          : false,
        isBookmarked: userId
          ? video.bookmarks?.some((id: any) => id.toString() === userId) ?? false
          : false,
      };
    })
    .filter(Boolean) as PostType[];

  const safePosts = JSON.parse(JSON.stringify(posts));

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <div className="max-w-7xl mx-auto px-4 flex justify-center gap-16">
        {/* Main Feed — centered */}
        <div className="w-full max-w-[540px]">
          <FeedCard feedposts={safePosts} />
        </div>

        {/* Sidebar — Trending Hashtags (right side, doesn't push feed off-center on lg) */}
        <aside className="hidden lg:block w-80 shrink-0 pt-6">
          <div className="sticky top-24">
            <TrendingHashtags />
          </div>
        </aside>
      </div>
    </div>
  );
}
