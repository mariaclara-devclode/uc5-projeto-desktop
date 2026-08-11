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
  movimentacaoProduto
} from './interface'


// CARREGAR PRODUTOS

export async function carregarProdutos() {
  try {
    const produtos =
      await window.api.listarProdutos()

    mostrarProdutos(produtos)

    return produtos
  } catch (error) {
    console.error(
      'Erro ao carregar produtos:',
      error
    )

    throw error
  }
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

  produtos.forEach((produto) => {
    const linha =
      document.createElement('tr')

    const status =
      produto.estoque <= 10
        ? 'CRÍTICO'
        : 'Normal'

    linha.innerHTML = `
      <td>${produto.id}</td>

      <td>${produto.nome}</td>

      <td>${produto.codigo_barras}</td>

      <td>
        R$ ${Number(
          produto.preco_venda
        ).toFixed(2)}
      </td>

      <td>${produto.categoria}</td>

      <td>${produto.estoque}</td>

      <td>${status}</td>

      <td>
        <button
          class="btn-editar-produto"
          type="button"
        >
          Editar
        </button>

        <button
          class="btn-excluir-produto"
          type="button"
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
      async () => {
        console.log(
          'Clicou em editar produto:',
          produto.id
        )

        await editarProduto(
          produto.id
        )
      }
    )

    btnExcluir.addEventListener(
      'click',
      async () => {
        await excluirProduto(
          produto.id
        )
      }
    )

    tabelaProdutos.appendChild(
      linha
    )
  })
}


// BOTÃO PRODUTOS

btnProdutos.addEventListener(
  'click',
  async () => {
    try {
      resposta.textContent =
        'Carregando produtos...'

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


// BUSCAR PRODUTOS

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

      resposta.textContent =
        'Buscando...'

      const produtos =
        await window.api.buscarProdutos(
          termo
        )

      mostrarProdutos(produtos)

      resposta.textContent =
        `${produtos.length} produtos encontrados`
    } catch (error) {
      console.error(
        'Erro ao buscar:',
        error
      )

      resposta.textContent =
        'Erro ao buscar produtos.'
    }
  }
)


// LIMPAR BUSCA

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
      resposta.textContent =
        'Buscando estoque crítico...'

      const produtos =
        await window.api.listarEstoqueCritico()

      mostrarProdutos(produtos)

      resposta.textContent =
        `${produtos.length} produtos com estoque crítico`
    } catch (error) {
      console.error(error)

      resposta.textContent =
        'Erro ao buscar estoque crítico.'
    }
  }
)


// CATEGORIAS

export async function carregarCategoriasNoProduto() {
  const categorias =
    await window.api.listarCategorias()

  produtoCategoria.innerHTML = `
    <option value="">
      Selecione uma categoria
    </option>
  `

  categorias.forEach((categoria) => {
    const option =
      document.createElement('option')

    option.value =
      String(categoria.id)

    option.textContent =
      categoria.nome

    produtoCategoria.appendChild(
      option
    )
  })
}


// CADASTRAR PRODUTO

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
        preco <= 0
      ) {
        respostaProduto.textContent =
          'O preço deve ser maior que zero.'

        return
      }

      if (
        !Number.isInteger(
          idCategoria
        ) ||
        idCategoria <= 0
      ) {
        respostaProduto.textContent =
          'Selecione uma categoria.'

        return
      }

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
        'Erro ao cadastrar produto:',
        error
      )

      if (
        error instanceof Error
      ) {
        respostaProduto.textContent =
          `Erro ao cadastrar produto: ${error.message}`
      } else {
        respostaProduto.textContent =
          'Erro ao cadastrar produto.'
      }
    }
  }
)


// EDITAR PRODUTO

async function editarProduto(
  id: number
) {
  try {
    console.log(
      'Iniciando edição do produto:',
      id
    )

    const produtos =
      await window.api.listarProdutos()

    const produto =
      produtos.find(
        (item) =>
          item.id === id
      )

    if (!produto) {
      alert(
        'Produto não encontrado.'
      )

      return
    }

    const categorias =
      await window.api.listarCategorias()

    if (
      categorias.length === 0
    ) {
      alert(
        'Não existem categorias cadastradas.'
      )

      return
    }

    // MODAL

    const fundo =
      document.createElement(
        'div'
      )

    fundo.id =
      'modal-editar-produto'

    fundo.style.position =
      'fixed'

    fundo.style.top =
      '0'

    fundo.style.left =
      '0'

    fundo.style.width =
      '100%'

    fundo.style.height =
      '100%'

    fundo.style.background =
      'rgba(0, 0, 0, 0.6)'

    fundo.style.display =
      'flex'

    fundo.style.alignItems =
      'center'

    fundo.style.justifyContent =
      'center'

    fundo.style.zIndex =
      '9999'


    const caixa =
      document.createElement(
        'div'
      )

    caixa.style.background =
      '#1e293b'

    caixa.style.color =
      '#f8fafc'

    caixa.style.padding =
      '30px'

    caixa.style.borderRadius =
      '12px'

    caixa.style.width =
      '450px'

    caixa.style.maxWidth =
      '90%'


    const titulo =
      document.createElement(
        'h2'
      )

    titulo.textContent =
      'Editar Produto'

    titulo.style.marginTop =
      '0'

    caixa.appendChild(
      titulo
    )


    // NOME

    const labelNome =
      document.createElement(
        'label'
      )

    labelNome.textContent =
      'Nome do produto'

    labelNome.style.display =
      'block'

    labelNome.style.marginTop =
      '15px'

    caixa.appendChild(
      labelNome
    )


    const inputNome =
      document.createElement(
        'input'
      )

    inputNome.type =
      'text'

    inputNome.value =
      produto.nome

    inputNome.style.width =
      '100%'

    inputNome.style.boxSizing =
      'border-box'

    caixa.appendChild(
      inputNome
    )


    // CÓDIGO

    const labelCodigo =
      document.createElement(
        'label'
      )

    labelCodigo.textContent =
      'Código de barras'

    labelCodigo.style.display =
      'block'

    labelCodigo.style.marginTop =
      '15px'

    caixa.appendChild(
      labelCodigo
    )


    const inputCodigo =
      document.createElement(
        'input'
      )

    inputCodigo.type =
      'text'

    inputCodigo.value =
      produto.codigo_barras

    inputCodigo.style.width =
      '100%'

    inputCodigo.style.boxSizing =
      'border-box'

    caixa.appendChild(
      inputCodigo
    )


    // PREÇO

    const labelPreco =
      document.createElement(
        'label'
      )

    labelPreco.textContent =
      'Preço de venda'

    labelPreco.style.display =
      'block'

    labelPreco.style.marginTop =
      '15px'

    caixa.appendChild(
      labelPreco
    )


    const inputPreco =
      document.createElement(
        'input'
      )

    inputPreco.type =
      'number'

    inputPreco.step =
      '0.01'

    inputPreco.value =
      String(
        produto.preco_venda
      )

    inputPreco.style.width =
      '100%'

    inputPreco.style.boxSizing =
      'border-box'

    caixa.appendChild(
      inputPreco
    )


    // CATEGORIA

    const labelCategoria =
      document.createElement(
        'label'
      )

    labelCategoria.textContent =
      'Categoria'

    labelCategoria.style.display =
      'block'

    labelCategoria.style.marginTop =
      '15px'

    caixa.appendChild(
      labelCategoria
    )


    const selectCategoria =
      document.createElement(
        'select'
      )

    selectCategoria.style.width =
      '100%'

    selectCategoria.style.boxSizing =
      'border-box'


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

        if (
          categoria.nome ===
          produto.categoria
        ) {
          option.selected =
            true
        }

        selectCategoria.appendChild(
          option
        )
      }
    )


    caixa.appendChild(
      selectCategoria
    )


    // BOTÕES

    const areaBotoes =
      document.createElement(
        'div'
      )

    areaBotoes.style.display =
      'flex'

    areaBotoes.style.justifyContent =
      'flex-end'

    areaBotoes.style.gap =
      '10px'

    areaBotoes.style.marginTop =
      '25px'

    caixa.appendChild(
      areaBotoes
    )


    // CANCELAR

    const btnCancelar =
      document.createElement(
        'button'
      )

    btnCancelar.type =
      'button'

    btnCancelar.textContent =
      'Cancelar'

    areaBotoes.appendChild(
      btnCancelar
    )


    // SALVAR

    const btnSalvar =
      document.createElement(
        'button'
      )

    btnSalvar.type =
      'button'

    btnSalvar.textContent =
      'Salvar'

    areaBotoes.appendChild(
      btnSalvar
    )


    fundo.appendChild(
      caixa
    )

    document.body.appendChild(
      fundo
    )


    // CANCELAR

    btnCancelar.addEventListener(
      'click',
      () => {
        fundo.remove()
      }
    )


    // SALVAR

    btnSalvar.addEventListener(
      'click',
      async () => {
        try {
          const nome =
            inputNome.value.trim()

          const codigo =
            inputCodigo.value.trim()

          const preco =
            Number(
              inputPreco.value
            )

          const idCategoria =
            Number(
              selectCategoria.value
            )


          // VALIDAÇÃO

          if (!nome) {
            alert(
              'Informe o nome do produto.'
            )

            return
          }


          if (!codigo) {
            alert(
              'Informe o código de barras.'
            )

            return
          }


          if (
            !Number.isFinite(preco) ||
            preco <= 0
          ) {
            alert(
              'Informe um preço válido.'
            )

            return
          }


          if (
            !Number.isInteger(
              idCategoria
            ) ||
            idCategoria <= 0
          ) {
            alert(
              'Selecione uma categoria.'
            )

            return
          }


          btnSalvar.disabled =
            true

          btnSalvar.textContent =
            'Salvando...'


          console.log(
            'Enviando edição:',
            {
              id,
              nome,
              codigo,
              preco,
              idCategoria
            }
          )


          const produtoAtualizado =
            await window.api.editarProduto(
              id,
              nome,
              codigo,
              preco,
              idCategoria
            )


          console.log(
            'Produto atualizado:',
            produtoAtualizado
          )


          fundo.remove()


          alert(
            'Produto editado com sucesso!'
          )


          await carregarProdutos()

          await carregarProdutosMovimentacao()

        } catch (error) {
          console.error(
            'Erro ao editar produto:',
            error
          )

          btnSalvar.disabled =
            false

          btnSalvar.textContent =
            'Salvar'


          if (
            error instanceof Error
          ) {
            alert(
              `Erro ao editar produto:\n\n${error.message}`
            )
          } else {
            alert(
              'Erro ao editar produto.'
            )
          }
        }
      }
    )

  } catch (error) {
    console.error(
      'Erro ao abrir edição:',
      error
    )

    if (
      error instanceof Error
    ) {
      alert(
        `Erro ao editar produto:\n\n${error.message}`
      )
    } else {
      alert(
        'Erro ao editar produto.'
      )
    }
  }
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
        `Não foi possível excluir o produto:\n\n${error.message}`
      )
    } else {
      alert(
        'Não foi possível excluir o produto.'
      )
    }
  }
}


// MOVIMENTAÇÃO

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