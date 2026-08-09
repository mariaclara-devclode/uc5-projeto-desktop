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

      listarCategorias(): Promise<{
        id: number
        nome: string
        descricao: string
      }[]>

      cadastrarCategoria(
        nome: string,
        descricao: string
      ): Promise<{
        id: number
        nome: string
        descricao: string
      }>

      cadastrarProduto(
        nome: string,
        codigo_barras: string,
        preco_venda: number,
        id_categoria: number
      ): Promise<{
        id: number
        nome: string
        codigo_barras: string
        preco_venda: number
        id_categoria: number
      }>

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