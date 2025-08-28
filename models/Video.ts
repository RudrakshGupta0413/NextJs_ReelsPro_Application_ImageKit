import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;


export interface IUserPublic {
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
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  uploadedBy: string | IUserPublic;
  isPublic: boolean;
  likes?: string[];
  shares?: number;
  bookmarks?: string[];
  comments?: IComment[];
  createdAt?: Date;
}

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

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    isPublic: { type: Boolean, default: true },
    likes: [{ type: String, ref: "User" }],
    bookmarks: [{ type: String, ref: "User" }],
    shares: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
