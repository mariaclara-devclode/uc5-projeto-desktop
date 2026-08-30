import { pool } from "../db";

import { ErroValidacao } from "../erros";

// LISTAR PRODUTOS

export async function listarProdutos() {
  const resultado = await pool.query(`

      SELECT

        p.id,

        p.nome,

        p.codigo_barras,

        p.preco_venda,

        c.nome AS categoria,

        COALESCE(

          SUM(

            CASE

              WHEN m.tipo = 'entrada'
                THEN m.quantidade

              WHEN m.tipo = 'saida'
                THEN -m.quantidade

              ELSE 0

            END

          ),

          0

        ) AS estoque

      FROM produtos p

      INNER JOIN categorias c
        ON p.id_categoria = c.id

      LEFT JOIN movimentacoes m
        ON p.id = m.id_produto

      GROUP BY

        p.id,

        p.nome,

        p.codigo_barras,

        p.preco_venda,

        c.nome

      ORDER BY p.id

    `);

  return resultado.rows.map((produto) => ({
    ...produto,

    preco_venda: Number(produto.preco_venda),

    estoque: Number(produto.estoque),
  }));
}

// BUSCAR PRODUTOS

export async function buscarProdutos(termo: string) {
  const busca = termo.trim();

  const resultado = await pool.query(
    `

      SELECT

        p.id,

        p.nome,

        p.codigo_barras,

        p.preco_venda,

        c.nome AS categoria,

        COALESCE(

          SUM(

            CASE

              WHEN m.tipo = 'entrada'
                THEN m.quantidade

              WHEN m.tipo = 'saida'
                THEN -m.quantidade

              ELSE 0

            END

          ),

          0

        ) AS estoque

      FROM produtos p

      INNER JOIN categorias c
        ON p.id_categoria = c.id

      LEFT JOIN movimentacoes m
        ON p.id = m.id_produto

      WHERE

        p.id::text = $1

        OR p.codigo_barras = $1

        OR p.nome ILIKE $2

      GROUP BY

        p.id,

        p.nome,

        p.codigo_barras,

        p.preco_venda,

        c.nome

      ORDER BY p.id

      `,

    [busca, `%${busca}%`],
  );

  return resultado.rows.map((produto) => ({
    ...produto,

    preco_venda: Number(produto.preco_venda),

    estoque: Number(produto.estoque),
  }));
}

// ESTOQUE CRÍTICO

export async function listarEstoqueCritico() {
  const resultado = await pool.query(`

      SELECT

        p.id,

        p.nome,

        p.codigo_barras,

        p.preco_venda,

        c.nome AS categoria,

        COALESCE(

          SUM(

            CASE

              WHEN m.tipo = 'entrada'
                THEN m.quantidade

              WHEN m.tipo = 'saida'
                THEN -m.quantidade

              ELSE 0

            END

          ),

          0

        ) AS estoque

      FROM produtos p

      INNER JOIN categorias c
        ON p.id_categoria = c.id

      LEFT JOIN movimentacoes m
        ON p.id = m.id_produto

      GROUP BY

        p.id,

        p.nome,

        p.codigo_barras,

        p.preco_venda,

        c.nome

      HAVING

        COALESCE(

          SUM(

            CASE

              WHEN m.tipo = 'entrada'
                THEN m.quantidade

              WHEN m.tipo = 'saida'
                THEN -m.quantidade

              ELSE 0

            END

          ),

          0

        ) <= 10

      ORDER BY estoque ASC

    `);

  return resultado.rows.map((produto) => ({
    ...produto,

    preco_venda: Number(produto.preco_venda),

    estoque: Number(produto.estoque),
  }));
}

// CADASTRAR PRODUTO

export async function cadastrarProduto(dados: {
  nome: string;

  codigo_barras: string;

  preco_venda: number;

  id_categoria: number;
}) {
  const resultado = await pool.query(
    `

      INSERT INTO produtos

        (
          nome,
          codigo_barras,
          preco_venda,
          id_categoria
        )

      VALUES

        ($1, $2, $3, $4)

      RETURNING

        id,
        nome,
        codigo_barras,
        preco_venda,
        id_categoria

      `,

    [dados.nome, dados.codigo_barras, dados.preco_venda, dados.id_categoria],
  );

  return {
    ...resultado.rows[0],

    preco_venda: Number(resultado.rows[0].preco_venda),
  };
}

// EDITAR PRODUTO

export async function editarProduto(dados: {
  id: number;

  nome: string;

  codigo_barras: string;

  preco_venda: number;

  id_categoria: number;
}) {
  const resultado = await pool.query(
    `

      UPDATE produtos

      SET

        nome = $1,

        codigo_barras = $2,

        preco_venda = $3,

        id_categoria = $4

      WHERE id = $5

      RETURNING

        id,
        nome,
        codigo_barras,
        preco_venda,
        id_categoria

      `,

    [
      dados.nome,
      dados.codigo_barras,
      dados.preco_venda,
      dados.id_categoria,
      dados.id,
    ],
  );

  if (resultado.rows.length === 0) {
    throw new ErroValidacao("Produto não encontrado.");
  }

  return {
    ...resultado.rows[0],

    preco_venda: Number(resultado.rows[0].preco_venda),
  };
}

// EXCLUIR PRODUTO

export async function excluirProduto(id: number) {
  const movimentacoes = await pool.query(
    `

      SELECT id

      FROM movimentacoes

      WHERE id_produto = $1

      LIMIT 1

      `,

    [id],
  );

  if (movimentacoes.rows.length > 0) {
    throw new ErroValidacao(
      "Não é possível excluir este produto porque existem movimentações registradas.",
    );
  }

  const resultado = await pool.query(
    `

      DELETE FROM produtos

      WHERE id = $1

      RETURNING id

      `,

    [id],
  );

  if (resultado.rows.length === 0) {
    throw new ErroValidacao("Produto não encontrado.");
  }

  return {
    sucesso: true,

    id: resultado.rows[0].id,
  };
}
