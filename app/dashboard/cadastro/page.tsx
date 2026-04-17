'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Save, 
  Search, 
  ChevronDown,
  Package,
  DollarSign,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Box,
  Tag,
  Weight,
  FileUp,
  Loader2,
  Sparkles,
  Database
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { salvarPrecosCeasa, buscarPrecosCeasa, salvarNotaFiscal } from '@/lib/supabase/db';

// ==================== BANCO DE DADOS CEASA ====================
const PRODUTOS_CONTRATO = [
  { id: 101, codigo: 0, categoria: 'ABACATE', nome: 'AVOCADO', desconto: 10.00 },
  { id: 102, codigo: 0, categoria: 'ABACATE', nome: 'FORTUNA', desconto: 10.00 },
  { id: 103, codigo: 0, categoria: 'ABACATE', nome: 'MANTEIGA', desconto: 10.00 },
  { id: 104, codigo: 0, categoria: 'ABACATE', nome: 'MARGARIDA', desconto: 10.00 },
  { id: 25, codigo: 1107, categoria: 'ABACAXI', nome: 'HAVAI', desconto: 14.80 },
  { id: 26, codigo: 251658, categoria: 'ABACAXI', nome: 'PÉROLA', desconto: 18.10 },
  { id: 2, codigo: 357, categoria: 'ABÓBORA', nome: 'KABOTIÁ / HOKAIDO', desconto: 8.80 },
  { id: 3, codigo: 90539, categoria: 'ABÓBORA', nome: 'MORANGA', desconto: 10.30 },
  { id: 4, codigo: 359, categoria: 'ABÓBORA', nome: 'PAULISTA / MENINA', desconto: 10.50 },
  { id: 105, codigo: 0, categoria: 'ABÓBORA', nome: 'SECA / PESCOÇO', desconto: 10.50 },
  { id: 5, codigo: 111964, categoria: 'ABOBRINHA', nome: 'MENINA', desconto: 10.30 },
  { id: 106, codigo: 0, categoria: 'ABOBRINHA', nome: 'BRANCA', desconto: 10.30 },
  { id: 107, codigo: 0, categoria: 'ABOBRINHA', nome: 'VERDE', desconto: 10.30 },
  { id: 108, codigo: 0, categoria: 'ALHO', nome: 'ROXO NACIONAL', desconto: 5.00 },
  { id: 109, codigo: 0, categoria: 'ALHO', nome: 'ROXO IMPORTADO', desconto: 5.00 },
  { id: 110, codigo: 0, categoria: 'CEBOLA', nome: 'COMUM / BRANCA', desconto: 10.00 },
  { id: 111, codigo: 0, categoria: 'CEBOLA', nome: 'ROXA', desconto: 10.00 },
  { id: 112, codigo: 0, categoria: 'CENOURA', nome: 'COMUM', desconto: 10.00 },
  { id: 31, codigo: 371, categoria: 'BETERRABA', nome: 'EXTRA', desconto: 10.20 },
  { id: 113, codigo: 0, categoria: 'BATATA', nome: 'COMUM', desconto: 10.00 },
  { id: 114, codigo: 0, categoria: 'BATATA', nome: 'CASCA ROSADA', desconto: 10.00 },
  { id: 115, codigo: 0, categoria: 'BATATA DOCE', nome: 'BRANCA', desconto: 10.00 },
  { id: 116, codigo: 0, categoria: 'BATATA DOCE', nome: 'ROXA', desconto: 10.00 },
  { id: 117, codigo: 0, categoria: 'BATATA SALSA (MANDIOQUINHA)', nome: 'PRIMEIRA', desconto: 10.00 },
  { id: 1, codigo: 364, categoria: 'BANANA', nome: 'MAÇÃ', desconto: 2.20 },
  { id: 118, codigo: 0, categoria: 'BANANA', nome: 'CATURRA', desconto: 2.20 },
  { id: 119, codigo: 0, categoria: 'BANANA', nome: 'PRATA', desconto: 2.20 },
  { id: 120, codigo: 0, categoria: 'BANANA', nome: 'TERRA', desconto: 2.20 },
  { id: 27, codigo: 361, categoria: 'AGRIÃO', nome: 'MAÇO', desconto: 3.30 },
  { id: 28, codigo: 236941, categoria: 'ALFACE', nome: 'AMERICANA', desconto: 3.20 },
  { id: 29, codigo: 362, categoria: 'ALFACE', nome: 'CRESPA', desconto: 3.20 },
  { id: 121, codigo: 0, categoria: 'ALFACE', nome: 'LISA', desconto: 3.20 },
  { id: 6, codigo: 272822, categoria: 'COENTRO', nome: 'MAÇO', desconto: 2.70 },
  { id: 7, codigo: 379, categoria: 'COUVE FLOR', nome: 'UNIDADE', desconto: 2.70 },
  { id: 122, codigo: 0, categoria: 'COUVE MANTEIGA', nome: 'MAÇO', desconto: 3.00 },
  { id: 37, codigo: 413, categoria: 'RÚCULA', nome: 'MAÇO', desconto: 8.60 },
  { id: 123, codigo: 0, categoria: 'CEBOLINHA', nome: 'MAÇO', desconto: 3.00 },
  { id: 124, codigo: 0, categoria: 'LARANJA', nome: 'BAHIA', desconto: 10.00 },
  { id: 125, codigo: 0, categoria: 'LARANJA', nome: 'LIMA', desconto: 10.00 },
  { id: 126, codigo: 0, categoria: 'LARANJA', nome: 'PERA', desconto: 10.00 },
  { id: 127, codigo: 0, categoria: 'LIMÃO', nome: 'TAHITI', desconto: 10.00 },
  { id: 128, codigo: 0, categoria: 'LIMÃO', nome: 'ROSA', desconto: 10.00 },
  { id: 129, codigo: 0, categoria: 'LIMÃO', nome: 'SICILIANO', desconto: 10.00 },
  { id: 130, codigo: 0, categoria: 'MAÇÃ', nome: 'GALA', desconto: 10.00 },
  { id: 131, codigo: 0, categoria: 'MAÇÃ', nome: 'FUJI', desconto: 10.00 },
  { id: 132, codigo: 0, categoria: 'MAÇÃ', nome: 'EVA', desconto: 10.00 },
  { id: 133, codigo: 0, categoria: 'MAÇÃ', nome: 'GRANNY SMITH (VERDE)', desconto: 10.00 },
  { id: 33, codigo: 203412, categoria: 'MAMÃO', nome: 'HAVAI / PAPAYA', desconto: 10.10 },
  { id: 134, codigo: 0, categoria: 'MAMÃO', nome: 'FORMOSA', desconto: 10.10 },
  { id: 12, codigo: 90548, categoria: 'MANGA', nome: 'TOMMY', desconto: 16.65 },
  { id: 135, codigo: 0, categoria: 'MANGA', nome: 'PALMER', desconto: 16.65 },
  { id: 13, codigo: 6602, categoria: 'MARACUJÁ', nome: 'AZEDO', desconto: 10.10 },
  { id: 136, codigo: 0, categoria: 'MARACUJÁ', nome: 'DOCE', desconto: 10.10 },
  { id: 14, codigo: 1046, categoria: 'MELANCIA', nome: 'REDONDA / COMPRIDA', desconto: 19.10 },
  { id: 137, codigo: 0, categoria: 'MELANCIA', nome: 'BABY', desconto: 19.10 },
  { id: 138, codigo: 0, categoria: 'MELÃO', nome: 'AMARELO', desconto: 10.00 },
  { id: 139, codigo: 0, categoria: 'MELÃO', nome: 'PELE DE SAPO', desconto: 10.00 },
  { id: 17, codigo: 203414, categoria: 'PEPINO', nome: 'AODAI / SALADA', desconto: 10.10 },
  { id: 18, codigo: 1637, categoria: 'PEPINO', nome: 'JAPONÊS', desconto: 10.10 },
  { id: 20, codigo: 111965, categoria: 'PIMENTÃO', nome: 'AMARELO', desconto: 10.10 },
  { id: 21, codigo: 3693, categoria: 'PIMENTÃO', nome: 'VERDE', desconto: 9.10 },
  { id: 22, codigo: 111966, categoria: 'PIMENTÃO', nome: 'VERMELHO', desconto: 9.10 },
  { id: 35, codigo: 98800, categoria: 'REPOLHO', nome: 'VERDE', desconto: 10.00 },
  { id: 36, codigo: 90933, categoria: 'REPOLHO', nome: 'ROXO', desconto: 10.00 },
  { id: 38, codigo: 416, categoria: 'TOMATE', nome: 'LONGA VIDA', desconto: 15.00 },
  { id: 140, codigo: 0, categoria: 'TOMATE', nome: 'CEREJA', desconto: 15.00 },
  { id: 141, codigo: 0, categoria: 'TOMATE', nome: 'SALADETE', desconto: 15.00 },
  { id: 30, codigo: 265691, categoria: 'BERINJELA', nome: 'EXTRA', desconto: 3.20 },
  { id: 32, codigo: 221161, categoria: 'CARÁ', nome: 'EXTRA', desconto: 6.20 },
  { id: 8, codigo: 111968, categoria: 'GENGIBRE', nome: 'PRIMEIRA', desconto: 4.10 },
  { id: 9, codigo: 89741, categoria: 'GOIABA', nome: 'VERMELHA / BRANCA', desconto: 10.10 },
  { id: 10, codigo: 271015, categoria: 'INHAME', nome: 'TAIÁ', desconto: 10.10 },
  { id: 11, codigo: 266834, categoria: 'JILÓ', nome: 'PRIMEIRA', desconto: 7.10 },
  { id: 15, codigo: 221173, categoria: 'TANGERINA / MEXERICA', nome: 'MURKOTE / PONKAN', desconto: 10.10 },
  { id: 16, codigo: 400, categoria: 'MILHO VERDE', nome: 'ESPIGA / BANDEJA', desconto: 10.10 },
  { id: 34, codigo: 93945, categoria: 'MORANGO', nome: 'TIPO 1', desconto: 10.20 },
  { id: 19, codigo: 268125, categoria: 'PÊRA', nome: 'IMPORTADA WILLIANS / D ANJOU', desconto: 19.90 },
  { id: 23, codigo: 90537, categoria: 'QUIABO', nome: 'PRIMEIRA', desconto: 9.10 },
  { id: 24, codigo: 417, categoria: 'VAGEM', nome: 'MACARRÃO', desconto: 6.70 },
  { id: 142, codigo: 0, categoria: 'UVA', nome: 'NIAGARA / OUTRAS', desconto: 10.00 },
];

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

