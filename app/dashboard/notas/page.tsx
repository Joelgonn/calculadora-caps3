'use client';

import { useState, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Wallet, 
  BarChart3, 
  Eye, 
  Pencil, 
  Trash2, 
  Plus,
  ClipboardList,
  Calendar,
  Package,
  TrendingUp
} from 'lucide-react';

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
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};

// ==================== ESTILOS PDF ====================
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  headerInstitucional: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#059669',
    paddingBottom: 12,
  },
  prefeituraLabel: {
    fontSize: 8,
    color: '#6b7280',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  tituloPrincipal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#064e3b',
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 8,
    color: '#6b7280',
  },
  infoGrid: {
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
  },
  infoColumn: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  infoLabel: {
    width: 100,
    fontSize: 7,
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  protocoloBox: {
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  protocoloValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#064e3b',
  },
  tableContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#064e3b',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  colProduto: { width: '32%', fontSize: 8 },
  colKg: { width: '8%', textAlign: 'center', fontSize: 8 },
  colValorCx: { width: '10%', textAlign: 'right', fontSize: 8 },
  colPrecoBase: { width: '9%', textAlign: 'right', fontSize: 7, color: '#6b7280' },
  colDesconto: { width: '7%', textAlign: 'center', fontSize: 7 },
  colPrecoFinal: { width: '10%', textAlign: 'right', fontSize: 8, fontWeight: 'bold' },
  colQuantidade: { width: '10%', textAlign: 'center', fontSize: 8, fontWeight: 'bold' },
  colTotal: { width: '14%', textAlign: 'right', fontSize: 8, fontWeight: 'bold', color: '#059669' },
  resumoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    gap: 16,
  },
  resumoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalBox: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 6,
    color: '#9ca3af',
  },
});

