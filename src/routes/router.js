import { Router } from "express";
import passport from "passport";
import { controller } from "../controllers/controller.js";
import uploader from "../services/multer.js";

const router = Router();

router.get("/", controller.getMainPage);

router.get("/login", controller.getLogin);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginError" }),
  controller.postLogin
);

router.get("/logout", controller.getLogout);

router.get("/register", controller.getRegister);

router.post(
  "/register",
  uploader,
  passport.authenticate("register", { failureRedirect: "/registerError" }),
  controller.postRegister
);

router.get("/registerError", controller.getRegisterError);

router.get("/loginError", controller.getLoginError);

router.get("/info", controller.getSpecs);

router.get("/chat", controller.getChat);

router.get("/chat/:email", controller.getChatByEmail);

router.get("/productos", controller.getProduct);

router.get("/productos/:id", controller.getProductById);

router.get("/productos/:category", controller.getProductByCategory);

router.delete("/productos/:id", controller.deleteProductById);

router.post("/productos", controller.postProducts);

router.route("/add").post(controller.postAdd);

router.route("/cart").get(controller.getCart);

router.route("/cart/comprar").post(controller.postCartBuy);

router.get("*", controller.unknownRoute);

export default router;
