export {}

declare global {
  interface Window {
    api: {

      // PING
      // 

      ping(): Promise<string>

      // PRODUTOS
      // 

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


      editarProduto(
        id: number,
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


      excluirProduto(
        id: number
      ): Promise<{
        sucesso: boolean
        id: number
      }>

      // CATEGORIAS
      // 

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


      editarCategoria(
        id: number,
        nome: string,
        descricao: string
      ): Promise<{
        id: number
        nome: string
        descricao: string
      }>


      excluirCategoria(
        id: number
      ): Promise<{
        sucesso: boolean
        id: number
      }>

      // MOVIMENTAÇÃO
      // 
      registrarMovimentacao(
        id_produto: number,
        quantidade: number,
        tipo:
          | 'entrada'
          | 'saida'
      ): Promise<{
        id: number
        id_produto: number
        quantidade: number
        tipo:
          | 'entrada'
          | 'saida'
        data: string
      }>
    }
  }
}