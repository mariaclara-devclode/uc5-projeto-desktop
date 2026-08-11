import {
  formMovimentacao,
  movimentacaoProduto,
  movimentacaoQuantidade,
  movimentacaoTipo,
  respostaMovimentacao
} from './interface'

import {
  mostrarProdutos,
  carregarProdutosMovimentacao
} from './produtos'

formMovimentacao.addEventListener(
  'submit',
  async (event) => {
    event.preventDefault()

    try {
      const idProduto =
        Number(
          movimentacaoProduto.value
        )

      const quantidade =
        Number(
          movimentacaoQuantidade.value
        )

      const tipo =
        movimentacaoTipo.value as
          | 'entrada'
          | 'saida'

      if (idProduto <= 0) {
        respostaMovimentacao.textContent =
          'Selecione um produto.'

        return
      }

      if (quantidade <= 0) {
        respostaMovimentacao.textContent =
          'Informe uma quantidade válida.'

        return
      }

      if (
        tipo !== 'entrada' &&
        tipo !== 'saida'
      ) {
        respostaMovimentacao.textContent =
          'Selecione entrada ou saída.'

        return
      }

      await window.api.registrarMovimentacao(
        idProduto,
        quantidade,
        tipo
      )

      respostaMovimentacao.textContent =
        'Movimentação registrada com sucesso!'

      formMovimentacao.reset()

      const produtos =
        await window.api.listarProdutos()

      mostrarProdutos(produtos)

      await carregarProdutosMovimentacao()
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        respostaMovimentacao.textContent =
          error.message
      } else {
        respostaMovimentacao.textContent =
          'Erro ao registrar movimentação.'
      }
    }
  }
)