import express from "express";
import { CarritoDao } from "../dao/CarritoDao.js";

const router = express.Router();
const carritoDao = new CarritoDao();

router.get('/', async(req, res) => {
  const carrito = await carritoDao.getCart(req.session.cartId);
  if (!carrito) {
    return res.render('pages/cart', { status: req.session.login, carrito: null });
  }
  res.render('pages/cart', { status: req.session.login, carrito });
});


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
