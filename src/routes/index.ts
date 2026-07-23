import { Router } from "express";
import { estadoroutes } from "./estados-routes";
import { indicadorRoutes } from "./indicador-routes";

const routes = Router();

routes.use("/estados", estadoroutes)
routes.use("/dashboard", indicadorRoutes )

export { routes };
  