const Contenedor = require("./Contenedor");

const contenedor = new Contenedor("productos.json");

const main = async () => {
  const id1 = await contenedor.save({ title: "Remera", price: 7500.66 });
  const id2 = await contenedor.save({ title: "Zapatilla", price: 15700.75 });
  const id3 = await contenedor.save({ title: "Camiseta", price: 10000 });

  console.log(id1, id2, id3); // 1, 2, 3

  const object2 = await contenedor.getById(2);
  console.log(object2); // { title: 'Zapatilla', price: 15700.75, id: 2 }

  await contenedor.deleteById(2);

  const allCurrentObjects = await contenedor.getAll();
  console.log(allCurrentObjects);

  //await contenedor.deleteAll();
};

main();