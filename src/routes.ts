import { Router } from "express";

import UserController from "./app/controllers/UserController";
import { auth } from "./middlewares/auth";

const router = Router();

router.post("/users", UserController.create);
router.get("/login", UserController.login);
router.get("/coconut123", auth, (req, res) => {
  return res.json({
    message: "Hello World",
  });
});

export default router;
