import './style.css'

import {
  carregarProdutos,
  carregarCategoriasNoProduto,
  carregarProdutosMovimentacao
} from './produtos'

import {
  carregarCategorias
} from './categorias'

import './movimentacoes'


// MENU DE TELAS

const menuTela =
  document.getElementById(
    'menu-tela'
  ) as HTMLSelectElement


const telas = {
  produtos:
    document.getElementById(
      'tela-produtos'
    ) as HTMLElement,

  categorias:
    document.getElementById(
      'tela-categorias'
    ) as HTMLElement,

  cadastro:
    document.getElementById(
      'tela-cadastro'
    ) as HTMLElement,

  movimentacoes:
    document.getElementById(
      'tela-movimentacoes'
    ) as HTMLElement
}


// TROCAR TELA

function mostrarTela(
  telaSelecionada: string
) {

  Object.values(telas).forEach(
    (tela) => {
      tela.style.display = 'none'
    }
  )

  const tela =
    telas[
      telaSelecionada as keyof typeof telas
    ]

  if (tela) {
    tela.style.display = 'block'
  }
}


menuTela.addEventListener(
  'change',
  () => {

    mostrarTela(
      menuTela.value
    )

  }
)


// INICIALIZAÇÃO

async function iniciarSistema() {

  try {

    await carregarCategorias()

    await carregarCategoriasNoProduto()

    await carregarProdutos()

    await carregarProdutosMovimentacao()

    mostrarTela(
      menuTela.value
    )

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