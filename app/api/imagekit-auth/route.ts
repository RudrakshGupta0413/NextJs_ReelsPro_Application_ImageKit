/* eslint-disable @typescript-eslint/no-unused-vars */
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  });

  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    return NextResponse.json(
      { error: "Imagekit authentication failed" },
      { status: 500 }
    );
  }
}
