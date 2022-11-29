import express, {json , urlencoded} from 'express';
import Contenedor from './contenedor.js';
import { fileURLToPath } from "url";
import { dirname } from "path";

const contenedor = new Contenedor("productos.json");
const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/productos', async (req, res) => {
  const productos = await contenedor.getAll();
  res.render('pages/list',{productos})
})

app.get('/', (req,res) => {
  res.render('pages/form', {})
})

app.post('/productos', async(req,res) => {
  const {body} = req;
  await contenedor.save(body);
  res.redirect('/');
})

const PORT = 8060;
const server = app.listen(PORT, () => {
console.log(`Server started at http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.error(err)
})