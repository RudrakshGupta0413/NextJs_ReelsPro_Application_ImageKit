import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const videos = await Video.find({ uploadedBy: user._id })
      .populate("uploadedBy", "name username profilePicture")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = videos.map((video: any) => ({
      _id: video._id.toString(),
      title: video.title,
      description: video.description || "",
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      controls: video.controls,
      isPublic: video.isPublic,
      likes: video.likes || [],
      bookmarks: video.bookmarks || [],
      shares: video.shares || 0,
      comments: video.comments || [],
      uploadedBy: video.uploadedBy,
      createdAt: video.createdAt,
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (err) {
    console.error("Error fetching user videos:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch videos" }), { status: 500 });
  }
}
