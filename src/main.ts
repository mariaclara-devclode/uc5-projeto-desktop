import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";

import path from "path";

import { comTratamento, registrarErro, mensagemAmigavel } from "./erros";

import { CANAIS } from "./canais";

import { configuracaoOk, verificarConexaoBanco } from "./db";

import {
  listarProdutos,
  buscarProdutos,
  listarEstoqueCritico,
  cadastrarProduto,
  editarProduto,
  excluirProduto,
} from "./db/produtos_repository";

import {
  listarCategorias,
  cadastrarCategoria,
  editarCategoria,
  excluirCategoria,
} from "./db/categorias_repository";

import { registrarMovimentacao } from "./db/movimentacoes_repository";

let mainWindow: BrowserWindow | null = null;

// JANELA PRINCIPAL

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,

    height: 800,

    minWidth: 900,

    minHeight: 600,

    center: true,

    title: "Estok",

    show: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,

      nodeIntegration: false,
    },
  });

  // DESENVOLVIMENTO

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);

    mainWindow.webContents.openDevTools();
  }

  // PRODUÇÃO
  else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });
}

// MENU

function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: "Estok",

      submenu: [
        {
          label: "Sobre",

          click: () => {
            console.log("Estok");
          },
        },

        {
          type: "separator",
        },

        {
          label: "Sair",

          role: "quit",
        },
      ],
    },

    {
      label: "Ajuda",

      submenu: [
        {
          label: "Versão",

          click: () => {
            console.log("Versão 1.0");
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

// PING

ipcMain.handle(
  CANAIS.ping,

  () =>
    comTratamento(
      CANAIS.ping,

      async () => {
        return "pong do processo principal!";
      },
    ),
);

// PRODUTOS

ipcMain.handle(
  CANAIS.listarProdutos,

  () =>
    comTratamento(
      CANAIS.listarProdutos,

      () => listarProdutos(),
    ),
);

ipcMain.handle(
  CANAIS.buscarProdutos,

  (_event, termo: string) =>
    comTratamento(
      CANAIS.buscarProdutos,

      () => buscarProdutos(termo),
    ),
);

ipcMain.handle(
  CANAIS.listarEstoqueCritico,

  () =>
    comTratamento(
      CANAIS.listarEstoqueCritico,

      () => listarEstoqueCritico(),
    ),
);

ipcMain.handle(
  CANAIS.cadastrarProduto,

  (
    _event,

    dados: {
      nome: string;
      codigo_barras: string;
      preco_venda: number;
      id_categoria: number;
    },
  ) =>
    comTratamento(
      CANAIS.cadastrarProduto,

      () => cadastrarProduto(dados),
    ),
);

ipcMain.handle(
  CANAIS.editarProduto,

  (
    _event,

    dados: {
      id: number;
      nome: string;
      codigo_barras: string;
      preco_venda: number;
      id_categoria: number;
    },
  ) =>
    comTratamento(
      CANAIS.editarProduto,

      () => editarProduto(dados),
    ),
);

ipcMain.handle(
  CANAIS.excluirProduto,

  (_event, id: number) =>
    comTratamento(
      CANAIS.excluirProduto,

      () => excluirProduto(id),
    ),
);

// CATEGORIAS

ipcMain.handle(
  CANAIS.listarCategorias,

  () =>
    comTratamento(
      CANAIS.listarCategorias,

      () => listarCategorias(),
    ),
);

ipcMain.handle(
  CANAIS.cadastrarCategoria,

  (
    _event,

    dados: {
      nome: string;
      descricao: string;
    },
  ) =>
    comTratamento(
      CANAIS.cadastrarCategoria,

      () => cadastrarCategoria(dados),
    ),
);

ipcMain.handle(
  CANAIS.editarCategoria,

  (
    _event,

    dados: {
      id: number;
      nome: string;
      descricao: string;
    },
  ) =>
    comTratamento(
      CANAIS.editarCategoria,

      () => editarCategoria(dados),
    ),
);

ipcMain.handle(
  CANAIS.excluirCategoria,

  (_event, id: number) =>
    comTratamento(
      CANAIS.excluirCategoria,

      () => excluirCategoria(id),
    ),
);

// MOVIMENTAÇÃO

ipcMain.handle(
  CANAIS.registrarMovimentacao,

  (
    _event,

    dados: {
      id_produto: number;
      quantidade: number;
      tipo: "entrada" | "saida";
    },
  ) =>
    comTratamento(
      CANAIS.registrarMovimentacao,

      () => registrarMovimentacao(dados),
    ),
);

// INICIALIZAÇÃO

app.whenReady().then(async () => {
  // Cria primeiro a janela.

  createWindow();

  // Cria o menu.

  createMenu();

  // Verifica configuração.

  if (!configuracaoOk) {
    const mensagem =
      "Não foi possível carregar a configuração do banco de dados.\n\n" +
      "Verifique o arquivo .env e tente novamente.";

    console.error("DATABASE_URL não foi encontrada no arquivo .env");

    registrarErro(
      "inicializacao",
      new Error("DATABASE_URL não foi encontrada no arquivo .env"),
    );

    await dialog.showMessageBox(mainWindow!, {
      type: "error",

      title: "Erro de configuração",

      message: "Configuração do banco não encontrada",

      detail: mensagem,

      buttons: ["OK"],
    });
  }

  // Verifica conexão.
  else {
    try {
      await verificarConexaoBanco();

      console.log("Banco conectado com sucesso!");
    } catch (error) {
      console.error("Erro ao conectar ao banco:", error);

      registrarErro("inicializacao", error);

      await dialog.showMessageBox(mainWindow!, {
        type: "error",

        title: "Erro de conexão",

        message: "Não foi possível conectar ao banco de dados.",

        detail: mensagemAmigavel(error),

        buttons: ["OK"],
      });
    }
  }

  // ATIVAÇÃO

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// ENCERRAMENTO

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  console.log("Ate logo! Encerrando o sistema...");
});

export {};
