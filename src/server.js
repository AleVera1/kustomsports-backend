import express from 'express';
import { engine } from 'express-handlebars';
import productRouter from './routes/product.js'; 
import cartRouter from './routes/cart.js';
import userRouter from './routes/user.js';
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

const PORT = 8080;
const app = express();

const server = http.createServer(app)
const io = new Server(server);

const productosDao = new ProductoDao();
const chat = new MensajesDao();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));

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

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/productos', productRouter);
app.use('/api/carrito', cartRouter);
app.use('/', userRouter);

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  allowProtoPropertiesByDefault: true
}))



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

app.get('/productos', async(req, res) => {
  const productos = await productosDao.getAll();
  res.render('pages/list', {productos})
})

app.get('/productosRandoms', async(req, res) => {
  const productMocker = new ProductMocker(5);
  const productosRandom = productMocker.generateRandomProducts();
  res.render('pages/randomList', {productosRandom})
})

app.post('/productos', async(req,res) => {
  const {body} = req;
  await productosDao.createProduct(body);
  res.redirect('/');
})

app.get('/', (req,res) => {
  res.render('pages/form', {status: req.session.login})
})


server.listen(PORT, () => console.log(` >>>>> 🚀 Server started at http://localhost:${PORT}`));

server.on('error', (err) => console.log(err))