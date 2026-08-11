import {
  formCategoria,
  categoriaNome,
  categoriaDescricao,
  respostaCategoria,
  tabelaCategorias
} from './interface'

import {
  carregarCategoriasNoProduto
} from './produtos'

export async function carregarCategorias() {
  const categorias =
    await window.api.listarCategorias()

  tabelaCategorias.innerHTML = ''

  categorias.forEach((categoria) => {
    const linha =
      document.createElement('tr')

    linha.innerHTML = `
      <td>${categoria.id}</td>
      <td>${categoria.nome}</td>
      <td>${categoria.descricao}</td>

      <td>
        <button class="btn-editar-categoria">
          Editar
        </button>

        <button class="btn-excluir-categoria">
          Excluir
        </button>
      </td>
    `

    const btnEditar =
      linha.querySelector(
        '.btn-editar-categoria'
      ) as HTMLButtonElement

    const btnExcluir =
      linha.querySelector(
        '.btn-excluir-categoria'
      ) as HTMLButtonElement

    btnEditar.addEventListener(
      'click',
      () =>
        editarCategoria(
          categoria.id,
          categoria.nome,
          categoria.descricao
        )
    )

    btnExcluir.addEventListener(
      'click',
      () =>
        excluirCategoria(
          categoria.id
        )
    )

    tabelaCategorias.appendChild(
      linha
    )
  })

  await carregarCategoriasNoProduto()

  return categorias
}

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
      console.error(error)

      respostaCategoria.textContent =
        'Erro ao cadastrar categoria.'
    }
  }
)

async function editarCategoria(
  id: number,
  nomeAtual: string,
  descricaoAtual: string
) {
  const nome =
    prompt(
      'Nome da categoria:',
      nomeAtual
    )

  if (nome === null) {
    return
  }

  const descricao =
    prompt(
      'Descrição da categoria:',
      descricaoAtual
    )

  if (descricao === null) {
    return
  }

  if (!nome.trim() || !descricao.trim()) {
    alert(
      'Preencha todos os campos.'
    )

    return
  }

  try {
    await window.api.editarCategoria(
      id,
      nome.trim(),
      descricao.trim()
    )

    alert(
      'Categoria atualizada com sucesso!'
    )

    await carregarCategorias()
  } catch (error) {
    console.error(error)

    alert(
      'Não foi possível editar a categoria.'
    )
  }
}

async function excluirCategoria(
  id: number
) {
  const confirmar =
    confirm(
      `Deseja realmente excluir a categoria ID ${id}?`
    )

  if (!confirmar) {
    return
  }

  try {
    await window.api.excluirCategoria(id)

    alert(
      'Categoria excluída com sucesso!'
    )

    await carregarCategorias()
  } catch (error) {
    console.error(error)

    alert(
      'Não foi possível excluir a categoria. Verifique se existem produtos vinculados.'
    )
  }
}