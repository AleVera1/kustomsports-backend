const Contenedor = require("./Contenedor");
const express = require("express");

const PORT = 8080
const app = express()

const contenedor = new Contenedor("productos.json");

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor express')
})

app.get('/productos', async (req, res) => {
  const allProducts = await contenedor.getAll()
  res.json(allProducts)
})

app.get('/productoRandom', async (req, res) => {
  const allProducts = await contenedor.getAll()
  const randomNumber = Math.floor(Math.random() * allProducts.length)
  
  res.send(allProducts[randomNumber])
})

const server = app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})

server.on("error", (err) => {
  console.error(`Error: ${err}`)
})