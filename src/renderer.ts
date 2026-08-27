import './interface'


import {
  configurarMenuTelas
} from './telas'


import {
  carregarProdutos,
  carregarCategoriasNoProduto,
  carregarProdutosMovimentacao
} from './produtos'


import {
  carregarCategorias
} from './categorias'


import './movimentacoes'


// EXTRAI A MENSAGEM AMIGÁVEL

function mensagemDoErro(
  erro: unknown,
  alternativa: string
): string {

  if (
    erro instanceof Error
  ) {

    const semPrefixo =
      erro.message
        .replace(
          /^Error invoking remote method '[^']*': (Error: )?/,
          ''
        )
        .trim()


    if (
      semPrefixo !== ''
    ) {

      return semPrefixo
    }
  }


  return alternativa
}


// INICIAR SISTEMA

async function iniciarSistema() {

  try {

    configurarMenuTelas()


    await carregarCategorias()


    await carregarCategoriasNoProduto()


    await carregarProdutos()


    await carregarProdutosMovimentacao()


    console.log(
      'Sistema iniciado com sucesso!'
    )

  } catch (error) {

    console.error(
      'Erro ao iniciar o sistema:',
      error
    )


    console.error(
      mensagemDoErro(
        error,
        'Não foi possível iniciar o sistema.'
      )
    )
  }
}


iniciarSistema()


export {}