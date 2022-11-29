import express, {json , urlencoded} from 'express';
import { engine } from 'express-handlebars';
import Contenedor from './contenedor.js';
import { fileURLToPath } from "url";
import { dirname } from "path";

const contenedor = new Contenedor("productos.json");
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}))

app.get('/productos', async(req, res) => {
  const productos = await contenedor.getAll();
  res.render('pages/list', {productos})
})

app.post('/productos', async(req,res) => {
  const {body} = req;
  await contenedor.save(body);
  res.redirect('/');
})

app.get('/', (req,res) => {
  res.render('pages/form', {})
})


const PORT = 8080;
const server = app.listen(PORT, () => {
console.log(`Server started at http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.log(err)
})