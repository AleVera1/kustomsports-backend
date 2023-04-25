import express from "express";
import { graphqlHTTP } from "express-graphql";
import controllerProduct from "./controllerProduct.js";
import schema from "./product.modules.js";

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: {
      getProducto: controllerProduct.getProducto,
      createProducto: controllerProduct.createProducto,
      updateProducto: controllerProduct.updateProducto,
      deleteProducto: controllerProduct.deleteProducto,
    },
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server listening port 3000");
});

//para crear el producto

/* mutation {
  createProducto(datos: { name: "Producto 1", description: "Descripción del producto 1", price: 10 }) {
    id
    name
    description
    price
  }
}
 */

//para buscar el producto

/* query {
  getProducto(id: "63d32cf31ce9082f9fb4") {
    id
    name
    description
    price
  }
} */

//para updatearlo

/* mutation {
  updateProducto(id: "63d32cf31ce9082f9fb4", datos: { name: "Nuevo nombre", description: "Nueva descripción", price: 10 }) {
    id
    name
    description
    price
  }
} */

//para borrarlo

/* mutation {
  deleteProducto(id: "63d32cf31ce9082f9fb4") {
    id
    name
    description
    price
  }
} */
