import FeedCard from "./FeedCard";
import FeedHeader from "./FeedHeader";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import type { PostType } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import FloatingChatBar from "@/components/chat/FloatingChatBar";
import FloatingTrendingTags from "@/components/feed/FloatingTrendingTags";

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

  // Import our standardized mapper
  const { mapVideoToPost } = await import("@/lib/post-utils");

  const posts = publicVideosRaw
    .map((video: any) => mapVideoToPost(video, userId))
    .filter(Boolean) as PostType[];

  const safePosts = JSON.parse(JSON.stringify(posts));

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <div className="max-w-7xl mx-auto px-4 flex justify-center lg:justify-start lg:pl-[20%]">
        {/* Main Feed — shifted slightly right on desktop */}
        <div className="w-full max-w-[540px]">
          <FeedCard feedposts={safePosts} />
        </div>

      </div>
      <FloatingChatBar />
      <FloatingTrendingTags />
    </div>
  );
}
