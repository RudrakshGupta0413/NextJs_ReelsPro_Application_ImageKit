import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { fullName, userName, email, password } = await request.json();

    if (!fullName ||!userName || !email || !password) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already exists",
        },
        { status: 400 }
      );
    }

    const existingUsername = await User.find({ username: userName });
    if (existingUsername.length > 0) {
      return NextResponse.json(
        {
          error: "Username already exists",
        },
        { status: 400 }
      );
    }

    await User.create({ name: fullName, username: userName, email, password });
    return NextResponse.json(
      {
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error); 
    return NextResponse.json(
      {
        error: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
