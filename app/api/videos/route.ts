/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
if (!user) {
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

    await connectToDatabase();
    const videos = await Video.find({ uploadedBy: user._id })
      .sort({ createdAt: -1 })
      .lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();

    // Validate required fields
    if (!body.title || typeof body.videoUrl !== "string") {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

     const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new video with default values
    const videoData = {
      ...body,
      controls: body.controls || true,
      uploadedBy: user._id,
      tranformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality || 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
