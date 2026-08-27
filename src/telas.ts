import {btnVoltar,navProdutos,navCadastro,navCategorias,navMovimentacoes
} from './interface'

export const TELA_PRODUTOS =
  'produtos'

export const TELA_CADASTRO =
  'cadastro'

export const TELA_CATEGORIAS =
  'categorias'

export const TELA_MOVIMENTACOES =
  'movimentacoes'


type Tela =
  | typeof TELA_PRODUTOS
  | typeof TELA_CADASTRO
  | typeof TELA_CATEGORIAS
  | typeof TELA_MOVIMENTACOES


let telaAtual: Tela =
  TELA_PRODUTOS


// MOSTRAR TELA

function mostrarTela(
  tela: Tela
) {

  const telaProdutos =
    document.getElementById(
      'tela-produtos'
    ) as HTMLDivElement

  const telaCadastro =
    document.getElementById(
      'tela-cadastro'
    ) as HTMLDivElement

  const telaCategorias =
    document.getElementById(
      'tela-categorias'
    ) as HTMLDivElement

  const telaMovimentacoes =
    document.getElementById(
      'tela-movimentacoes'
    ) as HTMLDivElement


  telaProdutos.style.display =
    'none'

  telaCadastro.style.display =
    'none'

  telaCategorias.style.display =
    'none'

  telaMovimentacoes.style.display =
    'none'


  if (
    tela === TELA_PRODUTOS
  ) {

    telaProdutos.style.display =
      'block'

  }


  if (
    tela === TELA_CADASTRO
  ) {

    telaCadastro.style.display =
      'block'

  }


  if (
    tela === TELA_CATEGORIAS
  ) {

    telaCategorias.style.display =
      'block'

  }


  if (
    tela === TELA_MOVIMENTACOES
  ) {

    telaMovimentacoes.style.display =
      'block'

  }


  telaAtual = tela


  atualizarNavegacao()
}


// ATUALIZAR NAVEGAÇÃO

function atualizarNavegacao() {

  navProdutos.classList.remove(
    'navegacao-ativa'
  )

  navCadastro.classList.remove(
    'navegacao-ativa'
  )

  navCategorias.classList.remove(
    'navegacao-ativa'
  )

  navMovimentacoes.classList.remove(
    'navegacao-ativa'
  )


  if (
    telaAtual === TELA_PRODUTOS
  ) {

    navProdutos.classList.add(
      'navegacao-ativa'
    )

  }


  if (
    telaAtual === TELA_CADASTRO
  ) {

    navCadastro.classList.add(
      'navegacao-ativa'
    )

  }


  if (
    telaAtual === TELA_CATEGORIAS
  ) {

    navCategorias.classList.add(
      'navegacao-ativa'
    )

  }


  if (
    telaAtual === TELA_MOVIMENTACOES
  ) {

    navMovimentacoes.classList.add(
      'navegacao-ativa'
    )

  }


  // O botão Voltar não aparece
  // na tela inicial.

  if (
    telaAtual === TELA_PRODUTOS
  ) {

    btnVoltar.style.display =
      'none'

  } else {

    btnVoltar.style.display =
      'inline-block'

  }
}


// NAVEGAR PARA UMA TELA

export function navegarParaTela(
  tela: Tela
) {

  if (
    tela === telaAtual
  ) {
    return
  }


  window.history.pushState(
    {
      tela
    },
    '',
    `#${tela}`
  )


  mostrarTela(tela)
}


// CONFIGURAR MENU

export function configurarMenuTelas() {

  // Estado inicial da aplicação

  window.history.replaceState(
    {
      tela: TELA_PRODUTOS
    },
    '',
    `#${TELA_PRODUTOS}`
  )


  // PRODUTOS

  navProdutos.addEventListener(
    'click',
    () => {

      navegarParaTela(
        TELA_PRODUTOS
      )

    }
  )


  // CADASTRO

  navCadastro.addEventListener(
    'click',
    () => {

      navegarParaTela(
        TELA_CADASTRO
      )

    }
  )


  // CATEGORIAS

  navCategorias.addEventListener(
    'click',
    () => {

      navegarParaTela(
        TELA_CATEGORIAS
      )

    }
  )


  // MOVIMENTAÇÕES

  navMovimentacoes.addEventListener(
    'click',
    () => {

      navegarParaTela(
        TELA_MOVIMENTACOES
      )

    }
  )


  // VOLTAR

  btnVoltar.addEventListener(
    'click',
    () => {

      window.history.back()

    }
  )


  // BOTÃO VOLTAR DO HISTÓRICO

  window.addEventListener(
    'popstate',
    () => {

      const hash =
        window.location.hash.replace(
          '#',
          ''
        )


      if (
        hash === TELA_CADASTRO ||
        hash === TELA_CATEGORIAS ||
        hash === TELA_MOVIMENTACOES
      ) {

        mostrarTela(
          hash as Tela
        )

        return
      }


      mostrarTela(
        TELA_PRODUTOS
      )
    }
  )


  // COMEÇA NA TELA DE PRODUTOS

  mostrarTela(
    TELA_PRODUTOS
  )
}