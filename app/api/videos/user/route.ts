import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    console.log("Fetching videos for user:", session.user.email);

    const videos = await Video.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .select("_id thumbnail duration views likes title");

    console.log("Found videos:", videos);

    const formatted = videos.map((video) => ({
      id: video._id.toString(),
      thumbnail: video.thumbnail,
      duration: video.duration,
      views: video.views || 0,
      likes: video.likes || 0,
      title: video.title,
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (err) {
    console.error("Error fetching user videos:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch videos" }), { status: 500 });
  }
}
