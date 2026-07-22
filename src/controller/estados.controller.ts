import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export class EstadosController {
  async index(request: Request, response: Response) {
    const estados = await prisma.estado.findMany({
      orderBy: { nome: "asc" },
    });

    return response.json({ estados });
  }
}
