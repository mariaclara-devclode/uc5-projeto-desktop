import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {

  ping: () => ipcRenderer.invoke('canal-ping'),

  listarProdutos: () =>
    ipcRenderer.invoke('listar-produtos'),

   buscarProdutos: (termo: string) =>
    ipcRenderer.invoke(
      'buscar-produtos',
      termo
    ),

  listarEstoqueCritico: () =>
    ipcRenderer.invoke(
      'listar-estoque-critico'
    ),

 
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
        descricao
      }
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
      id_categoria
    }
  ),

  registrarMovimentacao: (
  id_produto: number,
  quantidade: number,
  tipo: 'entrada' | 'saida'
) =>
  ipcRenderer.invoke(
    'registrar-movimentacao',
    {
      id_produto,
      quantidade,
      tipo
    }
  ),

})

