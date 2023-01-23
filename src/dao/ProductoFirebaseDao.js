import db from '../config/dbFirebase.js'

export default class ProductoDao {
  async getAll() {
    try {
      const products = [];
      const querySnapshot = await db.collection('productos').get();
      querySnapshot.forEach((doc) => {
        products.push(doc.data());
      });
      return products;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getProductById(id) {
    try {
      const doc = await db.collection('productos').doc(id).get();
      return doc.data();
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createProduct(product) {
    try {
      const res = await db.collection('productos').add(product);
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateProductById(id, product) {
    try {
      const res = await db.collection('productos').doc(id).update(product);
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteProductById(id) {
    try {
      const res = await db.collection('productos').doc(id).delete();
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}