import { knex } from '../db.js';

export class MensajesDao {

  TABLE_NAME = 'mensajes';
  ID_COLUMN = 'id';
  
  async save(object) {
    try {
      const newMessageId = await knex.insert(object).from(this.TABLE_NAME);        
      console.log(`✔️ Mensaje nuevo agregado con ID: ${newMessageId}.`);
      return newMessageId;
    } catch (error) {
      console.log(error);
    } finally {
      knex.destroy();
    }
  }
  
  async getAll() {
    try {
      return await knex.select().from(this.TABLE_NAME);
    } catch (error) {
      console.log(error);
    } finally {
      knex.destroy();
    }
  }
}