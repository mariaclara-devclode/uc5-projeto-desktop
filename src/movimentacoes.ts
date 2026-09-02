import {
  formMovimentacao,
  movimentacaoProduto,
  movimentacaoQuantidade,
  movimentacaoTipo,
  respostaMovimentacao,
} from "./interface";

import {
  carregarProdutos,
  carregarProdutosMovimentacao,
} from "./produtos";


// MOSTRAR ERRO

function mostrarErro(
  erro: unknown,
  mensagemPadrao: string,
): string {

  if (erro instanceof Error) {
    return erro.message;
  }

  return mensagemPadrao;
}


// REGISTRAR MOVIMENTAÇÃO

formMovimentacao.addEventListener(
  "submit",
  async (evento) => {

    evento.preventDefault();

    respostaMovimentacao.textContent =
      "";


    const idProduto =
      Number(
        movimentacaoProduto.value,
      );

    const quantidade =
      Number(
        movimentacaoQuantidade.value,
      );

    const tipo =
      movimentacaoTipo.value;


    if (
      !Number.isInteger(idProduto) ||
      idProduto <= 0
    ) {

      respostaMovimentacao.textContent =
        "Selecione um produto.";

      movimentacaoProduto.focus();

      return;
    }


    if (
      !Number.isInteger(
        quantidade,
      ) ||
      quantidade <= 0
    ) {

      respostaMovimentacao.textContent =
        "Informe uma quantidade inteira maior que zero.";

      movimentacaoQuantidade.focus();

      return;
    }


    if (
      tipo !== "entrada" &&
      tipo !== "saida"
    ) {

      respostaMovimentacao.textContent =
        "Selecione o tipo de movimentação.";

      movimentacaoTipo.focus();

      return;
    }


    try {

      await window.api.registrarMovimentacao(
        idProduto,
        quantidade,
        tipo,
      );


      respostaMovimentacao.textContent =
        "Movimentação registrada com sucesso.";


      formMovimentacao.reset();


      await carregarProdutos();

      await carregarProdutosMovimentacao();

    } catch (erro) {

      console.error(
        "Erro ao registrar movimentação:",
        erro,
      );

      respostaMovimentacao.textContent =
        mostrarErro(
          erro,
          "Não foi possível registrar a movimentação.",
        );
    }
  },
);