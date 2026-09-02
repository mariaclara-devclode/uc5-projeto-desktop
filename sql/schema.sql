CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo_barras VARCHAR(100) NOT NULL UNIQUE,
    preco_venda NUMERIC(10, 2) NOT NULL,
    id_categoria INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS movimentacoes (
    id SERIAL PRIMARY KEY,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimentacoes_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_movimentacoes_quantidade
        CHECK (quantidade > 0),

    CONSTRAINT chk_movimentacoes_tipo
        CHECK (tipo IN ('entrada', 'saida'))
);