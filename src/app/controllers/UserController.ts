import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class UserController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = prisma.user;
    try {
      if (password == null) {
        return res.status(401).json({
          status: "error",
          message: "Password cannot be null",
        });
      }

      if (password.length < 8) {
        return res.status(401).json({
          status: "error",
          message: "Incorrect password",
        });
      }

      if (email.indexOf("@") === -1) {
        return res.status(401).json({
          status: "error",
          message: "Incorrect email",
        });
      }

      const isUser = await user.findFirst({ where: { email } });

      if (!isUser) {
        return res.status(401).json({
          status: "error",
          message: "User not found",
        });
      }

      const passwordMatch = await bcrypt.compare(password, isUser.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: "error",
          message: "Incorrect password",
        });
      }

      if (process.env.JWT_SECRET == null) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error. (Error code: 50)",
        });
      }

      const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const loggedUser = {
        id: isUser.id,
        name: isUser.name,
        email: isUser.email,
        token,
      };

      return res.json(loggedUser);
    } catch (error) {
      console.log(error);
      return res.json({
        status: "error",
        message: "Internal server error. " + error,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { email, password, name, age, gender, apiKey } = req.body;
      const user = prisma.user;

      const userExists = await user.findFirst({ where: { email } });

      if (userExists) {
        return res.status(409).json({
          status: "error",
          message: "User already exists",
        });
      }

      if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({
          status: "error",
          message: "Invalid API key",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const createdUser = await user.create({
        data: {
          password: passwordHash,
          email,
          age,
          apiKey,
          gender,
          name,
        },
      });

      return res.json(createdUser);
    } catch (error) {
      console.log(error);
      return res.json({
        status: "error",
        message: "Internal server error. " + error,
      });
    }
  }
}

export default new UserController();
