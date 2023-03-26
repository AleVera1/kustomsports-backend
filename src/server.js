import express from 'express';
import { engine } from 'express-handlebars';
import productRouter from './routes/product.js'; 
import cartRouter from './routes/cart.js';
import userRouter from './routes/user.js';
import otherRouter from './routes/other.js';
import { MensajesDao } from './dao/MensajesDao.js';
import { ProductoDao } from './dao/ProductoDao.js';
import { ProductMocker } from './mocks/productMocker.js'
import http from 'http'; 
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from 'socket.io'
import session from 'express-session';
import path from 'path';
import mongoStore from 'connect-mongo';
import cluster from "cluster";
import os from "os";
import { passportStrategies } from "./lib/passport.lib.js";
import { User } from "./modules/user.modules.js"
import passport from "passport";
import parseArgs from "minimist";
import dotenv from 'dotenv';
import compression from "compression";
import logger from "./loggers/Log4jsLogger.js";
import loggerMiddleware from "./middlewares/routesLogger.middleware.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const server = http.createServer(app)

const productosDao = new ProductoDao();
const chat = new MensajesDao();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));

app.use(cookieParser());

app.use(
  session({
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        options: {
            userNewParser: true,
            useUnifiedTopology: true,
        }
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 600000} //10 min.
    
}))

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id)
})
//
passport.deserializeUser((id, done) => {
  User.findById(id).then((data) => {
    done(null, data);
})
    .catch((err) => { console.error(err); })
})

app.use(passport.initialize());
app.use(passport.session());

app.use(loggerMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/productos', productRouter);
app.use('/cart', cartRouter);
app.use('/test', otherRouter);
app.use('/', userRouter);

app.all("*", (req, res) => {
  res.status(404).json({"error": "ruta no existente"})
});

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  allowProtoPropertiesByDefault: true
}))

const args = process.argv.slice(2);
const options = {
  alias: {
    p: "port",
    m: "mode"
  },
  default:{
    port: 8080,
    mode: "fork"
  }
};

const minimistArgs = parseArgs(args, options);

const cpus = os.cpus();
const PORT = process.env.PORT

const startServer = () => {
  const expressServer = app.listen(PORT, () => logger.info(` >>>>> 🚀 Server started at http://localhost:${PORT}`));

  const io = new Server(expressServer);

  io.on('connection', async(socket) => {
    console.log('🟢 Usuario conectado')
    
    const productos = await productosDao.getAll();
  
    socket.emit('bienvenidoLista', productos )
    
    const mensajes = await chat.getAll();
    socket.emit('listaMensajesBienvenida', mensajes)
    
    socket.on('nuevoMensaje', async(data) => {
      await chat.createMessage(data);
      
      const mensajes = await chat.getAll();
      io.sockets.emit('listaMensajesActualizada', mensajes)
    })
  
    socket.on('productoAgregado', async(data) => {    
      console.log('Alguien presionó el click')
      await productosDao.createProduct(data);
      
      const productos = await productosDao.getAll();
      io.sockets.emit('listaActualizada', productos);
    })
    
    socket.on('disconnect', () => {
      console.log('🔴 Usuario desconectado')
    })
  })

  server.on('error', (err) => logger.log(err))
}

if (minimistArgs.mode === "cluster") {
  if (cluster.isPrimary){

    cpus.map(()=> cluster.fork());

    cluster.on("exit", (worker)=>{
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork()
    })
  } else {
    startServer();
  }
} else if (minimistArgs.mode === "fork"){
  startServer();
} else {
  console.log(`${minimistArgs.mode} is not a valid mode. Please choose fork or cluster`)
  process.exit(1)
}

