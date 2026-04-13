import { ItemNota } from '@/types/nota';

export const calcularPrecoUnitario = (valorCaixa: number, kgCaixa: number) => {
  return valorCaixa / kgCaixa;
};

export const calcularPrecoComDesconto = (precoUnitario: number, descontoPercentual: number) => {
  const valorDesconto = precoUnitario * (descontoPercentual / 100);
  return Math.round((precoUnitario - valorDesconto) * 100) / 100;
};

export const calcularTotalItem = (quantidade: number, precoUnitario: number) => {
  return quantidade * precoUnitario;
};

export const calcularItemCompleto = (
  produtoId: number,
  produtoNome: string,
  desconto: number,
  kgCaixa: number,
  valorCaixa: number
): Omit<ItemNota, 'id' | 'quantidadeStr' | 'quantidade' | 'totalSemDesconto' | 'total'> => {
  const precoSemDesconto = calcularPrecoUnitario(valorCaixa, kgCaixa);
  const precoComDesconto = calcularPrecoComDesconto(precoSemDesconto, desconto);

  return {
    produtoId,
    produtoNome,
    desconto,
    kgCaixa,
    valorCaixa,
    precoUnitarioSemDesconto: precoSemDesconto,
    precoUnitarioComDesconto: precoComDesconto,
  };
};

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatarData = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};