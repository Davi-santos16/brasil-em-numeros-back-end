-- CreateTable
CREATE TABLE "Estado" (
    "id" SERIAL NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "regiao" JSONB NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "indicador" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "figura" JSONB NOT NULL,
    "kpis" JSONB NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_indicador_regiao_key" ON "Dashboard"("indicador", "regiao");
