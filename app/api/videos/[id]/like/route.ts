import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, context: { params:Promise<{ id: string }>}) {
    const session = await getServerSession({req, ...authOptions});
    if (!session) return NextResponse.json({ error: "Unauthorized" }, {status: 401});

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await context.params;

    const video = await Video.findByIdAndUpdate(
        id,
        { $addToSet: { likes: user._id } }, // addToSet prevents duplicates
        { new: true }
    ).populate("uploadedBy", "name username profilePicture");

    return NextResponse.json(video, { status: 200 });
}


export async function DELETE(req: NextRequest, context: { params:Promise<{ id: string }>}) {
    const session = await getServerSession({req, ...authOptions});
    if (!session) return NextResponse.json({ error: "Unauthorized" }, {status: 401});

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

     const { id } = await context.params;

    const video = await Video.findByIdAndUpdate(
        id,
        { $pull: { likes: user._id } }, // pull removes the user ID from likes array
        { new: true }
    );

    return NextResponse.json(video, { status: 200 });
}