// ==================== COMPONENTE PDF ====================
const NotaFiscalPDF = ({ nota }: { nota: NotaFiscal }) => {
  const totalItens = nota.itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerInstitucional}>
          <Text style={pdfStyles.prefeituraLabel}>PREFEITURA DE MARINGÁ • SECRETARIA DE SAÚDE • CAPS 3</Text>
          <Text style={pdfStyles.tituloPrincipal}>NOTA DE CONFERÊNCIA</Text>
          <Text style={pdfStyles.subtitulo}>Sistema Oficial de Conferência de Hortifrúti</Text>
        </View>

        <View style={pdfStyles.infoGrid}>
          <View style={pdfStyles.infoColumn}>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>FORNECEDOR</Text>
              <Text style={pdfStyles.infoValue}>{nota.empresa}</Text>
            </View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>EMPENHO/NF</Text>
              <Text style={pdfStyles.infoValue}>{nota.empenho}</Text>
            </View>
          </View>
          <View style={pdfStyles.infoColumn}>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>DATA</Text>
              <Text style={pdfStyles.infoValue}>{nota.data}</Text>
            </View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>TABELA CEASA</Text>
              <Text style={pdfStyles.infoValue}>{nota.dataTabelaCeasa}</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.protocoloBox}>
          <Text style={pdfStyles.protocoloValue}>Protocolo: CAPS-3-{nota.id.slice(-8)}</Text>
        </View>

        <View style={pdfStyles.tableContainer}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colProduto]}>PRODUTO</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colKg]}>KG/CX</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colValorCx]}>VALOR CX</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colPrecoBase]}>PREÇO KG</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colDesconto]}>DESC</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colPrecoFinal]}>PREÇO FINAL</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colQuantidade]}>QTD</Text>
            <Text style={[pdfStyles.tableHeaderText, pdfStyles.colTotal]}>TOTAL</Text>
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
              <Text style={pdfStyles.colTotal}>{formatarMoeda(item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.resumoContainer}>
          <Text style={pdfStyles.resumoValue}>{nota.itens.length} itens</Text>
          <Text style={pdfStyles.resumoValue}>{totalItens.toFixed(2)} kg total</Text>
        </View>

        <View style={pdfStyles.totalBox}>
          <Text style={{ fontSize: 9, color: '#064e3b', fontWeight: 'bold' }}>TOTAL A PAGAR</Text>
          <Text style={pdfStyles.totalValue}>{formatarMoeda(nota.totalGeral)}</Text>
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>Documento emitido eletronicamente • {new Date().toLocaleString('pt-BR')}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ==================== TOAST ====================
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${config[type]} text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-right-5 duration-300`}>
      {message}
    </div>
  );
};

// ==================== PDF MODAL ====================
const PDFModal = ({ nota, onClose }: { nota: NotaFiscal | null; onClose: () => void }) => {
  if (!nota) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-800 p-3 rounded-t-xl flex justify-between items-center">
          <span className="text-white text-sm font-semibold">Nota de Conferência</span>
          <button onClick={onClose} className="text-white/80 hover:text-white text-sm transition">Fechar</button>
        </div>
        <div className="flex-1">
          <PDFViewer width="100%" height="100%" className="rounded-b-xl">
            <NotaFiscalPDF nota={nota} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

// ==================== NOTA CARD COM ÍCONES MODERNOS ====================
const NotaCard = ({ nota, onView, onDelete, onEdit }: { 
  nota: NotaFiscal; 
  onView: () => void; 
  onDelete: () => void; 
  onEdit: (nota: NotaFiscal) => void;
}) => {
  const totalItens = nota.itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div className="group bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-[2px]">
      
      {/* LEFT - INFORMAÇÕES */}
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition">
            {nota.empresa}
          </p>
          <span className="text-xs text-slate-300">•</span>
          <p className="text-xs text-slate-500">{nota.empenho}</p>
          <span className="text-xs text-slate-300">•</span>
          <p className="text-xs text-slate-500">{nota.data}</p>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Package size={10} />
            {totalItens.toFixed(1)} kg
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <Calendar size={10} />
          Tabela Ceasa: {nota.dataTabelaCeasa}
        </p>
      </div>

      {/* RIGHT - AÇÕES COM ÍCONES */}
      <div className="flex items-center gap-3">
        
        {/* TOTAL */}
        <div className="text-right mr-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total</p>
          <p className="text-sm font-bold text-emerald-600">
            {formatarMoeda(nota.totalGeral)}
          </p>
        </div>

        {/* BOTÕES DE AÇÃO COM ÍCONES LUCIDE */}
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-all duration-200">
          
          <button
            onClick={onView}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all duration-200"
            title="Visualizar nota"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => onEdit(nota)}
            className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all duration-200"
            title="Editar nota"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all duration-200"
            title="Excluir nota"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PÁGINA PRINCIPAL ====================
export default function NotasFinalizadasPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [bancoNotas, setBancoNotas] = useState<NotaFiscal[]>([]);
  const [notaParaVisualizar, setNotaParaVisualizar] = useState<NotaFiscal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const carregarNotas = () => {
      const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
      if (notasSalvas) setBancoNotas(JSON.parse(notasSalvas));
    };
    carregarNotas();
    setIsLoaded(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const excluirNotaBanco = (id: string) => {
    if (confirm('Excluir esta nota permanentemente?')) {
      const novoBanco = bancoNotas.filter(nota => nota.id !== id);
      setBancoNotas(novoBanco);
      localStorage.setItem('banco_notas_hortifruti', JSON.stringify(novoBanco));
      showToast('Nota excluída', 'info');
    }
  };

  const editarNota = (nota: NotaFiscal) => {
    localStorage.setItem('nota_atual_hortifruti', JSON.stringify(nota));
    router.push('/dashboard/cadastro');
  };

  const filtrarNotas = () => {
    if (!searchTerm) return bancoNotas;
    return bancoNotas.filter(nota =>
      nota.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.empenho.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const notasFiltradas = filtrarNotas();
  const totalGeral = notasFiltradas.reduce((acc, nota) => acc + nota.totalGeral, 0);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER COM ÍCONES MODERNOS */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
            <ClipboardList size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Notas Finalizadas</h1>
            <p className="text-xs text-slate-500">Histórico de conferências</p>
          </div>
        </div>
        <Link
          href="/dashboard/cadastro"
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px] flex items-center gap-2"
        >
          <Plus size={16} />
          Nova
        </Link>
      </div>

      {/* STATS CARDS COM IDENTIDADE VISUAL */}
      {bancoNotas.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          
          {/* NOTAS - AZUL */}
          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Notas</p>
              <p className="text-lg font-bold text-slate-800">{bancoNotas.length}</p>
            </div>
          </div>

          {/* TOTAL - VERDE (dinheiro) */}
          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Geral</p>
              <p className="text-lg font-bold text-emerald-600">{formatarMoeda(totalGeral)}</p>
            </div>
          </div>

          {/* MÉDIA - ROXO (análise) */}
          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Média</p>
              <p className="text-lg font-bold text-slate-700">
                {bancoNotas.length 
                  ? formatarMoeda(totalGeral / bancoNotas.length) 
                  : formatarMoeda(0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PESQUISA */}
      {bancoNotas.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por empresa ou empenho..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          />
          {searchTerm && notasFiltradas.length !== bancoNotas.length && (
            <p className="text-xs text-slate-500 mt-2 animate-in fade-in duration-200">
              {notasFiltradas.length} de {bancoNotas.length} notas
            </p>
          )}
        </div>
      )}

      {/* LISTA DE NOTAS */}
      {bancoNotas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-2 opacity-50">📭</div>
          <p className="text-slate-500 text-sm">Nenhuma nota finalizada</p>
          <Link href="/dashboard/cadastro" className="text-emerald-600 text-sm font-medium mt-2 inline-block hover:underline transition">
            + Iniciar primeira conferência
          </Link>
        </div>
      ) : notasFiltradas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center animate-in fade-in duration-200">
          <p className="text-slate-500 text-sm">Nenhuma nota encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notasFiltradas.map(nota => (
            <NotaCard
              key={nota.id}
              nota={nota}
              onView={() => setNotaParaVisualizar(nota)}
              onDelete={() => excluirNotaBanco(nota.id)}
              onEdit={editarNota}
            />
          ))}
        </div>
      )}

      <PDFModal nota={notaParaVisualizar} onClose={() => setNotaParaVisualizar(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}