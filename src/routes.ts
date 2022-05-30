import { Router } from "express";
import AuthController from "./app/controllers/AuthController";
import CategoryController from "./app/controllers/CategoryController";

import UserController from "./app/controllers/UserController";
import { auth } from "./middlewares/auth";

const router = Router();

router.post("/users", UserController.create);
router.post("/login", AuthController.login);
router.post("/logout", auth, AuthController.logout);

// Rota para testar autenticidade de token
router.get("/ttkn", auth, AuthController.verifyToken);

// CRUD de categorias
router.post("/categories", auth, CategoryController.create);
router.get("/categories", auth, CategoryController.list);
router.put("/categories/:id", auth, CategoryController.update);
router.delete("/categories/:id", auth, CategoryController.delete);

export default router;
