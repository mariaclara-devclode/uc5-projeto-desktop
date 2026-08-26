import {app, BrowserWindow,ipcMain,Menu, } from 'electron'

import path from 'path'
import dotenv from 'dotenv'
import { pool } from './db'
import { ErroValidacao,comTratamento,registrarErro,} from './erros'

dotenv.config()

const databaseUrl =
  process.env.DATABASE_URL

console.log(
  'databaseUrl carregada:',
  Boolean(databaseUrl)
)

let mainWindow:
  | BrowserWindow
  | null = null


// JANELA PRINCIPAL

function createWindow() {
  mainWindow =
    new BrowserWindow({
      width: 1200,
      height: 800,

      minWidth: 900,
      minHeight: 600,

      center: true,

      title:
        'Gerenciador de Estoque Comercial',

      show: false,

      webPreferences: {
        preload: path.join(
          __dirname,
          'preload.js'
        ),

        contextIsolation: true,

        nodeIntegration: false,
      },
    })


  // DESENVOLVIMENTO

  if (
    process.env.VITE_DEV_SERVER_URL
  ) {
    mainWindow.loadURL(
      process.env.VITE_DEV_SERVER_URL
    )

    mainWindow.webContents.openDevTools()
  }


  // PRODUÇÃO

  else {
    mainWindow.loadFile(
      path.join(
        __dirname,
        '../dist/index.html'
      )
    )
  }


  mainWindow.once(
    'ready-to-show',
    () => {
      mainWindow?.show()
    }
  )
}


// MENU

function createMenu() {
  const menu =
    Menu.buildFromTemplate([
      {
        label:
          'Gerenciador de Estoque Comercial',

        submenu: [
          {
            label: 'Sobre',

            click: () => {
              console.log(
                'Gerenciador de Estoque Comercial'
              )
            },
          },

          {
            type: 'separator',
          },

          {
            label: 'Sair',
            role: 'quit',
          },
        ],
      },

      {
        label: 'Ajuda',

        submenu: [
          {
            label: 'Versão',

            click: () => {
              console.log(
                'Versão 1.0'
              )
            },
          },
        ],
      },
    ])

  Menu.setApplicationMenu(menu)
}


// INICIALIZAÇÃO

app.whenReady().then(
  async () => {
    try {
      await pool.query(
        'SELECT 1'
      )

      console.log(
        'Banco conectado com sucesso!'
      )
    } catch (error) {
      console.error(
        'Erro ao conectar ao banco:',
        error
      )

      registrarErro(
        'inicializacao',
        error
      )
    }

    createWindow()

    createMenu()


    app.on(
      'activate',
      () => {
        if (
          BrowserWindow.getAllWindows()
            .length === 0
        ) {
          createWindow()
        }
      }
    )
  }
)


// ENCERRAMENTO

app.on(
  'window-all-closed',
  () => {
    if (
      process.platform !== 'darwin'
    ) {
      app.quit()
    }
  }
)

app.on(
  'before-quit',
  () => {
    console.log(
      'Ate logo! Encerrando o sistema...'
    )
  }
)


// PING IPC

ipcMain.handle(
  'canal-ping',

  () =>
    comTratamento(
      'canal-ping',

      async () => {
        return 'pong do processo principal!'
      }
    )
)


// LISTAR PRODUTOS

ipcMain.handle(
  'listar-produtos',

  () =>
    comTratamento(
      'listar-produtos',

      async () => {
        const resultado =
          await pool.query(`
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

            ORDER BY p.id
          `)

        return resultado.rows.map(
          (produto) => ({
            ...produto,

            preco_venda:
              Number(
                produto.preco_venda
              ),

            estoque:
              Number(
                produto.estoque
              ),
          })
        )
      }
    )
)


// BUSCAR PRODUTOS

