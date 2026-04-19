import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { socket_id, channel_name } = await req.json();

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        username: session.user.username,
        profilePicture: session.user.profilePicture,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new Response("Internal Error", { status: 500 });
  }
}
