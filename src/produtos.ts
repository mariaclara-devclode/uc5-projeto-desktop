import {
  btnProdutos,
  btnCriticos,
  formBusca,
  campoBusca,
  btnLimpar,
  erroBusca,
  resposta,
  tabelaProdutos,
  formProduto,
  produtoNome,
  produtoCodigo,
  produtoPreco,
  produtoCategoria,
  respostaProduto,
  tituloFormProduto,
  btnSalvarProduto,
  btnCancelarEdicao,
  movimentacaoProduto,
  menuTela
} from './interface'


interface ProdutoTela {
  id: number
  nome: string
  codigo_barras: string
  preco_venda: number
  categoria: string
  estoque: number
}


let produtosCarregados: ProdutoTela[] = []

let produtoEditandoId: number | null = null


// MOSTRAR PRODUTOS

export function mostrarProdutos(
  produtos: ProdutoTela[]
) {

  tabelaProdutos.innerHTML = ''

  produtos.forEach((produto) => {

    const linha =
      document.createElement('tr')


    const colunaId =
      document.createElement('td')

    colunaId.textContent =
      String(produto.id)


    const colunaNome =
      document.createElement('td')

    colunaNome.textContent =
      produto.nome


    const colunaCodigo =
      document.createElement('td')

    colunaCodigo.textContent =
      produto.codigo_barras


    const colunaPreco =
      document.createElement('td')

    colunaPreco.textContent =
      `R$ ${produto.preco_venda.toFixed(2)}`


    const colunaCategoria =
      document.createElement('td')

    colunaCategoria.textContent =
      produto.categoria


    const colunaEstoque =
      document.createElement('td')

    colunaEstoque.textContent =
      String(produto.estoque)


    const colunaStatus =
      document.createElement('td')


    if (produto.estoque <= 5) {

      colunaStatus.textContent =
        'Crítico'

      colunaStatus.classList.add(
        'critico'
      )

    } else {

      colunaStatus.textContent =
        'Normal'

      colunaStatus.classList.add(
        'normal'
      )
    }


    const colunaAcoes =
      document.createElement('td')


    const btnEditar =
      document.createElement('button')

    btnEditar.type = 'button'

    btnEditar.textContent =
      'Editar'

    btnEditar.classList.add(
      'btn-editar-produto'
    )


    const btnExcluir =
      document.createElement('button')

    btnExcluir.type = 'button'

    btnExcluir.textContent =
      'Excluir'

    btnExcluir.classList.add(
      'btn-excluir-produto'
    )


    btnEditar.addEventListener(
      'click',
      () => {
        prepararEdicaoProduto(produto)
      }
    )


    btnExcluir.addEventListener(
      'click',
      async () => {
        await excluirProduto(produto.id)
      }
    )


    colunaAcoes.appendChild(
      btnEditar
    )

    colunaAcoes.appendChild(
      btnExcluir
    )


    linha.appendChild(
      colunaId
    )

    linha.appendChild(
      colunaNome
    )

    linha.appendChild(
      colunaCodigo
    )

    linha.appendChild(
      colunaPreco
    )

    linha.appendChild(
      colunaCategoria
    )

    linha.appendChild(
      colunaEstoque
    )

    linha.appendChild(
      colunaStatus
    )

    linha.appendChild(
      colunaAcoes
    )


    tabelaProdutos.appendChild(
      linha
    )
  })
}


// LISTAR PRODUTOS

export async function carregarProdutos() {

  try {

    const produtos =
      await window.api.listarProdutos()


    produtosCarregados =
      produtos


    mostrarProdutos(
      produtosCarregados
    )


    if (produtos.length === 0) {

      resposta.textContent =
        'Nenhum produto cadastrado.'

    } else {

      resposta.textContent =
        `${produtos.length} produto(s) encontrado(s).`
    }


    return produtos

  } catch (error) {

    console.error(
      'Erro ao carregar produtos:',
      error
    )


    resposta.textContent =
      'Não foi possível carregar os produtos.'


    return []
  }
}


// BUSCAR NO MAIN

