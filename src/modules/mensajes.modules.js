import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 100
  },
  date: {
    type: Date,
    default: Date.now()
  },
  mensaje: {
    type: String,
    required: true,
    max: 500
  }
})

export const MensajesModel = mongoose.model("mensajes", Schema);