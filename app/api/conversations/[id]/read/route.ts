import { connectToDatabase } from "@/lib/db";
import Conversation from "@/models/Conversation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    await connectToDatabase();

    const updatePath = `unreadCounts.${session.user.id}`;
    
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [updatePath]: 0 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking as read:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
