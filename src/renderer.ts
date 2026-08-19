import  './interface'

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

  }

}


iniciarSistema()


export {}