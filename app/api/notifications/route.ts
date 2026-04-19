import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Notification, { NotificationType } from "@/models/Notification";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch latest 30 notifications
    const notifications = await Notification.find({ recipient: session.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("sender", "name username profilePicture")
      .populate("videoId", "caption thumbnailUrl")
      .lean();

    // --- GROUPING LOGIC ---
    // We group LIKES on the same video that happened recently.
    const grouped: any[] = [];
    const likeGroups: Record<string, any> = {};

    for (const notification of notifications) {
      if (notification.type === NotificationType.LIKE && notification.videoId) {
        const videoId = notification.videoId._id.toString();
        if (!likeGroups[videoId]) {
          likeGroups[videoId] = {
            ...notification,
            othersCount: 0,
            senders: [notification.sender],
          };
          grouped.push(likeGroups[videoId]);
        } else {
          likeGroups[videoId].othersCount += 1;
          // Keep track of up to 2 senders for better text like "User and 2 others"
          if (likeGroups[videoId].senders.length < 2) {
             likeGroups[videoId].senders.push(notification.sender);
          }
        }
      } else {
        grouped.push(notification);
      }
    }

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("[NOTIFICATIONS_GET] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId, markAll } = await req.json();
    await connectToDatabase();

    if (markAll) {
      await Notification.updateMany(
        { recipient: session.user.id, isRead: false },
        { isRead: true }
      );
    } else if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
