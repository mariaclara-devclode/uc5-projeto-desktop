export {}

declare global {
  interface Window {
    api: {

      ping(): Promise<string>

      listarProdutos(): Promise<{
        id: number
        nome: string
        codigo_barras: string
        preco_venda: number
        categoria: string
        estoque: number
      }[]>

      buscarProdutos(
        termo: string
      ): Promise<{
        id: number
        nome: string
        codigo_barras: string
        preco_venda: number
        categoria: string
        estoque: number
      }[]>

      listarEstoqueCritico(): Promise<{
        id: number
        nome: string
        codigo_barras: string
        preco_venda: number
        categoria: string
        estoque: number
      }[]>

    }
  }
}