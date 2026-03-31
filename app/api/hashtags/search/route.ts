import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag")?.trim().toLowerCase().replace(/^#/, "");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!tag) {
      return NextResponse.json([], { status: 200 });
    }

    await connectToDatabase();

    const skip = (page - 1) * limit;

    const videos = await Video.find({
      isPublic: true,
      hashtags: tag,
    })
      .populate("uploadedBy", "name username profilePicture verified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const posts = videos
      .map((video: any) => {
        const u = video.uploadedBy;
        if (!u) return null;

        return {
          _id: video._id.toString(),
          uploadedBy: {
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
          isLiked: false,
          isBookmarked: false,
        };
      })
      .filter(Boolean);

    const total = await Video.countDocuments({ isPublic: true, hashtags: tag });

    return NextResponse.json({ posts, total, page, limit });
  } catch (error) {
    console.error("Hashtag search error:", error);
    return NextResponse.json(
      { error: "Failed to search by hashtag" },
      { status: 500 }
    );
  }
}
