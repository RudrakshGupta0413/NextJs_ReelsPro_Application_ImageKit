import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  if (!body.text || body.text.trim().length === "") {
    return NextResponse.json(
      { error: "Comment text is required" },
      { status: 400 }
    );
  }

  const newComment = {
    user: user._id,
    text: body.text,
    createdAt: new Date(),
  };

  const video = await Video.findByIdAndUpdate(
    params.id,
    { $push: { comments: newComment } },
    { new: true }
  ).populate("uploadedBy", "name username profilePicture");
  return NextResponse.json(video, { status: 200 });
}
