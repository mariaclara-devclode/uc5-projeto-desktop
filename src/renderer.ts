import './style.css'

const appElement =
  document.getElementById('app') as HTMLDivElement

appElement.innerHTML = `
  <h1>Gerenciador de Estoque Comercial</h1>

  <hr>

  <h2>Produtos</h2>

  <button id="btn-produtos">
    Listar Produtos
  </button>

  <button id="btn-criticos">
    Listar Estoque Crítico
  </button>

  <br><br>

  <input
    id="campo-busca"
    type="text"
    placeholder="Nome ou código de barras"
  >

  <button id="btn-buscar">
    Buscar
  </button>

  <button id="btn-limpar">
    Limpar
  </button>

  <p id="resposta">
    Aguardando interação...
  </p>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Código de Barras</th>
        <th>Preço</th>
        <th>Categoria</th>
        <th>Estoque</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody id="tabela-produtos">
    </tbody>
  </table>

  <hr>

  <h2>Cadastrar Categoria</h2>

  <form id="form-categoria">

    <input
      id="categoria-nome"
      type="text"
      placeholder="Nome da categoria"
      required
    >

    <input
      id="categoria-descricao"
      type="text"
      placeholder="Descrição"
      required
    >

    <button type="submit">
      Cadastrar Categoria
    </button>

  </form>

  <p id="resposta-categoria"></p>

  <hr>

  <h2>Cadastrar Produto</h2>

  <form id="form-produto">

    <input
      id="produto-nome"
      type="text"
      placeholder="Nome do produto"
      required
    >

    <input
      id="produto-codigo"
      type="text"
      placeholder="Código de barras"
      required
    >

    <input
      id="produto-preco"
      type="number"
      step="0.01"
      min="0"
      placeholder="Preço de venda"
      required
    >

    <select
      id="produto-categoria"
      required
    >
      <option value="">
        Selecione uma categoria
      </option>
    </select>

    <button type="submit">
      Cadastrar Produto
    </button>

  </form>

  <p id="resposta-produto"></p>

  <hr>

  <h2>Registrar Movimentação</h2>

  <form id="form-movimentacao">

    <select
      id="movimentacao-produto"
      required
    >
      <option value="">
        Selecione um produto
      </option>
    </select>

    <input
      id="movimentacao-quantidade"
      type="number"
      min="1"
      placeholder="Quantidade"
      required
    >

    <select
      id="movimentacao-tipo"
      required
    >
      <option value="">
        Selecione o tipo
      </option>

      <option value="entrada">
        Entrada
      </option>

      <option value="saida">
        Saída
      </option>
    </select>

    <button type="submit">
      Registrar Movimentação
    </button>

  </form>

  <p id="resposta-movimentacao"></p>
`

// =====================================================
// ELEMENTOS DA INTERFACE
// =====================================================

const resposta =
  document.getElementById(
    'resposta'
  ) as HTMLParagraphElement

const tabelaProdutos =
  document.getElementById(
    'tabela-produtos'
  ) as HTMLTableSectionElement

const btnProdutos =
  document.getElementById(
    'btn-produtos'
  ) as HTMLButtonElement

const btnCriticos =
  document.getElementById(
    'btn-criticos'
  ) as HTMLButtonElement

const btnBuscar =
  document.getElementById(
    'btn-buscar'
  ) as HTMLButtonElement

const btnLimpar =
  document.getElementById(
    'btn-limpar'
  ) as HTMLButtonElement

const campoBusca =
  document.getElementById(
    'campo-busca'
  ) as HTMLInputElement

// =====================================================
// CATEGORIA
// =====================================================

const formCategoria =
  document.getElementById(
    'form-categoria'
  ) as HTMLFormElement

const categoriaNome =
  document.getElementById(
    'categoria-nome'
  ) as HTMLInputElement

const categoriaDescricao =
  document.getElementById(
    'categoria-descricao'
  ) as HTMLInputElement

const respostaCategoria =
  document.getElementById(
    'resposta-categoria'
  ) as HTMLParagraphElement

// =====================================================
// PRODUTO
// =====================================================

const formProduto =
  document.getElementById(
    'form-produto'
  ) as HTMLFormElement

const produtoNome =
  document.getElementById(
    'produto-nome'
  ) as HTMLInputElement

const produtoCodigo =
  document.getElementById(
    'produto-codigo'
  ) as HTMLInputElement

const produtoPreco =
  document.getElementById(
    'produto-preco'
  ) as HTMLInputElement

const produtoCategoria =
  document.getElementById(
    'produto-categoria'
  ) as HTMLSelectElement

const respostaProduto =
  document.getElementById(
    'resposta-produto'
  ) as HTMLParagraphElement

// =====================================================
// MOVIMENTAÇÃO
// =====================================================

const formMovimentacao =
  document.getElementById(
    'form-movimentacao'
  ) as HTMLFormElement

const movimentacaoProduto =
  document.getElementById(
    'movimentacao-produto'
  ) as HTMLSelectElement

const movimentacaoQuantidade =
  document.getElementById(
    'movimentacao-quantidade'
  ) as HTMLInputElement

const movimentacaoTipo =
  document.getElementById(
    'movimentacao-tipo'
  ) as HTMLSelectElement

const respostaMovimentacao =
  document.getElementById(
    'resposta-movimentacao'
  ) as HTMLParagraphElement


