'use client';

import { useState, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ==================== SUPER BANCO DE DADOS (BASEADO NO PDF DA CEASA) ====================
const PRODUTOS_CONTRATO = [
  // === ABACATE ===
  { id: 101, codigo: 0, categoria: 'ABACATE', nome: 'AVOCADO', desconto: 10.00 },
  { id: 102, codigo: 0, categoria: 'ABACATE', nome: 'FORTUNA', desconto: 10.00 },
  { id: 103, codigo: 0, categoria: 'ABACATE', nome: 'MANTEIGA', desconto: 10.00 },
  { id: 104, codigo: 0, categoria: 'ABACATE', nome: 'MARGARIDA', desconto: 10.00 },

  // === ABACAXI ===
  { id: 25, codigo: 1107, categoria: 'ABACAXI', nome: 'HAVAI', desconto: 14.80 },
  { id: 26, codigo: 251658, categoria: 'ABACAXI', nome: 'PÉROLA', desconto: 18.10 },

  // === ABÓBORA ===
  { id: 2, codigo: 357, categoria: 'ABÓBORA', nome: 'KABOTIÁ / HOKAIDO', desconto: 8.80 },
  { id: 3, codigo: 90539, categoria: 'ABÓBORA', nome: 'MORANGA', desconto: 10.30 },
  { id: 4, codigo: 359, categoria: 'ABÓBORA', nome: 'PAULISTA / MENINA', desconto: 10.50 },
  { id: 105, codigo: 0, categoria: 'ABÓBORA', nome: 'SECA / PESCOÇO', desconto: 10.50 },

  // === ABOBRINHA ===
  { id: 5, codigo: 111964, categoria: 'ABOBRINHA', nome: 'MENINA', desconto: 10.30 },
  { id: 106, codigo: 0, categoria: 'ABOBRINHA', nome: 'BRANCA', desconto: 10.30 },
  { id: 107, codigo: 0, categoria: 'ABOBRINHA', nome: 'VERDE', desconto: 10.30 },

  // === ALHO / CEBOLA / TUBÉRCULOS ===
  { id: 108, codigo: 0, categoria: 'ALHO', nome: 'ROXO NACIONAL', desconto: 5.00 },
  { id: 109, codigo: 0, categoria: 'ALHO', nome: 'ROXO IMPORTADO', desconto: 5.00 },
  { id: 110, codigo: 0, categoria: 'CEBOLA', nome: 'COMUM / BRANCA', desconto: 10.00 },
  { id: 111, codigo: 0, categoria: 'CEBOLA', nome: 'ROXA', desconto: 10.00 },
  { id: 112, codigo: 0, categoria: 'CENOURA', nome: 'COMUM', desconto: 10.00 },
  { id: 31, codigo: 371, categoria: 'BETERRABA', nome: 'EXTRA', desconto: 10.20 },
  
  // === BATATAS ===
  { id: 113, codigo: 0, categoria: 'BATATA', nome: 'COMUM', desconto: 10.00 },
  { id: 114, codigo: 0, categoria: 'BATATA', nome: 'CASCA ROSADA', desconto: 10.00 },
  { id: 115, codigo: 0, categoria: 'BATATA DOCE', nome: 'BRANCA', desconto: 10.00 },
  { id: 116, codigo: 0, categoria: 'BATATA DOCE', nome: 'ROXA', desconto: 10.00 },
  { id: 117, codigo: 0, categoria: 'BATATA SALSA (MANDIOQUINHA)', nome: 'PRIMEIRA', desconto: 10.00 },

  // === BANANA ===
  { id: 1, codigo: 364, categoria: 'BANANA', nome: 'MAÇÃ', desconto: 2.20 },
  { id: 118, codigo: 0, categoria: 'BANANA', nome: 'CATURRA', desconto: 2.20 },
  { id: 119, codigo: 0, categoria: 'BANANA', nome: 'PRATA', desconto: 2.20 },
  { id: 120, codigo: 0, categoria: 'BANANA', nome: 'TERRA', desconto: 2.20 },

  // === FOLHAS / VERDURAS ===
  { id: 27, codigo: 361, categoria: 'AGRIÃO', nome: 'MAÇO', desconto: 3.30 },
  { id: 28, codigo: 236941, categoria: 'ALFACE', nome: 'AMERICANA', desconto: 3.20 },
  { id: 29, codigo: 362, categoria: 'ALFACE', nome: 'CRESPA', desconto: 3.20 },
  { id: 121, codigo: 0, categoria: 'ALFACE', nome: 'LISA', desconto: 3.20 },
  { id: 6, codigo: 272822, categoria: 'COENTRO', nome: 'MAÇO', desconto: 2.70 },
  { id: 7, codigo: 379, categoria: 'COUVE FLOR', nome: 'UNIDADE', desconto: 2.70 },
  { id: 122, codigo: 0, categoria: 'COUVE MANTEIGA', nome: 'MAÇO', desconto: 3.00 },
  { id: 37, codigo: 413, categoria: 'RÚCULA', nome: 'MAÇO', desconto: 8.60 },
  { id: 123, codigo: 0, categoria: 'CEBOLINHA', nome: 'MAÇO', desconto: 3.00 },

  // === LARANJA E LIMÃO ===
  { id: 124, codigo: 0, categoria: 'LARANJA', nome: 'BAHIA', desconto: 10.00 },
  { id: 125, codigo: 0, categoria: 'LARANJA', nome: 'LIMA', desconto: 10.00 },
  { id: 126, codigo: 0, categoria: 'LARANJA', nome: 'PERA', desconto: 10.00 },
  { id: 127, codigo: 0, categoria: 'LIMÃO', nome: 'TAHITI', desconto: 10.00 },
  { id: 128, codigo: 0, categoria: 'LIMÃO', nome: 'ROSA', desconto: 10.00 },
  { id: 129, codigo: 0, categoria: 'LIMÃO', nome: 'SICILIANO', desconto: 10.00 },

  // === MAÇÃ ===
  { id: 130, codigo: 0, categoria: 'MAÇÃ', nome: 'GALA', desconto: 10.00 },
  { id: 131, codigo: 0, categoria: 'MAÇÃ', nome: 'FUJI', desconto: 10.00 },
  { id: 132, codigo: 0, categoria: 'MAÇÃ', nome: 'EVA', desconto: 10.00 },
  { id: 133, codigo: 0, categoria: 'MAÇÃ', nome: 'GRANNY SMITH (VERDE)', desconto: 10.00 },

  // === MAMÃO ===
  { id: 33, codigo: 203412, categoria: 'MAMÃO', nome: 'HAVAI / PAPAYA', desconto: 10.10 },
  { id: 134, codigo: 0, categoria: 'MAMÃO', nome: 'FORMOSA', desconto: 10.10 },

  // === MANGA ===
  { id: 12, codigo: 90548, categoria: 'MANGA', nome: 'TOMMY', desconto: 16.65 },
  { id: 135, codigo: 0, categoria: 'MANGA', nome: 'PALMER', desconto: 16.65 },

  // === MARACUJÁ ===
  { id: 13, codigo: 6602, categoria: 'MARACUJÁ', nome: 'AZEDO', desconto: 10.10 },
  { id: 136, codigo: 0, categoria: 'MARACUJÁ', nome: 'DOCE', desconto: 10.10 },

  // === MELÃO E MELANCIA ===
  { id: 14, codigo: 1046, categoria: 'MELANCIA', nome: 'REDONDA / COMPRIDA', desconto: 19.10 },
  { id: 137, codigo: 0, categoria: 'MELANCIA', nome: 'BABY', desconto: 19.10 },
  { id: 138, codigo: 0, categoria: 'MELÃO', nome: 'AMARELO', desconto: 10.00 },
  { id: 139, codigo: 0, categoria: 'MELÃO', nome: 'PELE DE SAPO', desconto: 10.00 },

  // === PEPINO ===
  { id: 17, codigo: 203414, categoria: 'PEPINO', nome: 'AODAI / SALADA', desconto: 10.10 },
  { id: 18, codigo: 1637, categoria: 'PEPINO', nome: 'JAPONÊS', desconto: 10.10 },

  // === PIMENTÃO ===
  { id: 20, codigo: 111965, categoria: 'PIMENTÃO', nome: 'AMARELO', desconto: 10.10 },
  { id: 21, codigo: 3693, categoria: 'PIMENTÃO', nome: 'VERDE', desconto: 9.10 },
  { id: 22, codigo: 111966, categoria: 'PIMENTÃO', nome: 'VERMELHO', desconto: 9.10 },

  // === REPOLHO ===
  { id: 35, codigo: 98800, categoria: 'REPOLHO', nome: 'VERDE', desconto: 10.00 },
  { id: 36, codigo: 90933, categoria: 'REPOLHO', nome: 'ROXO', desconto: 10.00 },

  // === TOMATE ===
  { id: 38, codigo: 416, categoria: 'TOMATE', nome: 'LONGA VIDA', desconto: 15.00 },
  { id: 140, codigo: 0, categoria: 'TOMATE', nome: 'CEREJA', desconto: 15.00 },
  { id: 141, codigo: 0, categoria: 'TOMATE', nome: 'SALADETE', desconto: 15.00 },

  // === DIVERSOS (OUTROS) ===
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

const SENHA_SISTEMA = 'caps3maringa';

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

// ==================== ESTILOS PDF PREMIUM ====================
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerInstitucional: { marginBottom: 25, borderBottomWidth: 2, borderBottomColor: '#166534', paddingBottom: 15 },
  prefeituraLabel: { fontSize: 9, color: '#6b7280', letterSpacing: 1, marginBottom: 4 },
  tituloPrincipal: { fontSize: 24, fontWeight: 'bold', color: '#166534', marginBottom: 4 },
  subtitulo: { fontSize: 10, color: '#6b7280' },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, padding: 15, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  infoCard: { flex: 1 },
  infoLabel: { fontSize: 8, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
  infoValue: { fontSize: 12, fontWeight: 'bold', color: '#1e293b' },
  protocoloBox: { marginBottom: 25, padding: 10, backgroundColor: '#f0fdf4', borderRadius: 6, borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center' },
  protocoloLabel: { fontSize: 8, color: '#166534', textTransform: 'uppercase', fontWeight: 'bold' },
  protocoloValue: { fontSize: 14, fontWeight: 'bold', color: '#166534', fontFamily: 'Helvetica-Bold' },
  tabelaInfoBox: { marginBottom: 20, padding: 8, backgroundColor: '#fef3c7', borderRadius: 6, borderWidth: 1, borderColor: '#fde68a', alignItems: 'center' },
  tabelaInfoText: { fontSize: 9, color: '#92400e' },
  tabelaInfoBold: { fontSize: 9, fontWeight: 'bold', color: '#92400e' },
  table: { marginTop: 10, marginBottom: 25 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#166534', paddingVertical: 10, paddingHorizontal: 8, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  tableHeaderText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tableRowAlt: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  colProduto: { width: '22%' },
  colKg: { width: '8%', textAlign: 'center' },
  colValorCx: { width: '10%', textAlign: 'right' },
  colPrecoBase: { width: '10%', textAlign: 'right' },
  colDesconto: { width: '8%', textAlign: 'center' },
  colPrecoFinal: { width: '10%', textAlign: 'right' },
  colQuantidade: { width: '10%', textAlign: 'center' },
  colTotalSemDesc: { width: '10%', textAlign: 'right' },
  colTotal: { width: '12%', textAlign: 'right' },
  totalBox: { marginTop: 20, padding: 20, backgroundColor: '#166534', borderRadius: 10, alignItems: 'flex-end' },
  totalLabel: { color: '#bbf7d0', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb', alignItems: 'center' },
  footerText: { fontSize: 8, color: '#9ca3af', marginBottom: 2 },
  footerProtocolo: { fontSize: 8, color: '#166534', fontWeight: 'bold', marginTop: 4 },
});

// ==================== COMPONENTE PDF PREMIUM ====================
const NotaFiscalPDF = ({ nota }: { nota: NotaFiscal }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      
      <View style={pdfStyles.headerInstitucional}>
        <Text style={pdfStyles.prefeituraLabel}>PREFEITURA DE MARINGÁ • SECRETARIA DE SAÚDE</Text>
        <Text style={pdfStyles.tituloPrincipal}>NOTA DE CONFERÊNCIA</Text>
        <Text style={pdfStyles.subtitulo}>Sistema Oficial de Conferência de Hortifrúti - CAPS 3</Text>
      </View>

      <View style={pdfStyles.infoGrid}>
        <View style={pdfStyles.infoCard}>
          <Text style={pdfStyles.infoLabel}>Empresa Fornecedora</Text>
          <Text style={pdfStyles.infoValue}>{nota.empresa}</Text>
        </View>
        <View style={pdfStyles.infoCard}>
          <Text style={pdfStyles.infoLabel}>Empenho / Nota Fiscal</Text>
          <Text style={pdfStyles.infoValue}>{nota.empenho}</Text>
        </View>
        <View style={pdfStyles.infoCard}>
          <Text style={pdfStyles.infoLabel}>Data da Conferência</Text>
          <Text style={pdfStyles.infoValue}>{nota.data}</Text>
        </View>
      </View>

      <View style={pdfStyles.tabelaInfoBox}>
        <Text style={pdfStyles.tabelaInfoText}>
          📊 Tabela de Preços Ceasa utilizada nesta conferência:{' '}
          <Text style={pdfStyles.tabelaInfoBold}>{nota.dataTabelaCeasa}</Text>
        </Text>
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

// ==================== COMPONENTE TOAST ====================
const Toast = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => {
  const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${colors[type as keyof typeof colors]} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in`}>
      {message}
    </div>
  );
};

// ==================== COMPONENTE MODAL PDF ====================
const PDFModal = ({ nota, onClose }: { nota: NotaFiscal | null; onClose: () => void }) => {
  if (!nota) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Visualizar Nota Fiscal</h2>
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl transition">Fechar</button>
        </div>
        <div className="flex-1">
          <PDFViewer width="100%" height="100%"><NotaFiscalPDF nota={nota} /></PDFViewer>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [bancoNotas, setBancoNotas] = useState<NotaFiscal[]>([]);
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
  
  // Novos Estados para Categoria e Subtipo
  const [setupCategoria, setSetupCategoria] = useState('');
  const [setupProdutoId, setSetupProdutoId] = useState('');
  
  const [setupKgCaixa, setSetupKgCaixa] = useState('');
  const [setupValorCaixa, setSetupValorCaixa] = useState('');
  
  const [notaParaVisualizar, setNotaParaVisualizar] = useState<NotaFiscal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Listas ordenadas alfabeticamente
  const categoriasDisponiveis = Array.from(new Set(PRODUTOS_CONTRATO.map(p => p.categoria))).sort();
  const subtiposDisponiveis = PRODUTOS_CONTRATO.filter(p => p.categoria === setupCategoria).sort((a, b) => a.nome.localeCompare(b.nome));

  useEffect(() => {
    const authStatus = localStorage.getItem('auth_hortifruti');
    if (authStatus === 'true') setIsAuthenticated(true);
    const notasSalvas = localStorage.getItem('banco_notas_hortifruti');
    if (notasSalvas) setBancoNotas(JSON.parse(notasSalvas));
    const notaEmAndamento = localStorage.getItem('nota_atual_hortifruti');
    if (notaEmAndamento) setNotaAtual(JSON.parse(notaEmAndamento));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('banco_notas_hortifruti', JSON.stringify(bancoNotas));
      localStorage.setItem('nota_atual_hortifruti', JSON.stringify(notaAtual));
    }
  }, [bancoNotas, notaAtual, isLoaded]);

  const showToast = (message: string, type: string) => setToast({ message, type });

  const handleAddSetupCeasa = (e: React.FormEvent) => {
    e.preventDefault();
    const produto = PRODUTOS_CONTRATO.find(p => p.id.toString() === setupProdutoId);
    const kg = parseFloat(setupKgCaixa.replace(',', '.'));
    const valor = parseFloat(setupValorCaixa.replace(',', '.'));

    if (!produto || !kg || !valor) {
      showToast('Preencha todos os campos corretamente', 'error');
      return;
    }

    const precoSemDesconto = valor / kg;
    const precoFinalArredondado = calcularPrecoComDesconto(precoSemDesconto, produto.desconto);

    // Concatena Categoria + Nome para exibição clara
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
    showToast('Item removido', 'info');
  };

  const iniciarDigitacaoDaNota = () => {
    if (!formEmpresa || !formEmpenho || itensCeasa.length === 0) {
      showToast('Preencha Empresa, Empenho e adicione pelo menos 1 item!', 'error');
      return;
    }
    if (!formDataTabela) {
      showToast('Selecione a data da tabela Ceasa utilizada!', 'error');
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
    
    const hoje = new Date();
    setFormDataTabela(`${hoje.getUTCDate().toString().padStart(2, '0')}/${(hoje.getUTCMonth() + 1).toString().padStart(2, '0')}/${hoje.getUTCFullYear()}`);
    setItensCeasa([]);
    showToast(`Nota criada! Tabela Ceasa de ${formDataTabela}`, 'success');
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
    setBancoNotas([notaAtual, ...bancoNotas]);
    setNotaAtual(null);
    showToast('Nota finalizada com sucesso!', 'success');
  };

  const excluirNotaBanco = (id: string) => {
    if (confirm('Tem certeza que deseja apagar esta nota?')) {
      setBancoNotas(bancoNotas.filter(nota => nota.id !== id));
      showToast('Nota excluída', 'info');
    }
  };

  const cancelarNota = () => {
    setNotaAtual(null);
    showToast('Digitação cancelada', 'info');
  };

  if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl text-white">🍎</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CAPS 3</h1>
            <p className="text-gray-500 text-sm">Sistema de Conferência de Hortifrúti</p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === SENHA_SISTEMA) {
              localStorage.setItem('auth_hortifruti', 'true');
              setIsAuthenticated(true);
              showToast('Login realizado!', 'success');
            } else {
              setError('Senha incorreta.');
              showToast('Senha incorreta', 'error');
            }
          }} className="space-y-5">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-all" placeholder="Digite a senha..." autoFocus />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-green-900 to-green-700 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"><span className="text-xl font-bold">CAPS</span></div>
              <div><h1 className="text-xl font-bold">Conferência de Notas</h1><p className="text-sm text-green-200">Prefeitura de Maringá - CAPS 3</p></div>
            </div>
            <button onClick={() => { localStorage.removeItem('auth_hortifruti'); setIsAuthenticated(false); }} className="bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg transition-all">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {!notaAtual ? (
          <>
            {/* Tela de Setup */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                  <div><h2 className="text-xl font-bold text-green-800">Criar Nova Conferência</h2><p className="text-sm text-gray-600">Preencha os dados da nota e adicione os produtos</p></div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Empresa</label>
                    <input type="text" value={formEmpresa} onChange={(e) => setFormEmpresa(e.target.value.toUpperCase())} placeholder="Ex: HORTIBRAS LTDA" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Número do Empenho / Nota</label>
                    <input type="text" value={formEmpenho} onChange={(e) => setFormEmpenho(e.target.value.toUpperCase())} placeholder="Ex: 1234/2026" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📅 Data da Tabela Ceasa</label>
                    <input type="date" value={(() => {
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
                      className="w-full border-2 border-amber-300 bg-amber-50 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <form onSubmit={handleAddSetupCeasa} className="bg-gray-50 rounded-xl p-5 border-2 border-dashed border-gray-200">
                  <h3 className="font-bold text-gray-700 mb-4">➕ Adicionar Produto do Ceasa</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <select
                        value={setupCategoria}
                        onChange={(e) => {
                          setSetupCategoria(e.target.value);
                          setSetupProdutoId('');
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-green-500 bg-white font-medium uppercase"
                      >
                        <option value="">1. Selecione a Categoria (Ex: BANANA)...</option>
                        {categoriasDisponiveis.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={setupProdutoId}
                        onChange={(e) => setSetupProdutoId(e.target.value)}
                        disabled={!setupCategoria}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-green-500 bg-white font-medium disabled:bg-gray-100 disabled:text-gray-400 uppercase"
                      >
                        <option value="">2. Selecione o Tipo (Ex: CATURRA)...</option>
                        {subtiposDisponiveis.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nome} (Desconto de {p.desconto}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input type="text" value={setupKgCaixa} onChange={(e) => setSetupKgCaixa(e.target.value)} placeholder="Peso Total da Embalagem/Caixa (Ex: 20)" className="w-full border border-gray-300 rounded-lg px-3 py-3" />
                    </div>
                    <div>
                      <input type="text" value={setupValorCaixa} onChange={(e) => setSetupValorCaixa(e.target.value)} placeholder="Valor da Caixa no Ceasa (R$)" className="w-full border border-gray-300 rounded-lg px-3 py-3" />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button type="submit" className="w-full md:w-auto bg-gray-800 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-all">
                      + Adicionar à Lista
                    </button>
                  </div>
                </form>

                {itensCeasa.length > 0 && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-amber-50 p-2 text-center border-b border-amber-200">
                      <span className="text-sm text-amber-700">📊 Produtos baseados na tabela Ceasa de {formDataTabela}</span>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3">Produto - Tipo</th>
                          <th className="p-3 text-center">Caixa/Embalagem</th>
                          <th className="p-3 text-right">Preço Final/kg</th>
                          <th className="p-3 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensCeasa.map(item => (
                          <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-800">{item.produtoNome}</td>
                            <td className="p-3 text-center text-gray-500">{item.kgCaixa}kg / {formatarMoeda(item.valorCaixa)}</td>
                            <td className="p-3 text-right font-bold text-green-700">{formatarMoeda(item.precoUnitarioComDesconto)}/kg</td>
                            <td className="p-3 text-center"><button onClick={() => removerItemSetup(item.id)} className="text-red-500 hover:text-red-700">Remover</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  onClick={iniciarDigitacaoDaNota} disabled={itensCeasa.length === 0 || !formEmpresa || !formEmpenho}
                  className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all ${itensCeasa.length === 0 || !formEmpresa || !formEmpenho ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 text-white shadow-lg hover:shadow-xl'}`}
                >
                  🚀 Iniciar Digitação das Quantidades (Tabela: {formDataTabela})
                </button>
              </div>
            </div>

            {/* Lista de Notas Finalizadas */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">📂</div>
                  <div><h2 className="text-xl font-bold text-gray-800">Notas Finalizadas</h2><p className="text-sm text-gray-500">Histórico de conferências realizadas</p></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr><th className="p-4">Empresa</th><th className="p-4">Empenho</th><th className="p-4">Data Conf.</th><th className="p-4">Tabela Ceasa</th><th className="p-4 text-right">Valor Total</th><th className="p-4 text-center">Ações</th></tr>
                  </thead>
                  <tbody>
                    {bancoNotas.map(nota => (
                      <tr key={nota.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-bold">{nota.empresa}</td><td className="p-4 text-gray-600">{nota.empenho}</td><td className="p-4 text-gray-500 text-sm">{nota.data}</td>
                        <td className="p-4"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">📅 {nota.dataTabelaCeasa}</span></td>
                        <td className="p-4 text-right font-bold text-green-700">{formatarMoeda(nota.totalGeral)}</td>
                        <td className="p-4 text-center space-x-2">
                          <button onClick={() => setNotaParaVisualizar(nota)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">👁️ Visualizar</button>
                          <button onClick={() => excluirNotaBanco(nota.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg">Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Tela de Digitação */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-xs text-green-400 uppercase">Passo 2: Digitação e Conferência</p>
                  <h2 className="text-2xl font-bold">{notaAtual.empresa}<span className="text-gray-400 font-normal ml-3 text-lg">| Empenho: {notaAtual.empenho}</span></h2>
                  <p className="text-xs text-amber-300 mt-1">📊 Tabela Ceasa utilizada: {notaAtual.dataTabelaCeasa}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={cancelarNota} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl">Cancelar</button>
                  <button onClick={finalizarNota} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg">💾 Salvar e Finalizar</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[1200px]">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4 text-center">KG/Cx</th>
                        <th className="p-4 text-right">Valor Cx</th>
                        <th className="p-4 text-right">Preço Base</th>
                        <th className="p-4 text-center">Desc.</th>
                        <th className="p-4 text-right">Preço Final</th>
                        <th className="p-4 text-center bg-green-50 text-green-800">Qtd. Entregue (KG)</th>
                        <th className="p-4 text-right">Total S/Desc</th>
                        <th className="p-4 text-right text-green-700">Total Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notaAtual.itens.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-bold">{item.produtoNome}</td>
                          <td className="p-4 text-center text-gray-500">{item.kgCaixa} kg</td>
                          <td className="p-4 text-right text-gray-500">{formatarMoeda(item.valorCaixa)}</td>
                          <td className="p-4 text-right text-gray-400">{formatarMoeda(item.precoUnitarioSemDesconto)}</td>
                          <td className="p-4 text-center text-red-500">-{item.desconto}%</td>
                          <td className="p-4 text-right font-bold">{formatarMoeda(item.precoUnitarioComDesconto)}</td>
                          <td className="p-4 bg-green-50/50">
                            <input type="text" value={item.quantidadeStr} onChange={(e) => handleQuantidadeChange(item.id, e.target.value)} placeholder="0,00" className="w-full text-center font-bold text-lg border-2 border-green-400 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                          </td>
                          <td className="p-4 text-right text-gray-400 line-through">{formatarMoeda(item.totalSemDesconto)}</td>
                          <td className="p-4 text-right font-bold text-green-700 text-lg">{formatarMoeda(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center border-t-2 border-gray-200">
                  <span className="text-gray-600 uppercase font-bold">Total Geral a Pagar:</span>
                  <span className="text-4xl font-black text-green-700">{formatarMoeda(notaAtual.totalGeral)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <PDFModal nota={notaParaVisualizar} onClose={() => setNotaParaVisualizar(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}