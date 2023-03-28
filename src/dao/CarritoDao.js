import { CarritosModel } from "../modules/carritos.modules.js";
import { ProductosModel } from "../modules/productos.modules.js";
import mongoose from "mongoose";

mongoose.model('productos', ProductosModel.schema);

export class CarritoDao {
  async createCart() {
    const cart = new CarritosModel();
    await cart.save();
    return cart;
  }

  async getActualCart(userId) {
    const cart = await CarritosModel.findOne({ userId, finalizado: false }).populate('productos');
    if (!cart) {
      return await this.createCart();
    }
    return cart;
  }

  async saveProductToCart(cartId, { productId, cantidad }) {
    const cart = await CarritosModel.findById(cartId);
    if (!cart) {
      return false;
    }

    const producto = await ProductosModel.findById(productId);
    if (!producto) {
      return false;
    }

    const index = cart.productos.findIndex((p) => p._id.equals(producto._id));

    if (index === -1) {
      cart.productos.push(producto);
    } else {
      cart.productos[index].stock -= cantidad;
      cart.productos[index].save();
    }

    await cart.save();
    return true;
  }

  async getAllProductsFromCart(cartId) {
    const cart = await CarritosModel.findById(cartId).populate('productos');
    if (!cart) {
      return null;
    }
    return cart.productos;
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await CarritosModel.findById(cartId).populate('productos');
    if (!cart) {
      return false;
    }

    const index = cart.productos.findIndex((p) => p._id.equals(productId));
    if (index === -1) {
      return false;
    }

    const removedProduct = cart.productos.splice(index, 1)[0];
    removedProduct.stock += 1;
    removedProduct.save();
    await cart.save();
    return true;
  }

  async deleteCartById(cartId) {
    const cart = await CarritosModel.findByIdAndDelete(cartId);
    if (!cart) {
      return false;
    }
    return true;
  }
}