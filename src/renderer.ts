import './style.css'

const appElement =
  document.getElementById('app') as HTMLDivElement

appElement.innerHTML = `
  <h1>Gerenciador de Estoque Comercial</h1>

  <div class="acoes">

    <button id="btn-ping">
      Enviar Ping IPC
    </button>

    <button id="btn-produtos">
      Listar Produtos
    </button>

    <button id="btn-criticos">
      Listar Estoque Crítico
    </button>

  </div>

  <div class="busca">

    <input
      id="campo-busca"
      type="text"
      placeholder="Nome ou código de barras"
    />

    <button id="btn-buscar">
      Buscar
    </button>

    <button id="btn-limpar">
      Limpar
    </button>

  </div>

  <p id="resposta">
    Aguardando interação...
  </p>

  <h2>Produtos</h2>

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
`

const button =
  document.getElementById(
    'btn-ping'
  ) as HTMLButtonElement

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


/*

PING IPC

*/

button.addEventListener(
  'click',
  async () => {

    resposta.textContent =
      'Enviando ping...'

    try {

      const retorno =
        await window.api.ping()

      resposta.textContent =
        `Resposta: ${retorno}`

    } catch (error) {

      resposta.textContent =
        'Erro ao enviar IPC.'

      console.error(error)
    }
  }
)


/*

FUNÇÃO PARA MOSTRAR PRODUTOS

*/

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

      <td>
        ${status}
      </td>
    `

    tabelaProdutos.appendChild(linha)
  })
}


/*

LISTAR TODOS OS PRODUTOS

*/

btnProdutos.addEventListener(
  'click',
  async () => {

    resposta.textContent =
      'Carregando produtos...'

    try {

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


/*

BUSCAR PRODUTO

*/

btnBuscar.addEventListener(
  'click',
  async () => {

    try {

      const termo =
        campoBusca.value.trim()

      if (!termo) {

        resposta.textContent =
          'Digite um nome ou código.'

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


/*

LIMPAR BUSCA

*/

btnLimpar.addEventListener(
  'click',
  async () => {

    campoBusca.value = ''

    resposta.textContent =
      'Carregando produtos...'

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


/*

ESTOQUE CRÍTICO

*/

btnCriticos.addEventListener(
  'click',
  async () => {

    resposta.textContent =
      'Buscando estoque crítico...'

    try {

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

export {}