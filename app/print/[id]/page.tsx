'use client';

import { useEffect, useState } from 'react';
import { NotaPrint } from '@/components/NotaPrint';
import { supabase } from '@/lib/supabase/client';

interface ItemNota {
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
  precoUnitarioNotaStr?: string;
  precoUnitarioNota?: number;
  totalNota?: number;
  precoCeasa?: number;
  statusValidacao?: 'ok' | 'divergente';
  diferenca?: number;
}

interface NotaFiscal {
  id: string;
  empresa: string;
  empenho: string;
  numeroNota: string;
  data: string;
  dataISO: string;
  dataTabelaCeasa: string;
  itens: ItemNota[];
  totalGeral: number;
  statusValidacao?: 'ok' | 'divergente';
}

const formatarDataBR = (dataISO?: string) => {
  if (!dataISO) return '-';
  const partes = dataISO.split('-');
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return dataISO;
};

export default function PrintPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ modo?: string }> }) {
  const [nota, setNota] = useState<NotaFiscal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modo, setModo] = useState<'conferencia' | 'divergencia'>('conferencia');
  const [notaId, setNotaId] = useState<string | null>(null);

  // Resolver as Promises
  useEffect(() => {
    const resolver = async () => {
      const { id } = await params;
      const { modo: modoParam } = await searchParams;
      setNotaId(id);
      setModo(modoParam === 'divergencia' ? 'divergencia' : 'conferencia');
    };
    resolver();
  }, [params, searchParams]);

  useEffect(() => {
    if (!notaId) return;

    const carregarNota = async () => {
      try {
        let notaEncontrada: NotaFiscal | null = null;

        try {
          const { data, error } = await supabase
            .from('notas_fiscais')
            .select('*')
            .eq('id', notaId)
            .single();

          if (!error && data) {
            notaEncontrada = {
              id: data.id,
              empresa: data.empresa,
              empenho: data.empenho,
              numeroNota: data.numero_nota,
              data: formatarDataBR(data.data),
              dataISO: data.data,
              dataTabelaCeasa: formatarDataBR(data.data_tabela_ceasa),
              itens: data.itens || [],
              totalGeral: data.total_geral || 0,
              statusValidacao: data.status_validacao
            };
          }
        } catch (err) {
          console.warn('Erro no Supabase:', err);
        }

        if (!notaEncontrada) {
          const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
          if (notasSalvas) {
            const notas = JSON.parse(notasSalvas);
            notaEncontrada = notas.find((n: NotaFiscal) => n.id === notaId) || null;
          }
        }

        if (!notaEncontrada) {
          setError('Nota não encontrada');
          return;
        }

        setNota(notaEncontrada);
      } catch (err) {
        setError('Erro ao carregar nota');
      } finally {
        setLoading(false);
      }
    };

    carregarNota();
  }, [notaId]);

  useEffect(() => {
    if (!loading && nota) {
      setTimeout(() => window.print(), 300);
    }
  }, [loading, nota]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (error || !nota) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'red' }}>{error || 'Nota não encontrada'}</div>
      </div>
    );
  }

  return (
    <div className="print-root">
      <NotaPrint nota={nota} modo={modo} />
    </div>
  );
}