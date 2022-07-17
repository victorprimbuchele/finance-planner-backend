import { Router } from "express";
import AuthController from "./app/controllers/AuthController";
import CategoryController from "./app/controllers/CategoryController";
import PaymentMethodController from "./app/controllers/PaymentMethodController";
import SubCategoryController from "./app/controllers/SubCategoryController";
import TransfersController from "./app/controllers/TransfersController";

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

// CRUD de métodos de pagamento
router.post("/payment-methods", auth, PaymentMethodController.create);
router.get("/payment-methods", auth, PaymentMethodController.list);
router.put("/payment-methods/:id", auth, PaymentMethodController.update);
router.delete("/payment-methods/:id", auth, PaymentMethodController.delete);

// CRUD de subcategorias
router.post("/sub-categories/:categoryId", auth, SubCategoryController.create);
router.get("/sub-categories/:categoryId", auth, SubCategoryController.list);
router.put(
  "/sub-categories/:categoryId/:id",
  auth,
  SubCategoryController.update
);
router.delete(
  "/sub-categories/:categoryId/:id",
  auth,
  SubCategoryController.delete
);

// CRUD de transferências
router.post("/transfers/:categoryId/:id", auth, TransfersController.create);
router.get("/transfers", auth, TransfersController.list);
router.put("/transfers/:id", auth, TransfersController.update);
router.delete("/transfers/:id", auth, TransfersController.delete);

export default router;
