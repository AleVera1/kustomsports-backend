import { sendMail, sendSMS } from "../services/services.js";
import EcommerceFactory from "../persistances/factory_ecommerce.js";
import os from "os";
import logger from "../loggers/Log4jsLogger.js";

const getMainPage = async (ctx) => {
  if (!ctx.session.login) {
    ctx.redirect("/login");
  } else {
    ctx.render("pages/form", {
      status: ctx.session.login,
      username: ctx.session.username,
      avatar: ctx.body.avatar,
    });
  }
};

const getLogin = async (ctx) => {
  if (ctx.session.login) {
    ctx.redirect("/");
  } else {
    ctx.render("pages/login", { status: false });
  }
};

const postLogin = async (ctx) => {
  const { username, password } = ctx.body;
  ctx.session.username = username;
  ctx.session.login = true;
  console.log("Login successful");
  ctx.redirect("/");
};

const getLogout = async (ctx) => {
  ctx.session.destroy((err) => {
    if (err) {
      ctx.json(err);
    } else {
      ctx.render("pages/logout", { status: false });
    }
  });
};

const getRegister = async (ctx) => {
  ctx.render("pages/register");
};

const postRegister = async (ctx) => {
  sendMail(ctx);
  ctx.redirect("/login");
};

const getRegisterError = async (ctx) => {
  ctx.render("pages/registerError");
};

const getLoginError = async (ctx) => {
  ctx.render("pages/loginError");
};

const getSpecs = (_ctx) => {
  let args = process.argv;
  let so = process.platform;
  let nodeVer = process.version;
  let rss = process.memoryUsage.rss();
  let execPath = process.execPath;
  let pId = process.pid;
  let folder = process.cwd();
  let coctx = os.cpus().length;
  ctx.render("pages/info", {
    status: ctx.session.login,
    username: ctx.session.username,
    avatar: ctx.body.avatar,
    args,
    so,
    nodeVer,
    rss,
    execPath,
    pId,
    folder,
    coctx,
  });
  console.log({ args, so, nodeVer, rss, execPath, pId, folder, coctx });
};

const getProduct = async (ctx) => {
  const productos = EcommerceFactory.createDAO("mongo");
  const prods = await productos.getProducts();

  ctx.render("pages/list", {
    status: ctx.session.login,
    username: ctx.session.username,
    avatar: ctx.body.avatar,
    productos: prods,
  });
};

const postProducts = async (ctx) => {
  const { body } = ctx;
  const createAProduct = EcommerceFactory.createDAO("mongo");
  await createAProduct.createProduct(body);
  ctx.redirect("/");
};

const postAdd = async (ctx) => {
  const name = ctx.body.prodName;
  const user = ctx.user.username;
  logger.info(`${name} added to cart by user ${user}!`);
  try {
    const carrito = EcommerceFactory.createDAO("mongo");
    await carrito.addToCart(user, name);
    ctx.redirect("/cart");
  } catch (err) {
    logger.error(`${err}`);
    ctx.status(500).json({ message: "Internal server error" });
  }
};

//cambie el postAdd utilizando el username que le pasamos a traves del body en el api.test.js para unicamente poder realizar el test y que funcione

/* const postAdd = async (ctx) => {
  const name = ctx.body.prodName;
  const user = ctx.body.username;
  logger.info(`${name} added to cart by user ${user}!`);
  try {
    const carrito = EcommerceFactory.createDAO("mongo")
    await carrito.addToCart(user, name);
    ctx.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    logger.error(`${err}`);
    ctx.status(500).json({ message: "Internal server error" });
  }
}  */

const getCart = async (ctx) => {
  try {
    const carrito = EcommerceFactory.createDAO("mongo");
    const userCart = await carrito.getDetailedCart(ctx);
    console.log(userCart);
    ctx.render("pages/cart", {
      status: ctx.session.login,
      username: ctx.session.username,
      avatar: ctx.body.avatar,
      userCart,
      hasAny: true,
    });
  } catch (err) {
    logger.error(`${err}`);
  }
};

const postCartBuy = async (ctx) => {
  const carrito = EcommerceFactory.createDAO("mongo");
  const userCart = await carrito.getDetailedCart(ctx);
  const userCartText = JSON.stringify(userCart);
  sendMail(ctx, "purchase", "New purchase", userCartText);
  sendSMS(ctx, "Order recieved and in process");
  carrito.clearCart(ctx);
  ctx.redirect("/");
};

const unknownRoute = (ctx) => {
  logger.warn(`${ctx.method} ctxuest from ${ctx.originalUrl} route`);
  ctx.status(404).send("Sorry this route does not exist");
};

export const controller = {
  getMainPage,
  getLogin,
  postLogin,
  getLogout,
  getRegister,
  postRegister,
  getRegisterError,
  getLoginError,
  getSpecs,
  getProduct,
  postProducts,
  postAdd,
  getCart,
  postCartBuy,
  unknownRoute,
};
