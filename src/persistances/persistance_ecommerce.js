import { CarritoDao } from "../dao/CarritoDao.js"
import { ProductoDao } from "../dao/ProductoDao.js"

const productosDao = new ProductoDao();
const carritosDao = new CarritoDao();

const getProducts = () => {
  return productosDao.getAll();
}

const createProducts = (body) => {
  return productosDao.createProduct(body);
}

const getAllCart = (req) => {
  return carritosDao.getDetailedCart(req);
};


const clearAllCart = (req) => {
  return carritosDao.clearCart(req);
}

const addAProductToCart = (user, name) => {
  return carritosDao.addToCart(user, name);
}

export { getProducts, createProducts, getAllCart, clearAllCart, addAProductToCart }