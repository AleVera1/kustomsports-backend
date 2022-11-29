import express, {json , urlencoded} from 'express';
import Contenedor from './contenedor.js';

const contenedor = new Contenedor("productos.json");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views', './src/views');
app.set('view engine', 'pug');

app.get('/productos', async (req, res) => {
  const products = await contenedor.getAll();
  res.render('list',{products:products
  })
})

app.get('/', (req,res) => {
  res.render('form', {})
})

app.post('/productos', async(req,res) => {
  const {body} = req;
  await contenedor.save(body);
  res.redirect('/');
})

const PORT = 8070;
const server = app.listen(PORT, () => {
console.log(`Server started at http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.error(err)
})