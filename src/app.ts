import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connect";
import { categoryRoute } from "./routes/category.route";
import { authUserRouter } from "./routes/auth-user.route";
import { authMiddleware } from "./middleware/authMiddleware";
import { response } from "./utils/response";
// import { HttpStatus } from "./utils/http-statuses";
import { eventRouter } from "./routes/event.route";
import "./config/cloudinary";
authUserRouter;
dotenv.config();
const app: Express = express();
const mongoURL = process.env.MONGODB_URL;
const port = process.env.PORT || 3000;

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
