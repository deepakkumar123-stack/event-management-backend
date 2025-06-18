import mongoose, { Document, Model, Schema } from "mongoose";

import { CategoryType } from "../types/category.type";

const categorySchema: Schema<CategoryType & Document> = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Categories: Model<CategoryType> = mongoose.model<CategoryType>(
  "Categories",
  categorySchema
);
