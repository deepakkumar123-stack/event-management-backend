import { Request, Response } from "express";
import { createCategory, getCategories } from "../services/category.service";
import { response } from "../utils/response";
import { HttpStatus } from "../utils/http-statuses";

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();

    response(res, HttpStatus.OK, {
      message: "your categories",
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log("error occur in get categories controller");
    response(
      res,
      HttpStatus.BAD_REQUEST,
      {
        message: "Error in getting categories",
        success: false,
        data: null,
      },
      true
    );
  }
};
export const createCategoryController = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    response(
      res,
      HttpStatus.UNAUTHORIZED,
      {
        message: "name  is required",
        success: false,
        data: null,
      },
      true
    );
  }

  try {
    const newCategory = await createCategory(name);
    response(res, HttpStatus.CREATED, {
      message: "category created",
      success: true,
      data: newCategory,
    });
  } catch (error) {
    console.log("error in controller");
    response(
      res,
      HttpStatus.BAD_REQUEST,
      {
        message: "error in create category",
        success: false,
        data: error,
      },
      true
    );
  }
};
export const deleteCategory = (req: Request, res: Response) => {};
