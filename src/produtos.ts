import {
  btnProdutos,
  btnCriticos,
  btnBuscar,
  btnLimpar,
  campoBusca,
  resposta,
  tabelaProdutos,
  formProduto,
  produtoNome,
  produtoCodigo,
  produtoPreco,
  produtoCategoria,
  respostaProduto,
  movimentacaoProduto,
  tituloFormProduto,
  btnSalvarProduto,
  btnCancelarEdicao,
  menuTela
} from './interface'


let produtoEmEdicao:
  number | null = null


// LISTAR PRODUTOS

export async function carregarProdutos() {

  const produtos =
    await window.api.listarProdutos()

  mostrarProdutos(
    produtos
  )

  return produtos
}


// MOSTRAR PRODUTOS

export function mostrarProdutos(
  produtos: Awaited<
    ReturnType<
      typeof window.api.listarProdutos
    >
  >
) {

  tabelaProdutos.innerHTML = ''


  produtos.forEach(
    (produto) => {

      const linha =
        document.createElement(
          'tr'
        )


      const status =
        produto.estoque <= 10
          ? 'CRÍTICO'
          : 'Normal'


      linha.innerHTML = `

        <td>
          ${produto.id}
        </td>

        <td>
          ${produto.nome}
        </td>

        <td>
          ${produto.codigo_barras}
        </td>

        <td>
          R$ ${produto.preco_venda.toFixed(2)}
        </td>

        <td>
          ${produto.categoria}
        </td>

        <td>
          ${produto.estoque}
        </td>

        <td
          class="${
            produto.estoque <= 10
              ? 'critico'
              : 'normal'
          }"
        >
          ${status}
        </td>

        <td>

          <button
            class="btn-editar-produto"
          >
            Editar
          </button>

          <button
            class="btn-excluir-produto"
          >
            Excluir
          </button>

        </td>

      `


      const btnEditar =
        linha.querySelector(
          '.btn-editar-produto'
        ) as HTMLButtonElement


      const btnExcluir =
        linha.querySelector(
          '.btn-excluir-produto'
        ) as HTMLButtonElement


      btnEditar.addEventListener(
        'click',
        () => {

          iniciarEdicaoProduto(
            produto.id
          )

        }
      )


      btnExcluir.addEventListener(
        'click',
        () => {

          excluirProduto(
            produto.id
          )

        }
      )


      tabelaProdutos.appendChild(
        linha
      )

    }
  )
}


// LISTAR

btnProdutos.addEventListener(
  'click',
  async () => {

    try {

      const produtos =
        await carregarProdutos()


      resposta.textContent =
        `${produtos.length} produtos encontrados`

    } catch (error) {

      console.error(error)

      resposta.textContent =
        'Erro ao listar produtos.'

    }

  }
)


// BUSCAR

btnBuscar.addEventListener(
  'click',
  async () => {

    try {

      const termo =
        campoBusca.value.trim()


      if (!termo) {

        resposta.textContent =
          'Digite um ID, nome ou código de barras.'

        return

      }


      const produtos =
        await window.api.buscarProdutos(
          termo
        )


      mostrarProdutos(
        produtos
      )


      resposta.textContent =
        `${produtos.length} produtos encontrados`

    } catch (error) {

      console.error(error)

      resposta.textContent =
        'Erro ao buscar produtos.'

    }

  }
)


// LIMPAR

btnLimpar.addEventListener(
  'click',
  async () => {

    campoBusca.value = ''


    try {

      const produtos =
        await carregarProdutos()


      resposta.textContent =
        `${produtos.length} produtos encontrados`

    } catch (error) {

      console.error(error)

      resposta.textContent =
        'Erro ao carregar produtos.'

    }

  }
)


// ESTOQUE CRÍTICO

btnCriticos.addEventListener(
  'click',
  async () => {

    try {

      const produtos =
        await window.api.listarEstoqueCritico()


      mostrarProdutos(
        produtos
      )


      resposta.textContent =
        `${produtos.length} produtos com estoque crítico`

    } catch (error) {

      console.error(error)

      resposta.textContent =
        'Erro ao buscar estoque crítico.'

    }

  }
)


// CARREGAR CATEGORIAS

export async function carregarCategoriasNoProduto() {

  const categorias =
    await window.api.listarCategorias()


  produtoCategoria.innerHTML = `

    <option value="">
      Selecione uma categoria
    </option>

  `


  categorias.forEach(
    (categoria) => {

      const option =
        document.createElement(
          'option'
        )


      option.value =
        String(
          categoria.id
        )


      option.textContent =
        categoria.nome


      produtoCategoria.appendChild(
        option
      )

    }
  )
}


