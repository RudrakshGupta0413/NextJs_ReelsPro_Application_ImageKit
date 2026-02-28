import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        // We don't strictly need auth to view comments on public videos,
        // though adding it is an option. For now, matching the public feed visibility.

        const { id } = await context.params;
        const video = await Video.findById(id).lean() as any;

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // Map comments to the structure FeedCard expects
        const commentsList = (video.comments || []).map((c: any) => ({
            _id: c._id?.toString() || Math.random().toString(),
            name: c.user?.name || "Unknown User",
            text: c.text,
            username: `@${c.user?.username?.toLowerCase().replace(/\s+/g, "") || "unknown"
                }`,
            profilePicture: c.user?.profilePicture || "/default-avatar.jpg",
            verified: c.user?.verified ?? false,
            createdAt: new Date(c.createdAt).toLocaleTimeString(),
        }));

        // Sort by newest first (optional, but good UX)
        commentsList.reverse();

        return NextResponse.json(commentsList, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}
