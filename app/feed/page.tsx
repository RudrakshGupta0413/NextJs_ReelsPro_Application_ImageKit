import FeedCard from "./FeedCard";
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
          name: u.name || "Unknown User",
          username: `@${u.username?.toLowerCase().replace(/\s+/g, "") || "unknown"
            }`,
          profilePicture: u.profilePicture || "/default-avatar.jpg",
          verified: u.verified ?? false,
        },
        video: {
          videoUrl: video.videoUrl.replace(/\.(mp4|webm)$/, ""),
          thumbnail: video.thumbnailUrl || "",
        },
        caption: video.description || "No description provided.",
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
    })
    .filter(Boolean) as PostType[];

  const safePosts = JSON.parse(JSON.stringify(posts));
  return <FeedCard feedposts={safePosts} />;
}
