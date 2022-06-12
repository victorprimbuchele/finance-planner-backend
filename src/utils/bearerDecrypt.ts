import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const getToken = (req: Request, res: Response) => {
  // capturar o token no header da requisição
  const { authorization } = req.headers;

  // descriptografar o token
  const decryptToken = bearerDecrypt(authorization!);

  // verificar se dados do token é nulo
  if (decryptToken == null) {
    res.status(401).json({
      status: "error",
      message: "Information not found",
    });
    return null;
  }

  return decryptToken;
};

export const bearerDecrypt = (bearer: string): BearerDecryptResponse | null => {
  const bearerToken = bearer.split(" ");

  const decryptedToken = jwt.decode(bearerToken[1]);
  if (decryptedToken === null) {
    return null;
  }
  if (typeof decryptedToken === "string") {
    return null;
  }
  return decryptedToken as BearerDecryptResponse;
};

type BearerDecryptResponse = {
  isAuth: boolean;
  id: number;
  email: string;
  genders: string;
  name: string;
};
