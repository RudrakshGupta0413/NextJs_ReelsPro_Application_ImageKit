import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { mapVideoToPost } from "@/lib/post-utils";
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

        const userId = user._id.toString();

        // Find all posts (videos + images) that the user has liked
        const videos = await Video.find({ likes: user._id })
            .populate("uploadedBy", "name username profilePicture verified")
            .sort({ createdAt: -1 })
            .lean();

        const posts = videos
            .map((video: any) => mapVideoToPost(video, userId))
            .filter(Boolean);

        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (err) {
        console.error("Error fetching liked posts:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch liked posts" }), { status: 500 });
    }
}
