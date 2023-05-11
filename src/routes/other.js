import express from "express";
const router = express.Router();
import { fork } from "child_process";

const randomNumbersGeneratorFork = fork(
  "./src/functions/randomNumbersGenerator.js"
);

router.get("/randoms", (req, res) => {
  const cant = req.query.cant || 5000;

  randomNumbersGeneratorFork.on("message", (resultado) => {
    res.status(200).json(resultado);
  });
  randomNumbersGeneratorFork.send(cant);
});

export default router;
