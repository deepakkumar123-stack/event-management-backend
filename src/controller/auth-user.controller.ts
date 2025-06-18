import { Request, Response } from "express";
import { response } from "../utils/response";
import { HttpStatus } from "../utils/http-statuses";
import { validateRegisterData } from "../utils/validateSchema/validateUser";
import { authUserLogin, authUserRegister } from "../services/auth-user.service";
import { _comparePassword } from "../utils/auth/hasher";
import { _generateToken } from "../utils/auth/token.helper";
import cloudinary from "../config/cloudinary";
import { uploadImg } from "../utils/avatar-helper";

export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const validatedData = await validateRegisterData.validate(req.body, {
      abortEarly: false,
    });
    const { name, email, password } = validatedData;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;
    const cloudinaryResult = await uploadImg(avatarUrl);

    const user = await authUserRegister(
      name,
      email,
      password,
      cloudinaryResult.secure_url
    );
    response(res, HttpStatus.CREATED, {
      message: "User created successfully",
      success: true,
      data: user,
    });
  } catch (error: any) {
    // console.log(error, "error from create user catch block");
    response(
      res,
      HttpStatus.BAD_REQUEST,
      {
        message: error.message || "error in register user",
        success: false,
        data: error.errors,
      },
      true
    );
  }
};

export const userLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authUserLogin(email, password);

    const payload = {
      userId: user?._id,
      userName: user?.name,
      userEmail: user?.email,
    };
    const token = _generateToken(payload);

    response(res, HttpStatus.OK, {
      message: "Login successful",
      success: true,
      data: { token },
    });
  } catch (error: any) {
    response(
      res,
      HttpStatus.BAD_REQUEST,
      {
        message: error.message || "error in user login",
        success: false,
        data: null,
      },
      true
    );
  }
};
