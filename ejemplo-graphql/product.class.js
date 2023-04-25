export default class Producto {
  constructor(id, { name, description, price }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
