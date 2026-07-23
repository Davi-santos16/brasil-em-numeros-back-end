import axios from "axios";
import { prisma } from "../database/prisma";
import { AppError } from "@/utils/AppError";
import type { Prisma } from "../../prisma/generated/prisma/client";

type JsonEntrada = Prisma.InputJsonValue;

interface DashboardCache {
  indicador: string;
  regiao: string;
  figura: Prisma.JsonValue;
  kpis: Prisma.JsonValue;
}

function montarDashboardResposta(dashboard: DashboardCache) {
  return {
    indicador: dashboard.indicador,
    regiao: dashboard.regiao,
    figura: dashboard.figura,
    kpis: dashboard.kpis,
  };
}

function converterParaJson(valor: unknown, campo: string): JsonEntrada {
  if (valor === undefined) {
    throw new AppError(`A resposta da API de dados nao contem o campo ${campo}`, 502);
  }

  return valor as JsonEntrada;
}

function extrairDadosDashboard(dadosDaEquipe: unknown) {
  if (!dadosDaEquipe || typeof dadosDaEquipe !== "object" || Array.isArray(dadosDaEquipe)) {
    throw new AppError("Resposta invalida da API de dados", 502);
  }

  const dados = dadosDaEquipe as Record<string, unknown>;

  return {
    figura: converterParaJson(dados.figura, "figura"),
    kpis: converterParaJson(dados.kpis, "kpis"),
  };
}

export async function buscarDashboard(indicador: string, regiao: string) {
  const dashboardSalvo = await prisma.dashboard.findUnique({
    where: {
      indicador_regiao: {
        indicador,
        regiao,
      },
    },
  });

  if (dashboardSalvo) {
    return montarDashboardResposta(dashboardSalvo);
  }

  const urlAPI = process.env.API_DADOS_URL;

  if (!urlAPI) {
    throw new AppError("API_DADOS_URL nao configurada", 500);
  }

  const respostaAPI = await axios.get(`${urlAPI}/grafico`, {
    params: {
      indicador,
      regiao,
    },
  });

  const { figura, kpis } = extrairDadosDashboard(respostaAPI.data);

  const dashboardCriado = await prisma.dashboard.upsert({
    where: {
      indicador_regiao: {
        indicador,
        regiao,
      },
    },
    update: {},
    create: {
      indicador,
      regiao,
      figura,
      kpis,
    },
  });

  return montarDashboardResposta(dashboardCriado);
}
