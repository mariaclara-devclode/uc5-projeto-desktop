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

  try {

    const categorias =
      await window.api.listarCategorias()

    tabelaCategorias.innerHTML = ''

    categorias.forEach((categoria) => {

      const linha =
        document.createElement('tr')


      const colunaId =
        document.createElement('td')

      colunaId.textContent =
        String(categoria.id)


      const colunaNome =
        document.createElement('td')

      colunaNome.textContent =
        categoria.nome


      const colunaDescricao =
        document.createElement('td')

      colunaDescricao.textContent =
        categoria.descricao


      const colunaAcoes =
        document.createElement('td')


      const btnEditar =
        document.createElement('button')

      btnEditar.type =
        'button'

      btnEditar.textContent =
        'Editar'

      btnEditar.classList.add(
        'btn-editar-categoria'
      )


      const btnExcluir =
        document.createElement('button')

      btnExcluir.type =
        'button'

      btnExcluir.textContent =
        'Excluir'

      btnExcluir.classList.add(
        'btn-excluir-categoria'
      )


      btnEditar.addEventListener(
        'click',
        () => {

          editarCategoriaNaLinha(
            linha,
            categoria.id,
            categoria.nome,
            categoria.descricao
          )

        }
      )


      btnExcluir.addEventListener(
        'click',
        async () => {

          const confirmar =
            window.confirm(
              `Deseja excluir a categoria "${categoria.nome}"?`
            )

          if (!confirmar) {
            return
          }


          try {

            await window.api.excluirCategoria(
              categoria.id
            )

            respostaCategoria.textContent =
              'Categoria excluída com sucesso!'

            await carregarCategorias()

          } catch (error) {

            console.error(error)

            if (
              error instanceof Error
            ) {

              respostaCategoria.textContent =
                error.message

            } else {

              respostaCategoria.textContent =
                'Não foi possível excluir a categoria.'

            }

          }

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
        colunaDescricao
      )

      linha.appendChild(
        colunaAcoes
      )


      tabelaCategorias.appendChild(
        linha
      )

    })


    await carregarCategoriasNoProduto()

    return categorias

  } catch (error) {

    console.error(error)

    respostaCategoria.textContent =
      'Não foi possível carregar as categorias.'

    return []

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


      if (!nome) {

        respostaCategoria.textContent =
          'Informe o nome da categoria.'

        return

      }


      if (!descricao) {

        respostaCategoria.textContent =
          'Informe a descrição da categoria.'

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

      if (
        error instanceof Error
      ) {

        respostaCategoria.textContent =
          error.message

      } else {

        respostaCategoria.textContent =
          'Erro ao cadastrar categoria.'

      }

    }

  }
)


// EDITAR CATEGORIA

function editarCategoriaNaLinha(
  linha: HTMLTableRowElement,
  id: number,
  nomeAtual: string,
  descricaoAtual: string
) {

  linha.innerHTML = ''


  const colunaId =
    document.createElement('td')

  colunaId.textContent =
    String(id)


  const colunaNome =
    document.createElement('td')


  const campoNome =
    document.createElement('input')

  campoNome.type =
    'text'

  campoNome.value =
    nomeAtual


  colunaNome.appendChild(
    campoNome
  )


  const colunaDescricao =
    document.createElement('td')


  const campoDescricao =
    document.createElement('input')

  campoDescricao.type =
    'text'

  campoDescricao.value =
    descricaoAtual


  colunaDescricao.appendChild(
    campoDescricao
  )


  const colunaAcoes =
    document.createElement('td')


  const btnSalvar =
    document.createElement('button')

  btnSalvar.type =
    'button'

  btnSalvar.textContent =
    'Salvar'


  const btnCancelar =
    document.createElement('button')

  btnCancelar.type =
    'button'

  btnCancelar.textContent =
    'Cancelar'


  btnSalvar.addEventListener(
    'click',
    async () => {

      const nome =
        campoNome.value.trim()

      const descricao =
        campoDescricao.value.trim()


      if (!nome) {

        respostaCategoria.textContent =
          'Informe o nome da categoria.'

        return

      }


      if (!descricao) {

        respostaCategoria.textContent =
          'Informe a descrição da categoria.'

        return

      }


      try {

        await window.api.editarCategoria(
          id,
          nome,
          descricao
        )


        respostaCategoria.textContent =
          'Categoria atualizada com sucesso!'


        await carregarCategorias()

      } catch (error) {

        console.error(error)

        if (
          error instanceof Error
        ) {

          respostaCategoria.textContent =
            error.message

        } else {

          respostaCategoria.textContent =
            'Não foi possível editar a categoria.'

        }

      }

    }
  )


  btnCancelar.addEventListener(
    'click',
    async () => {

      await carregarCategorias()

    }
  )


  colunaAcoes.appendChild(
    btnSalvar
  )

  colunaAcoes.appendChild(
    btnCancelar
  )


  linha.appendChild(
    colunaId
  )

  linha.appendChild(
    colunaNome
  )

  linha.appendChild(
    colunaDescricao
  )

  linha.appendChild(
    colunaAcoes
  )

}


// RECARREGAR CATEGORIAS

carregarCategorias()