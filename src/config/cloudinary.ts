import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME! || "dmzewpzng",
  api_key: process.env.CLOUDINARY_API_KEY! || "153711194265712",
  api_secret:
    process.env.CLOUDINARY_API_SECRET! || "iHlqStgMv90pKJIPJve7FS-Rvuo",
});

export default cloudinary;
