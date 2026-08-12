// TELAS

export const TELA_PRODUTOS =
  'produtos'

export const TELA_CADASTRO =
  'cadastro'

export const TELA_CATEGORIAS =
  'categorias'

export const TELA_MOVIMENTACOES =
  'movimentacoes'


export function configurarMenuTelas() {

  const menuTela =
    document.getElementById(
      'menu-tela'
    ) as HTMLSelectElement


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


  function mostrarTela(
    tela: string
  ) {

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

  }


  menuTela.addEventListener(
    'change',
    () => {

      mostrarTela(
        menuTela.value
      )

    }
  )


  mostrarTela(
    TELA_PRODUTOS
  )

}