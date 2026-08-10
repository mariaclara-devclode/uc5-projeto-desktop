import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool =
  new Pool({
    connectionString:
      process.env.DATABASE_URL,
  })

pool.connect()
  .then(() => {
    console.log(
      'Banco conectado com sucesso!'
    )
  })
  .catch((erro) => {
    console.error(
      'Erro ao conectar:',
      erro
    )
  })