'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

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

const calcularPrecoComDesconto = (precoUnitario: number, descontoPercentual: number) => {
  const valorDesconto = precoUnitario * (descontoPercentual / 100);
  return Math.round((precoUnitario - valorDesconto) * 100) / 100;
};

// ==================== SELECTOR PERSONALIZADO CORRIGIDO ====================
interface PremiumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; discount?: number }>;
  placeholder: string;
  icon?: string;
  disabled?: boolean;
}

const PremiumSelect = ({ value, onChange, options, placeholder, icon, disabled }: PremiumSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, position: 'bottom' as 'top' | 'bottom' });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Função para calcular a posição do dropdown (com flip automático)
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const viewportHeight = window.innerHeight;
      
      // Calcula espaço disponível abaixo e acima
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 320; // Altura aproximada do dropdown (max-h-64 = 256px + header)
      
      let position: 'top' | 'bottom' = 'bottom';
      let top = rect.bottom + scrollY + 4;
      
      // Se não couber embaixo, abre para cima
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        position = 'top';
        top = rect.top + scrollY - dropdownHeight - 4;
      }
      
      setDropdownPosition({
        top: top,
        left: rect.left + scrollX,
        width: rect.width,
        position: position
      });
    }
  };
  
  // Observadores de scroll e resize
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      // Captura scroll em qualquer container (true = fase de captura)
      const handleScroll = () => {
        requestAnimationFrame(updatePosition);
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isOpen]);
  
  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fecha ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  // Foco no input ao abrir
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
        className={`w-full bg-white border rounded-xl px-4 py-3 text-left transition-all shadow-sm flex items-center justify-between group ${
          disabled 
            ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400' 
            : isOpen 
              ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="text-base flex-shrink-0">{icon}</span>}
          <span className={`font-medium truncate ${selectedOption ? 'text-slate-700' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.discount && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
              -{selectedOption.discount}%
            </span>
          )}
        </div>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produto..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                <span className="text-2xl block mb-1">🔍</span>
                Nenhum produto encontrado
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2.5 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between group ${
                    value === option.value ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="truncate">{option.label}</span>
                    {option.discount && (
                      <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                        -{option.discount}%
                      </span>
                    )}
                  </div>
                  {value === option.value && (
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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

// ==================== COMPONENTE TOAST PREMIUM ====================
const Toast = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => {
  const isSuccess = type === 'success';
  const isInfo = type === 'info';
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  
  return (
    <div className={`fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl border border-white/20 transition-all duration-300 animate-[float_3s_ease-in-out_infinite] ${isSuccess ? 'bg-emerald-600/95' : isInfo ? 'bg-blue-600/95' : 'bg-rose-600/95'} text-white`}>
      <span className="text-xl">{isSuccess ? '✨' : isInfo ? 'ℹ️' : '⚠️'}</span>
      <p className="font-semibold tracking-wide text-sm">{message}</p>
    </div>
  );
};

// ==================== PÁGINA DE CADASTRO ====================
export default function NovaConferenciaPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [notaAtual, setNotaAtual] = useState<NotaFiscal | null>(null);
  
  const [formEmpresa, setFormEmpresa] = useState('');
  const [formEmpenho, setFormEmpenho] = useState('');
  const [formDataTabela, setFormDataTabela] = useState(() => {
    const hoje = new Date();
    const dia = hoje.getUTCDate().toString().padStart(2, '0');
    const mes = (hoje.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  });
  
  const [itensCeasa, setItensCeasa] = useState<ItemNota[]>([]);
  const [setupCategoria, setSetupCategoria] = useState('');
  const [setupProdutoId, setSetupProdutoId] = useState('');
  const [setupKgCaixa, setSetupKgCaixa] = useState('');
  const [setupValorCaixa, setSetupValorCaixa] = useState('');
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const categoriasDisponiveis = Array.from(new Set(PRODUTOS_CONTRATO.map(p => p.categoria))).sort();
  const subtiposDisponiveis = PRODUTOS_CONTRATO
    .filter(p => p.categoria === setupCategoria)
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(p => ({ value: p.id.toString(), label: p.nome, discount: p.desconto }));

  useEffect(() => {
    const notaEmAndamento = localStorage.getItem('nota_atual_hortifruti');
    if (notaEmAndamento) setNotaAtual(JSON.parse(notaEmAndamento));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (notaAtual) localStorage.setItem('nota_atual_hortifruti', JSON.stringify(notaAtual));
      else localStorage.removeItem('nota_atual_hortifruti');
    }
  }, [notaAtual, isLoaded]);

  const showToast = (message: string, type: string) => setToast({ message, type });

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
    showToast(`${nomeCompleto} adicionado com sucesso!`, 'success');
  };

  const removerItemSetup = (id: string) => {
    setItensCeasa(itensCeasa.filter(i => i.id !== id));
    showToast('Item removido da lista', 'info');
  };

  const iniciarDigitacaoDaNota = () => {
    if (!formEmpresa || !formEmpenho || itensCeasa.length === 0) {
      showToast('Preencha Empresa, Empenho e adicione ao menos 1 item.', 'error');
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
    showToast(`Nota criada com sucesso!`, 'success');
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

  const finalizarNota = () => {
    if (!notaAtual) return;
    const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
    const bancoNotas = notasSalvas ? JSON.parse(notasSalvas) : [];
    
    localStorage.setItem('banco_notas_hortifruti', JSON.stringify([notaAtual, ...bancoNotas]));
    setNotaAtual(null);
    localStorage.removeItem('nota_atual_hortifruti');
    router.push('/dashboard/notas');
  };

  const cancelarNota = () => {
    if (confirm("Deseja realmente cancelar? Todos os dados preenchidos serão perdidos.")) {
      setNotaAtual(null);
      localStorage.removeItem('nota_atual_hortifruti');
      showToast('Conferência cancelada', 'info');
    }
  };

  if (!isLoaded) return <div className="flex items-center justify-center py-20 text-emerald-600 font-bold animate-pulse">Carregando módulo de conferência...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Tipo Fichário com Abas Laterais */}
      <div className="relative">
        {/* Efeito de sombra do fichário */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-200/50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-200/50 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-t-3xl shadow-xl border border-slate-100 overflow-hidden">                       
            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-5px); }
                }
                @keyframes slide-in-left {
                  from { opacity: 0; transform: translateX(-20px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-right {
                  from { opacity: 0; transform: translateX(20px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fade-in {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
                .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
              `}} />

              {!notaAtual ? (
                <>
                  {/* PASSO 1: DADOS GERAIS */}
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-4 border-b border-emerald-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black shadow-md">1</div>
                        <div>
                          <h2 className="font-black text-slate-800 tracking-tight">Setup da Conferência</h2>
                          <p className="text-xs text-slate-500">Dados fiscais e referência Ceasa</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">🏢 Empresa Fornecedora</label>
                        <input 
                          type="text" 
                          value={formEmpresa} 
                          onChange={(e) => setFormEmpresa(e.target.value.toUpperCase())} 
                          placeholder="Digite o nome da empresa" 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-bold placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">📄 Empenho / Número NF</label>
                        <input 
                          type="text" 
                          value={formEmpenho} 
                          onChange={(e) => setFormEmpenho(e.target.value.toUpperCase())} 
                          placeholder="Digite o empenho ou número da NF" 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-bold placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-wider">📅 Data Tabela Ceasa</label>
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
                              setFormDataTabela(`${dataUTC.getUTCDate().toString().padStart(2, '0')}/${(dataUTC.getUTCMonth() + 1).toString().padStart(2, '0')}/${dataUTC.getUTCFullYear()}`);
                            }
                          }}
                          className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PASSO 2: PRODUTOS - Com dropdown corrigido */}
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 overflow-visible shadow-sm">
                    <div className="bg-gradient-to-r from-slate-800/5 to-transparent p-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white font-black shadow-md">2</div>
                        <div>
                          <h2 className="font-black text-slate-800 tracking-tight">Montar Carga Ceasa</h2>
                          <p className="text-xs text-slate-500">Adicione produtos com os valores da cotação</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Formulário Horizontal */}
                      <form onSubmit={handleAddSetupCeasa} className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">📦 Categoria</label>
                          <PremiumSelect
                            value={setupCategoria}
                            onChange={setSetupCategoria}
                            options={categoriasDisponiveis.map(cat => ({ value: cat, label: cat }))}
                            placeholder="Selecione a categoria..."
                            icon="🥬"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">🏷️ Tipo do item</label>
                          <PremiumSelect
                            value={setupProdutoId}
                            onChange={setSetupProdutoId}
                            options={subtiposDisponiveis}
                            placeholder={setupCategoria ? "Selecione o tipo..." : "Escolha a categoria primeiro"}
                            icon="🍎"
                            disabled={!setupCategoria}
                          />
                        </div>
                        
                        <div className="w-[140px]">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">⚖️ Peso Cx (KG)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={setupKgCaixa} 
                              onChange={(e) => setSetupKgCaixa(e.target.value)} 
                              placeholder="0,00" 
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-black text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">KG</span>
                          </div>
                        </div>
                        
                        <div className="w-[160px]">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">💰 Valor Cx (R$)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm">R$</span>
                            <input 
                              type="text" 
                              value={setupValorCaixa} 
                              onChange={(e) => setSetupValorCaixa(e.target.value)} 
                              placeholder="0,00" 
                              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 font-black text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                            />
                          </div>
                        </div>
                        
                        <button 
                          type="submit" 
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 h-[52px]"
                        >
                          <span className="text-xl leading-none">+</span> Adicionar
                        </button>
                      </form>

                      {/* Tabela de Setup */}
                      {itensCeasa.length > 0 && (
                        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden animate-slide-in-right">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-700">📋 Resumo da Carga</span>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">{itensCeasa.length} itens</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="bg-white">
                                <tr>
                                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Produto</th>
                                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Ref.</th>
                                  <th className="px-4 py-3 text-[10px] font-black text-emerald-600 uppercase tracking-wider text-right">Preço Final/Kg</th>
                                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center w-12">Ação</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {itensCeasa.map(item => (
                                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-800 text-sm">{item.produtoNome}</td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{item.kgCaixa}kg / {formatarMoeda(item.valorCaixa)}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-black text-emerald-600">{formatarMoeda(item.precoUnitarioComDesconto)}</td>
                                    <td className="px-4 py-3 text-center">
                                      <button 
                                        onClick={() => removerItemSetup(item.id)} 
                                        className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Botão Start */}
                      <button 
                        onClick={iniciarDigitacaoDaNota} 
                        disabled={itensCeasa.length === 0 || !formEmpresa || !formEmpenho} 
                        className={`mt-6 w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                          itensCeasa.length === 0 || !formEmpresa || !formEmpenho 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                            : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                      >
                        {itensCeasa.length === 0 || !formEmpresa || !formEmpenho ? '🔒 Preencha todos os dados para continuar' : '🚀 Iniciar Lançamento de Pesos'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* TELA DE DIGITAÇÃO DAS QUANTIDADES */
                <div className="space-y-6 animate-slide-in-left">
                  <div className="bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider shadow-md">Digitação Ativa</span>
                        <span className="text-slate-400 text-xs font-medium">Tabela: {notaAtual.dataTabelaCeasa}</span>
                      </div>
                      <h2 className="text-2xl font-black text-white tracking-tight">{notaAtual.empresa}</h2>
                      <p className="text-emerald-400 font-medium text-sm">NF / Empenho: {notaAtual.empenho}</p>
                    </div>
                    
                    <div className="flex gap-2 relative z-10">
                      <button onClick={cancelarNota} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                        Cancelar
                      </button>
                      <button onClick={finalizarNota} className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900 font-black px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        SALVAR
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Produto</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Ref.</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Desc</th>
                            <th className="p-4 text-[10px] font-black text-emerald-600 uppercase tracking-wider text-right">Preço Kg</th>
                            <th className="p-4 text-[10px] font-black text-white bg-emerald-500 uppercase tracking-wider text-center">Peso (KG)</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {notaAtual.itens.map((item) => (
                            <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                              <td className="p-4 font-bold text-slate-800 text-sm">{item.produtoNome}</td>
                              <td className="p-4 text-center text-slate-500 text-xs">{item.kgCaixa}kg / {formatarMoeda(item.valorCaixa)}</td>
                              <td className="p-4 text-center font-bold text-rose-500 bg-rose-50/50 text-xs">-{item.desconto}%</td>
                              <td className="p-4 text-right font-black text-slate-700">{formatarMoeda(item.precoUnitarioComDesconto)}</td>
                              <td className="p-3 bg-emerald-50/50">
                                <input 
                                  type="text" 
                                  value={item.quantidadeStr} 
                                  onChange={(e) => handleQuantidadeChange(item.id, e.target.value)} 
                                  placeholder="0,00" 
                                  className="w-28 text-center font-black text-lg text-emerald-900 border-2 border-emerald-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white shadow-sm" 
                                />
                              </td>
                              <td className="p-4 text-right font-black text-emerald-600">{formatarMoeda(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-slate-900 p-5 flex flex-col md:flex-row justify-between items-center gap-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                      <div className="relative z-10">
                        <span className="text-slate-400 uppercase font-black tracking-wider text-[10px]">Total a Pagar</span>
                      </div>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 relative z-10">
                        {formatarMoeda(notaAtual.totalGeral)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}