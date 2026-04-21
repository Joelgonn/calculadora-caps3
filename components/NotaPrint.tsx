'use client';

import { useRef, useEffect } from 'react';

type ItemNota = {
  id: string;
  produtoNome: string;
  quantidade: number;
  precoUnitarioComDesconto: number;
  total: number;
  statusValidacao?: 'ok' | 'divergente';
  precoCeasa?: number;
  diferenca?: number;
};

type NotaFiscal = {
  id?: string;
  empresa: string;
  numeroNota: string;
  data: string;
  itens: ItemNota[];
  totalGeral: number;
  empenho?: string;
  dataTabelaCeasa?: string;
  fornecedor?: string;
  cnpj?: string;
};

type ModoImpressao = 'conferencia' | 'divergencia' | 'completo';
type FormatoPapel = 'A4' | 'A5' | 'Carta';

interface NotaPrintProps {
  nota: NotaFiscal;
  modo?: ModoImpressao;
  formato?: FormatoPapel;
  showLogo?: boolean;
  showAssinatura?: boolean;
  empresaNome?: string;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};

const formatarDataLonga = (data: string) => {
  if (!data || data === '-') return data;
  try {
    const partes = data.split('/');
    if (partes.length === 3) {
      const dataObj = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      return dataObj.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    return data;
  } catch {
    return data;
  }
};

const formatarNumeroExtenso = (valor: number): string => {
  if (valor === 0) return 'zero reais';
  
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais: Record<number, string> = {
    10: 'dez', 11: 'onze', 12: 'doze', 13: 'treze', 14: 'quatorze',
    15: 'quinze', 16: 'dezesseis', 17: 'dezessete', 18: 'dezoito', 19: 'dezenove'
  };
  const dezenas: Record<number, string> = {
    2: 'vinte', 3: 'trinta', 4: 'quarenta', 5: 'cinquenta',
    6: 'sessenta', 7: 'setenta', 8: 'oitenta', 9: 'noventa'
  };
  const centenas: Record<number, string> = {
    1: 'cento', 2: 'duzentos', 3: 'trezentos', 4: 'quatrocentos',
    5: 'quinhentos', 6: 'seiscentos', 7: 'setecentos', 8: 'oitocentos', 9: 'novecentos'
  };

  const converterAte99 = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return unidades[n];
    if (n < 20) return especiais[n];
    const dezena = Math.floor(n / 10);
    const unidade = n % 10;
    return dezenas[dezena] + (unidade > 0 ? ` e ${unidades[unidade]}` : '');
  };

  const converterAte999 = (n: number): string => {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    if (n < 100) return converterAte99(n);
    const centena = Math.floor(n / 100);
    const resto = n % 100;
    return centenas[centena] + (resto > 0 ? ` e ${converterAte99(resto)}` : '');
  };

  const partesNumero = [];
  if (inteiro >= 1000) {
    const milhares = Math.floor(inteiro / 1000);
    const restoMilhar = inteiro % 1000;
    partesNumero.push(`${converterAte999(milhares)} ${milhares === 1 ? 'mil' : 'mil'}`);
    if (restoMilhar > 0) {
      partesNumero.push(converterAte999(restoMilhar));
    }
  } else if (inteiro > 0) {
    partesNumero.push(converterAte999(inteiro));
  }

  const textoInteiro = partesNumero.join(' e ');
  const textoCentavos = centavos > 0 ? ` e ${centavos} centavos` : '';
  
  const primeiraLetra = textoInteiro.charAt(0).toUpperCase();
  const restoTexto = textoInteiro.slice(1);
  
  return `${primeiraLetra}${restoTexto} reais${textoCentavos}`;
};

