
# 🇧🇷 Brasil em Números - Backend

Este é o repositório da API do **Brasil em Números**, um backend moderno, robusto e escalável desenvolvido em **Node.js**, **Express (v5)**, **TypeScript** e **Prisma ORM** integrado com **PostgreSQL**. A API tem como principal objetivo disponibilizar dados e indicadores sobre os estados e regiões do Brasil.

O projeto conta com um sistema de **seed automático** que consome a API oficial do IBGE para popular inicialmente a base de dados com as informações atualizadas das unidades federativas brasileiras de forma automatizada.

---

## 🚀 Funcionalidades Principais

- **Arquitetura Limpa e Modular:** Separação clara de responsabilidades entre Rotas, Controllers, Services, Middlewares e Banco de Dados.
- **TypeScript de Ponta:** Utilização de aliases de caminho (`@/*` mapeado para `src/*`) configurados nativamente via `tsconfig.json`.
- **Express 5.x:** Integração com a versão mais recente e moderna do framework de roteamento.
- **Prisma ORM (v7) com Adapter PG:** Uso de adapters nativos do PostgreSQL (`@prisma/adapter-pg`) para melhor performance e flexibilidade, utilizando o arquivo de configuração moderno `prisma.config.ts`.
- **Ambiente Dockerizado:** Setup de banco de dados PostgreSQL rápido e isolado utilizando Docker Compose.
- **Seeding Inteligente:** Integração com a API de localidades do IBGE para popular o banco de dados sem esforço manual.
- **Tratamento de Erros Global:** Middleware especializado para captura e tratamento de erros operacionais (`AppError`) e inesperados (500).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição | Versão Principal |
| :--- | :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript | v18+ |
| **Express** | Framework web para criação de APIs | 5.2.x |
| **TypeScript** | Superset tipado e seguro do JavaScript | 7.0.x |
| **Prisma ORM** | Object-Relational Mapping (ORM) moderno | 7.9.x |
| **PostgreSQL** | Banco de dados relacional robusto e estável | v16 |
| **Docker** | Conteinerização rápida do banco de dados | - |
| **Axios** | Cliente HTTP para consumir a API do IBGE | 1.18.x |
| **tsx watch** | Execução e reinicialização ágil em desenvolvimento | 4.23.x |

---

## 📂 Estrutura de Pastas

Abaixo está a organização das pastas e principais arquivos do projeto:

```text
brasil-em-numeros-backend/
├── prisma/                          # Configurações do banco de dados e ORM
│   ├── schema.prisma                # Definição do schema e modelos de dados
│   ├── seed.ts                      # Script de inicialização (Seed)
│   └── migrations/                  # Histórico de alterações do banco de dados
├── src/                             # Código-fonte da aplicação
│   ├── server.ts                    # Ponto de entrada (Bootstrap do Express)
│   ├── controller/                  # Lógica de controle de rotas (EstadosController)
│   ├── database/                    # Instanciação do Prisma Client com adaptador PG
│   ├── middleware/                  # Middlewares globais (Tratamento de erros)
│   ├── routes/                      # Definições e centralização de rotas HTTP
│   ├── service/                     # Regras de negócio e integração com IBGE
│   └── utils/                       # Utilitários e classes auxiliares (AppError)
├── .env.example                     # Modelo das variáveis de ambiente
├── docker-compose.yml               # Configuração do container PostgreSQL
├── prisma.config.ts                 # Configurações modernas do Prisma (v7+)
└── tsconfig.json                    # Configurações do compilador TypeScript
```

---

## 📋 Pré-requisitos

Para rodar o projeto localmente, certifique-se de ter instalado em sua máquina:
1. **Node.js** (versão 18 ou superior)
2. **NPM** (gerenciador de pacotes padrão) ou Yarn / Pnpm
3. **Docker** & **Docker Compose**

---

## ⚙️ Instruções de Instalação e Execução (Passo a Passo)

Siga os passos abaixo sequencialmente para clonar, configurar e rodar o projeto do zero:

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/brasil-em-numeros-backend.git
cd brasil-em-numeros-backend
```

### 2. Instalar as Dependências
Instale todas as dependências do projeto listadas no `package.json`:
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Copie o arquivo de exemplo para criar o seu arquivo `.env`:
```bash
cp .env.example .env
```
O arquivo `.env` gerado virá com a string padrão de conexão com o banco de dados rodando no Docker local:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api-brasil-ibge?schema=public"
```

