'use client';

import { useState, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Link from 'next/link';

// ==================== TIPOS ====================
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
}

interface NotaFiscal {
  id: string;
  empresa: string;
  empenho: string;
  data: string;
  dataTabelaCeasa: string;
  itens: ItemNota[];
  totalGeral: number;
}

// ==================== UTILITÁRIOS ====================
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarDataExtenso = (dataStr: string) => {
  try {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
      const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      return data.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    return dataStr;
  } catch {
    return dataStr;
  }
};

// ==================== ESTILOS PDF PREMIUM ====================
const pdfStyles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontSize: 10, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
    fontSize: 60,
    color: '#f0fdf4',
    textAlign: 'center',
    transform: 'rotate(-45deg)',
    fontFamily: 'Helvetica-Bold'
  },
  headerInstitucional: { 
    marginBottom: 25, 
    borderBottomWidth: 2, 
    borderBottomColor: '#059669', 
    paddingBottom: 15 
  },
  prefeituraLabel: { 
    fontSize: 9, 
    color: '#6b7280', 
    letterSpacing: 1.5, 
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  tituloPrincipal: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#059669', 
    marginBottom: 4 
  },
  subtitulo: { 
    fontSize: 10, 
    color: '#6b7280' 
  },
  infoGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25, 
    padding: 18, 
    backgroundColor: '#f8fafc', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  infoCard: { 
    flex: 1 
  },
  infoLabel: { 
    fontSize: 8, 
    color: '#64748b', 
    textTransform: 'uppercase', 
    fontWeight: 'bold', 
    marginBottom: 6, 
    letterSpacing: 0.8 
  },
  infoValue: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  protocoloBox: { 
    marginBottom: 20, 
    padding: 14, 
    backgroundColor: '#ecfdf5', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#a7f3d0', 
    alignItems: 'center' 
  },
  protocoloLabel: { 
    fontSize: 8, 
    color: '#059669', 
    textTransform: 'uppercase', 
    fontWeight: 'bold',
    letterSpacing: 1 
  },
  protocoloValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#047857', 
    fontFamily: 'Helvetica-Bold',
    marginTop: 4
  },
  tabelaInfoBox: { 
    marginBottom: 20, 
    padding: 12, 
    backgroundColor: '#fffbeb', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#fde68a', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tabelaInfoText: { 
    fontSize: 9, 
    color: '#92400e' 
  },
  tabelaInfoBold: { 
    fontSize: 9, 
    fontWeight: 'bold', 
    color: '#92400e' 
  },
  table: { 
    marginTop: 15, 
    marginBottom: 25 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#059669', 
    paddingVertical: 12, 
    paddingHorizontal: 8, 
    borderTopLeftRadius: 8, 
    borderTopRightRadius: 8 
  },
  tableHeaderText: { 
    color: 'white', 
    fontSize: 9, 
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  tableRow: { 
    flexDirection: 'row', 
    paddingVertical: 10, 
    paddingHorizontal: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  tableRowAlt: { 
    flexDirection: 'row', 
    paddingVertical: 10, 
    paddingHorizontal: 8, 
    backgroundColor: '#fafafa', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  colProduto: { width: '22%' },
  colKg: { width: '8%', textAlign: 'center' },
  colValorCx: { width: '10%', textAlign: 'right' },
  colPrecoBase: { width: '10%', textAlign: 'right' },
  colDesconto: { width: '8%', textAlign: 'center' },
  colPrecoFinal: { width: '10%', textAlign: 'right' },
  colQuantidade: { width: '10%', textAlign: 'center' },
  colTotalSemDesc: { width: '10%', textAlign: 'right' },
  colTotal: { width: '12%', textAlign: 'right' },
  totalBox: { 
    marginTop: 20, 
    padding: 24, 
    backgroundColor: '#064e3b', 
    borderRadius: 12, 
    alignItems: 'flex-end' 
  },
  totalLabel: { 
    color: '#86efac', 
    fontSize: 10, 
    textTransform: 'uppercase', 
    letterSpacing: 1.5, 
    marginBottom: 6 
  },
  totalValue: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#e5e7eb', 
    alignItems: 'center' 
  },
  footerText: { 
    fontSize: 8, 
    color: '#9ca3af', 
    marginBottom: 2 
  },
  footerProtocolo: { 
    fontSize: 8, 
    color: '#059669', 
    fontWeight: 'bold', 
    marginTop: 6 
  },
});

