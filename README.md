# MyContacts — Backend API

API RESTful para gerenciamento de contatos, desenvolvida com **Node.js**, **Express** e **PostgreSQL** (via Docker).

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Instalação](#configuração-e-instalação)
- [Banco de Dados (Docker)](#banco-de-dados-docker)
- [Rodando o Projeto](#rodando-o-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Schema do Banco de Dados](#schema-do-banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Boas Práticas Adotadas](#boas-práticas-adotadas)

---

## Visão Geral

O **MyContacts Backend** é uma API que permite o gerenciamento completo de contatos (CRUD), com suporte a categorização. Cada contato pode ser associado a uma categoria, permitindo melhor organização.

### Funcionalidades

- Listar todos os contatos
- Buscar contato por ID
- Criar novo contato
- Atualizar contato existente
- Deletar contato
- Validação de campos obrigatórios e unicidade de e-mail

---

## Tecnologias

| Tecnologia | Versão      | Finalidade                        |
| ---------- | ----------- | --------------------------------- |
| Node.js    | >= 18.x     | Runtime JavaScript                |
| Express    | ^4.21.2     | Framework HTTP                    |
| PostgreSQL | 15 (Docker) | Banco de dados relacional         |
| pg         | ^8.13.3     | Driver PostgreSQL para Node.js    |
| Docker     | —           | Conteinerização do banco de dados |
| Nodemon    | ^3.1.9      | Hot-reload em desenvolvimento     |
| ESLint     | ^9.20.1     | Linter e qualidade de código      |

---

## Arquitetura do Projeto

O projeto segue uma arquitetura em camadas, separando responsabilidades de forma clara:

```
src/
├── index.js                     # Entry point — inicializa o servidor Express
└── App/
    ├── routes.js                # Definição de todas as rotas da API
    ├── controller/
    │   └── ContactControler.js  # Lógica de negócio e tratamento de requisições
    └── repositories/
        └── ContactRepository.js # Abstração de acesso ao banco de dados (queries SQL)

database/
├── index.js                     # Configuração e conexão com o PostgreSQL
└── schema.sql                   # DDL — estrutura das tabelas
```

### Camadas

| Camada          | Arquivo                | Responsabilidade                                           |
| --------------- | ---------------------- | ---------------------------------------------------------- |
| **Entry Point** | `index.js`             | Inicializa Express, registra middlewares e sobe o servidor |
| **Routes**      | `routes.js`            | Mapeia verbos HTTP e caminhos para os controllers          |
| **Controller**  | `ContactControler.js`  | Valida entrada, chama o repository e formata a resposta    |
| **Repository**  | `ContactRepository.js` | Executa queries SQL no banco de dados                      |
| **Database**    | `database/index.js`    | Gerencia a conexão com o PostgreSQL via `pg`               |

---

## Pré-requisitos

Antes de começar, garanta que você possui instalado:

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## Configuração e Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd MyContacts_BackEnd
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

---

## Banco de Dados (Docker)

O banco de dados PostgreSQL é executado em um container Docker. Utilize o `docker-compose.yml` incluído no projeto.

### Subir o container do banco

```bash
docker-compose up -d
```

Esse comando irá:

- Criar e iniciar um container PostgreSQL na porta `5432`
- Criar o banco de dados `mycontacts` automaticamente
- Persistir os dados em um volume Docker (`pgdata`)

### Aplicar o Schema

Com o container rodando, execute o schema SQL para criar as tabelas:

```bash
docker exec -i mycontacts_db psql -U root -d mycontacts < src/database/schema.sql
```

### Verificar o container

```bash
docker ps
docker logs mycontacts_db
```

### Derrubar o container (mantendo os dados)

```bash
docker-compose down
```

### Derrubar o container e apagar os dados

```bash
docker-compose down -v
```

---

## Rodando o Projeto

### Modo Desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## Endpoints da API

Base URL: `http://localhost:3000`

### Contatos

#### `GET /contacts`

Lista todos os contatos cadastrados.

**Response `200 OK`:**

```json
[
    {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "11999999999",
        "category_id": "uuid | null"
    }
]
```

---

#### `GET /contacts/:id`

Retorna um contato específico pelo ID.

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|--------|--------------------|
| `id` | UUID | ID do contato |

**Response `200 OK`:**

```json
{
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "category_id": "uuid | null"
}
```

**Response `404 Not Found`:**

```json
{ "error": "Contact not found" }
```

---

#### `POST /contacts`

Cria um novo contato.

**Body (JSON):**

```json
{
    "name": "João Silva", // obrigatório
    "email": "joao@email.com", // obrigatório, deve ser único
    "phone": "11999999999", // opcional
    "category_id": "uuid" // opcional
}
```

**Response `200 OK`:**

```json
{
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "category_id": "uuid | null"
}
```

**Erros possíveis:**
| Status | Mensagem | Motivo |
|--------|---------------------------|------------------------------|
| `400` | `"Name is required"` | Campo `name` não enviado |
| `400` | `"Email already exists"` | E-mail já cadastrado |

---

#### `PUT /contacts/:id`

Atualiza os dados de um contato existente.

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|--------|--------------------|
| `id` | UUID | ID do contato |

**Body (JSON):**

```json
{
    "name": "João Atualizado",
    "email": "novo@email.com",
    "phone": "11988888888",
    "category_id": "uuid"
}
```

**Response `200 OK`:** Contato atualizado.

**Erros possíveis:**
| Status | Mensagem | Motivo |
|--------|---------------------------|-------------------------------------|
| `404` | `"Contact not found"` | ID não corresponde a nenhum contato |
| `400` | `"Name is required"` | Campo `name` não enviado |
| `400` | `"Email already exists"` | E-mail já pertence a outro contato |

---

#### `DELETE /contacts/:id`

Remove um contato pelo ID.

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|--------|--------------------|
| `id` | UUID | ID do contato |

**Response `204 No Content`:** Contato deletado com sucesso.

**Response `404 Not Found`:**

```json
{ "error": "Contact not found" }
```

---

## Schema do Banco de Dados

### Tabela `categories`

| Coluna | Tipo    | Restrições                         |
| ------ | ------- | ---------------------------------- |
| `id`   | UUID    | PK, NOT NULL, UNIQUE, default uuid |
| `name` | VARCHAR | NOT NULL                           |

### Tabela `contacts`

| Coluna        | Tipo    | Restrições                         |
| ------------- | ------- | ---------------------------------- |
| `id`          | UUID    | PK, NOT NULL, UNIQUE, default uuid |
| `name`        | VARCHAR | NOT NULL                           |
| `email`       | VARCHAR | NOT NULL                           |
| `phone`       | VARCHAR | Opcional                           |
| `category_id` | UUID    | FK → `categories(id)`, Opcional    |

### Diagrama de Relacionamento

```
categories (1) ──────── (0..N) contacts
     id  ◄────────────────── category_id
     name                    name
                             email
                             phone
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

| Variável      | Padrão       | Descrição                         |
| ------------- | ------------ | --------------------------------- |
| `DB_HOST`     | `localhost`  | Host do PostgreSQL                |
| `DB_PORT`     | `5432`       | Porta do PostgreSQL               |
| `DB_USER`     | `root`       | Usuário do banco de dados         |
| `DB_PASSWORD` | `root`       | Senha do banco de dados           |
| `DB_NAME`     | `mycontacts` | Nome do banco de dados            |
| `PORT`        | `3000`       | Porta em que o servidor vai rodar |

> ⚠️ **Nunca versione o arquivo `.env`** com credenciais reais. Ele já está incluído no `.gitignore`.

---

## Scripts Disponíveis

```bash
npm run dev    # Inicia em modo desenvolvimento com nodemon (hot-reload)
npm start      # Inicia em modo produção
```

---

## Boas Práticas Adotadas

- **Separação de camadas**: Controller → Repository → Database, seguindo o princípio de responsabilidade única (SRP).
- **Repository Pattern**: Isola as queries SQL do restante da aplicação, facilitando testes e troca de banco de dados.
- **Validações no Controller**: Validações de negócio centralizadas antes de acessar o banco.
- **HTTP Status Codes semânticos**: `200`, `204`, `400`, `404` usados corretamente.
- **UUID como chave primária**: Evita enumeração de IDs e aumenta a segurança.
- **Docker para o banco**: Ambiente isolado, reproduzível e sem necessidade de instalação local do PostgreSQL.
- **ESLint configurado**: Padrão de código consistente no projeto.
- **Nodemon em desenvolvimento**: Hot-reload sem necessidade de reiniciar o servidor manualmente.
- **`.gitignore`**: Arquivos sensíveis e `node_modules` não são versionados.
