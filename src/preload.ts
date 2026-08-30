import {
  contextBridge,
  ipcRenderer,
} from 'electron'

import { CANAIS } from './canais'


contextBridge.exposeInMainWorld(
  'api',
  {

    // PING

    ping: () =>
      ipcRenderer.invoke(
        CANAIS.ping
      ),


    // PRODUTOS

    listarProdutos: () =>
      ipcRenderer.invoke(
        CANAIS.listarProdutos
      ),


    buscarProdutos: (
      termo: string
    ) =>
      ipcRenderer.invoke(
        CANAIS.buscarProdutos,
        termo
      ),


    listarEstoqueCritico: () =>
      ipcRenderer.invoke(
        CANAIS.listarEstoqueCritico
      ),


    cadastrarProduto: (
      nome: string,
      codigo_barras: string,
      preco_venda: number,
      id_categoria: number
    ) =>
      ipcRenderer.invoke(
        CANAIS.cadastrarProduto,
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
        CANAIS.editarProduto,
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
        CANAIS.excluirProduto,
        id
      ),


    // CATEGORIAS

    listarCategorias: () =>
      ipcRenderer.invoke(
        CANAIS.listarCategorias
      ),


    cadastrarCategoria: (
      nome: string,
      descricao: string
    ) =>
      ipcRenderer.invoke(
        CANAIS.cadastrarCategoria,
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
        CANAIS.editarCategoria,
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
        CANAIS.excluirCategoria,
        id
      ),


    // MOVIMENTAÇÕES

    registrarMovimentacao: (
      id_produto: number,
      quantidade: number,
      tipo:
        | 'entrada'
        | 'saida'
    ) =>
      ipcRenderer.invoke(
        CANAIS.registrarMovimentacao,
        {
          id_produto,
          quantidade,
          tipo,
        }
      ),

  }
)