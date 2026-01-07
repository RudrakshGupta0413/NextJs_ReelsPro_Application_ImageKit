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
  if (!user) return NextResponse.json({error: "User not found"}, {status: 404});
  
  const { id} = await context.params;
  const video = await Video.findById(id);
  if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

  const alreadyBookmarked = video.bookmarks?.some(
    (uid: any) => uid.toString() === user._id.toString()
  );

  const updateQuery = alreadyBookmarked
    ? { $pull: { bookmarks: user._id } }
    : { $addToSet: { bookmarks: user._id } };

  const updatedVideo = await Video.findByIdAndUpdate(id, updateQuery, { new: true }).populate("uploadedBy", "name username profilePicture verified");

  const u = updatedVideo?.uploadedBy;

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
    shares: updatedVideo.shares ?? 0,
    timestamp: new Date(updatedVideo.createdAt).toLocaleTimeString(),
    isLiked: false,
    isBookmarked: !alreadyBookmarked, // toggle state

    commentsList: video.comments.map((c: any) => ({
        _id: c._id.toString(),
        name: c.user.name || "Unknown User",
        text: c.text,
        username: c.user.username,
        profilePicture: c.user.profilePicture || "/default-avatar.jpg",
        verified: c.user.verified ?? false,
        createdAt: new Date(c.createdAt).toLocaleTimeString(),
      }) )
  });
}

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession({ req, ...authOptions });
//   if (!session)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   await connectToDatabase();
//   const user = await User.findOne({ email: session.user.email });

//   const video = await Video.findByIdAndUpdate(
//     params.id,
//     { $pull: { bookmarks: user._id } }, // pull removes the user ID from bookmarks array
//     { new: true }
//   );

//   return NextResponse.json(video, { status: 200 });
// }
