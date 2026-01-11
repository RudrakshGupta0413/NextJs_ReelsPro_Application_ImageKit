import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { type, value, otp } = await req.json();

    if (!type || !value || !otp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // const otpKey =
    //   type === "email"
    //     ? `otp:email:${value}`
    //     : `otp:phone:${value}`;

    // const storedOtp = await redis.get(otpKey);

    // if (!storedOtp || storedOtp !== otp) {
    //   return NextResponse.json(
    //     { error: "Invalid or expired OTP" },
    //     { status: 401 }
    //   );
    // }

    const normalizedValue =
      type === "email" ? value.toLowerCase().trim() : value.trim();

    const otpKey =
      type === "email"
        ? `otp:email:${normalizedValue}`
        : `otp:phone:${normalizedValue}`;

    const storedOtp = await redis.get(otpKey);

    console.log({
      otpKey,
      storedOtp,
      receivedOtp: otp,
    });

    if (!storedOtp || storedOtp !== otp.toString().trim()) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // OTP valid → delete it
    await redis.del(otpKey);

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ [type]: value });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "OTP verification failed" },
      { status: 500 }
    );
  }
}
