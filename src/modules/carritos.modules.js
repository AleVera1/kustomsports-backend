import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  username: { type: String, require: true },
  products: { type: Array, require: true },
});

export const CarritosModel = mongoose.model("carritos", Schema);
