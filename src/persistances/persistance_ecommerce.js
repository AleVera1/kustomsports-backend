import { CarritosModel } from "../modules/carritos.modules.js";
import { ProductosModel } from "../modules/productos.modules.js";
import { ProductoDao } from "../dao/ProductoDao.js"


const productosDao = new ProductoDao();

const getProducts = () => {
  return ProductosModel.find().lean();
}

const createProducts = (body) => {
  return productosDao.createProduct(body);
}

const getDetailedCart = async (req) => {
  const user = req.user.username
  const productsMongo = await CarritosModel.findOne({username: user}, {products: 1, _id:0}).lean();
  console.log(productsMongo.products)
  const productsArray = productsMongo.products

  const productsInfo = [];
  await Promise.all(productsArray.map(async (prod) => {
      const prodData = await ProductosModel.findOne({title: prod}, {price:1, image:1, _id:0}).lean();
      console.log(prodData);
      
      if (prodData) { // Add a check to ensure prodData is not null or undefined
        let prodInfo = {
            title: prod,
            price: prodData.price,
            image: prodData.image
        };
        productsInfo.push(prodInfo);
      }
  }));

  return productsInfo
};


const clearCart = async (req) => {
  const user = req.user.username;
  await CarritosModel.findOneAndUpdate({username: user}, {products: []});
}

const addToCart = async (user, name) => {
  await CarritosModel.findOneAndUpdate(
    { username: user },
    { $push: { products: name } },
    { upsert: true }
  );
}

export { getProducts, createProducts, getDetailedCart, clearCart, addToCart }