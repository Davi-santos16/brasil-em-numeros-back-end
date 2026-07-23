import axios from "axios";
import { prisma } from "../database/prisma.js";

interface RegiaoIBGE {
  id: number;
  sigla: string;
  nome: string;
}

interface EstadoIBGE {
  id: number;
  sigla: string;
  nome: string;
  regiao: RegiaoIBGE;
}

export async function popularEstadosSeed() {
  console.log("Iniciando o processo de seed de Estados...");

  try {
    const { data } = await axios.get<EstadoIBGE[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
    );

    const estados = await Promise.all(
      data.map((uf) =>
        prisma.estado.upsert({
          where: { sigla: uf.sigla },
          update: {
            nome: uf.nome,
            regiao: uf.regiao as any,
          },
          create: {
            sigla: uf.sigla,
            nome: uf.nome,
            regiao: uf.regiao as any,
          },
        }),
      ),
    );

    console.log(
      `✅ Sucesso! ${estados.length} estados sincronizados no banco de dados.`,
    );
  } catch (error) {
    console.error("❌ Erro ao popular a tabela de estados:", error);
    throw error;
  }
}
