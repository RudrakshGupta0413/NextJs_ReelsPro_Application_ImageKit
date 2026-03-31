import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import MasonryGrid from "@/components/MasonryGrid";
import type { PostType } from "@/app/feed/types";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";

interface HashtagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function HashtagPage({ params }: HashtagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).toLowerCase();

  console.log(`🔍 Fetching data for hashtag: ${decodedTag}`);

  await connectToDatabase();

  const videos = await Video.find({
    isPublic: true,
    hashtags: decodedTag,
  })
    .populate("uploadedBy", "name username profilePicture verified")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const totalPosts = await Video.countDocuments({
    isPublic: true,
    hashtags: decodedTag,
  });

  const posts = videos
    .map((video: any) => {
      const u = video.uploadedBy;
      if (!u) {
        console.log(`🏷️ Hashtag Page Debug: Video ${video._id} missing uploadedBy!`);
        return null;
      }

      return {
        _id: video._id.toString(),
        uploadedBy: {
          id: u._id.toString(),
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
        timestamp: video.createdAt.toISOString(),
        isLiked: false,
        isBookmarked: false,
      };
    })
    .filter(Boolean) as PostType[];

  console.log(`✅ Successfully processed ${posts.length} posts for hashtag: ${decodedTag}`);

  const safePosts = JSON.parse(JSON.stringify(posts));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/feed"
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
            >
              <ArrowLeft className="w-5 h-5 mx-auto" />
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-1 text-foreground">
                <Hash className="w-5 h-5 text-blue-500" />
                {decodedTag}
              </h1>
              <p className="text-sm text-muted-foreground">
                {totalPosts} {totalPosts === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {posts.length > 0 ? (
          <MasonryGrid posts={safePosts} />
        ) : (
          <div className="text-center py-16">
            <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">
              No posts found for #{decodedTag}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to post with this hashtag!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
