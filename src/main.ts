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

// MENU
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

app.whenReady().then(async () => {

  try {
    await pool.query('SELECT 1')
    console.log('Banco conectado com sucesso!')
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error)
  }

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
  console.log('Ate logo!Encerrando o sistema...')
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
        p.id,
        p.nome,
        p.codigo_barras,
        p.preco_venda,
        c.nome AS categoria,


        COALESCE(
            SUM(
              CASE
                WHEN m.tipo = 'entrada' THEN m.quantidade
                WHEN m.tipo = 'saida' THEN -m.quantidade
                ELSE 0
              END
            ),
            0
          ) AS  estoque
          
          From produtos p

          INNER JOIN categorias c
            ON p.id_categoria = c.id

           LEFT JOIN movimentacoes m
            ON p.id = m.id_produto

          GROUP BY
             p.id, 
             p.nome,
             p.codigo_barras,
             p.preco_venda,
             c.nome

          ORDER BY p.id

    `) 

    console.log(
      'Produtos encontrados:',
       resultado.rows
      )

    return resultado.rows.map((produto) => ({
      ...produto,

      preco_venda: Number(produto.preco_venda),
      
      estoque: Number(produto.estoque),

    }))

  } catch (error) {
    console.error(
      'Erro ao buscar produtos:', 
      error
    )

    throw error
  }
})

ipcMain.handle(
  'buscar-produtos',
  async (_event, termo: string) => {
    try {
      const busca = termo.trim()

      const resultado = await pool.query(
        `
        SELECT
          p.id,
          p.nome,
          p.codigo_barras,
          p.preco_venda,
          c.nome AS categoria,

          COALESCE(
            SUM(
              CASE
                WHEN m.tipo = 'entrada'
                  THEN m.quantidade

                WHEN m.tipo = 'saida'
                  THEN -m.quantidade

                ELSE 0
              END
            ),
            0
          ) AS estoque

        FROM produtos p

        INNER JOIN categorias c
          ON p.id_categoria = c.id

        LEFT JOIN movimentacoes m
          ON p.id = m.id_produto

        WHERE
          p.nome ILIKE $1
          OR p.codigo_barras ILIKE $1

        GROUP BY
          p.id,
          p.nome,
          p.codigo_barras,
          p.preco_venda,
          c.nome

        ORDER BY p.id
        `,
        [`%${busca}%`]
      )

      return resultado.rows.map((produto)=> ({
        ...produto,

        preco_venda: Number(
          produto.preco_venda
        ),
        estoque: Number(
          produto.estoque
        ),
      }))   
        
      } catch (error) {
        console.error(
          'Erro ao buscar produtos:',
          error
        ) 

        throw error
      }
    }
  )

  ipcMain.handle(
  'listar-estoque-critico',
  async () => {
    try {
      const resultado = await pool.query(`
        SELECT
          p.id,
          p.nome,
          p.codigo_barras,
          p.preco_venda,
          c.nome AS categoria,

          COALESCE(
            SUM(
              CASE
                WHEN m.tipo = 'entrada'
                  THEN m.quantidade

                WHEN m.tipo = 'saida'
                  THEN -m.quantidade

                ELSE 0
              END
            ),
            0
          ) AS estoque

        FROM produtos p

        INNER JOIN categorias c
          ON p.id_categoria = c.id

        LEFT JOIN movimentacoes m
          ON p.id = m.id_produto

        GROUP BY
          p.id,
          p.nome,
          p.codigo_barras,
          p.preco_venda,
          c.nome

        HAVING
          COALESCE(
            SUM(
              CASE
                WHEN m.tipo = 'entrada'
                  THEN m.quantidade

                WHEN m.tipo = 'saida'
                  THEN -m.quantidade

                ELSE 0
              END
            ),
            0
          ) <= 10

        ORDER BY estoque ASC
      `)

      return resultado.rows.map((produto) => ({
        ...produto,

        preco_venda: Number(
          produto.preco_venda
        ),

        estoque: Number(
          produto.estoque
        ),
      }))
    } catch (error) {
      console.error(
        'Erro ao buscar estoque crítico:',
        error
      )


      throw error
    }
  }
)

ipcMain.handle('listar-categorias', async () => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        nome,
        descricao
      FROM categorias
      ORDER BY nome
    `)

    return resultado.rows
  } catch (error) {
    console.error('Erro ao listar categorias:', error)

    throw error
  }
})

