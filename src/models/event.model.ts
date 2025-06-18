import mongoose, { Document, Model, Schema } from "mongoose";
import { EventType } from "../types/event.type";

const eventSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      require: true,
    },
    bannerUrl: {
      type: String,
      required: true,
    },
    // we want to add form of data to pass like array or object
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },

  { timestamps: true }
);

export const Events: Model<EventType> = mongoose.model<EventType>(
  "Events",
  eventSchema
);
