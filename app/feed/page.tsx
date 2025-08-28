import FeedComponent from "./FeedComponent";
import { connectToDatabase } from "@/lib/db";
import Video, { IUserPublic } from "@/models/Video";
import type { PostType } from "./types";

export default async function FeedPage() {
  await connectToDatabase();

  const publicVideosRaw = await Video.find({ isPublic: true })
    .populate("uploadedBy", "name username profilePicture")
    .sort({ createdAt: -1 })
    .lean();

  // console.log("publicVideosRaw", publicVideosRaw);

  const posts = publicVideosRaw.map((video: any) => {
    if (!video.uploadedBy) {
      console.error('Video with ID', video._id, 'has no uploadedBy field');
      return null;
    }
    const uploader = video.uploadedBy as IUserPublic;
    return {
      _id: video._id.toString(),
      user: {
        name: uploader.name || "Unknown User",
        username: `@${uploader.username?.toLowerCase().replace(/\s+/g, "") || "unknown"}`,
        profilePicture: uploader.profilePicture || "/default-avatar.jpg",
        verified: true, 
      },
      video: {
        videoUrl: video.videoUrl.replace(/\.(mp4|webm)$/, ""),
        thumbnail: video.thumbnailUrl || "",
        // duration: "0:30", // you can extract duration if available
      },
      caption: video.description || "No description provided.",
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      timestamp: new Date(video.createdAt).toLocaleTimeString(),
      isLiked: false,
      isBookmarked: false,
    };
  }).filter(Boolean) as PostType[];

  return <FeedComponent feedposts={posts} />;
}
