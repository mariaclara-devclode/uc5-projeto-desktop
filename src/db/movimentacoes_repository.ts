import { pool } from "../db";
import { ErroValidacao } from "../erros";


// REGISTRAR MOVIMENTAÇÃO

export async function registrarMovimentacao(
  dados: {
    id_produto: number;
    quantidade: number;
    tipo: "entrada" | "saida";
  },
) {

  if (
    !Number.isInteger(
      dados.id_produto,
    ) ||
    dados.id_produto <= 0
  ) {
    throw new ErroValidacao(
      "Produto inválido.",
    );
  }


  if (
    !Number.isInteger(
      dados.quantidade,
    ) ||
    dados.quantidade <= 0
  ) {
    throw new ErroValidacao(
      "A quantidade deve ser um número inteiro maior que zero.",
    );
  }


  if (
    dados.tipo !== "entrada" &&
    dados.tipo !== "saida"
  ) {
    throw new ErroValidacao(
      "Tipo de movimentação inválido.",
    );
  }


  // VERIFICA SE O PRODUTO EXISTE
  // E SE ESTÁ ATIVO

  const produto =
    await pool.query(
      `
      SELECT
        id,
        ativo
      FROM produtos
      WHERE id = $1
      `,
      [dados.id_produto],
    );


  if (
    produto.rows.length === 0
  ) {
    throw new ErroValidacao(
      "Produto não encontrado.",
    );
  }


  if (
    !produto.rows[0].ativo
  ) {
    throw new ErroValidacao(
      "Este produto está inativo e não pode receber novas movimentações.",
    );
  }


  // VERIFICA ESTOQUE PARA SAÍDA

  if (
    dados.tipo === "saida"
  ) {

    const estoqueAtual =
      await pool.query(
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


    const estoque =
      Number(
        estoqueAtual.rows[0].estoque,
      );


    if (
      dados.quantidade > estoque
    ) {
      throw new ErroValidacao(
        `Não é possível realizar a saída. Estoque disponível: ${estoque}.`,
      );
    }
  }


  // REGISTRA A MOVIMENTAÇÃO

  const resultado =
    await pool.query(
      `
      INSERT INTO movimentacoes (
        id_produto,
        quantidade,
        tipo
      )

      VALUES (
        $1,
        $2,
        $3
      )

      RETURNING
        id,
        id_produto,
        quantidade,
        tipo,
        data
      `,
      [
        dados.id_produto,
        dados.quantidade,
        dados.tipo,
      ],
    );


  return resultado.rows[0];
}