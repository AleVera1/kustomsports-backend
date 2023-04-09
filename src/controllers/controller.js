import { sendMail, sendSMS } from "../services/services.js";
import EcommerceFactory from "../persistances/factory_ecommerce.js"
import os from "os";
import logger from "../loggers/Log4jsLogger.js";

const getMainPage = async (req, res) => {
  if (!req.session.login) {
    res.redirect('/login')
  } else {
    res.render('pages/form', {status: req.session.login, username: req.session.username, avatar: req.body.avatar})
  }
}

const getLogin = async (req, res) => {
  if (req.session.login) {
    res.redirect('/')
  } else {
    res.render('pages/login', {status: false})
  }
}

const postLogin = async (req, res) => {
  const {username, password} = req.body;
  req.session.username = username;
  req.session.login = true;
  console.log('Login successful');
  res.redirect("/");
}

const getLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        res.json(err);
    } else {
        res.render('pages/logout', {status: false});
    }
  })
}

const getRegister = async (req, res) => {
  res.render('pages/register')
}

const postRegister = async (req, res) => {
  sendMail(req)
  res.redirect("/login")
}

const getRegisterError = async (req, res) => {
  res.render('pages/registerError')
}

const getLoginError = async (req, res) => {
  res.render('pages/loginError')
}

const getSpecs = (_req, res) => {
  let args = process.argv;
  let so = process.platform;
  let nodeVer = process.version;
  let rss = process.memoryUsage.rss();
  let execPath = process.execPath;
  let pId = process.pid;
  let folder = process.cwd();
  let cores = os.cpus().length;
  res.render("pages/info", {status: req.session.login, username: req.session.username, avatar: req.body.avatar, args, so, nodeVer, rss, execPath, pId, folder, cores})
  console.log({args, so, nodeVer, rss, execPath, pId, folder, cores});
}

const getProduct = async (req, res) => {
  const productos = EcommerceFactory.createDAO("mongo");
  const prods = await productos.getProducts();

  res.render('pages/list', {status: req.session.login, username: req.session.username, avatar: req.body.avatar, productos: prods});
}

const postProducts = async (req, res) => {
  const { body } = req;
  const createAProduct = EcommerceFactory.createDAO("mongo")
  await createAProduct.createProduct(body)
  res.redirect('/');
}

const postAdd = async (req, res) => {
  const name = req.body.prodName;
  const user = req.user.username;
  logger.info(`${name} added to cart by user ${user}!`);
  try {
    const carrito = EcommerceFactory.createDAO("mongo")
    await carrito.addToCart(user, name);
    res.redirect('/cart');
  } catch (err) {
    logger.error(`${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getCart = async (req, res) => {
  try{
    const carrito = EcommerceFactory.createDAO("mongo")
    const userCart = await carrito.getDetailedCart(req);
    console.log(userCart);
    res.render("pages/cart", {status: req.session.login, username: req.session.username, avatar: req.body.avatar, userCart, hasAny:true})
  } catch (err){
      logger.error(`${err}`);
  }
}

const postCartBuy = async (req, res) => {
  const carrito = EcommerceFactory.createDAO("mongo")
  const userCart = await carrito.getDetailedCart(req);
  const userCartText = JSON.stringify(userCart);
  sendMail(req, "purchase", "New purchase", userCartText);
  sendSMS(req, "Order recieved and in process");
  carrito.clearCart(req);
  res.redirect("/");
}

const unknownRoute = (req, res) => {
  logger.warn(`${req.method} request from ${req.originalUrl} route`);
  res.status(404).send("Sorry this route does not exist")
}

export { getMainPage, getLogin, postLogin, getLogout, getRegister, postRegister, getRegisterError, getLoginError, getSpecs, getProduct, postProducts, postAdd, getCart, postCartBuy, unknownRoute}