### 4. Subir o Banco de Dados com Docker
Inicie o container do PostgreSQL em segundo plano utilizando o Docker Compose:
```bash
docker compose up -d
```
*Isso criará e iniciará uma instância do Postgres na porta `5432` com o usuário `postgres` e senha `postgres` conforme configurado em `docker-compose.yml`.*

### 5. Executar as Migrations e Popular o Banco (Seed)
Execute o comando do Prisma para rodar as migrations (criar as tabelas no banco de dados). Este comando também irá gerar localmente o Prisma Client e, ao final, executará o script de **seed automático** que busca os estados brasileiros da API do IBGE e os grava no seu banco local:
```bash
npx prisma migrate dev
```
*(Opcional) Caso queira rodar apenas o processo de seed separadamente em um banco de dados já migrado:*
```bash
npx prisma db seed
```

### 6. Iniciar o Servidor em Desenvolvimento
Com o banco de dados pronto e populado, inicie o servidor Express local:
```bash
npm run dev
```
O servidor começará a rodar e exibirá a seguinte mensagem de sucesso no terminal:
```text
Server esta rodando na porta 3333
```

---

## 🗄️ Modelagem de Dados (Banco de Dados)

O banco de dados PostgreSQL possui duas entidades principais configuradas no `prisma/schema.prisma`:

### `Estado`
Armazena as informações das unidades federativas do Brasil obtidas via IBGE.
- `id` (Int, Autoincrement, Chave Primária): Identificador único interno.
- `sigla` (String): Sigla do estado (ex: `SP`, `RJ`, `MG`).
- `nome` (String): Nome completo do estado (ex: `São Paulo`).
- `regiao` (Json): Objeto que armazena os dados da região geográfica (ID, sigla e nome).

### `Dashboard`
Armazena indicadores e métricas consolidadas por região geográfica.
- `id` (Int, Autoincrement, Chave Primária): Identificador único interno.
- `indicador` (String): Nome do indicador ou métrica específica.
- `regiao` (String): Nome ou sigla da região associada.
- `figura` (Json): Dados visuais ou estruturais sobre a representação gráfica.
- `kpis` (Json): Indicadores-chave de performance detalhados.
- **Restrição Unique:** `[indicador, regiao]` composto, impedindo duplicidade do mesmo indicador para a mesma região.

---

## 🔌 Endpoints da API

A API disponibiliza atualmente a rota principal para consulta de estados:

### 1. Listar Estados
Retorna todos os estados brasileiros cadastrados, ordenados alfabeticamente por nome.

- **Método:** `GET`
- **Rota:** `/estados`
- **URL Completa (Local):** `http://localhost:3333/estados`
- **Resposta de Sucesso (200 OK):**
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
      },
      {
        "id": 2,
        "sigla": "AL",
        "nome": "Alagoas",
        "regiao": {
          "id": 2,
          "sigla": "NE",
          "nome": "Nordeste"
        }
      }
      // ... demais estados ordenados por nome
    ]
  }
  ```

---

## 🛡️ Tratamento de Erros e Padrões de Código

- **AppError:** Uma classe utilitária personalizada (`src/utils/AppError.ts`) que modela exceções de negócio operacionais conhecidas (ex: falhas de validação, recursos não encontrados). Ela recebe uma mensagem clara e um código HTTP customizado (padrão 400).
- **Middleware Global de Erros:** Todas as exceções não capturadas no fluxo normal das rotas caem no middleware `errorHandling` (`src/middleware/error-handling.ts`). Ele intercepta o erro, verifica se é do tipo `AppError` e devolve uma resposta elegante ao cliente. Erros de sistema inesperados são tratados e mascarados com um status `500 Internal Server Error` genérico por motivos de segurança.
- **Path Aliases (`@/`):** Facilita importações dentro do código. Graças ao `tsconfig.json`, você pode importar arquivos usando `@/controller/` ou `@/utils/` ao invés de usar referências relativas complexas como `../../utils/`.

---

## 👥 Equipe / Autoria

Desenvolvido com carinho pelo **Squad 2** 🚀.
