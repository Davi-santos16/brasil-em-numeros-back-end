import { EstadosController } from "../controller/estados.controller.js";
import { Router } from "express";

const estadoroutes = Router();

const estadosController = new EstadosController();
estadoroutes.get("/", estadosController.index);

export { estadoroutes };
