export {};

declare global {
  interface Window {
    api: {
      ping(): Promise<string>;

      listarProdutos(): Promise<
        {
          id: number;
          nome: string;
          codigo_barras: string;
          preco_venda: number;
          id_categoria: number;
        }[]
      >;
    };
  }
}