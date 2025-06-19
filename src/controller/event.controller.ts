import { Request, Response } from "express";
import {
  createEvent,
  deleteEventbyId,
  getEventById,
  getEvents,
  updateEvent,
} from "../services/event.service";
import { response } from "../utils/response";
import { HttpStatus } from "../utils/http-statuses";
import { validateEventData } from "../utils/validateSchema/validateEvent";
import { Categories } from "../models/category.model";
import { Events } from "../models/event.model";
import cloudinary from "../config/cloudinary";

export const getEventsController = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  const skip = (page - 1) * limit;

  const categoriesString = req?.query?.categories as string | "";
  const start = req?.query?.startDate as string | "";
  const end = req?.query?.endDate as string | "";

  const categories = categoriesString ? categoriesString.split(",") : [];
  const startDate = start ? start : "";
  const endDate = end ? end : "";

  try {
    const events = await getEvents(categories, startDate, endDate, limit, skip);
    response(res, HttpStatus.OK, {
      message: "your events",
      success: true,
      data: events,
    });
  } catch (error: any) {
    console.log("error in  fetch event controller");
    response(res, HttpStatus.BAD_REQUEST, {
      message: "Error in fetch  events",
      success: false,
      data: error.message,
    });
  }
};

export const getEventController = async (req: Request, res: Response) => {
  const eventId = req.params._id;
  try {
    const events = await getEventById(eventId);
    response(res, HttpStatus.OK, {
      message: "your event",
      success: true,
      data: events,
    });
  } catch (error: any) {
    console.log("error in  fetch event by id controller");
    response(res, HttpStatus.BAD_REQUEST, {
      message: "Error in fetch  event by id",
      success: false,
      data: error.message,
    });
  }
};

export const createEventController = async (req: Request, res: Response) => {
  const createdBy = (req as any).user;

  try {
    //for banner
    const file = req.file;
    if (!file) {
      return response(res, HttpStatus.FORBIDDEN, {
        message: "Banner is required",
        success: false,
        data: null,
      });
    }
    // Upload file to cloudinary
    let uploaded;
    try {
      uploaded = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "upload" },
            (err, result) => {
              if (err || !result) {
                return reject(err || new Error("Upload failed"));
              }
              resolve(result);
            }
          );
          stream.end(file.buffer);
        }
      );
    } catch (err) {
      console.error("Upload to Cloudinary failed:", err);
      return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
        message: "Failed to upload image",
        success: false,
        data: null,
      });
    }
    console.log(req.body);
    const validateEvent = await validateEventData.validate(req.body, {
      abortEarly: false,
    });
    const { title, description, location, categories } = validateEvent;
    console.log("categories", categories);
    const categoriesData = await Categories.find({
      _id: { $in: categories?.split(",") },
    });
    const newEvent = await createEvent(
      title,
      description,
      location,
      uploaded.secure_url, //bannerUrl from cloudinary
      categoriesData,
      createdBy
    );

    response(res, HttpStatus.CREATED, {
      message: "event created successfully....",
      success: true,
      data: newEvent,
    });
  } catch (error: any) {
    console.log("error in  create event controller");
    response(res, HttpStatus.BAD_REQUEST, {
      message: "Error in create event",
      success: false,
      data: error.errors || error.message,
    });
  }
};

//for delete event by owner
export const deleteEventController = async (req: Request, res: Response) => {
  const eventId = req.params._id;

  const userId = (req as any).user;
  console.log(eventId);
  console.log("login user id", userId);

  try {
    const event = await Events.findById(eventId);

    if (!event) {
      return response(res, HttpStatus.NOT_FOUND, {
        message: "Event  not found",
        success: false,
        data: null,
      });
    }
    console.log("event user id", event?.createdBy._id);
    if (event?.createdBy._id?.toString() !== userId) {
      return response(res, HttpStatus.FORBIDDEN, {
        message: "You are not allowed to delete this event",
        success: false,
        data: null,
      });
    }

    const deleteEvent = await deleteEventbyId(eventId);
    return response(res, HttpStatus.OK, {
      message: "event deleted successfully....",
      success: true,
      data: deleteEvent,
    });
  } catch (error: any) {
    response(res, HttpStatus.BAD_REQUEST, {
      message: "Error in delete event",
      success: false,
      data: error.errors || error.message,
    });
  }
};
export const updateEventController = async (req: Request, res: Response) => {
  const eventId = req.params._id;

  const userId = (req as any).user;

  try {
    const file = req.file;
    if (!file) {
      return response(res, HttpStatus.FORBIDDEN, {
        message: "Banner is required",
        success: false,
        data: null,
      });
    }
    // Upload file to cloudinary
    const uploaded = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_banners" },
          (err, result) => {
            if (err || !result) return reject(err);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      }
    );
    const validateEvent = await validateEventData.validate(req.body, {
      abortEarly: false,
    });
    const { title, description, location, categories } = validateEvent;
    const categoriesData = await Categories.find({
      _id: { $in: categories?.split(",") },
    });
    console.log("categories::", categoriesData);
    const event = await Events.findById(eventId);

    if (!event) {
      return response(res, HttpStatus.NOT_FOUND, {
        message: "Event  not found",
        success: false,
        data: null,
      });
    }
    if (event?.createdBy._id?.toString() !== userId) {
      return response(res, HttpStatus.FORBIDDEN, {
        message:
          "You are not allowed to update this event and only create user edit  event",
        success: false,
        data: null,
      });
    }
    const editedEvent = await updateEvent(
      eventId,
      title,
      description,
      location,
      uploaded.secure_url,
      categoriesData
    );
    return response(res, HttpStatus.OK, {
      message: "event update successfully....",
      success: true,
      data: editedEvent,
    });
  } catch (error: any) {
    response(res, HttpStatus.BAD_REQUEST, {
      message: "Error in update event",
      success: false,
      data: error.errors || error.message,
    });
  }
};
