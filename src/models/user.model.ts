import mongoose, { Document, Model, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const userSchema: Schema<UserType & Document> = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Users: Model<UserType> = mongoose.model<UserType>(
  "Users",
  userSchema
);
