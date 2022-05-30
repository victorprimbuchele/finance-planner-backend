import { Request, Response } from "express";
import blackListController from "../controllers/BlackList";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../../database/migrations/connect";

class AuthController {
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

      const token = jwt.sign(
        {
          id: isUser.id,
          email: isUser.email,
          gender: isUser.gender,
          name: isUser.name,
          isAuth: isUser.isAuth,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Atualizar status do usuário como autenticado
      const loggedUser = await user.update({
        where: { id: isUser.id },
        data: {
          isAuth: true,
        },
      });

      return res.json({ loggedUser, token });
    } catch (error) {
      console.log(error);
      return res.json({
        status: "error",
        message: "Internal server error. " + error,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // capturar token do usuário
      const { id, token } = req.body;

      // verificar se existe token e id no corpo da requisição
      if (token == null || id == null) {
        return res.status(401).json({
          status: "error",
          message: "Token or id cannot be null",
        });
      }

      // instanciar tabela do usuário
      const user = prisma.user;

      // buscar usuário pelo id
      const userExists = await user.findUnique({ where: { id } });

      // verificar se usuário existe
      if (!userExists) {
        return res.status(401).json({
          status: "error",
          message: "User not found",
        });
      }

      // instanciar controlador da tabela blacklist
      blackListController.stopThisToken(token);

      // atualizar stauts do usuário como desautenticado
      const updatedUser = await user.update({
        where: { id },
        data: {
          isAuth: false,
        },
      });

      return res.json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error. " + error,
      });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      const parts = authHeader!.split(" ");

      const [_, token] = parts;

      console.log({ authHeader, token });

      //   verificar se token existe na blacklist
      const blacklist = prisma.blackList;

      const tokenExists = await blacklist.findMany({
        where: {
          token: {
            search: token,
          },
        },
      });

      console.log(tokenExists);

      //   se token existir, proibir usuário de acessar a API
      if (tokenExists) {
        return res.status(403).json({
          status: "error",
          message: "Token is blacklisted",
        });
      }

      //   se token não existir, retornar usuário autenticado
      return res.status(200).json({
        isAuth: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error. " + error,
      });
    }
  }
}

export default new AuthController();
