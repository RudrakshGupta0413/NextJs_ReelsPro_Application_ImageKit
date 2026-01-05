import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string; cid: string } }
) {
    const session = await getServerSession({ req, ...authOptions });
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const video = await Video.findOneAndUpdate(
        { _id: params.id },
        { $pull: { comments: { _id: params.cid } } },
        { new: true }
    ).populate("uploadedBy", "name username profilePicture");

    return NextResponse.json(video);
}