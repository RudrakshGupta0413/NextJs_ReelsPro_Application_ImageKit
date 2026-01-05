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

  const video = await Video.findByIdAndUpdate(
    params.id,
    { $addToSet: { bookmarks: user._id } }, // addToSet prevents duplicates
    { new: true }
  ).populate("uploadedBy", "name username profilePicture");

  return NextResponse.json(video, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });

  const video = await Video.findByIdAndUpdate(
    params.id,
    { $pull: { bookmarks: user._id } }, // pull removes the user ID from bookmarks array
    { new: true }
  );

  return NextResponse.json(video, { status: 200 });
}
