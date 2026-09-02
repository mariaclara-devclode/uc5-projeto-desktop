import {
  formProduto,
  produtoNome,
  produtoCodigo,
  produtoPreco,
  produtoCategoria,
  respostaProduto,
  tituloFormProduto,
  btnSalvarProduto,
  btnCancelarEdicao,
  btnProdutos,
  btnCriticos,
  formBusca,
  campoBusca,
  btnLimpar,
  erroBusca,
  resposta,
  tabelaProdutos,
  movimentacaoProduto,
} from "./interface";

import { navegarParaTela, TELA_CADASTRO } from "./telas";

interface ProdutoTela {
  id: number;
  nome: string;
  codigo_barras: string;
  preco_venda: number;
  categoria: string;
  estoque: number;
  ativo: boolean;
}

let produtosCarregados: ProdutoTela[] = [];

let produtoEditandoId: number | null = null;

// MOSTRAR ERRO

function mostrarErro(erro: unknown, mensagemPadrao: string) {
  if (erro instanceof Error) {
    return erro.message;
  }

  return mensagemPadrao;
}

// MOSTRAR PRODUTOS

function mostrarProdutos(produtos: ProdutoTela[]) {
  tabelaProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    const linha = document.createElement("tr");

    // ID

    const colunaId = document.createElement("td");

    colunaId.textContent = String(produto.id);

    // NOME

    const colunaNome = document.createElement("td");

    colunaNome.textContent = produto.nome;

    // CÓDIGO

    const colunaCodigo = document.createElement("td");

    colunaCodigo.textContent = produto.codigo_barras;

    // PREÇO

    const colunaPreco = document.createElement("td");

    colunaPreco.textContent = produto.preco_venda.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    // CATEGORIA

    const colunaCategoria = document.createElement("td");

    colunaCategoria.textContent = produto.categoria;

    // ESTOQUE

    const colunaEstoque = document.createElement("td");

    colunaEstoque.textContent = String(produto.estoque);

    // STATUS

    const colunaStatus = document.createElement("td");

    if (!produto.ativo) {
      colunaStatus.textContent = "Inativo";

      colunaStatus.classList.add("inativo");
    } else if (produto.estoque <= 10) {
      colunaStatus.textContent = "Crítico";

      colunaStatus.classList.add("critico");
    } else {
      colunaStatus.textContent = "Normal";

      colunaStatus.classList.add("normal");
    }

    // AÇÕES

    const colunaAcoes = document.createElement("td");

    if (produto.ativo) {
      const botaoEditar = document.createElement("button");

      botaoEditar.type = "button";

      botaoEditar.textContent = "Editar";

      botaoEditar.classList.add("btn-editar-produto");

      botaoEditar.addEventListener("click", () => {
        prepararEdicaoProduto(produto);
      });

      const botaoExcluir = document.createElement("button");

      botaoExcluir.type = "button";

      botaoExcluir.textContent = "Excluir";

      botaoExcluir.classList.add("btn-excluir-produto");

      botaoExcluir.addEventListener("click", () => {
        excluirProduto(produto);
      });

      colunaAcoes.append(botaoEditar, botaoExcluir);
    } else {
      const texto = document.createElement("span");

      texto.textContent = "Produto inativo";

      colunaAcoes.append(texto);
    }

    linha.append(
      colunaId,
      colunaNome,
      colunaCodigo,
      colunaPreco,
      colunaCategoria,
      colunaEstoque,
      colunaStatus,
      colunaAcoes,
    );

    tabelaProdutos.appendChild(linha);
  });
}

// CARREGAR PRODUTOS

export async function carregarProdutos() {
  try {
    const produtos = await window.api.listarProdutos();

    produtosCarregados = produtos;

    mostrarProdutos(produtosCarregados);

    resposta.textContent = `${produtos.length} produto(s) encontrado(s).`;
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    resposta.textContent = mostrarErro(
      erro,
      "Não foi possível carregar os produtos.",
    );
  }
}

// BUSCAR PRODUTOS

async function buscarProdutos() {
  erroBusca.textContent = "";

  const termo = campoBusca.value.trim();

  if (!termo) {
    erroBusca.textContent = "Digite um ID, nome ou código de barras.";

    campoBusca.focus();

    return;
  }

  try {
    const produtos = await window.api.buscarProdutos(termo);

    produtosCarregados = produtos;

    mostrarProdutos(produtosCarregados);

    resposta.textContent = `${produtos.length} produto(s) encontrado(s).`;
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);

    erroBusca.textContent = mostrarErro(
      erro,
      "Não foi possível realizar a busca.",
    );
  }
}

// LIMPAR BUSCA

function limparBusca() {
  campoBusca.value = "";

  erroBusca.textContent = "";

  carregarProdutos();
}

// ESTOQUE CRÍTICO

async function listarEstoqueCritico() {
  erroBusca.textContent = "";

  try {
    const produtos = await window.api.listarEstoqueCritico();

    produtosCarregados = produtos;

    mostrarProdutos(produtosCarregados);

    resposta.textContent = `${produtos.length} produto(s) em estoque crítico.`;
  } catch (erro) {
    console.error("Erro ao listar estoque crítico:", erro);

    resposta.textContent = mostrarErro(
      erro,
      "Não foi possível listar o estoque crítico.",
    );
  }
}

// CADASTRAR / EDITAR PRODUTO

