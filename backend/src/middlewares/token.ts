import { error } from "console";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  jwt.verify(token, "#!$safE2!@@#342", (error: any, decoded: any) => {
    if (error) {
      return res
        .status(401)
        .json({ message: "invalid token try login again :(" });
    }
    req.user = decoded.user;
    next();
  });
};
