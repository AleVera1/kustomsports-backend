import { knex } from '../../db.js';

const productos = [
  {
    "id": 1,
    "timestamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
    "title": "Producto 1",
    "price": 10,
    "description":"Producto 1",
    "code": "a123",
    "image": "urlProducto1.com",
    "stock": 100
  },
  {
    "id": 2,
    "timestamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
    "title": "Producto 2",
    "price": 20,
    "description":"Producto 2",
    "code": "a124",
    "image": "urlProducto2.com",
    "stock": 200
  },
  {
    "id": 3,
    "timestamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
    "title": "Producto 3",
    "price": 30,
    "description":"Producto 3",
    "code": "a125",
    "image": "urlProducto3.com",
    "stock": 300
  },
  {
    "id": 4,
    "timestamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
    "title": "Producto 4",
    "price": 40,
    "description":"Producto 4",
    "code": "a126",
    "image": "urlProducto4.com",
    "stock": 400
  }
]

const mensajes = [
  {"email":"aevlanus@gmail.com","message":"Hola, todo bien?","date":"5/12/2022, 15:06:18","id":1},
  {"email":"pedro@gmail.com","message":"Hola, todo bien, vos?","date":"5/12/2022, 15:06:33","id":2},
  {"email":"aevlanus@gmail.com","message":"Todo bien por suerte!","date":"5/12/2022, 15:06:52","id":3},
  {"email":"pedro@gmail.com","message":"Genial me alegro!","date":"5/12/2022, 15:07:13","id":4}
]

const carritos = [
  {
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }
]

const productoCarritoRelations = [
  {
    carritoId: 2,
    productoId: 1
  },
  {
    carritoId: 2,
    productoId: 2
  },
  {
    carritoId: 2,
    productoId: 3
  }
]

export async function populateProducts() {
  try {
    await knex.insert(productos).from('producto');
    console.log('Se agregaron Productos a la tabla')
  } catch (error) {
    console.log(error);
  } 
}

export async function populateCarts() {
  try {
    await knex.insert(carritos).from('carrito');
    console.log('🛒 Se agregaron Carritos a la tabla')
  } catch (error) {
    console.log(error);
  } 
}

export async function populateProductoCarrito() {
  try {
    await knex.insert(productoCarritoRelations).from('productoCarrito');
    console.log('🛒<->🧪 Se agregaron relaciones a la tabla')
    return;
  } catch(error) {
    console.log(error);
  }
}

export async function populateMessages() {
  try {
    await knex.insert(mensajes).from('mensajes');
    console.log('Se agregaron Mensajes a la tabla')
  } catch (error) {
    console.log(error);
  } 
}