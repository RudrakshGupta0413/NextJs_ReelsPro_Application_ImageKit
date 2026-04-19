import { pusherServer } from "./pusher";
import Notification, { NotificationType } from "@/models/Notification";
import { connectToDatabase } from "./db";

interface NotificationData {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  videoId?: string;
  conversationId?: string;
  content?: string;
}

export async function sendNotification(data: NotificationData) {
  try {
    await connectToDatabase();

    // 1. Save to Database
    const notification = await Notification.create({
      recipient: data.recipientId,
      sender: data.senderId,
      type: data.type,
      videoId: data.videoId,
      conversationId: data.conversationId,
      content: data.content,
    });

    // 2. Populate for Pusher (need sender info)
    const populated = await Notification.findById(notification._id)
      .populate("sender", "name username profilePicture")
      .populate("videoId", "caption thumbnailUrl");

    // 3. Trigger Pusher Event
    if (populated) {
      await pusherServer.trigger(
        `user-${data.recipientId}`,
        "new-notification",
        populated
      );
    }

    return populated;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return null;
  }
}