formBusca.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault()


    erroBusca.textContent = ''

    resposta.textContent = ''


    const termo =
      campoBusca.value.trim()


    if (!termo) {

      erroBusca.textContent =
        'Digite um ID, nome ou código para buscar.'

      return
    }


    try {

      const produtos =
        await window.api.buscarProdutos(
          termo
        )


      if (produtos.length === 0) {

        produtosCarregados = []

        mostrarProdutos([])

        resposta.textContent =
          'Nenhum produto encontrado.'

        return
      }


      produtosCarregados =
        produtos


      mostrarProdutos(
        produtos
      )


      resposta.textContent =
        `${produtos.length} produto(s) encontrado(s).`

    } catch (error) {

      console.error(
        'Erro ao buscar produto:',
        error
      )


      if (error instanceof Error) {

        erroBusca.textContent =
          error.message

      } else {

        erroBusca.textContent =
          'O Main recusou a busca.'
      }
    }
  }
)


// FILTRO LOCAL

campoBusca.addEventListener(
  'input',
  () => {

    const termo =
      campoBusca.value
        .trim()
        .toLowerCase()


    if (!termo) {

      mostrarProdutos(
        produtosCarregados
      )


      resposta.textContent =
        `${produtosCarregados.length} produto(s) carregado(s).`

      return
    }


    const produtosFiltrados =
      produtosCarregados.filter(
        (produto) => {

          return (
            String(produto.id)
              .includes(termo) ||

            produto.nome
              .toLowerCase()
              .includes(termo) ||

            produto.codigo_barras
              .toLowerCase()
              .includes(termo)
          )
        }
      )


    mostrarProdutos(
      produtosFiltrados
    )


    if (produtosFiltrados.length === 0) {

      resposta.textContent =
        'Nenhum produto encontrado no filtro local.'

    } else {

      resposta.textContent =
        `${produtosFiltrados.length} produto(s) encontrado(s) no filtro local.`
    }
  }
)


// LIMPAR BUSCA

btnLimpar.addEventListener(
  'click',
  () => {

    campoBusca.value = ''

    erroBusca.textContent = ''


    mostrarProdutos(
      produtosCarregados
    )


    resposta.textContent =
      `${produtosCarregados.length} produto(s) carregado(s).`
  }
)


// BOTÃO LISTAR

btnProdutos.addEventListener(
  'click',
  async () => {

    erroBusca.textContent = ''

    campoBusca.value = ''

    await carregarProdutos()
  }
)


// ESTOQUE CRÍTICO

btnCriticos.addEventListener(
  'click',
  async () => {

    try {

      const produtos =
        await window.api.listarEstoqueCritico()


      produtosCarregados =
        produtos


      mostrarProdutos(
        produtos
      )


      if (produtos.length === 0) {

        resposta.textContent =
          'Nenhum produto com estoque crítico.'

      } else {

        resposta.textContent =
          `${produtos.length} produto(s) com estoque crítico.`
      }

    } catch (error) {

      console.error(
        'Erro ao consultar estoque crítico:',
        error
      )


      resposta.textContent =
        'Não foi possível consultar o estoque crítico.'
    }
  }
)


// CADASTRAR OU EDITAR

formProduto.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault()


    try {

      const nome =
        produtoNome.value.trim()


      const codigo =
        produtoCodigo.value.trim()


      const preco =
        Number(
          produtoPreco.value
        )


      const idCategoria =
        Number(
          produtoCategoria.value
        )


      if (!nome) {

        respostaProduto.textContent =
          'Informe o nome do produto.'

        return
      }


      if (!codigo) {

        respostaProduto.textContent =
          'Informe o código de barras.'

        return
      }


      if (
        !Number.isFinite(preco) ||
        preco < 0
      ) {

        respostaProduto.textContent =
          'Informe um preço válido.'

        return
      }


      if (
        !Number.isInteger(idCategoria) ||
        idCategoria <= 0
      ) {

        respostaProduto.textContent =
          'Selecione uma categoria.'

        return
      }


      if (
        produtoEditandoId === null
      ) {

        await window.api.cadastrarProduto(
          nome,
          codigo,
          preco,
          idCategoria
        )


        respostaProduto.textContent =
          'Produto cadastrado com sucesso!'

      } else {

        await window.api.editarProduto(
          produtoEditandoId,
          nome,
          codigo,
          preco,
          idCategoria
        )


        respostaProduto.textContent =
          'Produto atualizado com sucesso!'
      }


      limparFormularioProduto()


      await carregarProdutos()


      await carregarProdutosMovimentacao()

    } catch (error) {

      console.error(
        'Erro ao salvar produto:',
        error
      )


      if (error instanceof Error) {

        respostaProduto.textContent =
          error.message

      } else {

        respostaProduto.textContent =
          'Não foi possível salvar o produto.'
      }
    }
  }
)


