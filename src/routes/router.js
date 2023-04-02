import { Router } from "express";
import passport from "passport";
import { sendMail } from "../services/services.js";
import { getMainPage, getLogin, postLogin, getLogout, getRegister, postRegister, getRegisterError, getLoginError, getSpecs, getProduct, postProducts, postAdd, getCart, postCartBuy, unknownRoute} from "../controllers/controller.js"
import uploader from "../services/multer.js"

const router = Router()

router.get('/', getMainPage)

router.get('/login', getLogin)

router.post('/login', passport.authenticate("login", { failureRedirect: "/loginError" }), postLogin)

router.get('/logout', getLogout)

router.get('/register', getRegister)

router.post('/register', uploader, passport.authenticate("register", {failureRedirect: "/registerError"}), async (req, res) => {
  sendMail(req)
  res.redirect("/login")
});

router.get('/registerError', getRegisterError)

router.get('/loginError', getLoginError)

router.get('/info', getSpecs)

router.get('/productos', getProduct);

router.post('/productos', postProducts);

router.route("/add").post(postAdd);

router.route("/cart").get(getCart);

router.route("/cart/comprar").post(postCartBuy)

router.get("*", unknownRoute)

export default router;

