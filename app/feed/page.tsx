// feed/page.tsx
import FeedComponent from "./FeedComponent";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export default async function FeedPage() {
  await connectToDatabase();

  const publicVideosRaw = await Video.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "name profilePicture")
    .lean();

  const posts = publicVideosRaw.map((video: any, idx: number) => {
    const uploader = video.uploadedBy || {};
    return {
      id: idx + 1, // needed because your Feed component uses numeric `id`
      user: {
        name: uploader.name || "Unknown User",
        username: `@${uploader.name?.toLowerCase().replace(/\s+/g, "") || "unknown"}`,
        avatar: uploader.profilePicture || "/placeholder.svg",
        verified: true, // customize this as needed
      },
      video: {
        url: video.videoUrl,
        thumbnail: video.thumbnailUrl || "/placeholder.svg",
        duration: "0:30", // you can extract duration if available
      },
      caption: video.description || "No description provided.",
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      timestamp: new Date(video.createdAt).toLocaleTimeString(),
      isLiked: false,
      isBookmarked: false,
    };
  });

  return <FeedComponent posts={posts} />;
}
