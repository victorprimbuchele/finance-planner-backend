import { Router } from "express";
import AuthController from "./app/controllers/AuthController";

import UserController from "./app/controllers/UserController";
import { auth } from "./middlewares/auth";

const router = Router();

router.post("/users", UserController.create);
router.post("/login", AuthController.login);
router.post("/logout", auth, AuthController.logout);
// Rota para testar autenticidade de token
router.get("/ttkn", auth, AuthController.verifyToken);

export default router;
