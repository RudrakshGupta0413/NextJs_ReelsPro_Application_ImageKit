import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const trending = await Video.aggregate([
      { $match: { isPublic: true, hashtags: { $exists: true, $ne: [] } } },
      { $unwind: "$hashtags" },
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, tag: "$_id", count: 1 } },
    ]);

    return NextResponse.json(trending);
  } catch (error) {
    console.error("Trending hashtags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending hashtags" },
      { status: 500 }
    );
  }
}
