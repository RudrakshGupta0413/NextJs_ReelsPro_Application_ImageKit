import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim();

        if (!query || query.length < 1) {
            return NextResponse.json([], { status: 200 });
        }

        await connectToDatabase();

        // Escape special regex characters to prevent injection
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const users = await User.find({
            $or: [
                { name: { $regex: escaped, $options: "i" } },
                { username: { $regex: escaped, $options: "i" } },
            ],
        })
            .select("_id name username profilePicture verified")
            .limit(10)
            .lean();

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to search users" },
            { status: 500 }
        );
    }
}
