'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Wallet, 
  Eye, 
  Pencil, 
  Trash2, 
  Plus,
  ClipboardList,
  Calendar,
  Package,
  AlertTriangle,
  RefreshCw,
  Cloud,
  CloudOff,
  Layers,
  List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { listarNotasFiscais, deletarNotaFiscal } from '@/lib/supabase/db';

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

interface EmpenhoAgrupado {
  numero: string;
  empresa: string;
  notas: NotaFiscal[];
  totalGeral: number;
  totalDivergencias: number;
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

const formatarDataBR = (dataISO?: string) => {
  if (!dataISO) return '-';
  const partes = dataISO.split('-');
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return dataISO;
};

const formatarDataISO = (dataBR: string) => {
  const partes = dataBR.split('/');
  if (partes.length === 3) return `${partes[2]}-${partes[1]}-${partes[0]}`;
  return dataBR;
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

// ==================== COMPONENTE: NOTA CARD COM SWIPE ====================
const NotaCard = ({ nota, onView, onDelete, onEdit, onDivergencia }: { 
  nota: NotaFiscal; 
  onView: () => void; 
  onDelete: () => void; 
  onEdit: (nota: NotaFiscal) => void;
  onDivergencia: (nota: NotaFiscal) => void;
}) => {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  
  if (!nota || !nota.itens || !nota.id) return null;
  
  const totalItens = nota.itens.reduce((acc, item) => acc + (item.quantidade || 0), 0);
  const temDivergencia = nota.statusValidacao === 'divergente' || nota.itens.some(i => i.statusValidacao === 'divergente');

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;

    if (diff > 80) return setTranslateX(80);
    if (diff < -80) return setTranslateX(-80);

    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (translateX > 60) {
      onEdit(nota);
    } else if (translateX < -60) {
      onDelete();
    }
    setTranslateX(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* SWIPE ACTIONS FUNDO */}
      <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
        <div className="text-blue-600 text-sm font-bold flex items-center gap-1">
          <Pencil size={14} /> Editar
        </div>
        <div className="text-rose-600 text-sm font-bold flex items-center gap-1">
          <Trash2 size={14} /> Excluir
        </div>
      </div>

      {/* CARD COM SWIPE */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${translateX}px)` }}
        className={`relative z-10 transition-transform duration-200 bg-white border rounded-xl transition-all duration-200 hover:shadow-lg ${
          temDivergencia 
            ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400' 
            : 'border-slate-200 hover:border-emerald-300'
        }`}
      >
        
        {/* VERSÃO MOBILE (vertical) */}
        <div className="md:hidden p-3 space-y-2">
          
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {nota.empresa || '-'}
              </p>
              <p className="text-xs text-slate-500">
                Emp: {nota.empenho} • NF: {nota.numeroNota}
              </p>
            </div>

            <p className={`text-sm font-bold ${
              temDivergencia ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {formatarMoeda(nota.totalGeral || 0)}
            </p>
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={10} /> {nota.data}
            </span>
            <span className="flex items-center gap-1">
              <Package size={10} /> {totalItens.toFixed(1)} kg
            </span>
          </div>

          <div className="text-[10px] text-slate-400">
            Tabela CEASA: {nota.dataTabelaCeasa || '-'}
          </div>

          {temDivergencia && (
            <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
              <AlertTriangle size={12} />
              Esta nota possui divergência
            </div>
          )}

          <div className="flex justify-between mt-2 pt-2 border-t border-slate-100 gap-1">
            <button onClick={onView} className="flex-1 text-xs text-slate-600 bg-slate-50 py-2 rounded-lg hover:bg-slate-100 transition">
              👁️ Ver
            </button>
            <button onClick={() => onEdit(nota)} className="flex-1 text-xs text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 transition">
              ✏️ Editar
            </button>
            <button onClick={() => onDivergencia(nota)} className="flex-1 text-xs text-amber-600 bg-amber-50 py-2 rounded-lg hover:bg-amber-100 transition">
              ⚠️ Relatório
            </button>
            <button onClick={onDelete} className="flex-1 text-xs text-rose-600 bg-rose-50 py-2 rounded-lg hover:bg-rose-100 transition">
              🗑️ Excluir
            </button>
          </div>
        </div>

        {/* VERSÃO DESKTOP (horizontal intacta) */}
        <div className="hidden md:flex items-center justify-between px-4 py-3">
          
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {temDivergencia && (
                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Divergente
                </span>
              )}
              <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition">
                {nota.empresa || '-'}
              </p>
              <span className="text-xs text-slate-300">•</span>
              <p className="text-xs text-slate-500">Empenho: {nota.empenho || '-'}</p>
              <span className="text-xs text-slate-300">•</span>
              <p className="text-xs font-mono text-slate-600">NF: {nota.numeroNota || '-'}</p>
              <span className="text-xs text-slate-300">•</span>
              <p className="text-xs text-slate-500">{nota.data || '-'}</p>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Package size={10} />
                {totalItens.toFixed(1)} kg
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Calendar size={10} />
              Tabela Ceasa: {nota.dataTabelaCeasa || '-'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total</p>
              <p className={`text-sm font-bold ${temDivergencia ? 'text-amber-600' : 'text-emerald-600'}`}>
                {formatarMoeda(nota.totalGeral || 0)}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-all duration-200">
              <button onClick={onView} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all duration-200" title="Visualizar nota">
                <Eye size={16} />
              </button>
              <button onClick={() => onEdit(nota)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all duration-200" title="Editar nota">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDivergencia(nota)} className="p-2 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-all duration-200" title="Gerar relatório de divergência">
                <AlertTriangle size={16} />
              </button>
              <button onClick={onDelete} className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all duration-200" title="Excluir nota">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE: EMPENHO CARD ====================
const EmpenhoCard = ({ 
  empenho, 
  expanded, 
  onToggle,
  onViewNota,
  onEditNota,
  onDeleteNota,
  onDivergenciaNota
}: { 
  empenho: EmpenhoAgrupado;
  expanded: boolean;
  onToggle: () => void;
  onViewNota: (nota: NotaFiscal) => void;
  onEditNota: (nota: NotaFiscal) => void;
  onDeleteNota: (id: string) => void;
  onDivergenciaNota: (nota: NotaFiscal) => void;
}) => {
  const temDivergencia = empenho.totalDivergencias > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${temDivergencia ? 'bg-amber-100' : 'bg-emerald-100'}`}>
            <Layers size={16} className={temDivergencia ? 'text-amber-600' : 'text-emerald-600'} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800">Empenho: {empenho.numero}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-sm text-slate-600">{empenho.empresa}</span>
              {temDivergencia && (
                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle size={10} />
                  {empenho.totalDivergencias} divergência(s)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {empenho.notas.length} nota(s) fiscal(is)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Empenho</p>
            <p className={`text-sm font-bold ${temDivergencia ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatarMoeda(empenho.totalGeral)}
            </p>
          </div>
          {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-3 space-y-2 bg-slate-50/30">
          {empenho.notas.map((nota) => (
            <NotaCard
              key={nota.id}
              nota={nota}
              onView={() => onViewNota(nota)}
              onEdit={() => onEditNota(nota)}
              onDelete={() => onDeleteNota(nota.id)}
              onDivergencia={() => onDivergenciaNota(nota)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== PÁGINA PRINCIPAL ====================
export default function NotasFinalizadasPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [bancoNotas, setBancoNotas] = useState<NotaFiscal[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped');
  const [expandedEmpenhos, setExpandedEmpenhos] = useState<Set<string>>(new Set());
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ok' | 'divergente'>('todas');

  useEffect(() => {
    const verificarConexao = async () => {
      try {
        const { error } = await supabase.from('notas_fiscais').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setSupabaseStatus('connected');
      } catch (error) {
        setSupabaseStatus('disconnected');
      }
    };
    verificarConexao();
  }, []);

  const carregarNotas = async () => {
    try {
      if (supabaseStatus === 'connected') {
        try {
          const notasDoSupabase = await listarNotasFiscais();
          if (notasDoSupabase && notasDoSupabase.length > 0) {
            const notasConvertidas = notasDoSupabase.map((nota: any) => {
              const dataISO = nota.data;
              return {
                id: nota.id,
                empresa: nota.empresa,
                empenho: nota.empenho,
                numeroNota: nota.numero_nota,
                data: formatarDataBR(dataISO),
                dataISO: dataISO,
                dataTabelaCeasa: formatarDataBR(nota.data_tabela_ceasa),
                itens: nota.itens || [],
                totalGeral: nota.total_geral || 0,
                statusValidacao: nota.status_validacao
              };
            });
            
            notasConvertidas.sort((a, b) => {
              if (!a.dataISO && !b.dataISO) return 0;
              if (!a.dataISO) return 1;
              if (!b.dataISO) return -1;
              return b.dataISO.localeCompare(a.dataISO);
            });
            
            setBancoNotas(notasConvertidas);
            localStorage.setItem('banco_notas_hortifruti', JSON.stringify(notasConvertidas));
            return;
          }
        } catch (supabaseError) {
          console.warn('⚠️ Erro ao carregar do Supabase:', supabaseError);
        }
      }
      
      const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
      if (notasSalvas) {
        const parsed = JSON.parse(notasSalvas);
        const notasValidas = Array.isArray(parsed) ? parsed.filter((n: any) => 
          n && typeof n.id === 'string' && typeof n.empresa === 'string' && Array.isArray(n.itens)
        ) : [];
        
        const notasUnicasMap = new Map<string, NotaFiscal>();
        for (const nota of notasValidas) {
          if (!notasUnicasMap.has(nota.id)) {
            notasUnicasMap.set(nota.id, nota);
          }
        }
        
        const notasUnicas = Array.from(notasUnicasMap.values());
        
        notasUnicas.sort((a, b) => {
          const dataA = (a as any).dataISO || formatarDataISO(a.data);
          const dataB = (b as any).dataISO || formatarDataISO(b.data);
          if (!dataA && !dataB) return 0;
          if (!dataA) return 1;
          if (!dataB) return -1;
          return dataB.localeCompare(dataA);
        });
        
        setBancoNotas(notasUnicas);
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      setBancoNotas([]);
    }
  };

  const agruparPorEmpenho = (notas: NotaFiscal[]): EmpenhoAgrupado[] => {
    const grupos = new Map<string, EmpenhoAgrupado>();
    
    for (const nota of notas) {
      if (!grupos.has(nota.empenho)) {
        grupos.set(nota.empenho, {
          numero: nota.empenho,
          empresa: nota.empresa,
          notas: [],
          totalGeral: 0,
          totalDivergencias: 0
        });
      }
      
      const grupo = grupos.get(nota.empenho)!;
      grupo.notas.push(nota);
      grupo.totalGeral += nota.totalGeral;
      if (nota.statusValidacao === 'divergente') {
        grupo.totalDivergencias++;
      }
    }
    
    const agrupado = Array.from(grupos.values());
    agrupado.sort((a, b) => {
      const dataA = a.notas[0]?.dataISO || formatarDataISO(a.notas[0]?.data || '');
      const dataB = b.notas[0]?.dataISO || formatarDataISO(b.notas[0]?.data || '');
      return dataB.localeCompare(dataA);
    });
    
    return agrupado;
  };

  const toggleEmpenho = (empenhoNumero: string) => {
    setExpandedEmpenhos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(empenhoNumero)) {
        newSet.delete(empenhoNumero);
      } else {
        newSet.add(empenhoNumero);
      }
      return newSet;
    });
  };

  const expandirTodos = () => {
    const empenhos = agruparPorEmpenho(notasFiltradas);
    const todosNumeros = new Set(empenhos.map(e => e.numero));
    setExpandedEmpenhos(todosNumeros);
  };

  const recolherTodos = () => {
    setExpandedEmpenhos(new Set());
  };

  const forcarSincronizacao = async () => {
    if (supabaseStatus !== 'connected') {
      showToast('Sem conexão com a nuvem', 'error');
      return;
    }
    
    setIsSyncing(true);
    showToast('Sincronizando com nuvem...', 'info');
    
    try {
      await carregarNotas();
      showToast('Notas sincronizadas com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao sincronizar', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    carregarNotas();
    setIsLoaded(true);
  }, [supabaseStatus]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const excluirNotaBanco = async (id: string) => {
    if (!confirm('Excluir esta nota permanentemente?')) return;
    
    try {
      if (supabaseStatus === 'connected') {
        await deletarNotaFiscal(id);
      }
      
      const novoBanco = bancoNotas.filter(nota => nota.id !== id);
      setBancoNotas(novoBanco);
      localStorage.setItem('banco_notas_hortifruti', JSON.stringify(novoBanco));
      showToast('Nota excluída', 'info');
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      showToast('Erro ao excluir nota', 'error');
    }
  };

  const editarNota = (nota: NotaFiscal) => {
    localStorage.setItem('nota_atual_hortifruti', JSON.stringify(nota));
    router.push('/dashboard/cadastro');
  };

  const imprimirNota = (nota: NotaFiscal, modo: 'conferencia' | 'divergencia') => {
    window.open(`/print/${nota.id}?modo=${modo}`, '_blank');
  };

  const filtrarNotas = () => {
    let resultado = bancoNotas;

    if (searchTerm) {
      resultado = resultado.filter(nota =>
        nota.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.empenho?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.numeroNota?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroStatus === 'divergente') {
      resultado = resultado.filter(nota => nota.statusValidacao === 'divergente');
    }

    if (filtroStatus === 'ok') {
      resultado = resultado.filter(nota => nota.statusValidacao !== 'divergente');
    }

    return resultado;
  };

  const notasFiltradas = filtrarNotas();
  const totalGeral = notasFiltradas.reduce((acc, nota) => acc + (nota.totalGeral || 0), 0);
  const notasComDivergencia = notasFiltradas.filter(n => n.statusValidacao === 'divergente').length;
  const totalNotasFiltradas = notasFiltradas.length;
  const empenhosAgrupados = agruparPorEmpenho(notasFiltradas);
  const totalEmpenhos = empenhosAgrupados.length;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      
      {/* HEADER REFATORADO - Mobile horizontal, Desktop completo */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        
        {/* MOBILE: Layout compacto horizontal */}
        <div className="md:hidden p-3">
          
          {/* Linha 1: Logo + Título + Botão Nova */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <ClipboardList size={16} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800">Notas</h1>
                <p className="text-[9px] text-slate-400">Finalizadas</p>
              </div>
            </div>

            <Link
              href="/dashboard/cadastro"
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1"
            >
              <Plus size={12} />
              Nova
            </Link>
          </div>

          {/* Linha 2: Controles (scroll horizontal) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            
            <div className="flex bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500'
                }`}
              >
                <List size={12} className="inline mr-1" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-all ${
                  viewMode === 'grouped' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500'
                }`}
              >
                <Layers size={12} className="inline mr-1" />
                Empenho
              </button>
            </div>

            {supabaseStatus === 'connected' && (
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">
                <Cloud size={10} className="text-emerald-600" />
                <span className="text-[9px] text-emerald-700 font-medium">Cloud</span>
              </div>
            )}
            {supabaseStatus === 'disconnected' && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full flex-shrink-0">
                <CloudOff size={10} className="text-amber-600" />
                <span className="text-[9px] text-amber-700 font-medium">Offline</span>
              </div>
            )}

            <button
              onClick={forcarSincronizacao}
              disabled={isSyncing || supabaseStatus !== 'connected'}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 flex-shrink-0 disabled:opacity-50"
            >
              <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
              Sync
            </button>

            {filtroStatus !== 'todas' && (
              <div className="bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                <span className="text-[9px] font-semibold text-emerald-700">
                  {filtroStatus === 'divergente' ? '⚠️ Divergentes' : '✅ Validados'}
                </span>
              </div>
            )}

            <div className="bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
              <span className="text-[9px] font-medium text-slate-600">
                {totalNotasFiltradas} nota(s)
              </span>
            </div>

          </div>
        </div>

        {/* DESKTOP: Layout completo original (INALTERADO) */}
        <div className="hidden md:flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
              <ClipboardList size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Notas Finalizadas</h1>
              <p className="text-xs text-slate-500">Histórico de conferências</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {supabaseStatus === 'connected' ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
                <Cloud size={12} className="text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-medium">Cloud</span>
              </div>
            ) : supabaseStatus === 'disconnected' ? (
              <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-full">
                <CloudOff size={12} className="text-amber-600" />
                <span className="text-[10px] text-amber-700 font-medium">Offline</span>
              </div>
            ) : null}
            
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  viewMode === 'list' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={12} />
                Lista
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  viewMode === 'grouped' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layers size={12} />
                Por Empenho
              </button>
            </div>
            
            <button
              onClick={forcarSincronizacao}
              disabled={isSyncing || supabaseStatus !== 'connected'}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            </button>
            
            <Link
              href="/dashboard/cadastro"
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px] flex items-center gap-2"
            >
              <Plus size={16} />
              Nova
            </Link>
          </div>
        </div>
      </div>

      {/* STATS CARDS - Desktop */}
      {bancoNotas.length > 0 && (
        <div className="hidden md:grid grid-cols-4 gap-3">
          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Notas</p>
              <p className="text-lg font-bold text-slate-800">{totalNotasFiltradas}</p>
            </div>
          </div>

          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Empenhos</p>
              <p className="text-lg font-bold text-slate-800">{totalEmpenhos}</p>
            </div>
          </div>

          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Geral</p>
              <p className="text-lg font-bold text-emerald-600">{formatarMoeda(totalGeral)}</p>
            </div>
          </div>

          <div className="group bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Divergências</p>
              <p className="text-lg font-bold text-amber-600">{notasComDivergencia}</p>
            </div>
          </div>
        </div>
      )}

      {/* PESQUISA E FILTROS */}
      {bancoNotas.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por empresa, empenho ou número da NF..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          />
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: 'todas', label: '📋 Todas' },
              { key: 'divergente', label: '⚠️ Com divergência' },
              { key: 'ok', label: '✅ Sem divergência' }
            ].map((chip) => {
              const active = filtroStatus === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setFiltroStatus(chip.key as any)}
                  className={`
                    whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
          
          {viewMode === 'grouped' && empenhosAgrupados.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {empenhosAgrupados.length} empenhos encontrados
              </p>
              <div className="flex gap-2">
                <button
                  onClick={expandirTodos}
                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Expandir todos
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={recolherTodos}
                  className="text-[10px] text-slate-500 hover:text-slate-700 font-medium"
                >
                  Recolher todos
                </button>
              </div>
            </div>
          )}
          
          {searchTerm && notasFiltradas.length !== bancoNotas.length && (
            <p className="text-xs text-slate-500 animate-in fade-in duration-200">
              {notasFiltradas.length} de {bancoNotas.length} notas
            </p>
          )}
        </div>
      )}

      {/* LISTAGEM */}
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
          <p className="text-slate-500 text-sm">Nenhuma nota encontrada com este filtro</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {notasFiltradas.map((nota) => (
            <NotaCard
              key={nota.id}
              nota={nota}
              onView={() => imprimirNota(nota, 'conferencia')}
              onDelete={() => excluirNotaBanco(nota.id)}
              onEdit={editarNota}
              onDivergencia={() => imprimirNota(nota, 'divergencia')}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {empenhosAgrupados.map((empenho) => (
            <EmpenhoCard
              key={empenho.numero}
              empenho={empenho}
              expanded={expandedEmpenhos.has(empenho.numero)}
              onToggle={() => toggleEmpenho(empenho.numero)}
              onViewNota={(nota) => imprimirNota(nota, 'conferencia')}
              onEditNota={editarNota}
              onDeleteNota={excluirNotaBanco}
              onDivergenciaNota={(nota) => imprimirNota(nota, 'divergencia')}
            />
          ))}
        </div>
      )}

      {/* MOBILE STICKY SUMMARY */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Geral</p>
            <p className="text-base font-bold text-emerald-600">
              {formatarMoeda(totalGeral)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] text-slate-400">Notas</p>
              <p className="text-sm font-semibold text-slate-700">{totalNotasFiltradas}</p>
            </div>

            {notasComDivergencia > 0 && (
              <div className="text-center">
                <p className="text-[10px] text-slate-400">Divergentes</p>
                <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
                  <AlertTriangle size={12} /> {notasComDivergencia}
                </p>
              </div>
            )}

            {filtroStatus !== 'todas' && (
              <div className="bg-emerald-100 rounded-full px-2 py-1">
                <p className="text-[9px] font-semibold text-emerald-700">
                  {filtroStatus === 'divergente' ? '⚠️ Filtrado' : '✅ Filtrado'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}