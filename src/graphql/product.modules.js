import { buildSchema } from "graphql";

const prodSchema = buildSchema(`
  type Product {
    title: String!,
    price: Int,
    image: String,
    stock: Int,
    timestamp: String,
    code: String,
    description: String
  }
  type Cart {
    timestamp: String,
    username: String!,
    products: [Product]
  }
  type Query {
    getCart(username: String!): Cart
  }
  type Mutation {
    clearCart(username: String!): Cart,
  }
`);

export default prodSchema;
