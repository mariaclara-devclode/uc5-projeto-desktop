import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {

  ping: () => ipcRenderer.invoke('canal-ping'),

  listarProdutos: () =>
    ipcRenderer.invoke('listar-produtos'),

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
    )

})