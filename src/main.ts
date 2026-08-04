import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import dotenv from 'dotenv'
import {pool}  from "./db";

dotenv.config()

const databaseUrl = process.env.DATABASE_URL
console.log("databaseUrl carregada:", Boolean(databaseUrl))

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    minWidth: 900,
    minHeight: 600,

    center: true,

    title: 'Gerenciador de Estoque Comercial',

    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })


  // Se estiver em desenvolvimento, usa a URL do Vite. Em produção, carrega o arquivo compilado.
  if (process.env.VITE_DEV_SERVER_URL) {
  mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  mainWindow.webContents.openDevTools()
} else {
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
}


  mainWindow.once('ready-to-show', () => {

    mainWindow?.show()

  })

}

function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Gerenciador de Estoque Comercial',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            console.log('Gerenciador de Estoque Comercial')
          }
        },
        {
          type: 'separator'
        },
        {

          label:'sair',
          role: 'quit'

        }
       
      
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Versão',
          click: () => {
            console.log('Versão 1.0')
          }
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()

    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  console.log('Até logo!Encerrando o sistema...')
})


// Manipulador IPC Exemplo
ipcMain.handle('canal-ping', async () => {
  return 'pong do processo principal!'
})

ipcMain.handle('listar-produtos', async () => {
  try {
    console.log('Buscando produtos no banco...')

    const resultado = await pool.query(`
      SELECT
        id,
        nome,
        codigo_barras,
        preco_venda,
        id_categoria
      FROM produtos
      ORDER BY id
    `)

    console.log('Produtos encontrados:', resultado.rows)

    return resultado.rows.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      codigo_barras: produto.codigo_barras,
      preco_venda: Number(produto.preco_venda),
      id_categoria: produto.id_categoria
    }))

  } catch (erro) {

    console.error('ERRO AO BUSCAR PRODUTOS NO BANCO:')
    console.error(erro)

    throw erro
  }
})