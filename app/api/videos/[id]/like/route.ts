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

  const { id } = await context.params;

  const video = await Video.findById(id);
  // const videoDoc = await Video.findByIdAndUpdate(
  //     id,
  //     { $addToSet: { likes: user._id } }, // addToSet prevents duplicates
  //     { new: true }
  // ).populate("uploadedBy", "name username profilePicture verified");

  if (!video)
    return NextResponse.json({ error: "Video not found" }, { status: 404 });

  // CHECK if user already liked
  const alreadyLiked = video.likes.some(
    (uid: any) => uid.toString() === user._id.toString()
  );

  // Toggle Query
  const updateQuery = alreadyLiked
    ? { $pull: { likes: user._id } }
    : { $addToSet: { likes: user._id } };

  const updatedVideo = await Video.findByIdAndUpdate(id, updateQuery, { new: true })
    .populate("uploadedBy", "name username profilePicture verified");

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
    shares: updatedVideo.shares ?? 0,
    timestamp: new Date(updatedVideo.createdAt).toLocaleTimeString(),
    isLiked: !alreadyLiked,
    isBookmarked: updatedVideo.bookmarks?.includes(user._id) ?? false,

    commentsList: video.comments.map((c: any) => ({
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


// Now we dont't need a separate DELETE method for unliking as we are toggling like status in POST


// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const session = await getServerSession({ req, ...authOptions });
//   if (!session)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   await connectToDatabase();
//   const user = await User.findOne({ email: session.user.email });
//   if (!user)
//     return NextResponse.json({ error: "User not found" }, { status: 404 });

//   const { id } = await context.params;

//   const videoDoc = await Video.findByIdAndUpdate(
//     id,
//     { $pull: { likes: user._id } }, // pull removes the user ID from likes array
//     { new: true }
//   ).populate("uploadedBy", "name username profilePicture verified");

//   if (!videoDoc)
//     return NextResponse.json({ error: "Video not found" }, { status: 404 });

//   const u = videoDoc.uploadedBy;

//   return NextResponse.json({
//     _id: videoDoc._id.toString(),
//     uploadedBy: {
//       name: u.name,
//       username: `@${u.username?.toLowerCase().replace(/\s+/g, "")}`,
//       profilePicture: u.profilePicture || "/default-avatar.jpg",
//       verified: u.verified ?? false,
//     },
//     video: {
//       videoUrl: videoDoc.videoUrl.replace(/\.(mp4|webm)$/, ""),
//       thumbnail: videoDoc.thumbnailUrl || "",
//     },
//     caption: videoDoc.description || "",
//     likes: videoDoc.likes.length, // REAL COUNT
//     comments: videoDoc.comments.length,
//     shares: videoDoc.shares ?? 0,
//     timestamp: new Date(videoDoc.createdAt).toLocaleTimeString(),
//     isLiked: false, // user just disliked it
//     isBookmarked: false,
//   });
// }
