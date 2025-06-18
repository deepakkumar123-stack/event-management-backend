import express from "express";
import {
  userLoginController,
  userRegisterController,
} from "../controller/auth-user.controller";

export const authUserRouter = express.Router();

authUserRouter.post("/login", userLoginController);
authUserRouter.post("/register", userRegisterController);
