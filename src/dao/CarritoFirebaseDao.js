import {db} from "../config/dbFirestore.js";

export default class CarritoDao {
  ID_FIELD = "id";

  async createCart() {
    try {
      const cartRef = db.collection("carritos").doc();
      await cartRef.set({
        products: []
      });
      return cartRef.id;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteCartById(id) {
    try {
      const cartRef = db.collection("carritos").doc(id);
      await cartRef.delete();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async saveProductToCart(id, obj) {
    try {
      const cartRef = db.collection("carritos").doc(id);
      const cartSnapshot = await cartRef.get();
      const cart = cartSnapshot.data();
      cart.products.push(obj.productId);
      await cartRef.set(cart);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteProductFromCart(id, productId) {
    try {
      const cartRef = db.collection("carritos").doc(id);
      const cartSnapshot = await cartRef.get();
      const cart = cartSnapshot.data();
      cart.products = cart.products.filter((p) => p !== productId);
      await cartRef.set(cart);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAllProductsFromCart(id) {
    try {
      const cartRef = db.collection("carritos").doc(id);
      const cartSnapshot = await cartRef.get();
      return cartSnapshot.data().products;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

