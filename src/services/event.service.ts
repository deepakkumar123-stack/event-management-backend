import { FilterQuery } from "mongoose";
import { Events } from "../models/event.model";
import { CategoryType } from "../types/category.type";
import { EventType } from "../types/event.type";
import { UserType } from "../types/user.type";

export const getEvents = async (
  categories: string[] = [],
  startDate: string,
  endDate: string,
  limit: number = 8,
  skip: number = 0
): Promise<EventType | {}> => {
  const validCategories = categories.filter((cat) => cat.length > 0);
  console.log(validCategories);
  const filter: FilterQuery<EventType> = {};

  if (validCategories.length > 0) {
    filter.categories = { $in: validCategories };
  }
  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }
  console.log(filter);
  try {
    const events = await Events.find(filter)
      .populate(["categories"])
      .skip(skip)
      .limit(limit);
    console.log(events, "njnnidsajid");
    if (!events) {
      console.log("Events not found");
      throw new Error(`Events not found`);
    }
    return events;
  } catch (error) {
    console.log("error occur in get events service");
    throw error;
  }
};

export const getEventById = async (eventId: string) => {
  try {
    const event = await Events.findById(eventId).populate(["categories"]);

    console.log(event, "njnnidsajid");
    if (!event) {
      console.log("Event not found");
      throw new Error(` not found`);
    }
    return event;
  } catch (error) {
    console.log("error occur in get event service");
    throw error;
  }
};

export const createEvent = async (
  title: string,
  description: string,
  location: string,
  bannerUrl: string,
  categories: CategoryType[],
  createdBy: UserType
): Promise<EventType> => {
  try {
    const newEvent = new Events({
      title,
      description,
      location,
      bannerUrl,
      categories: categories.map((cat) => cat._id),
      createdBy: createdBy,
    });

    // console.log(
    //   "Final category IDs:",
    //   categories.map((c) => c._id?.toString())
    // );
    // console.log("server user create id", createdBy);

    return await newEvent.save();
  } catch (error) {
    console.log("error occur in create event service");
    throw error;
  }
};

//for delete event
//@param eventId->string
//function is used to delete event by user who created

export const deleteEventbyId = async (eventId: string) => {
  try {
    const deleteEvent = await Events.findByIdAndDelete(eventId);
    if (!deleteEvent) {
      console.log(" Event with given ID is not exist");

      throw new Error(`Event with ID ${eventId} not found`);
    }
    return deleteEvent;
  } catch (error) {
    console.log("Failed to delete event with given ID ", error);
    throw new Error(`Failed to delete  event with ID ${eventId}`);
  }
};

//for update event

export const updateEvent = async (
  eventId: string,
  title: string,
  description: string,
  location: string,
  bannerUrl: string,
  categories: CategoryType[]
): Promise<EventType> => {
  try {
    const editEvent = await Events.findByIdAndUpdate(eventId, {
      title,
      description,
      location,
      bannerUrl,
      categories: categories.map((cat) => cat._id),
    });
    if (!editEvent) {
      console.log(" Event with given ID not found ");
      throw new Error(`Event with ID ${eventId} not found`);
    }
    return editEvent;
  } catch (error) {
    console.log("Failed to update event with given ID ", error);
    throw new Error(`Failed to update  event with ID ${eventId}`);
  }
};
