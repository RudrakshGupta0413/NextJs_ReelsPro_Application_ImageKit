import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const video = await Video.findByIdAndUpdate(
    params.id,
    { $inc: { shares: 1 } }, // increment shares by 1
    { new: true }
  );
  return NextResponse.json(video, { status: 200 });
}
