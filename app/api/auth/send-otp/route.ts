import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/mailer";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(request: Request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return NextResponse.json(
        { message: "Type and value are required" },
        { status: 400 }
      );
    }

    if (!["email", "phone"].includes(type)) {
      return NextResponse.json({ error: "Invalid OTP type" }, { status: 400 });
    }

    await connectToDatabase();

    // check if user exists
    const user = await User.findOne({ [type]: value });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //Rate limiting: prevent spamming OTP requests
    const otpRequestKey = `otp_requests:${type}:${value}`;
    const requests = await redis.get(otpRequestKey);

    if (requests) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please try again later." },
        { status: 429 }
      );
    }

    const otp = generateOTP();

    // const otpKey =
    //   type === "email"
    //     ? `otp:email:${value}`
    //     : `otp:phone:${value}`;

    const normalizedValue =
      type === "email" ? value.toLowerCase().trim() : value.trim();

    const otpKey =
      type === "email"
        ? `otp:email:${normalizedValue}`
        : `otp:phone:${normalizedValue}`;

    // Store OTP in Redis with a 5-minute expiration
    await redis.set(otpKey, otp, { EX: 300 });

    // Set rate limit key with a 1-minute expiration
    await redis.set(otpRequestKey, "1", { EX: 60 });

    if (type === "email") {
      await sendOtpEmail(value, otp);
    } else {
      // DEV ONLY (Twilio later)
      console.log(`Send OTP ${otp} to phone number ${value}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
