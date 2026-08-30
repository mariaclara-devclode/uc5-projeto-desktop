import { app } from "electron";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";


// LOCALIZAÇÃO DO .ENV

const caminhoEnv =
  app.isPackaged
    ? path.join(
        process.resourcesPath,
        ".env"
      )
    : undefined;


// CARREGA O .ENV

dotenv.config(
  caminhoEnv
    ? {
        path: caminhoEnv,
      }
    : undefined
);


// DATABASE URL

const databaseUrl =
  process.env.DATABASE_URL;


console.log(
  "DATABASE_URL carregada:",
  Boolean(databaseUrl)
);


// CONFIGURAÇÃO DO BANCO

// Não derruba o aplicativo
// caso o .env não seja encontrado.
// O main.ts decide o que fazer.

export const configuracaoOk =
  Boolean(databaseUrl);


// POOL DE CONEXÃO

export const pool =
  new Pool({
    connectionString:
      databaseUrl,

    ssl: {
      rejectUnauthorized: false,
    },
  });


// VERIFICAR CONEXÃO

// A conexão não é realizada
// automaticamente durante o import.
// O main.ts chama esta função
// quando o aplicativo estiver pronto.

export async function verificarConexaoBanco(): Promise<void> {

  if (!configuracaoOk) {

    throw new Error(
      "DATABASE_URL não foi encontrada no arquivo .env"
    );
  }


  const client =
    await pool.connect();


  try {

    await client.query(
      "SELECT 1"
    );

  } finally {

    client.release();

  }
}