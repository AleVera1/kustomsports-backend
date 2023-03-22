import express from "express";
import { ProductoDao } from "../dao/ProductoDao.js";

const router = express.Router();
const productosDao = new ProductoDao();

router.get('/', async(req, res) => {
  const productos = await productosDao.getAll();
  res.render('pages/list', {productos})
})

router.post('/', async(req,res) => {
  const {body} = req;
  await productosDao.createProduct(body);
  res.redirect('/');
  return;
})


export default router;