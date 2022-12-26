import { createProductoTable, createCarritoTable, createProductoCarritoTable, createMensajesTable } from './CreateTables.js';
import { populateCarts, populateProductoCarrito, populateProducts, populateMessages } from './Populate.js';

async function rebuild() {
  await createProductoTable();
  await createCarritoTable();
  await createProductoCarritoTable();
  await createMensajesTable()
  
  await populateProducts();
  await populateCarts();
  await populateMessages();
  await populateProductoCarrito();
}

rebuild();