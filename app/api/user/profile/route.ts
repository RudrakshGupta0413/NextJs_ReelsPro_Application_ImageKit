import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  // Use .lean() to get plain object (bypasses toJSON which strips phoneNumber)
  // Then manually remove password
  const user = await User.findOne({ email: session?.user?.email })
    .select("-password")
    .lean();
  return new Response(JSON.stringify(user), { status: 200 });
}
