import { Categories } from "../models/category.model";
import { CategoryType } from "../types/category.type";

export const getCategories = async (): Promise<CategoryType[] | undefined> => {
  try {
    const categories = await Categories.find();
    return categories;
  } catch (error) {
    console.log("error occur in get categories", error);
    throw error;
  }
};

export const createCategory = async (name: string): Promise<CategoryType> => {
  try {
    const newCategory = new Categories({ name });
    return await newCategory.save();
  } catch (error) {
    console.log("error occur in create category", error);
    throw error;
  }
};

// export const deleteCategorybyId = () => {};
