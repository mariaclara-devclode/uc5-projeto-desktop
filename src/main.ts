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
        produtos.id,
        produtos.nome,
        produtos.codigo_barras,
        produtos.preco_venda,
        categorias.nome AS categoria,

        (
          SELECT COALESCE(
            SUM(
              CASE
                WHEN movimentacoes.tipo = 'entrada'
                  THEN movimentacoes.quantidade
                WHEN movimentacoes.tipo = 'saida'
                  THEN -movimentacoes.quantidade
                ELSE 0
              END
            ),
            0
          )
          FROM movimentacoes
          WHERE movimentacoes.id_produto = produtos.id
        ) AS estoque

      FROM produtos

      INNER JOIN categorias
        ON produtos.id_categoria = categorias.id

      ORDER BY produtos.id
    `)

    console.log('Produtos encontrados:', resultado.rows)

    return resultado.rows.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      codigo_barras: produto.codigo_barras,
      preco_venda: Number(produto.preco_venda),
      categoria: produto.categoria,
      estoque: Number(produto.estoque)
    }))

  } catch (error) {
    console.error('Erro ao buscar produtos:', error)

    throw error
  }
})

ipcMain.handle(
  'registrar-movimentacao',
  async (
    _event,
    movimentacao
  ) => {

    try {

      console.log(
        'Registrando movimentação...'
      )


      const resultado = await pool.query(

        `
        INSERT INTO movimentacoes
        (
          id_produto,
          quantidade,
          tipo
        )

        VALUES
        (
          $1,
          $2,
          $3
        )

        RETURNING *
        `,

        [
          movimentacao.id_produto,
          movimentacao.quantidade,
          movimentacao.tipo
        ]

      )


      console.log(
        'Movimentação registrada:',
        resultado.rows[0]
      )


      return resultado.rows[0]

    } catch (error) {

      console.error(
        'Erro ao registrar movimentação:',
        error
      )

      throw error
    }
  }
)