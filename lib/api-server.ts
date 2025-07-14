import { connectToDatabase } from "./db";
import Video from "@/models/Video";

export async function getUserVideos(userId: string) {
  await connectToDatabase();
  return Video.find({ uploadedBy: userId }).lean();
}
