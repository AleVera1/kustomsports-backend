import express from "express";
import { ProductoDao } from "../dao/ProductoDao.js";
import { CarritoDao } from "../dao/CarritoDao.js";

const router = express.Router();
const productosDao = new ProductoDao();
const carritoDao = new CarritoDao();

router.get('/', async(req, res) => {
  const productos = await productosDao.getAll();
  res.render('pages/list', {status: req.session.login, productos});
});

router.post('/', async(req, res) => {
  const { body } = req;
  await productosDao.createProduct(body);
  res.redirect('/');
});

router.post('/add', async(req, res) => {
  const { body } = req;
  const producto = await productosDao.getProductById(body.prodId);
  const success = await carritoDao.saveProductToCart(req.session.cartId, {productId: producto._id});

  if (success) {
    res.redirect('/cart');
  } else {
    res.status(500).send('Error al agregar producto al carrito');
  }
});

export default router;

