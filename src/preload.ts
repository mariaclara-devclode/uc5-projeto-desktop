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
})