formProduto.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  respostaProduto.textContent = "";

  const nome = produtoNome.value.trim();

  const codigo = produtoCodigo.value.trim();

  const preco = Number(produtoPreco.value);

  const idCategoria = Number(produtoCategoria.value);

  if (!nome) {
    respostaProduto.textContent = "Informe o nome do produto.";

    produtoNome.focus();

    return;
  }

  if (!codigo) {
    respostaProduto.textContent = "Informe o código de barras.";

    produtoCodigo.focus();

    return;
  }

  if (!Number.isFinite(preco) || preco < 0) {
    respostaProduto.textContent = "Informe um preço válido.";

    produtoPreco.focus();

    return;
  }

  if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
    respostaProduto.textContent = "Selecione uma categoria.";

    produtoCategoria.focus();

    return;
  }

  try {
    if (produtoEditandoId === null) {
      await window.api.cadastrarProduto(nome, codigo, preco, idCategoria);

      respostaProduto.textContent = "Produto cadastrado com sucesso.";
    } else {
      await window.api.editarProduto(
        produtoEditandoId,
        nome,
        codigo,
        preco,
        idCategoria,
      );

      respostaProduto.textContent = "Produto atualizado com sucesso.";
    }

    formProduto.reset();

    produtoEditandoId = null;

    tituloFormProduto.textContent = "Cadastrar Produto";

    btnSalvarProduto.textContent = "Cadastrar Produto";

    btnCancelarEdicao.style.display = "none";

    await carregarProdutos();

    await carregarCategoriasNoProduto();

    await carregarProdutosMovimentacao();
  } catch (erro) {
    console.error("Erro ao salvar produto:", erro);

    respostaProduto.textContent = mostrarErro(
      erro,
      "Não foi possível salvar o produto.",
    );
  }
});

// PREPARAR EDIÇÃO

async function prepararEdicaoProduto(produto: ProdutoTela) {
  if (!produto.ativo) {
    resposta.textContent = "Este produto está inativo e não pode ser editado.";

    return;
  }

  await carregarCategoriasNoProduto();

  produtoEditandoId = produto.id;

  produtoNome.value = produto.nome;

  produtoCodigo.value = produto.codigo_barras;

  produtoPreco.value = String(produto.preco_venda);

  const categoria = Array.from(produtoCategoria.options).find(
    (opcao) => opcao.textContent === produto.categoria,
  );

  if (categoria) {
    produtoCategoria.value = categoria.value;
  }

  tituloFormProduto.textContent = "Editar Produto";

  btnSalvarProduto.textContent = "Salvar Alterações";

  btnCancelarEdicao.style.display = "inline-block";

  respostaProduto.textContent = "Editando produto.";

  navegarParaTela(TELA_CADASTRO);
}

// CANCELAR EDIÇÃO

function cancelarEdicaoProduto() {
  produtoEditandoId = null;

  formProduto.reset();

  tituloFormProduto.textContent = "Cadastrar Produto";

  btnSalvarProduto.textContent = "Cadastrar Produto";

  btnCancelarEdicao.style.display = "none";

  respostaProduto.textContent = "";
}

// EXCLUIR PRODUTO

async function excluirProduto(produto: ProdutoTela) {
  if (!produto.ativo) {
    resposta.textContent = "Este produto já está inativo.";

    return;
  }

  const confirmar = window.confirm(
    `Deseja excluir o produto "${produto.nome}"?`,
  );

  if (!confirmar) {
    return;
  }

  try {
    const resultado = await window.api.excluirProduto(produto.id);

    // ATUALIZA A LISTA SEM APAGAR
    // O PRODUTO INATIVADO.

    await carregarProdutos();

    if (resultado.inativado) {
      resposta.textContent = resultado.mensagem;
    } else {
      resposta.textContent = resultado.mensagem;
    }
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);

    resposta.textContent = mostrarErro(
      erro,
      "Não foi possível excluir o produto.",
    );
  }
}

// CARREGAR CATEGORIAS NO SELECT

export async function carregarCategoriasNoProduto() {
  try {
    const categorias = await window.api.listarCategorias();

    produtoCategoria.innerHTML = `
      <option value="">
        Selecione uma categoria
      </option>
      `;

    categorias.forEach((categoria) => {
      const opcao = document.createElement("option");

      opcao.value = String(categoria.id);

      opcao.textContent = categoria.nome;

      produtoCategoria.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);

    respostaProduto.textContent = mostrarErro(
      erro,
      "Não foi possível carregar as categorias.",
    );
  }
}

// CARREGAR PRODUTOS NO SELECT
// DE MOVIMENTAÇÃO

export async function carregarProdutosMovimentacao() {
  try {
    const produtos = await window.api.listarProdutos();

    movimentacaoProduto.innerHTML = `
      <option value="">
        Selecione um produto
      </option>
      `;

    produtos
      .filter((produto) => produto.ativo)
      .forEach((produto) => {
        const opcao = document.createElement("option");

        opcao.value = String(produto.id);

        opcao.textContent = produto.nome;

        movimentacaoProduto.appendChild(opcao);
      });
  } catch (erro) {
    console.error("Erro ao carregar produtos para movimentação:", erro);

    resposta.textContent = mostrarErro(
      erro,
      "Não foi possível carregar os produtos para movimentação.",
    );
  }
}

// EVENTOS

formBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();

  buscarProdutos();
});

btnLimpar.addEventListener("click", limparBusca);

btnProdutos.addEventListener("click", carregarProdutos);

btnCriticos.addEventListener("click", listarEstoqueCritico);

btnCancelarEdicao.addEventListener("click", cancelarEdicaoProduto);

// ESTADO INICIAL

btnCancelarEdicao.style.display = "none";

carregarProdutos();
carregarCategoriasNoProduto();
carregarProdutosMovimentacao();
