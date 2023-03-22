import express from "express";
import { ProductMocker } from '../mocks/productMocker.js'

const router = express.Router();

router.get('/productosRandoms', async(req, res) => {
  const productMocker = new ProductMocker(5);
  const productosRandom = productMocker.generateRandomProducts();
  res.render('pages/randomList', {productosRandom})
})

export default router;