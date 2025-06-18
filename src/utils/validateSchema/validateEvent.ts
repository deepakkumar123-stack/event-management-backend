import * as Yup from "yup";
export const validateEventData = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title must be less than 20 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  location: Yup.string().required("Location is required"),
  categories: Yup.array()
    .of(Yup.string().required("Each category ID must be a string"))
    .min(1, "At least one category is required")
    .required("Categories field is required"),
});
