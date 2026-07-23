import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "@/utils/AppError";
import "dotenv/config";
import axios from "axios";

export class IndicadorController {
  async index(request: Request, response: Response) {
    const { indicador, regiao } = request.query;

    if (!indicador) {
      throw new AppError("O indicador é obrigatório")
    }

    const urlAPI = process.env.API_DADOS_URL;

    const respostaAPI = await axios.get(`${urlAPI}/grafico`, {
      params: {
        indicador,
        regiao,
      },
    });

    const dadosDaEquipe = respostaAPI.data;

    return response.status(200).json({ dadosDaEquipe });
  }
}
