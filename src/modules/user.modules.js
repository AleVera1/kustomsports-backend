import { model, Schema } from "mongoose";

const userSchema = Schema({
  username: { type: String },
  password: { type: String },
  name: { type: String },
  address: { type: String },
  age: { type: Number },
  phone: { type: Number },
  avatar: { type: String }
});

export const User = model("user", userSchema);