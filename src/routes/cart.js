import express from "express";
import { CarritoDao } from "../dao/CarritoDao.js";
import { ProductoDao } from "../dao/ProductoDao.js";
import nodemailer from "nodemailer";

const router = express.Router();
const carritoDao = new CarritoDao();

// GET /cart
router.get('/', async(req, res) => {
  const cart = await carritoDao.getActualCart(req.session.userId);
  const products = await carritoDao.getAllProductsFromCart(cart._id);
  
  res.render('pages/cart', { status: req.session.login, products });
});


// POST /cart
router.post('/', async (_req, res) => {
  const newCart = await carritoDao.createCart();
  
  newCart
    ? res.status(200).json({"success": "Product added with ID " + newCart._id})
    : res.status(500).json({"error": "there was an error"})
  
})

// DELETE /cart/id
router.delete('/:id', async(req,res) => {
  const { id } = req.params;
  const wasDeleted = await carritoDao.deleteCartById(id);
  
  wasDeleted 
    ? res.status(200).json({"success": "cart successfully removed"})
    : res.status(404).json({"error": "cart not found"})
  
})

// POST /cart/:id/productos

router.post('/:id/productos', async(req,res) => {
  const { id } = req.params;
  const { body } = req;
  
  const productExists = await ProductoDao.exists(body.productId);
  
  if(productExists) {
    await carritoDao.saveProductToCart(id, body)
    res.redirect(`/cart/${id}/productos`);
  } else {
    res.status(404).json({"error": "product not found"});
  }
  
})

// GET /cart/:id/productos
router.get('/:id/productos', async(req,res)=>{
  const { id } = req.params;
  const cartProducts = await carritoDao.getAllProductsFromCart(id);
  
  if(cartProducts) {
    res.render('cart', {hasAny: true, userCart: cartProducts});
  } else {
    res.status(404).json({"error": "cart not found"})
  }
})


// DELETE /cart/:id/productos/:id_prod
router.delete('/:id/productos/:id_prod', async(req, res) => {
  const {id, id_prod } = req.params;
  
  const wasDeleted = await carritoDao.deleteProductFromCart(id, id_prod);
  
  wasDeleted 
? res.status(200).json({"success": "that product is no longer in the cart"})
    : res.status(400).json({"error": "there was some problem"})
  
})

// POST /cart/buy
router.post('/buy', async(req,res) => {
  const { id } = req.body;
  
  const cartProducts = await carritoDao.getAllProductsFromCart(id);
  
  if(cartProducts) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'cornell52@ethereal.email',
          pass: 'tm9KvstEd2AVZraH1N'
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"My Shop" <kustomsports@shop.com>', // sender address
      to: req.body.username, // list of receivers
      subject: "Your purchase on My Shop", // Subject line
      html: `
        <h2>Your purchase details</h2>
        <ul>
          ${cartProducts.map(product => {
            return `<li>${product.name} - ${product.price}</li>`
          }).join('')}
        </ul>
        <p>Thank you for shopping with us!</p>
      `
    });

    console.log("Message sent: %s", info.messageId);
    res.render('success', {message: "Purchase completed!"});
  } else {
    res.status(404).json({"error": "cart not found"})
  }
})

export default router;