interface PrecoCeasa {
  categoria: string;
  tipo: string;
  kgEmbalagem: number;
  valorMc: number;
}

// ==================== UTILITÁRIOS ====================
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarDataBrasil = (date: Date) => {
  const dia = date.getUTCDate().toString().padStart(2, '0');
  const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const ano = date.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
};

const formatarDataISO = (dataStr: string) => {
  const partes = dataStr.split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dataStr;
};

const calcularPrecoComDesconto = (precoUnitario: number, descontoPercentual: number) => {
  const valorDesconto = precoUnitario * (descontoPercentual / 100);
  return Math.round((precoUnitario - valorDesconto) * 100) / 100;
};

const normalizarTexto = (texto: string) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

// ==================== SELECTOR PERSONALIZADO ====================
interface PremiumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; discount?: number }>;
  placeholder: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const PremiumSelect = ({ value, onChange, options, placeholder, icon, disabled }: PremiumSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScroll = () => requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);
  
  const handleOpen = () => {
    if (!disabled) {
      updatePosition();
      setIsOpen(true);
    }
  };
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full bg-white border rounded-lg px-3 py-2 text-left transition-all shadow-sm flex items-center justify-between group text-sm ${
          disabled 
            ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400' 
            : isOpen 
              ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="flex-shrink-0 text-slate-400">{icon}</span>}
          <span className={`font-medium truncate ${selectedOption ? 'text-slate-700' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.discount && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
              -{selectedOption.discount}%
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">Nenhum resultado</div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between text-sm ${
                    value === option.value ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.discount && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{option.discount}%
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// ==================== COMPONENTE UPLOAD PDF ====================
const UploadPDFButton = ({ onDataExtracted }: { onDataExtracted: (produtos: PrecoCeasa[]) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress('Lendo arquivo...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress('Enviando para processamento...');
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      console.log('📦 Resposta bruta da API:', text.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ Erro ao parsear JSON:', text);
        setUploadProgress('Erro na resposta do servidor');
        setTimeout(() => {
          setUploadProgress('');
          setIsUploading(false);
        }, 3000);
        return;
      }

      if (!response.ok) {
        setUploadProgress(data.error || 'Erro no servidor');
        setTimeout(() => {
          setUploadProgress('');
          setIsUploading(false);
        }, 3000);
        return;
      }

      if (!data.success || !data.produtos || data.produtos.length === 0) {
        console.warn('⚠️ Nenhum produto encontrado na resposta:', data);
        setUploadProgress('Nenhum produto reconhecido no PDF');
        setTimeout(() => {
          setUploadProgress('');
          setIsUploading(false);
        }, 3000);
        return;
      }

      console.log(`✅ ${data.totalProdutos} produtos encontrados!`);
      setUploadProgress(`${data.totalProdutos} produtos encontrados!`);
      onDataExtracted(data.produtos);
      
      setTimeout(() => {
        setUploadProgress('');
        setIsUploading(false);
      }, 2000);

    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadProgress('Erro na conexão');
      setTimeout(() => {
        setUploadProgress('');
        setIsUploading(false);
      }, 3000);
    }

    event.target.value = '';
  };

  return (
    <div className="relative">
      <label className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all
        ${isUploading 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
        }
      `}>
        {isUploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{uploadProgress || 'Processando...'}</span>
          </>
        ) : (
          <>
            <FileUp size={16} />
            <span>Upload PDF Ceasa</span>
          </>
        )}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

