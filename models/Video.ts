import mongoose, { model, models, Schema, Document } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IUserPublic {
  verified: boolean;
  _id: string;
  name: string;
  profilePicture: string;
  username: string;
}

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  user: IUserPublic;
  text: string;
  createdAt?: Date;
}

export interface IVideo {
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: "9:16" | "16:9";
  type: "video" | "image";
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  uploadedBy: mongoose.Types.ObjectId | IUserPublic;
  isPublic: boolean;
  likes?: string[];
  shares?: number;
  bookmarks?: string[];
  comments?: IComment[];
  createdAt?: Date;
}

export interface IVideoDoc extends IVideo, Document { }

const commentSchema = new Schema<IComment>(
  {
    user: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      profilePicture: { type: String, required: true },
      username: { type: String, required: true },
    },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const videoSchema = new Schema<IVideoDoc>(
  {
    caption: { type: String, required: true },
    aspectRatio: {
      type: String,
      enum: ["9:16", "16:9"],
      default: "9:16",
    },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    type: { type: String, enum: ["video", "image"], default: "video" },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Video = models?.Video || model<IVideoDoc>("Video", videoSchema);

export default Video;