// PREPARAR EDIÇÃO

async function prepararEdicaoProduto(
  produto: ProdutoTela
) {

  produtoEditandoId =
    produto.id


  produtoNome.value =
    produto.nome


  produtoCodigo.value =
    produto.codigo_barras


  produtoPreco.value =
    String(produto.preco_venda)


  // Carrega as categorias

  try {

    const categorias =
      await window.api.listarCategorias()


    produtoCategoria.innerHTML = ''


    const opcaoInicial =
      document.createElement('option')

    opcaoInicial.value = ''

    opcaoInicial.textContent =
      'Selecione uma categoria'


    produtoCategoria.appendChild(
      opcaoInicial
    )


    categorias.forEach(
      (categoria) => {

        const opcao =
          document.createElement('option')


        opcao.value =
          String(categoria.id)


        opcao.textContent =
          categoria.nome


        if (
          categoria.nome ===
          produto.categoria
        ) {

          opcao.selected = true
        }


        produtoCategoria.appendChild(
          opcao
        )
      }
    )

  } catch (error) {

    console.error(
      'Erro ao carregar categoria:',
      error
    )
  }


  tituloFormProduto.textContent =
    'Editar Produto'


  btnSalvarProduto.textContent =
    'Salvar Alterações'


  btnCancelarEdicao.style.display =
    'inline-block'


  respostaProduto.textContent =
    `Editando produto ID ${produto.id}.`


  // Vai para a tela de cadastro

  menuTela.value =
    'cadastro'


  menuTela.dispatchEvent(
    new Event('change')
  )
}


// CANCELAR EDIÇÃO

btnCancelarEdicao.addEventListener(
  'click',
  () => {

    limparFormularioProduto()


    respostaProduto.textContent =
      'Edição cancelada.'
  }
)


// LIMPAR FORMULÁRIO

function limparFormularioProduto() {

  produtoEditandoId =
    null


  formProduto.reset()


  tituloFormProduto.textContent =
    'Cadastrar Produto'


  btnSalvarProduto.textContent =
    'Cadastrar Produto'


  btnCancelarEdicao.style.display =
    'none'
}


// EXCLUIR PRODUTO

async function excluirProduto(
  id: number
) {

  const confirmar =
    confirm(
      `Deseja realmente excluir o produto ID ${id}?`
    )


  if (!confirmar) {
    return
  }


  try {

    await window.api.excluirProduto(
      id
    )


    resposta.textContent =
      'Produto excluído com sucesso!'


    await carregarProdutos()


    await carregarProdutosMovimentacao()

  } catch (error) {

    console.error(
      'Erro ao excluir produto:',
      error
    )


    if (error instanceof Error) {

      resposta.textContent =
        error.message

    } else {

      resposta.textContent =
        'Não foi possível excluir o produto.'
    }
  }
}


// CATEGORIAS NO CADASTRO

export async function carregarCategoriasNoProduto() {

  try {

    const categorias =
      await window.api.listarCategorias()


    produtoCategoria.innerHTML = ''


    const opcaoInicial =
      document.createElement('option')

    opcaoInicial.value = ''

    opcaoInicial.textContent =
      'Selecione uma categoria'


    produtoCategoria.appendChild(
      opcaoInicial
    )


    categorias.forEach(
      (categoria) => {

        const opcao =
          document.createElement('option')


        opcao.value =
          String(categoria.id)


        opcao.textContent =
          categoria.nome


        produtoCategoria.appendChild(
          opcao
        )
      }
    )

  } catch (error) {

    console.error(
      'Erro ao carregar categorias:',
      error
    )
  }
}


// PRODUTOS NA MOVIMENTAÇÃO

export async function carregarProdutosMovimentacao() {

  try {

    const produtos =
      await window.api.listarProdutos()


    movimentacaoProduto.innerHTML =
      ''


    const opcaoInicial =
      document.createElement('option')

    opcaoInicial.value = ''

    opcaoInicial.textContent =
      'Selecione um produto'


    movimentacaoProduto.appendChild(
      opcaoInicial
    )


    produtos.forEach(
      (produto) => {

        const opcao =
          document.createElement('option')


        opcao.value =
          String(produto.id)


        opcao.textContent =
          `${produto.nome} - Estoque: ${produto.estoque}`


        movimentacaoProduto.appendChild(
          opcao
        )
      }
    )

  } catch (error) {

    console.error(
      'Erro ao carregar produtos para movimentação:',
      error
    )
  }
}