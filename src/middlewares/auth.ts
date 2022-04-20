import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  const parts = authHeader.split(" ");

  if (!(parts.length === 2)) {
    return res.status(401).json({
      status: "error",
      message: "Token error",
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      status: "error",
      message: "Token malformatted",
    });
  }

  if (process.env.JWT_SECRET == null) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error. (Error code: 50)",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Token invalid",
    });
  }
};
