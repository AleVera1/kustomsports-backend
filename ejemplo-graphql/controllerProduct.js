import crypto from "crypto";
import Producto from "./product.class.js";

const productosMap = {};

const createProducto = ({ datos }) => {
  const id = crypto.randomBytes(10).toString("hex");
  const createdProducto = new Producto(id, datos);

  productosMap[id] = createdProducto;

  return createdProducto;
};
const getProducto = ({ id }) => {
  if (!productosMap[id]) throw new Error("Producto no existe");

  return productosMap[id];
};

const updateProducto = ({ id, datos }) => {
  if (!productosMap[id]) throw new Error("Producto no existe");

  const updatedProducto = new Producto(id, datos);

  productosMap[id] = updatedProducto;

  return updatedProducto;
};

const deleteProducto = ({ id }) => {
  if (!productosMap[id]) throw new Error("Producto no existe");

  const deletedProducto = productosMap[id];

  delete productosMap[id];

  return deletedProducto;
};

export default {
  createProducto,
  getProducto,
  updateProducto,
  deleteProducto,
};
