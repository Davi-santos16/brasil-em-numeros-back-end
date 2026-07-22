import axios from "axios";
import { prisma } from "../database/prisma";

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

    const dadosParaInserir = data.map((uf) => ({
      sigla: uf.sigla,
      nome: uf.nome,
      regiao: uf.regiao as any,
    }));

    const resultado = await prisma.estado.createMany({
      data: dadosParaInserir,
      skipDuplicates: true,
    });

    console.log(
      `✅ Sucesso! ${resultado.count} estados inseridos no banco de dados.`,
    );
  } catch (error) {
    console.error("❌ Erro ao popular a tabela de estados:", error);
    throw error;
  }
}
