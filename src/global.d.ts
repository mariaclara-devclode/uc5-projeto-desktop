export {};

declare global {
  interface Window {
    api: {
      ping(): Promise<string>;

      listarProdutos(): Promise<
        {
          id: number;
          nome: string;
          preco: number;
        }[]
      >;
    };
  }
}