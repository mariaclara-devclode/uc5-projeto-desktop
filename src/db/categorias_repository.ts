import { pool } from "../db";

import { ErroValidacao } from "../erros";

// LISTAR CATEGORIAS

export async function listarCategorias() {
  const resultado = await pool.query(`

      SELECT

        id,

        nome,

        descricao

      FROM categorias

      ORDER BY id

    `);

  return resultado.rows;
}

// CADASTRAR CATEGORIA

export async function cadastrarCategoria(dados: {
  nome: string;

  descricao: string;
}) {
  const resultado = await pool.query(
    `

      INSERT INTO categorias

        (
          nome,
          descricao
        )

      VALUES

        ($1, $2)

      RETURNING

        id,
        nome,
        descricao

      `,

    [dados.nome, dados.descricao],
  );

  return resultado.rows[0];
}

// EDITAR CATEGORIA

export async function editarCategoria(dados: {
  id: number;

  nome: string;

  descricao: string;
}) {
  const resultado = await pool.query(
    `

      UPDATE categorias

      SET

        nome = $1,

        descricao = $2

      WHERE id = $3

      RETURNING

        id,
        nome,
        descricao

      `,

    [dados.nome, dados.descricao, dados.id],
  );

  if (resultado.rows.length === 0) {
    throw new ErroValidacao("Categoria não encontrada.");
  }

  return resultado.rows[0];
}

// EXCLUIR CATEGORIA

export async function excluirCategoria(id: number) {
  const resultado = await pool.query(
    `

      DELETE FROM categorias

      WHERE id = $1

      RETURNING id

      `,

    [id],
  );

  if (resultado.rows.length === 0) {
    throw new ErroValidacao("Categoria não encontrada.");
  }

  return {
    sucesso: true,

    id: resultado.rows[0].id,
  };
}
