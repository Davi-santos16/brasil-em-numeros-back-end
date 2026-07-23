import { Router } from "express";
import { estadoroutes } from "./estados-routes.js";
import { indicadorRoutes } from "./indicador-routes.js";

const routes = Router();

routes.use("/estados", estadoroutes)
routes.use("/dashboard", indicadorRoutes )

export { routes };
  