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
          categoria: string;
          estoque: number;
         }[]
      >

      registrarMovimentacao(
        id_produto: number,
        quantidade: number,
        tipo: 'entrada' | 'saida'
      ): Promise<{
        id: number
        id_produto: number
        quantidade: number
        tipo: 'entrada' | 'saida'
        data: string
      }>
    }
  }
}