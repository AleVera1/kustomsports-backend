import Router from "koa-router";
import passport from "koa-passport";
import { controller } from "../controllers/controller.js";
import { graphqlKoa } from "graphql-server-koa";
import { graphqlHTTP } from "koa-graphql";
import prodSchema from "../graphql/product.modules.js";
import uploader from "../services/multer.js";

const router = new Router();

router.get("/", controller.getMainPage);

router.post("/login", passport.authenticate("login"), controller.postLogin);

router.get("/logout", controller.getLogout);

router.get("/login", controller.getLogin);

router.post(
  "/register",
  uploader,
  passport.authenticate("register"),
  controller.postRegister
);

router.get("/registerError", controller.getRegisterError);

router.get("/loginError", controller.getLoginError);

router.get("/info", controller.getSpecs);

router.get("/productos", controller.getProduct);

router.post("/productos", controller.postProducts);

router.post("/add", controller.postAdd);

router.get("/cart", controller.getCart);

router.post("/cart/comprar", controller.postCartBuy);

router.all(
  "/graphql",
  graphqlKoa((ctx) => ({
    schema: prodSchema,
    rootValue: {
      getCart: controller.getCart,
    },
    graphiql: true,
    context: {
      status: ctx.session.login,
      username: ctx.session.username,
    },
  }))
);

router.use(
  "/graphql",
  graphqlHTTP({
    schema: prodSchema,
    rootValue: {
      getCart: controller.getCart,
    },
    graphiql: true,
  })
);

/* router.get("*", controller.unknownRoute) */

export default router;