ipcMain.handle(
  'buscar-produtos',

  (
    _event,
    termo: string
  ) =>
    comTratamento(
      'buscar-produtos',

      async () => {
        const busca =
          termo.trim()

        const resultado =
          await pool.query(
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
              p.id::text = $1
              OR p.codigo_barras = $1
              OR p.nome ILIKE $2

            GROUP BY
              p.id,
              p.nome,
              p.codigo_barras,
              p.preco_venda,
              c.nome

            ORDER BY p.id
            `,
            [
              busca,
              `%${busca}%`,
            ]
          )

        return resultado.rows.map(
          (produto) => ({
            ...produto,

            preco_venda:
              Number(
                produto.preco_venda
              ),

            estoque:
              Number(
                produto.estoque
              ),
          })
        )
      }
    )
)


// ESTOQUE CRÍTICO

ipcMain.handle(
  'listar-estoque-critico',

  () =>
    comTratamento(
      'listar-estoque-critico',

      async () => {
        const resultado =
          await pool.query(`
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

        return resultado.rows.map(
          (produto) => ({
            ...produto,

            preco_venda:
              Number(
                produto.preco_venda
              ),

            estoque:
              Number(
                produto.estoque
              ),
          })
        )
      }
    )
)


// LISTAR CATEGORIAS

ipcMain.handle(
  'listar-categorias',

  () =>
    comTratamento(
      'listar-categorias',

      async () => {
        const resultado =
          await pool.query(`
            SELECT
              id,
              nome,
              descricao

            FROM categorias

            ORDER BY id
          `)

        return resultado.rows
      }
    )
)


// CADASTRAR CATEGORIA

ipcMain.handle(
  'cadastrar-categoria',

  (
    _event,
    dados: {
      nome: string
      descricao: string
    }
  ) =>
    comTratamento(
      'cadastrar-categoria',

      async () => {
        const resultado =
          await pool.query(
            `
            INSERT INTO categorias
              (
                nome,
                descricao
              )

            VALUES
              ($1, $2)

            RETURNING
              id,
              nome,
              descricao
            `,
            [
              dados.nome,
              dados.descricao,
            ]
          )

        return resultado.rows[0]
      }
    )
)


// EDITAR CATEGORIA

ipcMain.handle(
  'editar-categoria',

  (
    _event,
    dados: {
      id: number
      nome: string
      descricao: string
    }
  ) =>
    comTratamento(
      'editar-categoria',

      async () => {
        const resultado =
          await pool.query(
            `
            UPDATE categorias

            SET
              nome = $1,
              descricao = $2

            WHERE id = $3

            RETURNING
              id,
              nome,
              descricao
            `,
            [
              dados.nome,
              dados.descricao,
              dados.id,
            ]
          )

        if (
          resultado.rows.length === 0
        ) {
          throw new ErroValidacao(
            'Categoria não encontrada.'
          )
        }

        return resultado.rows[0]
      }
    )
)


// EXCLUIR CATEGORIA

ipcMain.handle(
  'excluir-categoria',

  (
    _event,
    id: number
  ) =>
    comTratamento(
      'excluir-categoria',

      async () => {
        const resultado =
          await pool.query(
            `
            DELETE FROM categorias

            WHERE id = $1

            RETURNING id
            `,
            [id]
          )

        if (
          resultado.rows.length === 0
        ) {
          throw new ErroValidacao(
            'Categoria não encontrada.'
          )
        }

        return {
          sucesso: true,

          id:
            resultado.rows[0].id,
        }
      }
    )
)


// CADASTRAR PRODUTO

ipcMain.handle(
  'cadastrar-produto',

  (
    _event,
    dados: {
      nome: string
      codigo_barras: string
      preco_venda: number
      id_categoria: number
    }
  ) =>
    comTratamento(
      'cadastrar-produto',

      async () => {
        const resultado =
          await pool.query(
            `
            INSERT INTO produtos
              (
                nome,
                codigo_barras,
                preco_venda,
                id_categoria
              )

            VALUES
              ($1, $2, $3, $4)

            RETURNING
              id,
              nome,
              codigo_barras,
              preco_venda,
              id_categoria
            `,
            [
              dados.nome,
              dados.codigo_barras,
              dados.preco_venda,
              dados.id_categoria,
            ]
          )

        return {
          ...resultado.rows[0],

          preco_venda:
            Number(
              resultado.rows[0]
                .preco_venda
            ),
        }
      }
    )
)


// EDITAR PRODUTO

ipcMain.handle(
  'editar-produto',

  (
    _event,
    dados: {
      id: number
      nome: string
      codigo_barras: string
      preco_venda: number
      id_categoria: number
    }
  ) =>
    comTratamento(
      'editar-produto',

      async () => {
        const resultado =
          await pool.query(
            `
            UPDATE produtos

            SET
              nome = $1,
              codigo_barras = $2,
              preco_venda = $3,
              id_categoria = $4

            WHERE id = $5

            RETURNING
              id,
              nome,
              codigo_barras,
              preco_venda,
              id_categoria
            `,
            [
              dados.nome,
              dados.codigo_barras,
              dados.preco_venda,
              dados.id_categoria,
              dados.id,
            ]
          )

        if (
          resultado.rows.length === 0
        ) {
          throw new ErroValidacao(
            'Produto não encontrado.'
          )
        }

        return {
          ...resultado.rows[0],

          preco_venda:
            Number(
              resultado.rows[0]
                .preco_venda
            ),
        }
      }
    )
)


// EXCLUIR PRODUTO

ipcMain.handle(
  'excluir-produto',

  (
    _event,
    id: number
  ) =>
    comTratamento(
      'excluir-produto',

      async () => {

        // Verifica se existem
        // movimentações vinculadas

        const movimentacoes =
          await pool.query(
            `
            SELECT id

            FROM movimentacoes

            WHERE id_produto = $1

            LIMIT 1
            `,
            [id]
          )

        if (
          movimentacoes.rows.length > 0
        ) {
          throw new ErroValidacao(
            'Não é possível excluir este produto porque existem movimentações registradas.'
          )
        }


        const resultado =
          await pool.query(
            `
            DELETE FROM produtos

            WHERE id = $1

            RETURNING id
            `,
            [id]
          )

        if (
          resultado.rows.length === 0
        ) {
          throw new ErroValidacao(
            'Produto não encontrado.'
          )
        }

        return {
          sucesso: true,

          id:
            resultado.rows[0].id,
        }
      }
    )
)


// REGISTRAR MOVIMENTAÇÃO

ipcMain.handle(
  'registrar-movimentacao',

  (
    _event,
    dados: {
      id_produto: number
      quantidade: number
      tipo:
        | 'entrada'
        | 'saida'
    }
  ) =>
    comTratamento(
      'registrar-movimentacao',

      async () => {

        if (
          dados.quantidade <= 0
        ) {
          throw new ErroValidacao(
            'A quantidade deve ser maior que zero.'
          )
        }


        if (
          dados.tipo !== 'entrada' &&
          dados.tipo !== 'saida'
        ) {
          throw new ErroValidacao(
            'Tipo de movimentação inválido.'
          )
        }


        // Verifica estoque antes
        // de registrar uma saída

        if (
          dados.tipo === 'saida'
        ) {
          const estoqueResult =
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
              [
                dados.id_produto,
              ]
            )

          const estoqueAtual =
            Number(
              estoqueResult.rows[0]
                .estoque
            )

          if (
            dados.quantidade >
            estoqueAtual
          ) {
            throw new ErroValidacao(
              `Estoque insuficiente. Estoque atual: ${estoqueAtual}.`
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

            VALUES
              ($1, $2, $3)

            RETURNING
              id,
              id_produto,
              quantidade,
              tipo,
              data
            `,
            [
              dados.id_produto,
              dados.quantidade,
              dados.tipo,
            ]
          )

        return resultado.rows[0]
      }
    )
)


export {}