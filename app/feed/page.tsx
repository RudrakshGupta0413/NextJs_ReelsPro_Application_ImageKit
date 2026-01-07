import FeedComponent from "./FeedComponent";
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

  const publicVideosRaw = await Video.find({ isPublic: true })
    .populate("uploadedBy", "name username profilePicture verified")
    .sort({ createdAt: -1 })
    .lean();

  // console.log("publicVideosRaw", publicVideosRaw);

  const posts = publicVideosRaw
    .map((video: any) => {
      // if (!video.uploadedBy) {
      //   console.error('Video with ID', video._id, 'has no uploadedBy field');
      //   return null;
      // }
      // const uploader = video.uploadedBy as IUserPublic;
      // return {
      //   _id: video._id.toString(),
      //   uploadedBy: uploader,
      //   user: {
      //     name: uploader.name || "Unknown User",
      //     username: `@${uploader.username?.toLowerCase().replace(/\s+/g, "") || "unknown"}`,
      //     profilePicture: uploader.profilePicture || "/default-avatar.jpg",
      //     verified: uploader.verified || false,
      //   },
      const u = video.uploadedBy;
      if (!u) return null;

      return {
        _id: video._id.toString(),
        uploadedBy: {
          // _id: u._id.toString(),
          name: u.name || "Unknown User",
          username: `@${
            u.username?.toLowerCase().replace(/\s+/g, "") || "unknown"
          }`,
          profilePicture: u.profilePicture || "/default-avatar.jpg",
          verified: u.verified ?? false,
        },
        video: {
          videoUrl: video.videoUrl.replace(/\.(mp4|webm)$/, ""),
          thumbnail: video.thumbnailUrl || "",
          // duration: "0:30", // you can extract duration if available
        },
        caption: video.description || "No description provided.",
        likes: video.likes.length ?? 0,
        comments: video.comments?.length ?? 0,
        shares: video.shares ?? 0,
        timestamp: new Date(video.createdAt).toLocaleTimeString(),
        isLiked: userId
          ? video.likes.some((id: any) => id.toString() === userId)
          : false,
        isBookmarked: false,
        commentsList: video.comments.map((c: any) => ({
          _id: c._id.toString(),
          name: c.user?.name || "Unknown User",
          text: c.text,
          username: `@${
            c.user?.username?.toLowerCase().replace(/\s+/g, "") || "unknown"
          }`,
          profilePicture: c.user?.profilePicture || "/default-avatar.jpg",
          verified: c.user?.verified ?? false,
          createdAt: new Date(c.createdAt).toLocaleTimeString(),
        })),
      };
    })
    .filter(Boolean) as PostType[];

  const safePosts = JSON.parse(JSON.stringify(posts));
  return <FeedComponent feedposts={safePosts} />;
}
