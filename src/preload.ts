import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  ping: () => ipcRenderer.invoke('canal-ping'),

listarProdutos: () => ipcRenderer.invoke("listar-produtos")

})
