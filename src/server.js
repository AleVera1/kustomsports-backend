import express, {json , urlencoded} from 'express';
import productRouter from "./routes/product.route.js";
import baseRouter from "./routes/base.route.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }))

app.use('/api/productos', productRouter)
app.use('/', baseRouter)

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})

server.on('error', err => {
  console.log(error);
})