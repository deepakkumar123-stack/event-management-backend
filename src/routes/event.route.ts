import express from "express";
import {
  createEventController,
  deleteEventController,
  getEventsController,
  updateEventController,
} from "../controller/event.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";

export const eventRouter = express.Router();

eventRouter.get("/", getEventsController);
eventRouter.post(
  "/",
  authMiddleware,
  upload.single("banner"),
  createEventController
);
eventRouter.delete("/:_id", authMiddleware, deleteEventController);
eventRouter.patch(
  "/:_id",
  authMiddleware,
  upload.single("banner"),
  updateEventController
);
