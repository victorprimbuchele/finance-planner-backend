import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { prisma } from "../../database/migrations/connect";

class UserController {
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
          isAuth: false,
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
