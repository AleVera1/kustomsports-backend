import "../config/db.js";
import { MensajesModel } from "../modules/mensajes.modules.js";

export class MensajesDao {

  ID_FIELD = "_id";
  
  static async exists(id) {
    try {
      return await MensajesModel.findById(id);
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      return await MensajesModel.find();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  async getMessageById(objectId) {
    try {
      const message = await MensajesModel.findOne({
        [this.ID_FIELD] : objectId  
      })

      console.log(message);

      return message;

    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  async createMessage(object) {
    try {
      return await MensajesModel.create(object)
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  async updateMessageById(id, object) {
    try {
      await MensajesModel.findByIdAndUpdate(
        {
          [this.ID_FIELD] : id
        },
        object, 
        {
          runValidators: true
        })
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  async deleteMessageById(id) {
    try {
      return await MensajesModel.findByIdAndDelete({[this.ID_FIELD]: id})
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}