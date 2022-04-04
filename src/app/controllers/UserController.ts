import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserController {
  async store(req: Request, res: Response) {
    const user = prisma.user;
    const { email, password, name, age, gender, apiKey } = req.body;

    const userExists = await user.findFirst({ where: { email } });

    if (userExists) {
      return res.sendStatus(409);
    }

    const createdUser = await user.create({
      data: {
        password,
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