// =====================================================
// MOSTRAR PRODUTOS NA TABELA
// =====================================================

function mostrarProdutos(
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
        R$ ${produto.preco_venda.toFixed(2)}
      </td>

      <td>${produto.categoria}</td>

      <td>${produto.estoque}</td>

      <td>${status}</td>
    `

    tabelaProdutos.appendChild(linha)
  })
}


// =====================================================
// LISTAR PRODUTOS
// =====================================================

btnProdutos.addEventListener(
  'click',
  async () => {

    try {

      resposta.textContent =
        'Carregando produtos...'

      const produtos =
        await window.api.listarProdutos()

      mostrarProdutos(produtos)

      resposta.textContent =
        `${produtos.length} produtos encontrados`

    } catch (error) {

      resposta.textContent =
        'Erro ao listar produtos.'

      console.error(error)
    }
  }
)


// =====================================================
// BUSCAR PRODUTOS
// =====================================================

btnBuscar.addEventListener(
  'click',
  async () => {

    try {

      const termo =
        campoBusca.value.trim()

      if (!termo) {

        resposta.textContent =
          'Digite um nome ou código de barras.'

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

      resposta.textContent =
        'Erro ao buscar produtos.'

      console.error(error)
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
        await window.api.listarProdutos()

      mostrarProdutos(produtos)

      resposta.textContent =
        `${produtos.length} produtos encontrados`

    } catch (error) {

      resposta.textContent =
        'Erro ao carregar produtos.'

      console.error(error)
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

      resposta.textContent =
        'Erro ao buscar estoque crítico.'

      console.error(error)
    }
  }
)


// LISTAR CATEGORIAS

async function carregarCategorias() {

  try {

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

  } catch (error) {

    console.error(
      'Erro ao carregar categorias:',
      error
    )
  }
}


// LISTAR PRODUTOS NO SELECT DA MOVIMENTAÇÃO

async function carregarProdutosMovimentacao() {

  try {

    const produtos =
      await window.api.listarProdutos()

    movimentacaoProduto.innerHTML = `
      <option value="">
        Selecione um produto
      </option>
    `

    produtos.forEach((produto) => {

      const option =
        document.createElement('option')

      option.value =
        String(produto.id)

      option.textContent =
        `${produto.nome} - Estoque: ${produto.estoque}`

      movimentacaoProduto.appendChild(
        option
      )
    })

  } catch (error) {

    console.error(
      'Erro ao carregar produtos:',
      error
    )
  }
}


// CADASTRAR CATEGORIA

formCategoria.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault()

    try {

      const nome =
        categoriaNome.value.trim()

      const descricao =
        categoriaDescricao.value.trim()

      if (!nome || !descricao) {

        respostaCategoria.textContent =
          'Preencha todos os campos.'

        return
      }

      respostaCategoria.textContent =
        'Cadastrando categoria...'

      const categoria =
        await window.api.cadastrarCategoria(
          nome,
          descricao
        )

      respostaCategoria.textContent =
        `Categoria "${categoria.nome}" cadastrada com sucesso!`

      formCategoria.reset()

      await carregarCategorias()

    } catch (error) {

      respostaCategoria.textContent =
        'Erro ao cadastrar categoria.'

      console.error(error)
    }
  }
)


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
        Number(produtoPreco.value)

      const idCategoria =
        Number(produtoCategoria.value)

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

      if (preco <= 0) {

        respostaProduto.textContent =
          'O preço deve ser maior que zero.'

        return
      }

      if (idCategoria <= 0) {

        respostaProduto.textContent =
          'Selecione uma categoria.'

        return
      }

      respostaProduto.textContent =
        'Cadastrando produto...'

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

      await carregarProdutosMovimentacao()

      const produtos =
        await window.api.listarProdutos()

      mostrarProdutos(produtos)

    } catch (error) {

      respostaProduto.textContent =
        'Erro ao cadastrar produto.'

      console.error(error)
    }
  }
)

// REGISTRAR MOVIMENTAÇÃO

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
          'entrada' | 'saida'

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

      respostaMovimentacao.textContent =
        'Registrando movimentação...'

      await window.api.registrarMovimentacao(
        idProduto,
        quantidade,
        tipo
      )

      respostaMovimentacao.textContent =
        'Movimentação registrada com sucesso!'

      formMovimentacao.reset()

      // Atualiza a tabela
      
      const produtos =
        await window.api.listarProdutos()

      mostrarProdutos(produtos)

      // Atualiza o select de produtos
      await carregarProdutosMovimentacao()

    } catch (error) {

      if (error instanceof Error) {

        respostaMovimentacao.textContent =
          error.message

      } else {

        respostaMovimentacao.textContent =
          'Erro ao registrar movimentação.'
      }

      console.error(error)
    }
  }
)


// INICIALIZAÇÃO DA INTERFACE

async function inicializar() {

  try {

    await carregarCategorias()

    await carregarProdutosMovimentacao()

    const produtos =
      await window.api.listarProdutos()

    mostrarProdutos(produtos)

    resposta.textContent =
      `${produtos.length} produtos encontrados`

  } catch (error) {

    console.error(
      'Erro ao inicializar aplicação:',
      error
    )

    resposta.textContent =
      'Erro ao carregar dados iniciais.'
  }
}

inicializar()

export {}