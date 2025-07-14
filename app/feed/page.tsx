import VideoFeed from "@/components/VideoFeed";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export default async function FeedPage() {
  await connectToDatabase();
  const publicVideosRaw = await Video.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "name profilePicture")
    .lean();

const publicVideos = publicVideosRaw.map((video: any) => {
  const uploadedBy = video.uploadedBy;

  return {
    _id: video._id.toString(),
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    isPublic: video.isPublic,
    uploadedBy: uploadedBy
      ? {
          _id: uploadedBy._id?.toString?.() || "",
          name: uploadedBy.name || "Unknown User",
          profilePicture: uploadedBy.profilePicture || "",
        }
      : {
          _id: "",
          name: "Unknown User",
          profilePicture: "",
        },
    createdAt: video.createdAt?.toString?.() || "",
    updatedAt: video.updatedAt?.toString?.() || "",
  };
});

 return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Public Videos</h1>
      <VideoFeed videos={publicVideos} />
    </main>
  );

}
