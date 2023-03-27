import "../config/db.js";
import { CarritosModel } from "../modules/carritos.modules.js";

export class CarritoDao {

  ID_FIELD = "_id";

  async saveProductToCart(cartId, product) {
    try {
      let carrito;
      if (cartId) {
        carrito = await CarritosModel.findById(cartId);
      }

      if (!carrito) {
        carrito = await CarritosModel.create({
          products: []
        });
      }

      carrito.products.push(product);
      await carrito.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getCart(cartId) {
    try {
      const carrito = await CarritosModel.findById(cartId);
      return carrito;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteCart(cartId) {
    try {
      const result = await CarritosModel.findByIdAndDelete(cartId);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const carrito = await CarritosModel.findById(cartId);
      const index = carrito.products.findIndex(p => p.productId.toString() === productId);

      if (index === -1) {
        return false;
      }

      carrito.products.splice(index, 1);
      await carrito.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
