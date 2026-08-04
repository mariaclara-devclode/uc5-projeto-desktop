import './style.css'

const appElement = document.getElementById('app') as HTMLDivElement

appElement.innerHTML = `
  <h1>Gerenciador de Estoque Comercial</h1>

  <button id="btn-ping">Enviar Ping IPC</button>
  <button id="btn-produtos">Listar Produtos</button>

  <p id="resposta">Aguardando interação...</p>

  <h2>Produtos</h2>
  <ul id="lista-produtos"></ul>
`

const button = document.getElementById('btn-ping') as HTMLButtonElement
const resposta = document.getElementById('resposta') as HTMLParagraphElement

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

const btnProdutos = document.getElementById('btn-produtos') as HTMLButtonElement
const lista = document.getElementById('lista-produtos') as HTMLUListElement

btnProdutos.addEventListener('click', async () => {
  lista.innerHTML = ''

  try {
    const produtos = await window.api.listarProdutos()

    produtos.forEach((produto) => {
      const item = document.createElement('li')

      item.textContent = `${produto.id} - ${produto.nome} - R$ ${produto.preco.toFixed(2)}`

      lista.appendChild(item)
    })
  } catch (erro) {
    resposta.textContent = 'Erro ao listar produtos.'
    console.error(erro)
  }
})

export {}