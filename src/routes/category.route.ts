import express from "express";
import {
  createCategoryController,
  getCategoriesController,
} from "../controller/category.controller";
export const categoryRoute = express.Router();
categoryRoute.get("/", getCategoriesController);
categoryRoute.post("/", createCategoryController);
