import { Router } from "express";
import { estadoroutes } from "./estados-routes";

const routes = Router();

routes.use("/estados", estadoroutes)

export { routes };
