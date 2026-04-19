import { connectToDatabase } from "@/lib/db";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch last 5 messages for context
    const messages = await Message.find({ conversationId })
      .populate("sender", "name username")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Reverse to get chronological order [oldest -> newest]
    const sortedMessages = [...messages].reverse();

    // Format context for AI
    const context = sortedMessages
      .map((msg: any) => `${msg.sender.name}: ${msg.content}`)
      .join("\n");

    const prompt = `
      You are an AI assistant helping a user reply to messages in an Instagram-style chat. 
      Here is the recent conversation context:
      "${context}"

      Based on this, suggest 3 short, natural, and friendly replies that the user can send back.
      Keep the replies short (under 10 words) and suitable for a social media DM.
      Return ONLY a JSON array of 3 strings. 
      Example: ["Sounds good!", "I'll be there soon", "That is so cool!"]
    `;

    console.log("🤖 AI: Generating reply suggestions...");
    const result = await generateWithFallback(prompt);
    const text = result.response.text();

    // Basic JSON extraction (in case AI adds md fences)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON array");
    }

    const suggestions = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
