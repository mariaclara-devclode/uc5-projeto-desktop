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
      p.ativo,
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
      ON c.id = p.id_categoria

    LEFT JOIN movimentacoes m
      ON m.id_produto = p.id

    GROUP BY
      p.id,
      p.nome,
      p.codigo_barras,
      p.preco_venda,
      p.ativo,
      c.nome

    ORDER BY
      p.id
  `);

  return resultado.rows.map((produto) => ({
    ...produto,

    preco_venda: Number(produto.preco_venda),

    estoque: Number(produto.estoque),

    ativo: Boolean(produto.ativo),
  }));
}

// BUSCAR PRODUTOS

export async function buscarProdutos(termo: string) {
  const valor = termo.trim();

  if (!valor) {
    return listarProdutos();
  }

  const resultado = await pool.query(
    `
    SELECT
      p.id,
      p.nome,
      p.codigo_barras,
      p.preco_venda,
      p.ativo,
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
      ON c.id = p.id_categoria

    LEFT JOIN movimentacoes m
      ON m.id_produto = p.id

    WHERE
      (
        CAST(p.id AS TEXT) = $1
        OR p.codigo_barras = $1
        OR p.nome ILIKE '%' || $1 || '%'
      )

    GROUP BY
      p.id,
      p.nome,
      p.codigo_barras,
      p.preco_venda,
      p.ativo,
      c.nome

    ORDER BY
      p.id
    `,
    [valor],
  );

  return resultado.rows.map((produto) => ({
    ...produto,

    preco_venda: Number(produto.preco_venda),

    estoque: Number(produto.estoque),

    ativo: Boolean(produto.ativo),
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
      p.ativo,
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
      ON c.id = p.id_categoria

    LEFT JOIN movimentacoes m
      ON m.id_produto = p.id

    WHERE
      p.ativo = TRUE

    GROUP BY
      p.id,
      p.nome,
      p.codigo_barras,
      p.preco_venda,
      p.ativo,
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

    ORDER BY
      estoque ASC,
      p.id
  `);

  return resultado.rows.map((produto) => ({
    ...produto,

    preco_venda: Number(produto.preco_venda),

    estoque: Number(produto.estoque),

    ativo: Boolean(produto.ativo),
  }));
}

// CADASTRAR PRODUTO

export async function cadastrarProduto(dados: {
  nome: string;
  codigo_barras: string;
  preco_venda: number;
  id_categoria: number;
}) {
  const categoria = await pool.query(
    `
      SELECT id
      FROM categorias
      WHERE id = $1
      `,
    [dados.id_categoria],
  );

  if (categoria.rows.length === 0) {
    throw new ErroValidacao("A categoria selecionada não existe.");
  }

  try {
    const resultado = await pool.query(
      `
        INSERT INTO produtos (
          nome,
          codigo_barras,
          preco_venda,
          id_categoria,
          ativo
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          TRUE
        )

        RETURNING
          id,
          nome,
          codigo_barras,
          preco_venda,
          id_categoria,
          ativo
        `,
      [dados.nome, dados.codigo_barras, dados.preco_venda, dados.id_categoria],
    );

    return {
      ...resultado.rows[0],

      preco_venda: Number(resultado.rows[0].preco_venda),

      ativo: Boolean(resultado.rows[0].ativo),
    };
  } catch (erro: any) {
    if (erro?.code === "23505") {
      throw new ErroValidacao(
        "Já existe um produto com esse código de barras.",
      );
    }

    throw erro;
  }
}

// EDITAR PRODUTO

export async function editarProduto(dados: {
  id: number;
  nome: string;
  codigo_barras: string;
  preco_venda: number;
  id_categoria: number;
}) {
  const categoria = await pool.query(
    `
      SELECT id
      FROM categorias
      WHERE id = $1
      `,
    [dados.id_categoria],
  );

  if (categoria.rows.length === 0) {
    throw new ErroValidacao("A categoria selecionada não existe.");
  }

  const produto = await pool.query(
    `
      SELECT
        id,
        ativo
      FROM produtos
      WHERE id = $1
      `,
    [dados.id],
  );

  if (produto.rows.length === 0) {
    throw new ErroValidacao("Produto não encontrado.");
  }

  if (!produto.rows[0].ativo) {
    throw new ErroValidacao(
      "Este produto está inativo e não pode ser editado.",
    );
  }

  try {
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
          id_categoria,
          ativo
        `,
      [
        dados.nome,
        dados.codigo_barras,
        dados.preco_venda,
        dados.id_categoria,
        dados.id,
      ],
    );

    return {
      ...resultado.rows[0],

      preco_venda: Number(resultado.rows[0].preco_venda),

      ativo: Boolean(resultado.rows[0].ativo),
    };
  } catch (erro: any) {
    if (erro?.code === "23505") {
      throw new ErroValidacao(
        "Já existe um produto com esse código de barras.",
      );
    }

    throw erro;
  }
}

// EXCLUIR / INATIVAR PRODUTO

export async function excluirProduto(id: number) {
  const produto = await pool.query(
    `
      SELECT
        id,
        ativo
      FROM produtos
      WHERE id = $1
      `,
    [id],
  );

  if (produto.rows.length === 0) {
    throw new ErroValidacao("Produto não encontrado.");
  }

  if (!produto.rows[0].ativo) {
    throw new ErroValidacao("Este produto já está inativo.");
  }

  const movimentacoes = await pool.query(
    `
      SELECT id
      FROM movimentacoes
      WHERE id_produto = $1
      LIMIT 1
      `,
    [id],
  );

  // SE POSSUI MOVIMENTAÇÕES:
  // NÃO APAGA.
  // APENAS INATIVA.

  if (movimentacoes.rows.length > 0) {
    await pool.query(
      `
      UPDATE produtos

      SET ativo = FALSE

      WHERE id = $1
      `,
      [id],
    );

    return {
      sucesso: true,
      id,
      inativado: true,
      mensagem:
        "Não é possível excluir este produto porque existem movimentações registradas. O produto foi marcado como inativo.",
    };
  }

  // SE NÃO POSSUI MOVIMENTAÇÕES:
  // PODE EXCLUIR DEFINITIVAMENTE.

  await pool.query(
    `
    DELETE FROM produtos
    WHERE id = $1
    `,
    [id],
  );

  return {
    sucesso: true,
    id,
    inativado: false,
    mensagem: "Produto excluído com sucesso.",
  };
}