// ==================== COMPONENTE PDF PREMIUM ====================
const NotaFiscalPDF = ({ nota }: { nota: NotaFiscal }) => {
  const totalItens = nota.itens.reduce((acc, item) => acc + item.quantidade, 0);
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.watermark} fixed>
          <Text>DOCUMENTO OFICIAL</Text>
        </View>
        
        <View style={pdfStyles.headerInstitucional}>
          <Text style={pdfStyles.prefeituraLabel}>PREFEITURA DE MARINGÁ • SECRETARIA DE SAÚDE</Text>
          <Text style={pdfStyles.tituloPrincipal}>NOTA DE CONFERÊNCIA</Text>
          <Text style={pdfStyles.subtitulo}>Sistema Oficial de Conferência de Hortifrúti - CAPS 3</Text>
        </View>

        <View style={pdfStyles.infoGrid}>
          <View style={pdfStyles.infoCard}>
            <Text style={pdfStyles.infoLabel}>🏢 Empresa Fornecedora</Text>
            <Text style={pdfStyles.infoValue}>{nota.empresa}</Text>
          </View>
          <View style={pdfStyles.infoCard}>
            <Text style={pdfStyles.infoLabel}>📄 Empenho / Nota Fiscal</Text>
            <Text style={pdfStyles.infoValue}>{nota.empenho}</Text>
          </View>
          <View style={pdfStyles.infoCard}>
            <Text style={pdfStyles.infoLabel}>📅 Data da Conferência</Text>
            <Text style={pdfStyles.infoValue}>{nota.data}</Text>
          </View>
        </View>

        <View style={pdfStyles.tabelaInfoBox}>
          <Text style={pdfStyles.tabelaInfoText}>
            📊 Tabela de Preços Ceasa utilizada nesta conferência:
          </Text>
          <Text style={pdfStyles.tabelaInfoBold}>{nota.dataTabelaCeasa}</Text>
        </View>

        <View style={pdfStyles.protocoloBox}>
          <Text style={pdfStyles.protocoloLabel}>Protocolo de Conferência</Text>
          <Text style={pdfStyles.protocoloValue}>CAPS-3-{nota.id.slice(-8)}</Text>
        </View>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colProduto]}>PRODUTO</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colKg]}>KG/CX</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colValorCx]}>VALOR CX</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colPrecoBase]}>PREÇO BASE</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colDesconto]}>DESC.</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colPrecoFinal]}>PREÇO FINAL</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colQuantidade]}>QTD (KG)</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colTotalSemDesc]}>TOTAL S/DESC</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colTotal]}>TOTAL FINAL</Text>
          </View>
          
          {nota.itens.map((item, idx) => (
            <View style={idx % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlt} key={idx}>
              <Text style={pdfStyles.colProduto}>{item.produtoNome}</Text>
              <Text style={pdfStyles.colKg}>{item.kgCaixa}kg</Text>
              <Text style={pdfStyles.colValorCx}>{formatarMoeda(item.valorCaixa)}</Text>
              <Text style={pdfStyles.colPrecoBase}>{formatarMoeda(item.precoUnitarioSemDesconto)}</Text>
              <Text style={pdfStyles.colDesconto}>-{item.desconto}%</Text>
              <Text style={pdfStyles.colPrecoFinal}>{formatarMoeda(item.precoUnitarioComDesconto)}</Text>
              <Text style={pdfStyles.colQuantidade}>{item.quantidade}kg</Text>
              <Text style={pdfStyles.colTotalSemDesc}>{formatarMoeda(item.totalSemDesconto)}</Text>
              <Text style={pdfStyles.colTotal}>{formatarMoeda(item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.totalBox}>
          <Text style={pdfStyles.totalLabel}>VALOR TOTAL A PAGAR</Text>
          <Text style={pdfStyles.totalValue}>{formatarMoeda(nota.totalGeral)}</Text>
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>Documento emitido eletronicamente pelo Sistema de Conferência CAPS 3</Text>
          <Text style={pdfStyles.footerText}>Conferência baseada na tabela Ceasa do dia {nota.dataTabelaCeasa}</Text>
          <Text style={pdfStyles.footerProtocolo}>
            Protocolo: CAPS-3-{nota.id.slice(-8)} • Emitido em: {new Date().toLocaleString('pt-BR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// ==================== TOAST COMPONENT ====================
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => { 
    const timer = setTimeout(onClose, 3500); 
    return () => clearTimeout(timer); 
  }, [onClose]);
  
  const config = {
    success: { bg: 'from-emerald-500 to-teal-500', icon: '✨', border: 'border-emerald-300' },
    error: { bg: 'from-red-500 to-rose-500', icon: '⚠️', border: 'border-red-300' },
    info: { bg: 'from-blue-500 to-indigo-500', icon: 'ℹ️', border: 'border-blue-300' }
  };
  
  const current = config[type];
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className={`bg-gradient-to-r ${current.bg} text-white px-6 py-4 rounded-2xl shadow-2xl border ${current.border} backdrop-blur-sm flex items-center gap-3`}>
        <span className="text-2xl">{current.icon}</span>
        <p className="font-semibold tracking-wide">{message}</p>
      </div>
    </div>
  );
};

// ==================== PDF MODAL PREMIUM ====================
const PDFModal = ({ nota, onClose }: { nota: NotaFiscal | null; onClose: () => void }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  if (!nota) return null;
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };
  
  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">📄</span>
              Nota de Conferência
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Protocolo: <span className="font-mono bg-white/10 px-2 py-0.5 rounded">CAPS-3-{nota.id.slice(-8)}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleClose} 
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl transition font-medium border border-white/20 backdrop-blur-sm"
            >
              Fechar
            </button>
          </div>
        </div>
        <div className="flex-1 bg-slate-100 p-3">
          <PDFViewer width="100%" height="100%" className="rounded-xl border-0 shadow-lg">
            <NotaFiscalPDF nota={nota} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

// ==================== CARD DE RESUMO DA NOTA ====================
const NotaCard = ({ nota, onView, onDelete }: { nota: NotaFiscal; onView: () => void; onDelete: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalItens = nota.itens.reduce((acc, item) => acc + item.quantidade, 0);
  
  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isHovered 
          ? 'border-emerald-200 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] -translate-y-1' 
          : 'border-slate-100 shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {nota.dataTabelaCeasa}
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs font-mono px-3 py-1 rounded-full">
                #{nota.id.slice(-8)}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{nota.empresa}</h3>
            <p className="text-slate-500 text-sm mt-1">NF/Empenho: {nota.empenho}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-black text-emerald-600">{formatarMoeda(nota.totalGeral)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-500">{nota.itens.length} produtos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-slate-500">{totalItens.toFixed(2)} kg total</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span className="text-slate-500">{formatarDataExtenso(nota.data)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onView}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl transition font-medium text-sm flex items-center gap-2 shadow-md"
            >
              <span>👁️</span> Visualizar
            </button>
            <button 
              onClick={onDelete}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl transition font-medium text-sm flex items-center gap-2 border border-rose-200"
            >
              <span>🗑️</span> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PÁGINA DE NOTAS PRINCIPAL ====================
export default function NotasFinalizadasPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [bancoNotas, setBancoNotas] = useState<NotaFiscal[]>([]);
  const [notaParaVisualizar, setNotaParaVisualizar] = useState<NotaFiscal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('');
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null);

  useEffect(() => {
    const carregarNotas = () => {
      const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
      if (notasSalvas) {
        const notas = JSON.parse(notasSalvas);
        setBancoNotas(notas);
      }
    };
    
    carregarNotas();
    
    // Escutar mudanças no localStorage (quando nova nota é adicionada em outra aba)
    window.addEventListener('storage', carregarNotas);
    
    setIsLoaded(true);
    
    return () => window.removeEventListener('storage', carregarNotas);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const excluirNotaBanco = (id: string) => {
    if (confirm('⚠️ Tem certeza que deseja excluir esta nota permanentemente? Esta ação não pode ser desfeita.')) {
      const novoBanco = bancoNotas.filter(nota => nota.id !== id);
      setBancoNotas(novoBanco);
      localStorage.setItem('banco_notas_hortifruti', JSON.stringify(novoBanco));
      showToast('Nota excluída com sucesso', 'info');
    }
  };

  const filtrarNotas = () => {
    return bancoNotas.filter(nota => {
      const matchSearch = searchTerm === '' || 
        nota.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.empenho.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEmpresa = filterEmpresa === '' || nota.empresa === filterEmpresa;
      return matchSearch && matchEmpresa;
    });
  };

  const empresasUnicas = Array.from(new Set(bancoNotas.map(n => n.empresa))).sort();
  const notasFiltradas = filtrarNotas();
  const totalGeral = notasFiltradas.reduce((acc, nota) => acc + nota.totalGeral, 0);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Carregando histórico de notas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 transition-all duration-500">
      {/* Cabeçalho Premium */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/30">
                📋
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Notas Finalizadas</h1>
                <p className="text-emerald-300 font-medium mt-1">Histórico completo de todas as conferências realizadas</p>
              </div>
            </div>
            
            <Link 
              href="/dashboard/nova-conferencia" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/20 shadow-lg"
            >
              <span className="text-xl">+</span> Nova Conferência
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-300 text-sm font-medium">Total de Notas</p>
              <p className="text-3xl font-black text-white">{bancoNotas.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-300 text-sm font-medium">Valor Total Empenhado</p>
              <p className="text-3xl font-black text-emerald-400">{formatarMoeda(bancoNotas.reduce((acc, n) => acc + n.totalGeral, 0))}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-300 text-sm font-medium">Média por Nota</p>
              <p className="text-3xl font-black text-teal-400">
                {bancoNotas.length > 0 
                  ? formatarMoeda(bancoNotas.reduce((acc, n) => acc + n.totalGeral, 0) / bancoNotas.length)
                  : formatarMoeda(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      {bancoNotas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🔍 Pesquisar</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por empresa ou empenho..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="md:w-64">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🏢 Filtrar por Empresa</label>
              <select 
                value={filterEmpresa}
                onChange={(e) => setFilterEmpresa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="">Todas as empresas</option>
                {empresasUnicas.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
            {(searchTerm || filterEmpresa) && (
              <div className="flex items-end">
                <button 
                  onClick={() => { setSearchTerm(''); setFilterEmpresa(''); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 rounded-xl font-medium transition"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
          
          {notasFiltradas.length !== bancoNotas.length && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Mostrando <span className="font-bold text-emerald-600">{notasFiltradas.length}</span> de <span className="font-bold">{bancoNotas.length}</span> notas
              </p>
              <p className="text-sm font-medium text-slate-600">
                Total filtrado: <span className="font-black text-emerald-600">{formatarMoeda(totalGeral)}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lista de Notas */}
      {bancoNotas.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            📭
          </div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">Nenhuma nota finalizada</h3>
          <p className="text-slate-400 mb-6">As notas que você salvar aparecerão aqui para consulta e impressão.</p>
          <Link 
            href="/dashboard/nova-conferencia" 
            className="inline-flex bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            + Iniciar Primeira Conferência
          </Link>
        </div>
      ) : notasFiltradas.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            🔍
          </div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">Nenhuma nota encontrada</h3>
          <p className="text-slate-400">Tente ajustar os filtros de busca.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notasFiltradas.map(nota => (
            <NotaCard 
              key={nota.id}
              nota={nota}
              onView={() => setNotaParaVisualizar(nota)}
              onDelete={() => excluirNotaBanco(nota.id)}
            />
          ))}
        </div>
      )}

      {/* Modal do PDF */}
      <PDFModal nota={notaParaVisualizar} onClose={() => setNotaParaVisualizar(null)} />
      
      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}