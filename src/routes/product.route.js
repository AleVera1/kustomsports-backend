import {Router} from 'express';
import Contenedor from '../contenedor.js';

const router = Router();
const contenedor = new Contenedor("products.json")

router.get('/', async (req, res) => {
  const products = await contenedor.getAll()
  res.status(200).json(products);
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await contenedor.getById(id);

  product ? res.status(200).json(product) : res.status(404).json({error: "Product not found"})
})

router.post('/', async (req, res) => {
  const {body} = req
  const newProductId = await contenedor.save(body)
  res.status(200).send(`Product added with ID: ${newProductId}`)
})

router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const {body} = req
  const wasUpdated = await contenedor.updateById(id, body);
  wasUpdated 
    ? res.status(204).send(`Product with ID: ${id} was updated`) 
    : res.status(404).json(`Product was not updated because: ${id} was not found`)
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const wasDeleted = await contenedor.deleteById(id);
  wasDeleted
    ? res.status(200).send(`Product with ID: ${id} was deleted`) 
    : res.status(404).json(`Product was not deleted because: ${id} was not found`)
})

export default router;