export function NotaPrint({ 
  nota, 
  modo = 'conferencia',
  formato = 'A4',
  showLogo = true,
  showAssinatura = true,
  empresaNome = 'Caps III Maringá - Sistema de Gestão'
}: NotaPrintProps) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (printRef.current) {
      printRef.current.setAttribute('data-formato', formato);
    }
  }, [formato]);

  if (!nota || !nota.itens) return null;

  const itensFiltrados = modo === 'divergencia'
    ? nota.itens.filter(i => i.statusValidacao === 'divergente')
    : nota.itens;

  const totalGeral = itensFiltrados.reduce((sum, item) => sum + (item.total || 0), 0);
  const hasDivergencias = nota.itens.some(i => i.statusValidacao === 'divergente');
  const totalDivergencias = nota.itens.filter(i => i.statusValidacao === 'divergente').length;
  const totalItens = nota.itens.reduce((sum, item) => sum + (item.quantidade || 0), 0);

  const isModoDivergencia = modo === 'divergencia';
  const titulo = isModoDivergencia ? 'RELATÓRIO DE DIVERGÊNCIA' : 'NOTA DE CONFERÊNCIA';
  const corPrincipal = hasDivergencias ? '#d97706' : '#059669';
  const corPrimariaForte = hasDivergencias ? '#b45309' : '#047857';
  const corFundo = hasDivergencias ? '#fffbeb' : '#ecfdf5';

  return (
    <div className="print-container" ref={printRef} style={{ 
      width: '100%',
      maxWidth: '1000px',
      margin: '2rem auto', 
      padding: '15mm', 
      minHeight: '297mm', 
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      fontSize: '12px',
      color: '#374151',
      background: '#ffffff',
      boxSizing: 'border-box',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
      borderRadius: '8px'
    }}>
      {/* CSS IMPRESSÃO ALTA DENSIDADE (Sem Margens) */}
      <style>{`
        @media print {
          @page {
            size: ${formato} portrait;
            margin: 4mm !important; /* Margem mínima física para não cortar texto (hardware) */
          }
          
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-container {
            margin: 0 !important;
            padding: 0 !important; 
            box-shadow: none !important;
            border-radius: 0 !important;
            min-height: auto !important; 
            width: 100% !important;
            max-width: 100% !important;
            display: block !important; 
          }
          
          .no-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* CABEÇALHO COMPACTO */}
      <div style={{ 
        marginBottom: '12px', 
        borderBottom: `2px solid ${corPrincipal}`,
        paddingBottom: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {showLogo && (
              <div style={{
                width: '36px',
                height: '36px',
                background: `linear-gradient(135deg, ${corPrincipal}, ${corPrimariaForte})`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                ✓
              </div>
            )}
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#111827' }}>
                {empresaNome}
              </h1>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '2px 0 0 0', fontWeight: '500' }}>
                Documento oficial de conferência Hortifruti - Caps III Maringá
              </p>
            </div>
          </div>
          
          <div style={{ 
            background: corFundo,
            padding: '4px 12px',
            borderRadius: '999px',
            textAlign: 'center',
            border: `1px solid ${corPrincipal}30`
          }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: hasDivergencias ? '#92400e' : '#065f46' }}>
              {titulo}
            </p>
            <p style={{ margin: '0', fontSize: '9px', fontWeight: '600', color: corPrimariaForte }}>
              {isModoDivergencia && `${totalDivergencias} item(ns) divergente(s)`}
              {!isModoDivergencia && `${totalItens.toFixed(2)} kg conferidos`}
            </p>
          </div>
        </div>

        {/* CARDS DE INFORMAÇÃO COMPACTOS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginTop: '12px'
        }}>
          {[
            { label: 'EMPRESA / FORNECEDOR', content: nota.empresa || '-', sub: nota.cnpj && `CNPJ: ${nota.cnpj}` },
            { label: 'NOTA FISCAL / EMPENHO', content: `Nº ${nota.numeroNota || '-'}`, sub: nota.empenho && `Empenho: ${nota.empenho}` },
            { label: 'DATAS', content: `Emissão: ${formatarDataLonga(nota.data)}`, sub: nota.dataTabelaCeasa && `Tabela Ceasa: ${nota.dataTabelaCeasa}` },
            { label: 'VALOR TOTAL', content: formatarMoeda(totalGeral), sub: formatarNumeroExtenso(totalGeral), isTotal: true }
          ].map((card, idx) => (
            <div key={idx} style={{ 
              background: '#f8fafc', 
              borderRadius: '4px', 
              padding: '8px 10px',
              borderLeft: `3px solid ${card.isTotal ? (hasDivergencias ? '#dc2626' : corPrincipal) : '#cbd5e1'}`,
            }}>
              <p style={{ fontSize: '9px', color: '#64748b', margin: '0 0 2px 0', fontWeight: '700', letterSpacing: '0.5px' }}>
                {card.label}
              </p>
              <p style={{ 
                fontWeight: card.isTotal ? '800' : '600', 
                margin: 0, 
                fontSize: card.isTotal ? '15px' : '12px',
                color: card.isTotal ? (hasDivergencias ? '#dc2626' : corPrincipal) : '#1f2937'
              }}>
                {card.content}
              </p>
              {card.sub && (
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
                  {card.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ALERTA DE DIVERGÊNCIA */}
      {hasDivergencias && !isModoDivergencia && (
        <div style={{ 
          background: '#fffbeb', 
          border: `1px solid #fcd34d`,
          borderLeft: `4px solid #f59e0b`,
          borderRadius: '4px',
          padding: '6px 10px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '12px' }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e', fontWeight: '500' }}>
            Esta nota possui <strong>{totalDivergencias} item(ns) divergente(s)</strong>
          </p>
        </div>
      )}

      {/* TABELA DE ALTA DENSIDADE */}
      {itensFiltrados.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: '11px' /* Fonte um pouco menor para caber mais info */
          }}>
            <thead>
              <tr>
                {['Produto', 'Qtd (kg)', 'Und. Ceasa', 'Total'].map((th, i) => (
                  <th key={th} style={{ 
                    padding: '6px 8px', /* Padding super reduzido */
                    textAlign: i === 0 ? 'left' : (i === 1 ? 'center' : 'right'), 
                    fontWeight: '700', 
                    color: '#475569',
                    background: '#f1f5f9',
                    borderBottom: `2px solid ${corPrincipal}`,
                    borderTopLeftRadius: i === 0 ? '4px' : '0',
                    textTransform: 'uppercase',
                    fontSize: '9px'
                  }}>
                    {th}
                  </th>
                ))}
                {isModoDivergencia && (
                  <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: '700', color: '#475569', background: '#f1f5f9', borderBottom: `2px solid ${corPrincipal}`, borderTopRightRadius: '4px', fontSize: '9px' }}>
                    Status
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {itensFiltrados.map((item, index) => {
                const isDivergente = item.statusValidacao === 'divergente';
                return (
                  <tr key={item.id} style={{ background: isDivergente ? '#fef2f2' : (index % 2 === 0 ? '#ffffff' : '#f8fafc') }}>
                    <td style={{ padding: '6px 8px', fontWeight: '600', color: '#1f2937', borderBottom: '1px solid #e2e8f0' }}>{item.produtoNome}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{item.quantidade?.toFixed(2) || '0,00'}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{formatarMoeda(item.precoUnitarioComDesconto || 0)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '700', color: isDivergente ? '#dc2626' : '#1f2937', borderBottom: '1px solid #e2e8f0' }}>{formatarMoeda(item.total || 0)}</td>
                    {isModoDivergencia && (
                      <td style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: '999px', fontSize: '9px', fontWeight: '700' }}>DIVERGENTE</span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700', color: '#64748b', fontSize: '10px' }}>TOTAL GERAL:</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '800', fontSize: '14px', color: hasDivergencias ? '#dc2626' : corPrincipal }}>{formatarMoeda(totalGeral)}</td>
                {isModoDivergencia && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* ÁREA INFERIOR (ASSINATURAS E RODAPÉ) */}
      <div className="no-break">
        {showAssinatura && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '30px', 
            paddingTop: '16px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #475569', width: '70%', margin: '0 auto 4px auto', paddingTop: '4px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#1f2937' }}>Conferente</p>
              </div>
              <p style={{ fontSize: '9px', color: '#64748b', margin: 0 }}>Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #475569', width: '70%', margin: '0 auto 4px auto', paddingTop: '4px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#1f2937' }}>Responsável</p>
              </div>
              <p style={{ fontSize: '9px', color: '#64748b', margin: 0 }}>Carimbo e assinatura</p>
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: '16px', 
          paddingTop: '8px', 
          borderTop: '1px dashed #cbd5e1', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2px' 
        }}>
          <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', fontWeight: '500' }}>Documento gerado eletronicamente por <strong>{empresaNome}</strong></p>
          <p style={{ margin: 0, fontSize: '8px', color: '#cbd5e1' }}>{new Date().toLocaleString('pt-BR')} • Ref ID: {nota.id?.slice(-8) || 'N/A'}</p>
        </div>
      </div>
      
    </div>
  );
}