import { PostType } from "@/app/feed/types";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  if (!body.text || body.text.trim().length === "") {
    return NextResponse.json(
      { error: "Comment text is required" },
      { status: 400 }
    );
  }

  const newComment = {
    user: {
      _id: user._id.toString(),
      name: user.name,
      username: `@${user.username?.toLowerCase().replace(/\s+/g, "") || "unknown"}`,
      profilePicture: user.profilePicture || "/default-avatar.jpg",
      verified: user.verified ?? false,
    },
    text: body.text.trim(),
    createdAt: new Date(),
  };


  const { id } = await context.params;

  const video = await Video.findByIdAndUpdate(
    id,
    { $push: { comments: newComment } },
    { new: true }
  ).populate("uploadedBy", "name username profilePicture verified");

  const u = video.uploadedBy;
  return NextResponse.json({
    _id: video._id.toString(),
    uploadedBy: {
      id: u._id?.toString() || "",
      name: u.name,
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
    caption: video.caption || "No caption.",
    likes: video.likes.length,
    comments: video.comments.length, // updated count ✔
    shares: video.shares ?? 0,
    timestamp: new Date(video.createdAt).toLocaleTimeString(),
    isLiked: video.likes.includes(user._id),
    isBookmarked: video.bookmarks?.includes(user._id) ?? false,
    hashtags: video.hashtags || [],

    commentsList: video.comments.map((c: any) => ({
      _id: c._id.toString(),
      name: c.user.name || "Unknown User",
      text: c.text,
      username: c.user.username,
      profilePicture: c.user.profilePicture || "/default-avatar.jpg",
      verified: c.user.verified ?? false,
      createdAt: new Date(c.createdAt).toLocaleTimeString(),
    }))
  } satisfies PostType);
}
