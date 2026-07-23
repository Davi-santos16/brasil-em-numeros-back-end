import { IndicadorController } from "../controller/indicador.controller.js";
import { Router } from "express";

const indicadorRoutes = Router();

const indicadorController = new IndicadorController();
indicadorRoutes.get("/", indicadorController.index);

export { indicadorRoutes };
