import { connectToDatabase } from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log("[MESSAGES_API] Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content } = await req.json();

    if (!conversationId || !content) {
      console.log("[MESSAGES_API] Missing data:", { conversationId, content });
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connectToDatabase();

    const newMessage = await Message.create({
      sender: new mongoose.Types.ObjectId(session.user.id),
      content,
      conversationId: new mongoose.Types.ObjectId(conversationId),
    });

    // Find the conversation to identify the recipient
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const recipientId = conversation.participants.find(
      (p: any) => p.toString() !== session.user.id
    );

    // Update conversation: last message, timestamp, and increment recipient's unread count
    const updatePath = `unreadCounts.${recipientId}`;
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      updatedAt: new Date(),
      $inc: { [updatePath]: 1 },
    }, { new: true });

    // Fetch sender info and full conversation for real-time updates
    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name username profilePicture");
    const updatedConversation = await Conversation.findById(conversationId)
      .populate("participants", "name username profilePicture")
      .populate({ path: "lastMessage", select: "content createdAt sender" });

    // Trigger Pusher events
    try {
      // 1. Thread update (for the active chat window)
      await pusherServer.trigger(`private-chat-${conversationId}`, "new-message", populatedMessage);

      // 2. Sidebar updates (for both participants to re-order and show previews/badges)
      conversation.participants.forEach((participantId: any) => {
        pusherServer.trigger(`user-${participantId}`, "conversation-update", updatedConversation);
      });

      // 3. Add to Notification history for the recipient
      try {
        const { sendNotification } = await import("@/lib/notifications");
        const { NotificationType } = await import("@/models/Notification");
        
        await sendNotification({
          recipientId: recipientId.toString(),
          senderId: session.user.id,
          type: NotificationType.MESSAGE,
          conversationId: conversationId,
          content: content.substring(0, 50),
        });
      } catch (e) {
        console.error("Notify error:", e);
      }
    } catch (pusherError) {
      console.error("[MESSAGES_API] Pusher error:", pusherError);
    }

    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error("[MESSAGES_API] General error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
