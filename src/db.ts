import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

console.log(
  'DATABASE_URL carregada:',
  Boolean(databaseUrl)
)

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL não foi encontrada no arquivo .env'
  )
}

export const pool = new Pool({
  connectionString: databaseUrl,

  ssl: {
    rejectUnauthorized: false,
  },
})

pool.connect()
  .then((client) => {
    console.log(
      'Banco conectado com sucesso!'
    )

    client.release()
  })
  .catch((erro) => {
    console.error(
      'Erro ao conectar ao banco:'
    )

    console.error(erro)
  })