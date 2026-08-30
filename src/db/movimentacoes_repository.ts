import { pool } from "../db";

import { ErroValidacao } from "../erros";

// REGISTRAR MOVIMENTAÇÃO

export async function registrarMovimentacao(dados: {
  id_produto: number;

  quantidade: number;

  tipo: "entrada" | "saida";
}) {
  if (dados.quantidade <= 0) {
    throw new ErroValidacao("A quantidade deve ser maior que zero.");
  }

  if (dados.tipo !== "entrada" && dados.tipo !== "saida") {
    throw new ErroValidacao("Tipo de movimentação inválido.");
  }

  // VERIFICAR ESTOQUE

  if (dados.tipo === "saida") {
    const estoqueResult = await pool.query(
      `

        SELECT

          COALESCE(

            SUM(

              CASE

                WHEN tipo = 'entrada'
                  THEN quantidade

                WHEN tipo = 'saida'
                  THEN -quantidade

                ELSE 0

              END

            ),

            0

          ) AS estoque

        FROM movimentacoes

        WHERE id_produto = $1

        `,

      [dados.id_produto],
    );

    const estoqueAtual = Number(estoqueResult.rows[0].estoque);

    if (dados.quantidade > estoqueAtual) {
      throw new ErroValidacao(
        `Estoque insuficiente. Estoque atual: ${estoqueAtual}.`,
      );
    }
  }

  // REGISTRAR

  const resultado = await pool.query(
    `

      INSERT INTO movimentacoes

        (
          id_produto,
          quantidade,
          tipo
        )

      VALUES

        ($1, $2, $3)

      RETURNING

        id,
        id_produto,
        quantidade,
        tipo,
        data

      `,

    [dados.id_produto, dados.quantidade, dados.tipo],
  );

  return resultado.rows[0];
}
