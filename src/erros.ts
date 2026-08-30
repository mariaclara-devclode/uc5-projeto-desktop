import { app } from "electron";
import fs from "fs";
import path from "path";

// Marca um erro como "recusa de validação".
// A mensagem já é amigável e pode ir para a tela.
export class ErroValidacao extends Error {}

// Traduz o erro técnico para uma mensagem que o usuário consegue entender.
export function mensagemAmigavel(erro: unknown): string {
  const codigo =
    (erro as { code?: string } | null)?.code;

  // Registro duplicado
  if (codigo === "23505") {
    return "Já existe um registro com esses dados.";
  }

  // Violação de chave estrangeira
  if (codigo === "23503") {
    return "Não é possível concluir: há um vínculo com outro registro.";
  }

  // Campo obrigatório
  if (codigo === "23502") {
    return "Um campo obrigatório não foi preenchido.";
  }

  // Tabela inexistente
  if (codigo === "42P01") {
    return "O banco de dados ainda não foi criado. Aplique o schema.sql.";
  }

  // Falhas de conexão
  const texto =
    `${codigo ?? ""} ${
      erro instanceof Error
        ? erro.message
        : ""
    }`;

  if (
    /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ECONNRESET|SSL/i.test(
      texto
    )
  ) {
    return "Não foi possível conectar ao banco de dados. Verifique sua internet e tente novamente.";
  }

  return "Ocorreu um erro inesperado. Tente novamente em instantes.";
}

// Grava uma linha por erro no arquivo de log do aplicativo.
export function registrarErro(
  origem: string,
  erro: unknown
): void {
  try {
    const pasta =
      path.join(
        app.getPath("userData"),
        "logs"
      );

    fs.mkdirSync(
      pasta,
      {
        recursive: true,
      }
    );

    const detalhe =
      erro instanceof Error
        ? (
            erro.stack ??
            erro.message
          )
        : String(erro);

    const linha =
      `[${new Date().toISOString()}] [${origem}] ${detalhe}\n`;

    fs.appendFileSync(
      path.join(
        pasta,
        "erros.log"
      ),
      linha,
      "utf-8"
    );

  } catch {
    // Um problema no log jamais
    // pode derrubar o tratamento
    // do erro original.
  }
}

// O invólucro que os handlers do Main usam.
export async function comTratamento<T>(
  origem: string,
  operacao: () => Promise<T>,
): Promise<T> {

  try {

    return await operacao();

  } catch (erro) {

    if (
      erro instanceof ErroValidacao
    ) {
      throw erro;
    }

    registrarErro(
      origem,
      erro
    );

    throw new Error(
      mensagemAmigavel(erro)
    );
  }
}