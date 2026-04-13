export interface ItemNota {
  id: string;
  produtoId: number;
  produtoNome: string;
  desconto: number;
  kgCaixa: number;
  valorCaixa: number;
  precoUnitarioSemDesconto: number;
  precoUnitarioComDesconto: number;
  quantidadeStr: string;
  quantidade: number;
  totalSemDesconto: number;
  total: number;
}

export interface NotaFiscal {
  id: string;
  empresa: string;
  empenho: string;
  data: string;
  itens: ItemNota[];
  totalGeral: number;
}

export interface ProdutoContrato {
  id: number;
  codigo: number;
  nome: string;
  desconto: number;
}