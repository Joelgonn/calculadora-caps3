import { useState, useEffect } from 'react';
import { NotaFiscal, ItemNota } from '@/types/nota';
import { storage } from '@/lib/storage';
import { calcularTotalItem, formatarData } from '@/lib/calculations';

export const useNotas = () => {
  const [bancoNotas, setBancoNotas] = useState<NotaFiscal[]>([]);
  const [notaAtual, setNotaAtual] = useState<NotaFiscal | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setBancoNotas(storage.getNotas());
    setNotaAtual(storage.getNotaAtual());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.setNotas(bancoNotas);
      storage.setNotaAtual(notaAtual);
    }
  }, [bancoNotas, notaAtual, isLoaded]);

  const criarNota = (empresa: string, empenho: string, itens: ItemNota[]): NotaFiscal => {
    const novaNota: NotaFiscal = {
      id: Date.now().toString(),
      empresa: empresa.toUpperCase(),
      empenho: empenho.toUpperCase(),
      data: formatarData(new Date()),
      itens: itens.map(item => ({ ...item, quantidadeStr: '', quantidade: 0, totalSemDesconto: 0, total: 0 })),
      totalGeral: 0,
    };
    setNotaAtual(novaNota);
    return novaNota;
  };

  const atualizarQuantidade = (itemId: string, quantidadeStr: string) => {
    if (!notaAtual) return;

    const quantidadeNumerica = parseFloat(quantidadeStr.replace(',', '.')) || 0;

    const novosItens = notaAtual.itens.map(item => {
      if (item.id === itemId) {
        const totalSemDesconto = calcularTotalItem(quantidadeNumerica, item.precoUnitarioSemDesconto);
        const total = calcularTotalItem(quantidadeNumerica, item.precoUnitarioComDesconto);
        
        return {
          ...item,
          quantidadeStr,
          quantidade: quantidadeNumerica,
          totalSemDesconto,
          total,
        };
      }
      return item;
    });

    const novoTotalGeral = novosItens.reduce((acc, item) => acc + item.total, 0);

    setNotaAtual({
      ...notaAtual,
      itens: novosItens,
      totalGeral: novoTotalGeral,
    });
  };

  const finalizarNota = () => {
    if (!notaAtual) return;
    setBancoNotas([notaAtual, ...bancoNotas]);
    setNotaAtual(null);
  };

  const excluirNota = (id: string) => {
    setBancoNotas(bancoNotas.filter(nota => nota.id !== id));
  };

  const cancelarNotaAtual = () => {
    setNotaAtual(null);
  };

  return {
    bancoNotas,
    notaAtual,
    isLoaded,
    criarNota,
    atualizarQuantidade,
    finalizarNota,
    excluirNota,
    cancelarNotaAtual,
  };
};