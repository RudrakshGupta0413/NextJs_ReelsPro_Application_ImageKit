import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  name: string;
  profilePicture?: string;
  coverImage?: string;  
  bio?: string;
  website?: string;
  location?: string;
  verified?: boolean;
  followers?: number;
  following?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, sparse: true },
    password: { type: String, required: true, sparse: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    profilePicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    followers: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    following: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },  
  {
    timestamps: true,
  }
);

// hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// remoove password from API responses
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
