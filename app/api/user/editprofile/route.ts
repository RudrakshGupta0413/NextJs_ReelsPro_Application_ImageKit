import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

interface UpdateData {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  profilePicture?: string;
  coverImage?: string;
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;
    const profilePicture = formData.get("profileImage") as File | null;
    const coverImage = formData.get("coverImage") as File | null;

    const updateData: UpdateData = {};

    if (name !== null) updateData.name = name;
    if (username !== null) updateData.username = username;
    if (bio !== null) updateData.bio = bio;
    if (location !== null) updateData.location = location;
    if (website !== null) updateData.website = website;


    // Upload profile image if provided
    if (profilePicture) {
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      const uploadRes = await cloudinary.uploader.upload(
        `data:${profilePicture.type};base64,${buffer.toString("base64")}`,
        { folder: "profile_images" }
      );
      updateData.profilePicture = uploadRes.secure_url;
    }

    // Upload cover image if provided
    if (coverImage) {
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const uploadRes = await cloudinary.uploader.upload(
        `data:${coverImage.type};base64,${buffer.toString("base64")}`,
        { folder: "cover_images" }
      );
      updateData.coverImage = uploadRes.secure_url;
    }

    // Update user in the mongoDB database

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user?.email },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
