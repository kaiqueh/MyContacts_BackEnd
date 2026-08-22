-- Criar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id  UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contacts (
    id  UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    category_name VARCHAR(255),
    category_id UUID,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inserir categorias pré-definidas
INSERT INTO categories (name) VALUES
('Instagram'),
('LinkedIn'),
('WhatsApp'),
('Facebook'),
('Twitter'),
('Email'),
('Telefone'),
('Pessoal'),
('Trabalho'),
('Família')
ON CONFLICT (name) DO NOTHING;
