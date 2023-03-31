import { Router } from "express";
import passport from "passport";
import os from "os";
import logger from "../loggers/Log4jsLogger.js";
import { createTransport } from "nodemailer";
import { CarritosModel } from "../modules/carritos.modules.js";
import { ProductosModel } from "../modules/productos.modules.js";
import { ProductoDao } from "../dao/ProductoDao.js"
import uploader from "../lib/multer.js"
import twilio from "twilio";
import dotenv from "dotenv"
import { title } from "process";

dotenv.config()

const router = Router()

const productosDao = new ProductoDao();

const sendMail = async (req, type = "newUser", subject = "Nuevo usuario registrado", items) => {
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cornell52@ethereal.email',
        pass: 'tm9KvstEd2AVZraH1N'
    }
  });

  const adminMail = "aevlanus@gmail.com";

  let mailBody = "";
    switch (type) {
        case "newUser":
            mailBody = `<p>New user with mail:${req.body.username}, name:${req.body.name}, address:${req.body.address}, age:${req.body.age} and phone:${req.body.phone}</p>`;
            break;
        case "purchase":
            mailBody = `<p>New purchase from user ${req.user.username}, details:${items}</p>`;
            break;
    };

    const mailOptions = {
    from: "Node Server",
    to: adminMail,
    subject,
    html: mailBody
    };

    try {
    transporter.sendMail(mailOptions);
    }
    catch (err) {
    logger.info("Failed to send mail");
    }
}

const sendSMS = async (req, message) => {
  const accountSid = process.env.TWILIOSSID;
  const authToken = process.env.TWILIOAUTH;
  
  const client = twilio(accountSid, authToken);

  const options = {
      body: message,
      from: "+14406888709",
      to: req.user.phone,
    };
    
    try {
      const message = await client.messages.create(options);
    } catch (err) {
      logger.warn(err);
    } 
};

const getProducts = () => {
  return ProductosModel.find().lean();
}

const getDetailedCart = async (req) => {
  const user = req.user.username
  const productsMongo = await CarritosModel.findOne({username: user}, {products: 1, _id:0}).lean();
  console.log(productsMongo.products)
  const productsArray = productsMongo.products

  const productsInfo = [];
  await Promise.all(productsArray.map(async (prod) => {
      const prodData = await ProductosModel.findOne({title: prod}, {price:1, image:1, _id:0}).lean();
      console.log(prodData);
      
      if (prodData) { // Add a check to ensure prodData is not null or undefined
        let prodInfo = {
            title: prod,
            price: prodData.price,
            image: prodData.image
        };
        productsInfo.push(prodInfo);
      }
  }));

  return productsInfo
};


const clearCart = async (req) => {
  const user = req.user.username;
  await CarritosModel.findOneAndUpdate({username: user}, {products: []});
}

router.get('/', async(req, res) => {
  if (!req.session.login) {
    res.redirect('/login')
} else {
    res.render('pages/form', {status: req.session.login, username: req.session.username, avatar: req.body.avatar})
}
})

router.get('/login', async(req, res) => {
  if (req.session.login) {
      res.redirect('/')
  } else {
      res.render('pages/login', {status: false})
  }
  
})

router.post('/login', passport.authenticate("login", { failureRedirect: "/loginError" }), async(req, res) => {
const {username, password} = req.body;
req.session.username = username;
req.session.login = true;
console.log('Login successful');
res.redirect("/");
})

router.get('/logout', async(req, res) => {
  req.session.destroy((err) => {
      if (err) {
          res.json(err);
      } else {
          res.render('pages/logout', {status: false});
      }
  })
})

router.get('/register', async(req, res) => {
  res.render('pages/register')
})

router.post('/register', uploader, passport.authenticate("register", {failureRedirect: "/registerError"}), async (req, res) => {
  sendMail(req)
  res.redirect("/")
});

router.get('/registerError', async(req, res) => {
res.render('pages/registerError')
})

router.get('/loginError', async(req, res) => {
res.render('pages/loginError')
})

router.get('/info', (_req, res) => {
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
})

router.get('/productos', async(req, res) => {
  const productos = await productosDao.getAll();
  res.render('pages/list', {status: req.session.login, username: req.session.username, avatar: req.body.avatar, productos});
});

router.post('/productos', async(req, res) => {
  const { body } = req;
  await productosDao.createProduct(body);
  res.redirect('/');
});

router.route("/add").post(async (req, res) => {
  const name = req.body.prodName;
  const user = req.user.username;
  logger.info(`${name} added to cart by user ${user}!`);
  try {
    await CarritosModel.findOneAndUpdate(
      { username: user },
      { $push: { products: name } },
      { upsert: true }
    );
    res.redirect('/cart')
  } catch (err) {
    logger.error(`${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
});



router 
    .route("/cart")
    .get(async (req, res) => {
        try{
            const userCart = await getDetailedCart(req);
            console.log(userCart);
            res.render("pages/cart", {status: req.session.login, username: req.session.username, avatar: req.body.avatar, userCart, hasAny:true})
        } catch (err){
            logger.error(`${err}`);
        }
    });

router
    .route("/cart/comprar")
    .post(async (req,res) => {
        const userCart = await getDetailedCart(req);
        const userCartText = JSON.stringify(userCart);
        sendMail(req, "purchase", "New purchase", userCartText);
        sendSMS(req, "Order recieved and in process");
        clearCart(req);
        res.redirect("/");
    })

router.get("*", (req, res) => {
    logger.warn(`${req.method} request from ${req.originalUrl} route`);
    res.status(404).send("Sorry this route does not exist")
})

export default router;

