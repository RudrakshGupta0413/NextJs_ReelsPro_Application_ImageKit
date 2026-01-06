import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await context.params;

  const updatedVideo = await Video.findByIdAndUpdate(
    id,
    { $inc: { shares: 1 } }, // increment shares by 1
    { new: true }
  ).populate("uploadedBy", "name username profilePicture verified");

  if (!updatedVideo) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const u = updatedVideo.uploadedBy;

   return NextResponse.json({
    _id: updatedVideo._id.toString(),
    uploadedBy: {
      name: u.name,
      username: `@${u.username?.toLowerCase().replace(/\s+/g, "") || "unknown"}`,
      profilePicture: u.profilePicture || "/default-avatar.jpg",
      verified: u.verified ?? false,
    },
    video: {
      videoUrl: updatedVideo.videoUrl.replace(/\.(mp4|webm)$/, ""),
      thumbnail: updatedVideo.thumbnailUrl || "",
    },
    caption: updatedVideo.description || "",
    likes: updatedVideo.likes.length,
    comments: updatedVideo.comments.length,
    shares: updatedVideo.shares,  // REAL incremented count
    timestamp: new Date(updatedVideo.createdAt).toLocaleTimeString(),
    isLiked: false,
    isBookmarked: false,
  });

}
