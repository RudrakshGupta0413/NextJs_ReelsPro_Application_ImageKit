import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession({ req, ...authOptions });
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

  // Notification Logic
  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email });
    if (user && updatedVideo.uploadedBy._id.toString() !== user._id.toString()) {
      try {
        const { sendNotification } = await import("@/lib/notifications");
        const { NotificationType } = await import("@/models/Notification");
        
        await sendNotification({
          recipientId: updatedVideo.uploadedBy._id.toString(),
          senderId: user._id.toString(),
          type: NotificationType.SHARE,
          videoId: id,
        });
      } catch (e) {
        console.error("Notify error:", e);
      }
    }
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
    type: updatedVideo.type || "video",
    video: {
      videoUrl: updatedVideo.videoUrl,
      thumbnail: updatedVideo.thumbnailUrl || "",
      aspectRatio: updatedVideo.aspectRatio || "9:16",
    },
    caption: updatedVideo.caption || "No caption.",
    likes: updatedVideo.likes.length,
    comments: updatedVideo.comments.length,
    shares: updatedVideo.shares,
    timestamp: new Date(updatedVideo.createdAt).toLocaleTimeString(),
    isLiked: false,
    isBookmarked: false,

    commentsList: updatedVideo.comments.map((c: any) => ({
      _id: c._id.toString(),
      name: c.user.name || "Unknown User",
      text: c.text,
      username: c.user.username,
      profilePicture: c.user.profilePicture || "/default-avatar.jpg",
      verified: c.user.verified ?? false,
      createdAt: new Date(c.createdAt).toLocaleTimeString(),
    }))
  });

}
