export {};

declare global {
  interface Window {
    api: {
      ping(): Promise<string>;

      listarProdutos(): Promise<{
        id: number;
        nome: string;
        codigo_barras: string;
        preco_venda: number;
        categoria: string;
        estoque: number;
        ativo: boolean;
      }[]>;

      buscarProdutos(
        termo: string
      ): Promise<{
        id: number;
        nome: string;
        codigo_barras: string;
        preco_venda: number;
        categoria: string;
        estoque: number;
        ativo: boolean;
      }[]>;

      listarEstoqueCritico(): Promise<{
        id: number;
        nome: string;
        codigo_barras: string;
        preco_venda: number;
        categoria: string;
        estoque: number;
        ativo: boolean;
      }[]>;

      cadastrarProduto(
        nome: string,
        codigo_barras: string,
        preco_venda: number,
        id_categoria: number
      ): Promise<{
        id: number;
        nome: string;
        codigo_barras: string;
        preco_venda: number;
        id_categoria: number;
        ativo: boolean;
      }>;

      editarProduto(
        id: number,
        nome: string,
        codigo_barras: string,
        preco_venda: number,
        id_categoria: number
      ): Promise<{
        id: number;
        nome: string;
        codigo_barras: string;
        preco_venda: number;
        id_categoria: number;
        ativo: boolean;
      }>;

      excluirProduto(
        id: number
      ): Promise<{
        sucesso: boolean;
        id: number;
        inativado: boolean;
        mensagem: string;
      }>;

      listarCategorias(): Promise<{
        id: number;
        nome: string;
        descricao: string;
      }[]>;

      cadastrarCategoria(
        nome: string,
        descricao: string
      ): Promise<{
        id: number;
        nome: string;
        descricao: string;
      }>;

      editarCategoria(
        id: number,
        nome: string,
        descricao: string
      ): Promise<{
        id: number;
        nome: string;
        descricao: string;
      }>;

      excluirCategoria(
        id: number
      ): Promise<{
        sucesso: boolean;
        id: number;
      }>;

      registrarMovimentacao(
        id_produto: number,
        quantidade: number,
        tipo: "entrada" | "saida"
      ): Promise<{
        id: number;
        id_produto: number;
        quantidade: number;
        tipo: "entrada" | "saida";
        data: Date;
      }>;
    };
  }
}