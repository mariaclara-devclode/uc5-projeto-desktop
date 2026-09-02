export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export interface Produto {
  id: number;
  nome: string;
  codigo_barras: string;
  preco_venda: number;
  id_categoria: number;
  ativo: boolean;
}

export interface Movimentacao {
  id: number;
  id_produto: number;
  quantidade: number;
  tipo: "entrada" | "saida";
  data: Date;
}
