import { Router } from "express";

import UserController from "./app/controllers/UserController";
import { auth } from "./middlewares/auth";

const router = Router();

router.post("/users", UserController.create);
router.post("/login", UserController.login);
router.post("/logout", auth, UserController.logout);

export default router;
