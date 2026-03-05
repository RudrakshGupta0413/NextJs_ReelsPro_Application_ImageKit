import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { mapVideoToPost } from "@/lib/post-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const session = await getServerSession(authOptions);
        const currentUser = session?.user?.email
            ? await User.findOne({ email: session.user.email })
            : null;
        const currentUserId = currentUser?._id?.toString();

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const videos = await Video.find({ uploadedBy: id, isPublic: true })
            .populate("uploadedBy", "name username profilePicture verified")
            .sort({ createdAt: -1 })
            .lean();

        const posts = videos
            .map((video: any) => mapVideoToPost(video, currentUserId))
            .filter(Boolean);

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching user videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}
