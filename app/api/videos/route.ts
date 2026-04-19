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

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log("👤 User:", user);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const videos = await Video.find({ isPublic: true })
      .populate("uploadedBy", "name username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const { mapVideoToPost } = await import("@/lib/post-utils");
    const posts = videos.map((video: any) => mapVideoToPost(video, user._id.toString())).filter(Boolean);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos", details: error },
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
    console.log("📤 API RECEIVED BODY:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.caption || !body.videoUrl || !body.type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Sanitize hashtags
    const hashtags = Array.isArray(body.hashtags)
      ? body.hashtags.map((h: string) => h.toLowerCase().trim().replace(/^#/, "")).filter(Boolean)
      : [];
    
    console.log("🏷️ PROCESSED HASHTAGS:", hashtags);

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new video with default values
    const isPortrait = body.aspectRatio === "9:16";
    const videoData = {
      ...body,
      controls: body.controls ?? true,
      uploadedBy: user._id,
      hashtags,
      transformation: {
        height: isPortrait ? 1920 : 1080,
        width: isPortrait ? 1080 : 1920,
        quality: body.transformation?.quality || 100,
      },
    };

    const newVideo = await Video.create(videoData);
    await newVideo.populate("uploadedBy", "name username profilePicture");

    // Trigger Notifications for all followers
    if (user.followers && user.followers.length > 0) {
      try {
        const { sendNotification } = await import("@/lib/notifications");
        const { NotificationType } = await import("@/models/Notification");

        // We use a loop for now; for massive accounts, this would need a background queue.
        for (const followerId of user.followers) {
          await sendNotification({
            recipientId: followerId.toString(),
            senderId: user._id.toString(),
            type: NotificationType.NEW_POST,
            videoId: newVideo._id.toString(),
          });
        }
      } catch (e) {
        console.error("Follower notification error:", e);
      }
    }

    return NextResponse.json(newVideo.toObject());
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
