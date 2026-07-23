import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { buscarDashboard } from "@/service/indicador.service";

export class IndicadorController {
  async index(request: Request, response: Response) {
    const indicador = String(request.query.indicador ?? "").trim();
    const regiao = String(request.query.regiao ?? "").trim();

    if (!indicador) {
      throw new AppError("O indicador é obrigatório")
    }

    const dadosDaEquipe = await buscarDashboard(indicador, regiao);

    return response.status(200).json({ dadosDaEquipe });
  }
}
