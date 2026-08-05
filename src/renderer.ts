import './style.css'

const appElement =
  document.getElementById('app') as HTMLDivElement

appElement.innerHTML = `
  <h1>Gerenciador de Estoque Comercial</h1>

  <button id="btn-ping">Enviar Ping IPC</button>
  <button id="btn-produtos">Listar Produtos</button>

  <p id="resposta">Aguardando interação...</p>

  <h2>Produtos</h2>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Código de Barras</th>
        <th>Preço de Venda</th>
        <th>Categoria</th>
        <th>Estoque</th>
      </tr>
    </thead>

    <tbody id="tabela-produtos">
    </tbody>
  </table>
`

const button =
  document.getElementById('btn-ping') as HTMLButtonElement

const resposta =
  document.getElementById('resposta') as HTMLParagraphElement

button.addEventListener('click', async () => {
  resposta.textContent = 'Enviando ping...'

  try {
    const retorno = await window.api.ping()

    resposta.textContent = `Resposta: ${retorno}`
  } catch (erro) {
    resposta.textContent = 'Erro ao enviar IPC.'

    console.error(erro)
  }
})

const btnProdutos =
  document.getElementById('btn-produtos') as HTMLButtonElement

const tabelaProdutos =
  document.getElementById(
    'tabela-produtos'
  ) as HTMLTableSectionElement

btnProdutos.addEventListener('click', async () => {

  tabelaProdutos.innerHTML = ''

  resposta.textContent = 'Carregando produtos...'

  try {

    const produtos =
      await window.api.listarProdutos()

    produtos.forEach((produto) => {

      const linha =
        document.createElement('tr')

      linha.innerHTML = `
        <td>${produto.id}</td>

        <td>${produto.nome}</td>

        <td>${produto.codigo_barras}</td>

        <td>
          R$ ${produto.preco_venda.toFixed(2)}
        </td>

        <td>${produto.categoria}</td>

        <td>${produto.estoque}</td>
      `

      tabelaProdutos.appendChild(linha)
    })

    resposta.textContent =
      `${produtos.length} produtos encontrados`

  } catch (erro) {

    resposta.textContent =
      'Erro ao listar produtos.'

    console.error(erro)
  }
})

export {}