// ==================== TOAST ====================
const Toast = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  
  const config = {
    success: { bg: 'bg-emerald-500', icon: <CheckCircle size={18} /> },
    error: { bg: 'bg-red-500', icon: <AlertCircle size={18} /> },
    info: { bg: 'bg-blue-500', icon: <Info size={18} /> }
  };
  
  const current = config[type as keyof typeof config] || config.info;
  
  return (
    <div className={`fixed bottom-4 right-4 z-[10000] flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${current.bg} text-white text-sm animate-in slide-in-from-right-5 duration-300`}>
      {current.icon}
      <span>{message}</span>
    </div>
  );
};

// ==================== PÁGINA DE CADASTRO ====================
export default function NovaConferenciaPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notaAtual, setNotaAtual] = useState<NotaFiscal | null>(null);
  
  const [formEmpresa, setFormEmpresa] = useState('');
  const [formEmpenho, setFormEmpenho] = useState('');
  const [formDataTabela, setFormDataTabela] = useState(() => {
    const hoje = new Date();
    return formatarDataBrasil(hoje);
  });
  
  const [itensCeasa, setItensCeasa] = useState<ItemNota[]>([]);
  const [setupCategoria, setSetupCategoria] = useState('');
  const [setupProdutoId, setSetupProdutoId] = useState('');
  const [setupKgCaixa, setSetupKgCaixa] = useState('');
  const [setupValorCaixa, setSetupValorCaixa] = useState('');
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [precosCeasa, setPrecosCeasa] = useState<PrecoCeasa[]>([]);
  const [resetEffect, setResetEffect] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  const categoriasDisponiveis = Array.from(new Set(PRODUTOS_CONTRATO.map(p => p.categoria))).sort();
  const subtiposDisponiveis = PRODUTOS_CONTRATO
    .filter(p => p.categoria === setupCategoria)
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(p => ({ value: p.id.toString(), label: p.nome, discount: p.desconto }));

  // Verificar conexão com Supabase
  useEffect(() => {
    const verificarConexao = async () => {
      try {
        const { data, error } = await supabase.from('ceasa_precos').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setSupabaseStatus('connected');
        console.log('✅ Supabase conectado');
      } catch (error) {
        setSupabaseStatus('disconnected');
        console.warn('⚠️ Supabase desconectado, usando apenas localStorage');
      }
    };
    verificarConexao();
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const notaEmAndamento = localStorage.getItem('nota_atual_hortifruti');
    if (notaEmAndamento) setNotaAtual(JSON.parse(notaEmAndamento));
    setIsLoaded(true);
  }, []);

  // Salvar nota em andamento no localStorage
  useEffect(() => {
    if (isLoaded) {
      if (notaAtual) localStorage.setItem('nota_atual_hortifruti', JSON.stringify(notaAtual));
      else localStorage.removeItem('nota_atual_hortifruti');
    }
  }, [notaAtual, isLoaded]);

  // Carregar preços da CEASA do Supabase
  useEffect(() => {
    const carregarPrecosDoBanco = async () => {
      if (supabaseStatus === 'connected' && formDataTabela) {
        const precos = await buscarPrecosCeasa(formatarDataISO(formDataTabela));
        if (precos && precos.length > 0) {
          setPrecosCeasa(precos);
          showToast(`${precos.length} preços carregados do banco de dados!`, 'info');
          console.log(`📦 ${precos.length} preços carregados do Supabase para ${formDataTabela}`);
        }
      }
    };
    
    carregarPrecosDoBanco();
  }, [formDataTabela, supabaseStatus]);

  // Resetar campos quando categoria muda
  useEffect(() => {
    setSetupProdutoId('');
    setSetupKgCaixa('');
    setSetupValorCaixa('');
    setResetEffect(true);
    setTimeout(() => setResetEffect(false), 500);
    
    if (setupCategoria) {
      console.log(`📁 Categoria alterada para: ${setupCategoria} - Campos resetados`);
    }
  }, [setupCategoria]);

  // Buscar preço automaticamente ao selecionar tipo
  useEffect(() => {
    if (!setupCategoria || !setupProdutoId || precosCeasa.length === 0) return;
    
    const produtoSelecionado = PRODUTOS_CONTRATO.find(p => p.id.toString() === setupProdutoId);
    if (!produtoSelecionado) return;
    
    console.log(`🔍 Buscando preço para: ${produtoSelecionado.categoria} - ${produtoSelecionado.nome}`);
    
    const encontrarPreco = () => {
      const categoriaNorm = normalizarTexto(produtoSelecionado.categoria);
      const nomeNorm = normalizarTexto(produtoSelecionado.nome);
      
      const sinonimos: Record<string, string[]> = {
        'CENOURA': ['CENOURA A', 'CENOURA AA', 'CENOURA COMUM'],
        'GOIABA': ['GOIABA VERMELHA', 'GOIABA BRANCA', 'GOIABA COMUM'],
        'COUVE': ['COUVE MANTEIGA', 'COUVE COMUM'],
        'COUVE-FLOR': ['COUVE FLOR', 'COUVE FLOR MEDIA', 'COUVE FLOR GRANDE'],
        'CEBOLINHA': ['CEBOLINHA COMUM', 'CEBOLINHA VERDE', 'CEBOLINHA MAÇO'],
        'CEBOLA COMUM': ['CEBOLA BRANCA', 'CEBOLA COMUM', 'CEBOLA PERA'],
        'CEBOLA': ['CEBOLA BRANCA', 'CEBOLA PERA', 'CEBOLA ROXA'],
        'ALFACE': ['ALFACE AMERICANA', 'ALFACE CRESPA', 'ALFACE LISA'],
        'TOMATE': ['TOMATE LONGA VIDA', 'TOMATE SALADETE', 'TOMATE CEREJA'],
        'BETERRABA': ['BETERRABA A', 'BETERRABA AA', 'BETERRABA EXTRA']
      };
      
      // Match exato
      let preco = precosCeasa.find(p => 
        normalizarTexto(p.categoria) === categoriaNorm &&
        normalizarTexto(p.tipo) === nomeNorm
      );
      if (preco) return preco;
      
      // Match por categoria e nome contido
      preco = precosCeasa.find(p => 
        normalizarTexto(p.categoria) === categoriaNorm &&
        normalizarTexto(p.tipo).includes(nomeNorm)
      );
      if (preco) return preco;
      
      // Match por sinônimos
      const sinonimosLista = sinonimos[nomeNorm] || sinonimos[`${categoriaNorm}|${nomeNorm}`] || [];
      for (const sinonimo of sinonimosLista) {
        preco = precosCeasa.find(p => 
          normalizarTexto(p.categoria) === categoriaNorm &&
          normalizarTexto(p.tipo).includes(normalizarTexto(sinonimo))
        );
        if (preco) return preco;
      }
      
      // Match por categoria (primeiro da categoria)
      const precosDaCategoria = precosCeasa.filter(p => 
        normalizarTexto(p.categoria) === categoriaNorm
      );
      if (precosDaCategoria.length > 0) return precosDaCategoria[0];
      
      return null;
    };
    
    const precoEncontrado = encontrarPreco();
    
    if (precoEncontrado) {
      console.log(`✅ Preço encontrado: ${precoEncontrado.tipo} | ${precoEncontrado.kgEmbalagem}kg | ${formatarMoeda(precoEncontrado.valorMc)}`);
      setSetupKgCaixa(precoEncontrado.kgEmbalagem.toString().replace('.', ','));
      setSetupValorCaixa(precoEncontrado.valorMc.toString().replace('.', ','));
      showToast(`Preço carregado: ${precoEncontrado.kgEmbalagem}kg por ${formatarMoeda(precoEncontrado.valorMc)}`, 'info');
    } else {
      console.warn(`⚠️ Preço não encontrado para: ${produtoSelecionado.categoria} - ${produtoSelecionado.nome}`);
    }
  }, [setupCategoria, setupProdutoId, precosCeasa]);

  const showToast = (message: string, type: string) => setToast({ message, type });

  // Processar produtos extraídos do PDF
  const handlePDFDataExtracted = async (produtos: PrecoCeasa[]) => {
    console.log('📦 Produtos CEASA recebidos:', produtos.length);
    setPrecosCeasa(produtos);
    
    // Salvar no Supabase
    if (supabaseStatus === 'connected') {
      try {
        await salvarPrecosCeasa(formatarDataISO(formDataTabela), produtos);
        console.log('✅ Preços salvos no Supabase');
        showToast(`${produtos.length} preços salvos no banco de dados!`, 'success');
      } catch (error) {
        console.error('❌ Erro ao salvar no Supabase:', error);
        showToast('Erro ao salvar no banco, mas dados estão no navegador', 'error');
      }
    } else {
      showToast(`${produtos.length} preços carregados (apenas navegador)`, 'info');
    }
  };

  const handleAddSetupCeasa = (e: React.FormEvent) => {
    e.preventDefault();
    const produto = PRODUTOS_CONTRATO.find(p => p.id.toString() === setupProdutoId);
    const kg = parseFloat(setupKgCaixa.replace(',', '.'));
    const valor = parseFloat(setupValorCaixa.replace(',', '.'));

    if (!produto || !kg || !valor) {
      showToast('Preencha os campos de Peso e Valor corretamente.', 'error');
      return;
    }

    const precoSemDesconto = valor / kg;
    const precoFinalArredondado = calcularPrecoComDesconto(precoSemDesconto, produto.desconto);
    const nomeCompleto = `${produto.categoria} - ${produto.nome}`;

    const novoItem: ItemNota = {
      id: Date.now().toString(),
      produtoId: produto.id,
      produtoNome: nomeCompleto,
      desconto: produto.desconto,
      kgCaixa: kg,
      valorCaixa: valor,
      precoUnitarioSemDesconto: precoSemDesconto,
      precoUnitarioComDesconto: precoFinalArredondado,
      quantidadeStr: '',
      quantidade: 0,
      totalSemDesconto: 0,
      total: 0
    };

    setItensCeasa([...itensCeasa, novoItem]);
    setSetupCategoria('');
    setSetupProdutoId('');
    setSetupKgCaixa('');
    setSetupValorCaixa('');
    showToast(`${nomeCompleto} adicionado!`, 'success');
  };

  const removerItemSetup = (id: string) => {
    setItensCeasa(itensCeasa.filter(i => i.id !== id));
    showToast('Item removido', 'info');
  };

  const iniciarDigitacaoDaNota = () => {
    if (!formEmpresa || !formEmpenho || itensCeasa.length === 0) {
      showToast('Preencha todos os dados e adicione ao menos 1 item.', 'error');
      return;
    }

    const novaNota: NotaFiscal = {
      id: Date.now().toString(),
      empresa: formEmpresa,
      empenho: formEmpenho,
      data: formatarDataBrasil(new Date()),
      dataTabelaCeasa: formDataTabela,
      itens: itensCeasa,
      totalGeral: 0
    };

    setNotaAtual(novaNota);
    setFormEmpresa('');
    setFormEmpenho('');
    setItensCeasa([]);
    showToast(`Nota criada!`, 'success');
  };

  const handleQuantidadeChange = (id: string, qtdStr: string) => {
    if (!notaAtual) return;
    const qtdNumerica = parseFloat(qtdStr.replace(',', '.')) || 0;

    const novosItens = notaAtual.itens.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantidadeStr: qtdStr,
          quantidade: qtdNumerica,
          totalSemDesconto: qtdNumerica * item.precoUnitarioSemDesconto,
          total: qtdNumerica * item.precoUnitarioComDesconto
        };
      }
      return item;
    });

    setNotaAtual({
      ...notaAtual,
      itens: novosItens,
      totalGeral: novosItens.reduce((acc, item) => acc + item.total, 0)
    });
  };

  const finalizarNota = async () => {
    if (!notaAtual) return;
    
    setIsSaving(true);
    
    try {
      // Salvar no localStorage
      const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
      const bancoNotas = notasSalvas ? JSON.parse(notasSalvas) : [];
      localStorage.setItem('banco_notas_hortifruti', JSON.stringify([notaAtual, ...bancoNotas]));
      
      // Salvar no Supabase se conectado
      if (supabaseStatus === 'connected') {
        await salvarNotaFiscal(notaAtual);
        console.log('✅ Nota salva no Supabase');
        showToast('Nota salva com sucesso no banco de dados!', 'success');
      } else {
        showToast('Nota salva apenas no navegador', 'info');
      }
      
      setNotaAtual(null);
      localStorage.removeItem('nota_atual_hortifruti');
      router.push('/dashboard/notas');
    } catch (error) {
      console.error('❌ Erro ao salvar nota:', error);
      showToast('Erro ao salvar nota, tente novamente', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelarNota = () => {
    if (confirm("Cancelar conferência? Todos os dados serão perdidos.")) {
      setNotaAtual(null);
      localStorage.removeItem('nota_atual_hortifruti');
      showToast('Conferência cancelada', 'info');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* CABEÇALHO COMPACTO COM UPLOAD */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Package size={16} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Nova Conferência</h1>
            <p className="text-[11px] text-slate-500">Lançar pesos e valores</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status Supabase */}
          {supabaseStatus === 'connected' && (
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
              <Database size={12} className="text-emerald-600" />
              <span className="text-[10px] text-emerald-700 font-medium">Cloud</span>
            </div>
          )}
          <UploadPDFButton onDataExtracted={handlePDFDataExtracted} />
        </div>
      </div>

      {/* INDICADOR DE PREÇOS CARREGADOS */}
      {precosCeasa.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="text-xs text-emerald-700 font-medium">
              {precosCeasa.length} preços da CEASA carregados para {formDataTabela}
              {supabaseStatus === 'connected' && ' (sync com nuvem)'}
            </span>
          </div>
          <button 
            onClick={() => setPrecosCeasa([])}
            className="text-xs text-emerald-600 hover:text-emerald-800"
          >
            Limpar
          </button>
        </div>
      )}

      {!notaAtual ? (
        <>
          {/* PASSO 1: DADOS GERAIS */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white text-[10px] font-bold">1</div>
                <span className="text-sm font-semibold text-slate-700">Setup da Conferência</span>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empresa</label>
                <input 
                  type="text" 
                  value={formEmpresa} 
                  onChange={(e) => setFormEmpresa(e.target.value.toUpperCase())} 
                  placeholder="Nome da empresa" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empenho / NF</label>
                <input 
                  type="text" 
                  value={formEmpenho} 
                  onChange={(e) => setFormEmpenho(e.target.value.toUpperCase())} 
                  placeholder="Número da NF" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Tabela Ceasa</label>
                <input 
                  type="date" 
                  value={(() => {
                    if (!formDataTabela) return '';
                    const partes = formDataTabela.split('/');
                    if (partes.length === 3) return `${partes[2]}-${partes[1]}-${partes[0]}`;
                    return '';
                  })()}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [ano, mes, dia] = e.target.value.split('-');
                      const dataUTC = new Date(Date.UTC(parseInt(ano), parseInt(mes) - 1, parseInt(dia)));
                      setFormDataTabela(formatarDataBrasil(dataUTC));
                    }
                  }}
                  className="w-full bg-emerald-50/30 border border-emerald-200 rounded-lg px-3 py-2 text-sm text-emerald-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* PASSO 2: PRODUTOS */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-600 rounded flex items-center justify-center text-white text-[10px] font-bold">2</div>
                <span className="text-sm font-semibold text-slate-700">Montar Carga Ceasa</span>
              </div>
            </div>

            <div className="p-4">
              <form onSubmit={handleAddSetupCeasa} className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Categoria</label>
                  <PremiumSelect
                    value={setupCategoria}
                    onChange={setSetupCategoria}
                    options={categoriasDisponiveis.map(cat => ({ value: cat, label: cat }))}
                    placeholder="Selecione..."
                    icon={<Tag size={12} />}
                  />
                </div>
                
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo</label>
                  <PremiumSelect
                    value={setupProdutoId}
                    onChange={setSetupProdutoId}
                    options={subtiposDisponiveis}
                    placeholder={setupCategoria ? "Selecione..." : "Escolha categoria"}
                    icon={<Box size={12} />}
                    disabled={!setupCategoria}
                  />
                </div>
                
                <div className="w-[120px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Peso (KG)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={setupKgCaixa} 
                      onChange={(e) => setSetupKgCaixa(e.target.value)} 
                      placeholder="0,00" 
                      className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-800 font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                        resetEffect ? 'bg-amber-50 border-amber-400' : 'border-slate-200'
                      }`}
                    />
                    <Weight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                
                <div className="w-[140px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input 
                      type="text" 
                      value={setupValorCaixa} 
                      onChange={(e) => setSetupValorCaixa(e.target.value)} 
                      placeholder="0,00" 
                      className={`w-full bg-white border rounded-lg pl-7 pr-3 py-2 text-sm text-slate-800 font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                        resetEffect ? 'bg-amber-50 border-amber-400' : 'border-slate-200'
                      }`}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5 text-sm h-[38px]"
                >
                  <Plus size={14} /> Adicionar
                </button>
              </form>

              {itensCeasa.length > 0 && (
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-xs text-slate-600">Resumo da Carga</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{itensCeasa.length} itens</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase">Produto</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase text-center">Ref.</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-emerald-600 uppercase text-right">Preço Final</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase text-center w-10">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {itensCeasa.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2 font-semibold text-slate-700 text-xs">{item.produtoNome}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-medium">{item.kgCaixa}kg</span>
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-emerald-600 text-sm">{formatarMoeda(item.precoUnitarioComDesconto)}</td>
                            <td className="px-3 py-2 text-center">
                              <button 
                                onClick={() => removerItemSetup(item.id)} 
                                className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button 
                onClick={iniciarDigitacaoDaNota} 
                disabled={itensCeasa.length === 0 || !formEmpresa || !formEmpenho} 
                className={`mt-4 w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  itensCeasa.length === 0 || !formEmpresa || !formEmpenho 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <ArrowRight size={14} />
                {itensCeasa.length === 0 || !formEmpresa || !formEmpenho ? 'Preencha todos os dados' : 'Iniciar Lançamento'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">Digitação Ativa</span>
                <span className="text-slate-400 text-[10px]">Tabela: {notaAtual.dataTabelaCeasa}</span>
              </div>
              <h2 className="text-lg font-bold text-white">{notaAtual.empresa}</h2>
              <p className="text-emerald-400 text-xs">NF: {notaAtual.empenho}</p>
            </div>
            
            <div className="flex gap-2 relative z-10">
              <button onClick={cancelarNota} className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-1.5 rounded-lg transition-colors text-sm">
                Cancelar
              </button>
              <button 
                onClick={finalizarNota} 
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900 font-bold px-5 py-1.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase">Produto</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center">Ref.</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center">Desc</th>
                    <th className="p-3 text-[10px] font-bold text-emerald-600 uppercase text-right">Preço</th>
                    <th className="p-3 text-[10px] font-bold text-white bg-emerald-500 uppercase text-center">Peso (KG)</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notaAtual.itens.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="p-3 font-semibold text-slate-700 text-xs">{item.produtoNome}</td>
                      <td className="p-3 text-center text-slate-500 text-xs">{item.kgCaixa}kg</td>
                      <td className="p-3 text-center font-bold text-rose-500 bg-rose-50/50 text-xs">-{item.desconto}%</td>
                      <td className="p-3 text-right font-bold text-slate-700 text-sm">{formatarMoeda(item.precoUnitarioComDesconto)}</td>
                      <td className="p-2 bg-emerald-50/50">
                        <input 
                          type="text" 
                          value={item.quantidadeStr} 
                          onChange={(e) => handleQuantidadeChange(item.id, e.target.value)} 
                          placeholder="0,00" 
                          className="w-24 text-center font-bold text-base text-emerald-900 border-2 border-emerald-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white" 
                        />
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600">{formatarMoeda(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-800 p-4 flex flex-col md:flex-row justify-between items-center gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
              <div className="relative z-10">
                <span className="text-slate-400 uppercase font-bold tracking-wider text-[9px]">Total a Pagar</span>
              </div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 relative z-10">
                {formatarMoeda(notaAtual.totalGeral)}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}