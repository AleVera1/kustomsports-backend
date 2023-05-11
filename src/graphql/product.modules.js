import { buildSchema } from "graphql";

const schema = buildSchema(`
  input ProductoInput {
    name: String
    description: String
    price: Int
  }

  type Producto {
    id: ID!
    name: String
    description: String
    price: Int
  }

  type Query {
    getProducto(id: ID!): Producto
  }

  type Mutation {
    createProducto(datos: ProductoInput): Producto
    updateProducto(id: ID!, datos: ProductoInput): Producto
    deleteProducto(id: ID!): Producto
  }
`);

export default schema;
