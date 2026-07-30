import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL
console.log(databaseUrl)

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
