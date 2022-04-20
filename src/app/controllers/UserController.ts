import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

class UserController {
  async create(req: Request, res: Response) {
    const user = prisma.user;
    const { email, password, name, age, gender, apiKey } = req.body;

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
  }
}

export default new UserController();
