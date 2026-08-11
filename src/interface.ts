import './style.css'

const app = document.getElementById('app') as HTMLDivElement

app.innerHTML = `
  <h1>Gerenciador de Estoque Comercial</h1>

  <section>
    <h2>Produtos</h2>

    <button id="btn-produtos">Listar Produtos</button>
    <button id="btn-criticos">Estoque Crítico</button>

    <br>

    <input
      id="campo-busca"
      type="text"
      placeholder="Buscar por ID, nome ou código"
    >

    <button id="btn-buscar">Buscar</button>
    <button id="btn-limpar">Limpar</button>

    <p id="resposta"></p>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Código</th>
          <th>Preço</th>
          <th>Categoria</th>
          <th>Estoque</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody id="tabela-produtos"></tbody>
    </table>
  </section>

  <section>
    <h2>Cadastrar Produto</h2>

    <form id="form-produto">
      <input id="produto-nome" placeholder="Nome" required>

      <input
        id="produto-codigo"
        placeholder="Código de barras"
        required
      >

      <input
        id="produto-preco"
        type="number"
        step="0.01"
        min="0"
        placeholder="Preço"
        required
      >

      <select id="produto-categoria" required>
        <option value="">Selecione a categoria</option>
      </select>

      <button type="submit">
        Cadastrar Produto
      </button>
    </form>

    <p id="resposta-produto"></p>
  </section>

  <section>
    <h2>Categorias</h2>

    <form id="form-categoria">
      <input
        id="categoria-nome"
        placeholder="Nome da categoria"
        required
      >

      <input
        id="categoria-descricao"
        placeholder="Descrição"
        required
      >

      <button type="submit">
        Cadastrar Categoria
      </button>
    </form>

    <p id="resposta-categoria"></p>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody id="tabela-categorias"></tbody>
    </table>
  </section>

  <section>
    <h2>Registrar Movimentação</h2>

    <form id="form-movimentacao">

      <select id="movimentacao-produto" required>
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

      <select id="movimentacao-tipo" required>
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
  </section>
`

// PRODUTOS

export const btnProdutos =
  document.getElementById('btn-produtos') as HTMLButtonElement

export const btnCriticos =
  document.getElementById('btn-criticos') as HTMLButtonElement

export const btnBuscar =
  document.getElementById('btn-buscar') as HTMLButtonElement

export const btnLimpar =
  document.getElementById('btn-limpar') as HTMLButtonElement

export const campoBusca =
  document.getElementById('campo-busca') as HTMLInputElement

export const resposta =
  document.getElementById('resposta') as HTMLParagraphElement

export const tabelaProdutos =
  document.getElementById('tabela-produtos') as HTMLTableSectionElement

export const formProduto =
  document.getElementById('form-produto') as HTMLFormElement

export const produtoNome =
  document.getElementById('produto-nome') as HTMLInputElement

export const produtoCodigo =
  document.getElementById('produto-codigo') as HTMLInputElement

export const produtoPreco =
  document.getElementById('produto-preco') as HTMLInputElement

export const produtoCategoria =
  document.getElementById('produto-categoria') as HTMLSelectElement

export const respostaProduto =
  document.getElementById(
    'resposta-produto'
  ) as HTMLParagraphElement

// CATEGORIAS

export const formCategoria =
  document.getElementById('form-categoria') as HTMLFormElement

export const categoriaNome =
  document.getElementById('categoria-nome') as HTMLInputElement

export const categoriaDescricao =
  document.getElementById(
    'categoria-descricao'
  ) as HTMLInputElement

export const respostaCategoria =
  document.getElementById(
    'resposta-categoria'
  ) as HTMLParagraphElement

export const tabelaCategorias =
  document.getElementById(
    'tabela-categorias'
  ) as HTMLTableSectionElement

// MOVIMENTAÇÕES

export const formMovimentacao =
  document.getElementById(
    'form-movimentacao'
  ) as HTMLFormElement

export const movimentacaoProduto =
  document.getElementById(
    'movimentacao-produto'
  ) as HTMLSelectElement

export const movimentacaoQuantidade =
  document.getElementById(
    'movimentacao-quantidade'
  ) as HTMLInputElement

export const movimentacaoTipo =
  document.getElementById(
    'movimentacao-tipo'
  ) as HTMLSelectElement

export const respostaMovimentacao =
  document.getElementById(
    'resposta-movimentacao'
  ) as HTMLParagraphElement