import { Request, Response, NextFunction } from "express";
import { response } from "../utils/response";
import { HttpStatus } from "../utils/http-statuses";
import { _verifyToken } from "../utils/auth/token.helper";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return response(
      res,
      HttpStatus.UNAUTHORIZED,
      {
        message: "No token provided",
        success: false,
        data: null,
      },
      true
    );
  }
  const [_, token] = authHeader.split(" ");
  try {
    const decode = _verifyToken(token);
    //attach info of user to req
    (req as any).user = decode.userId;
    next();
  } catch (error) {
    response(
      res,
      HttpStatus.UNAUTHORIZED,
      {
        message: "Invalid token",
        success: false,
        data: null,
      },
      true
    );
  }
};
