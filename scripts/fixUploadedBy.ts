
import { connectToDatabase } from "@/lib/db"; // your existing DB util
import User from "@/models/User";
import Video from "@/models/Video";
import dotenv from "dotenv";

dotenv.config();

async function fixUploadedByReferences() {
  await connectToDatabase();

  const videosWithEmail = await Video.find({
    uploadedBy: { $type: "string" }, // filters bad entries
  });

  for (const video of videosWithEmail) {
    const user = await User.findOne({ email: video.uploadedBy });
    if (user) {
      video.uploadedBy = user._id;
      await video.save();
      console.log(`✅ Fixed video: ${video._id}`);
    } else {
      console.warn(`⚠️ No user found for email: ${video.uploadedBy}`);
    }
  }

  console.log("🎉 Finished fixing uploadedBy fields.");
  process.exit(0);
}

fixUploadedByReferences().catch(console.error);