ipcMain.handle(
  'cadastrar-categoria',
  async (_event, categoria: {
    nome: string
    descricao: string
  }) => {

    try {
      const nome = categoria.nome.trim()
      const descricao = categoria.descricao.trim()

      if (!nome) {
        throw new Error('O nome da categoria é obrigatório.')
      }

      if (!descricao) {
        throw new Error('A descrição da categoria é obrigatória.')
      }

      const resultado = await pool.query(
        `
        INSERT INTO categorias
        (nome, descricao)
        VALUES ($1, $2)
        RETURNING id, nome, descricao
        `,
        [nome, descricao]
      )

      return resultado.rows[0]

    } catch (error) {

      console.error(
        'Erro ao cadastrar categoria:',
        error
      )

      throw error
    }
  }
)

ipcMain.handle(
  'cadastrar-produto',
  async (
    _event,
    produto: {
      nome: string
      codigo_barras: string
      preco_venda: number
      id_categoria: number
    }
  ) => {

    try {

      const nome = produto.nome.trim()
      const codigo = produto.codigo_barras.trim()
      const preco = Number(produto.preco_venda)
      const idCategoria = Number(produto.id_categoria)

      if (!nome) {
        throw new Error(
          'O nome do produto é obrigatório.'
        )
      }

      if (!codigo) {
        throw new Error(
          'O código de barras é obrigatório.'
        )
      }

      if (preco <= 0) {
        throw new Error(
          'O preço deve ser maior que zero.'
        )
      }

      if (idCategoria <= 0) {
        throw new Error(
          'Selecione uma categoria.'
        )
      }

      const resultado = await pool.query(
        `
        INSERT INTO produtos
        (
          nome,
          codigo_barras,
          preco_venda,
          id_categoria
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          nome,
          codigo_barras,
          preco_venda,
          id_categoria
        `,
        [
          nome,
          codigo,
          preco,
          idCategoria
        ]
      )

      return {
        ...resultado.rows[0],
        preco_venda: Number(
          resultado.rows[0].preco_venda
        )
      }

    } catch (error) {

      console.error(
        'Erro ao cadastrar produto:',
        error
      )

      throw error
    }
  }
)

ipcMain.handle(
  'registrar-movimentacao',
  async (
    _event,
    movimentacao: {
      id_produto: number
      quantidade: number
      tipo: 'entrada' | 'saida'
    }
  ) => {

    try {

      const idProduto =
        Number(movimentacao.id_produto)

      const quantidade =
        Number(movimentacao.quantidade)

      const tipo =
        movimentacao.tipo

      if (idProduto <= 0) {
        throw new Error(
          'Produto inválido.'
        )
      }

      if (quantidade <= 0) {
        throw new Error(
          'A quantidade deve ser maior que zero.'
        )
      }

      if (
        tipo !== 'entrada' &&
        tipo !== 'saida'
      ) {
        throw new Error(
          'Tipo de movimentação inválido.'
        )
      }

      if (tipo === 'saida') {

        const estoqueAtual =
          await pool.query(
            `
            SELECT
              COALESCE(
                SUM(
                  CASE
                    WHEN tipo = 'entrada'
                      THEN quantidade
                    WHEN tipo = 'saida'
                      THEN -quantidade
                    ELSE 0
                  END
                ),
                0
              ) AS estoque

            FROM movimentacoes

            WHERE id_produto = $1
            `,
            [idProduto]
          )

        const estoque =
          Number(
            estoqueAtual.rows[0].estoque
          )

        if (quantidade > estoque) {
          throw new Error(
            `Estoque insuficiente. Estoque atual: ${estoque}`
          )
        }
      }

      const resultado =
        await pool.query(
          `
          INSERT INTO movimentacoes
          (
            id_produto,
            quantidade,
            tipo
          )
          VALUES ($1, $2, $3)
          RETURNING
            id,
            id_produto,
            quantidade,
            tipo,
            data
          `,
          [
            idProduto,
            quantidade,
            tipo
          ]
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
