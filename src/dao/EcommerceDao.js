import { CarritosModel } from "../modules/carritos.modules.js";
import { ProductosModel } from "../modules/productos.modules.js";
import MongoClient from "../config/mongodb.js";

let ecommerceDaoInstance

export default class EcommerceDAOMongo {

    constructor() {
        this.db = new MongoClient();
        this.prodCollection = ProductosModel;
        this.cartCollection = CarritosModel;
    };

    static getEcommerceDAOInstance() {
        if (!ecommerceDaoInstance) {
            ecommerceDaoInstance = new EcommerceDAOMongo();
        }
        return ecommerceDaoInstance;
    };

    getProducts = async () => {
        try {
            await this.db.connect();
            return await this.prodCollection.find().lean();
        } catch (err) {
            console.log(err);
        } 
    };

    createProduct = async (object) => {
      try {
        await this.db.connect();
        return await this.prodCollection.create(object);
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    getDetailedCart = async (req) => {
        try {
            await this.db.connect();
            const user = req.user.username
            const productsMongo = await this.cartCollection.findOne({username: user}, {products: 1, _id:0}).lean();
            const productsArray = productsMongo.products
        
            const productsInfo = [];
            await Promise.all(productsArray.map(async (prod) => {
                const prodData = await this.prodCollection.findOne({title: prod}, {price:1, image:1, _id:0}).lean();
        
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
        } catch (err) {
            console.log(err);
        }

    };

    clearCart = async (req) => {
        try {
            this.db.connect();
            const user = req.user.username;
            await this.cartCollection.findOneAndUpdate({username: user}, {products: []});
        } catch (err) {
            console.log(err);
        }

    };

    addToCart = async (user, name) => {
        try {
            this.db.connect();
            await this.cartCollection.findOneAndUpdate(
                {username: user},
                { $push: { products: name } },
                { upsert: true }
            )
        } catch (err) {
            console.log(err);
        }
    };

};