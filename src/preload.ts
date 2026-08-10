import {
  contextBridge,
  ipcRenderer,
} from 'electron'

contextBridge.exposeInMainWorld(
  'api',
  {
    // PING
    // 

    ping: () =>
      ipcRenderer.invoke(
        'canal-ping'
      ),

    // PRODUTOS
    // 
    listarProdutos: () =>
      ipcRenderer.invoke(
        'listar-produtos'
      ),

    buscarProdutos: (
      termo: string
    ) =>
      ipcRenderer.invoke(
        'buscar-produtos',
        termo
      ),

    listarEstoqueCritico: () =>
      ipcRenderer.invoke(
        'listar-estoque-critico'
      ),

    cadastrarProduto: (
      nome: string,
      codigo_barras: string,
      preco_venda: number,
      id_categoria: number
    ) =>
      ipcRenderer.invoke(
        'cadastrar-produto',
        {
          nome,
          codigo_barras,
          preco_venda,
          id_categoria,
        }
      ),

    editarProduto: (
      id: number,
      nome: string,
      codigo_barras: string,
      preco_venda: number,
      id_categoria: number
    ) =>
      ipcRenderer.invoke(
        'editar-produto',
        {
          id,
          nome,
          codigo_barras,
          preco_venda,
          id_categoria,
        }
      ),

    excluirProduto: (
      id: number
    ) =>
      ipcRenderer.invoke(
        'excluir-produto',
        id
      ),

    // CATEGORIAS
    // 

    listarCategorias: () =>
      ipcRenderer.invoke(
        'listar-categorias'
      ),

    cadastrarCategoria: (
      nome: string,
      descricao: string
    ) =>
      ipcRenderer.invoke(
        'cadastrar-categoria',
        {
          nome,
          descricao,
        }
      ),

    editarCategoria: (
      id: number,
      nome: string,
      descricao: string
    ) =>
      ipcRenderer.invoke(
        'editar-categoria',
        {
          id,
          nome,
          descricao,
        }
      ),

    excluirCategoria: (
      id: number
    ) =>
      ipcRenderer.invoke(
        'excluir-categoria',
        id
      ),

    // MOVIMENTAÇÕES
    // 
    registrarMovimentacao: (
      id_produto: number,
      quantidade: number,
      tipo:
        | 'entrada'
        | 'saida'
    ) =>
      ipcRenderer.invoke(
        'registrar-movimentacao',
        {
          id_produto,
          quantidade,
          tipo,
        }
      ),
  }
)