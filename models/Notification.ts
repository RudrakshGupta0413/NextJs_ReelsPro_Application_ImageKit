import mongoose, { Schema, model, models } from "mongoose";

export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  SHARE = "SHARE",
  FOLLOW = "FOLLOW",
  MESSAGE = "MESSAGE",
  NEW_POST = "NEW_POST",
}

export interface INotification {
  _id?: string;
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: NotificationType;
  videoId?: mongoose.Types.ObjectId; // For like, comment, share, new_post
  conversationId?: mongoose.Types.ObjectId; // For messages
  content?: string; // e.g. snippet of comment or message
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    videoId: { type: Schema.Types.ObjectId, ref: "Video" },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    content: { type: String },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for performance when fetching unread counts or recent notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = models?.Notification || model<INotification>("Notification", notificationSchema);

export default Notification;
