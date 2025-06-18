import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connect";
import { categoryRoute } from "./routes/category.route";
import { authUserRouter } from "./routes/auth-user.route";
import { authMiddleware } from "./middleware/authMiddleware";
import { eventRouter } from "./routes/event.route";
import "./config/cloudinary";
dotenv.config();
const whitelist = ["http://localhost:5173"];
const app: Express = express();
const mongoURL = process.env.MONGODB_URL;
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/test", authMiddleware, () => {
  try {
    console.log("test by jwt");
  } catch (error) {
    console.log(error);
  }
});
app.use("/api/category", categoryRoute);
app.use("/api/auth-user", authUserRouter);
app.use("/api/event", eventRouter);
if (!mongoURL) {
  throw new Error("Missing MONGODB_URL in environment variables.");
}

const start = async (): Promise<void> => {
  await connectDB(mongoURL);
  try {
    app.listen(port, () => {
      console.log(`${port} is running succesfully....`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
start();
