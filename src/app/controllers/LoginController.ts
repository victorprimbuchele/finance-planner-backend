import { Request, Response } from "express";

class LoginController {
  async authentication(req: Request, res: Response) {
    const { email, password } = req.body;

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
  }
}