// CADASTRAR OU EDITAR PRODUTO

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
        !preco ||
        preco <= 0
      ) {

        respostaProduto.textContent =
          'Informe um preço válido.'

        return

      }


      if (
        !idCategoria ||
        idCategoria <= 0
      ) {

        respostaProduto.textContent =
          'Selecione uma categoria.'

        return

      }


      // EDIÇÃO

      if (
        produtoEmEdicao !== null
      ) {

        await window.api.editarProduto(
          produtoEmEdicao,
          nome,
          codigo,
          preco,
          idCategoria
        )


        respostaProduto.textContent =
          'Produto atualizado com sucesso!'


        cancelarEdicao()


        await carregarProdutos()


        await carregarProdutosMovimentacao()


        return

      }


      // CADASTRO

      const produto =
        await window.api.cadastrarProduto(
          nome,
          codigo,
          preco,
          idCategoria
        )


      respostaProduto.textContent =
        `Produto "${produto.nome}" cadastrado com sucesso!`


      formProduto.reset()


      await carregarProdutos()


      await carregarProdutosMovimentacao()

    } catch (error) {

      console.error(
        'Erro ao salvar produto:',
        error
      )


      if (
        error instanceof Error
      ) {

        respostaProduto.textContent =
          error.message

      } else {

        respostaProduto.textContent =
          'Erro ao salvar produto.'

      }

    }

  }
)


// INICIAR EDIÇÃO

async function iniciarEdicaoProduto(
  id: number
) {

  try {

    const produtos =
      await window.api.listarProdutos()


    const produto =
      produtos.find(
        (item) =>
          item.id === id
      )


    if (!produto) {

      resposta.textContent =
        'Produto não encontrado.'

      return

    }


    produtoEmEdicao =
      produto.id


    produtoNome.value =
      produto.nome


    produtoCodigo.value =
      produto.codigo_barras


    produtoPreco.value =
      String(
        produto.preco_venda
      )


    await carregarCategoriasNoProduto()


    const categorias =
      await window.api.listarCategorias()


    const categoria =
      categorias.find(
        (item) =>
          item.nome ===
          produto.categoria
      )


    if (categoria) {

      produtoCategoria.value =
        String(
          categoria.id
        )

    }


    tituloFormProduto.textContent =
      'Editar Produto'


    btnSalvarProduto.textContent =
      'Salvar Alterações'


    btnCancelarEdicao.style.display =
      'inline-block'


    respostaProduto.textContent =
      `Editando produto: ${produto.nome}`


    menuTela.value =
      'cadastro'


    menuTela.dispatchEvent(
      new Event('change')
    )

  } catch (error) {

    console.error(
      'Erro ao iniciar edição:',
      error
    )


    resposta.textContent =
      'Erro ao carregar produto para edição.'

  }
}


// CANCELAR EDIÇÃO

function cancelarEdicao() {

  produtoEmEdicao =
    null


  formProduto.reset()


  tituloFormProduto.textContent =
    'Cadastrar Produto'


  btnSalvarProduto.textContent =
    'Cadastrar Produto'


  btnCancelarEdicao.style.display =
    'none'

}


// BOTÃO CANCELAR

btnCancelarEdicao.addEventListener(
  'click',
  () => {

    cancelarEdicao()

    respostaProduto.textContent =
      ''

  }
)


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


    alert(
      'Produto excluído com sucesso!'
    )


    await carregarProdutos()


    await carregarProdutosMovimentacao()

  } catch (error) {

    console.error(
      'Erro ao excluir produto:',
      error
    )


    if (
      error instanceof Error
    ) {

      alert(
        error.message
      )

    } else {

      alert(
        'Não foi possível excluir o produto.'
      )

    }

  }
}


// PRODUTOS DA MOVIMENTAÇÃO

export async function carregarProdutosMovimentacao() {

  const produtos =
    await window.api.listarProdutos()


  movimentacaoProduto.innerHTML = `

    <option value="">
      Selecione um produto
    </option>

  `


  produtos.forEach(
    (produto) => {

      const option =
        document.createElement(
          'option'
        )


      option.value =
        String(
          produto.id
        )


      option.textContent =
        `${produto.nome} - Estoque: ${produto.estoque}`


      movimentacaoProduto.appendChild(
        option
      )

    }
  )
}