import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return NextResponse.json({ error: "Target User ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser._id.toString() === targetUserId) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const isFollowing = (currentUser.following || []).some(
      (id: any) => id.toString() === targetUserId
    );

    if (isFollowing) {
      // Unfollow
      await Promise.all([
        User.findByIdAndUpdate(currentUser._id, {
          $pull: { following: targetUserId },
        }),
        User.findByIdAndUpdate(targetUserId, {
          $pull: { followers: currentUser._id },
        }),
      ]);
      return NextResponse.json({ following: false });
    } else {
      // Follow
      await Promise.all([
        User.findByIdAndUpdate(currentUser._id, {
          $addToSet: { following: targetUserId },
        }),
        User.findByIdAndUpdate(targetUserId, {
          $addToSet: { followers: currentUser._id },
        }),
      ]);
      return NextResponse.json({ following: true });
    }
  } catch (error: any) {
    console.error("Follow API Error:", error);
    return NextResponse.json({ error: "Failed to process follow action" }, { status: 500 });
  }
}
