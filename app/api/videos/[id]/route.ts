import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Await params since it's a Promise in Next.js 15+
        const { id: videoId } = await params;

        const video = await Video.findById(videoId);

        if (!video) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        // Check ownership
        // video.uploadedBy is an ObjectId, session.user.id is a string
        if (video.uploadedBy.toString() !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden: You do not have permission to delete this post." },
                { status: 403 }
            );
        }

        await Video.findByIdAndDelete(videoId);

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
