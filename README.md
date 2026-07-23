# Brasil em Numeros - Backend

API backend do projeto **Brasil em Numeros**, desenvolvida com Node.js, Express, TypeScript, Prisma ORM e PostgreSQL.

O projeto expõe dados de estados brasileiros salvos no banco local e possui uma rota de dashboard com cache em banco: se o indicador ja foi consultado antes, a API responde usando o PostgreSQL; se ainda nao existe no banco, consulta a API da equipe de analise de dados, salva o resultado e retorna a resposta ao front-end.

## Tecnologias

- Node.js
- Express 5
- TypeScript
- Prisma ORM 7
- PostgreSQL 16
- Docker Compose
- Axios
- CORS
- dotenv

## Estrutura do Projeto

```text
brasil-em-numeros-backend/
├── prisma/
│   ├── migrations/              # Historico de migrations do banco
│   ├── schema.prisma            # Modelos Estado e Dashboard
│   └── seed.ts                  # Seed inicial dos estados via API do IBGE
├── src/
│   ├── controller/              # Controllers das rotas HTTP
│   ├── database/                # Instancia do Prisma Client
│   ├── middleware/              # Middleware global de erros
│   ├── routes/                  # Definicao e agrupamento das rotas
│   ├── service/                 # Servicos e integracoes externas
│   ├── utils/                   # Utilitarios da aplicacao
│   └── server.ts                # Entrada da aplicacao Express
├── docker-compose.yml           # PostgreSQL local
├── prisma.config.ts             # Configuracao do Prisma
├── package.json                 # Scripts e dependencias
└── tsconfig.json                # Configuracao TypeScript
```

## Requisitos

- Node.js 18 ou superior
- npm
- Docker e Docker Compose

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

3. Confira as variaveis de ambiente:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api-brasil-ibge?schema=public"
API_DADOS_URL="http://localhost:3000"
```

`DATABASE_URL` e usada pelo Prisma para conectar ao PostgreSQL. `API_DADOS_URL` e usada pela rota `/dashboard` para consultar a API externa de indicadores.

## Rodando Localmente

1. Suba o PostgreSQL:

```bash
docker compose up -d
```

2. Execute as migrations:

```bash
npx prisma migrate dev
```

Esse comando aplica as migrations e gera o Prisma Client.

3. Execute o seed para popular a tabela `Estado` com dados da API publica do IBGE:

```bash
npx prisma db seed
```

4. Inicie o servidor em desenvolvimento:

```bash
npm run dev
```

Por padrao, a API roda em:

```text
http://localhost:3333
```

## Scripts

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor com `tsx watch src/server.ts` |

## Banco de Dados

O schema Prisma define dois modelos.

### Estado

Armazena unidades federativas brasileiras importadas da API do IBGE.

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | `Int` | Chave primaria autoincremental |
| `sigla` | `String` | Sigla unica da UF, como `CE`, `SP` ou `RJ` |
| `nome` | `String` | Nome do estado |
| `regiao` | `Json` | Dados da regiao retornados pelo IBGE |

### Dashboard

Armazena indicadores por regiao retornados pela API da equipe de analise de dados.

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | `Int` | Chave primaria autoincremental |
| `indicador` | `String` | Nome ou identificador do indicador |
| `regiao` | `String` | Regiao associada ao indicador |
| `figura` | `Json` | Dados estruturados para visualizacao |
| `kpis` | `Json` | Indicadores consolidados |

Existe uma restricao unica composta por `indicador` e `regiao`. Essa chave e usada como cache para evitar chamadas repetidas para a API externa quando o front-end solicitar o mesmo indicador para a mesma regiao.

## Endpoints

### `GET /estados`

Lista todos os estados cadastrados, ordenados pelo nome.

Exemplo de resposta:

```json
{
  "estados": [
    {
      "id": 1,
      "sigla": "AC",
      "nome": "Acre",
      "regiao": {
        "id": 1,
        "sigla": "N",
        "nome": "Norte"
      }
    }
  ]
}
```

### `GET /dashboard`

Consulta dados de dashboard usando cache no banco de dados.

Query params:

| Parametro | Obrigatorio | Descricao |
| --- | --- | --- |
| `indicador` | Sim | Indicador a ser consultado |
| `regiao` | Nao | Regiao usada como filtro |

Exemplo:

```text
GET /dashboard?indicador=populacao&regiao=Nordeste
```

Fluxo interno:

1. Procura no banco um registro com o mesmo `indicador` e a mesma `regiao`.
2. Se encontrar, retorna os dados salvos na tabela `Dashboard`.
3. Se nao encontrar, chama a API externa em:

```text
{API_DADOS_URL}/grafico
```

4. Salva `figura` e `kpis` no banco.
5. Retorna os dados salvos ao front-end.

Exemplo de resposta:

```json
{
  "dadosDaEquipe": {
    "indicador": "populacao",
    "regiao": "Nordeste",
    "figura": {},
    "kpis": {}
  }
}
```

Para o cache funcionar, a API externa deve retornar um JSON contendo os campos `figura` e `kpis`.

## Seed de Estados

O seed fica em `prisma/seed.ts` e chama `popularEstadosSeed()` em `src/service/estado.service.ts`.

A origem dos dados e a API publica do IBGE:

```text
https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
```

O seed sincroniza `sigla`, `nome` e `regiao` de cada estado na tabela `Estado`.

Para atualizar os estados quando o IBGE mudar os dados, execute novamente:

```bash
npx prisma db seed
```

O campo `sigla` e unico no banco, e o seed usa `upsert`. Por isso, se o estado ainda nao existir ele sera criado; se ja existir, `nome` e `regiao` serao atualizados.

## Tratamento de Erros

A aplicacao possui um middleware global em `src/middleware/error-handling.ts`.

- Erros do tipo `AppError` retornam o status configurado na propria excecao.
- Erros inesperados retornam status `500` com a mensagem do erro.

Na rota `/dashboard`, quando o parametro `indicador` nao e enviado, a API retorna erro `400`.

## Observacoes de Desenvolvimento

- A aplicacao usa alias de importacao `@/*` apontando para `src/*`.
- O Prisma Client e gerado em `prisma/generated/prisma`, conforme `schema.prisma`.
- O servidor Express usa CORS e JSON parser globalmente.
- A porta da API esta fixa em `3333` no arquivo `src/server.ts`.

## Autoria

Projeto desenvolvido pelo **Squad 2**.
