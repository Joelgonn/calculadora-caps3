'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Database,
  Pencil,
  Percent,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { salvarPrecosCeasa, buscarPrecosCeasa, salvarNotaFiscal } from '@/lib/supabase/db';

// ==================== BANCO DE DADOS CEASA COMPLETO ====================
const PRODUTOS_CONTRATO = [
  { id: 101, codigo: 0, categoria: 'ABACATE', nome: 'AVOCADO', desconto: null },
  { id: 102, codigo: 0, categoria: 'ABACATE', nome: 'FORTUNA', desconto: null },
  { id: 200, codigo: 0, categoria: 'ABACATE', nome: 'GEADA', desconto: null },
  { id: 103, codigo: 0, categoria: 'ABACATE', nome: 'MANTEIGA', desconto: null },
  { id: 104, codigo: 0, categoria: 'ABACATE', nome: 'MARGARIDA', desconto: null },
  { id: 25, codigo: 1107, categoria: 'ABACAXI', nome: 'HAVAI MEDIO', desconto: 14.80 },
  { id: 26, codigo: 251658, categoria: 'ABACAXI', nome: 'PÉROLA GRAUDO', desconto: 18.10 },
  { id: 201, codigo: 0, categoria: 'ABACAXI', nome: 'PÉROLA MÉDIO', desconto: 18.10 },
  { id: 202, codigo: 0, categoria: 'AMEIXA', nome: 'VERMELHA IMPORTADA', desconto: null },
  { id: 203, codigo: 0, categoria: 'AMEIXA', nome: 'VERMELHA NACIONAL', desconto: null },
  { id: 118, codigo: 0, categoria: 'BANANA', nome: 'CATURRA PRIMEIRA', desconto: 2.20 },
  { id: 1, codigo: 364, categoria: 'BANANA', nome: 'MAÇÃ PRIMEIRA', desconto: 2.20 },
  { id: 119, codigo: 0, categoria: 'BANANA', nome: 'PRATA', desconto: 2.20 },
  { id: 120, codigo: 0, categoria: 'BANANA', nome: 'TERRA', desconto: 2.20 },
  { id: 204, codigo: 0, categoria: 'CAQUI', nome: 'IMPORTADO', desconto: null },
  { id: 205, codigo: 0, categoria: 'CAQUI', nome: 'CHOCOLATE', desconto: null },
  { id: 206, codigo: 0, categoria: 'CAQUI', nome: 'FUYU', desconto: null },
  { id: 207, codigo: 0, categoria: 'COCO', nome: 'SECO', desconto: null },
  { id: 208, codigo: 0, categoria: 'COCO', nome: 'VERDE', desconto: null },
  { id: 209, codigo: 0, categoria: 'KIWI', nome: 'IMPORTADO', desconto: null },
  { id: 124, codigo: 0, categoria: 'LARANJA', nome: 'BAHIA IMPORTADA', desconto: null },
  { id: 210, codigo: 0, categoria: 'LARANJA', nome: 'BAHIA MÉDIA', desconto: null },
  { id: 125, codigo: 0, categoria: 'LARANJA', nome: 'LIMA MÉDIA', desconto: null },
  { id: 126, codigo: 0, categoria: 'LARANJA', nome: 'PERA MEDIA', desconto: null },
  { id: 211, codigo: 0, categoria: 'LIMA PERSIA', nome: 'LIMA PERSIA', desconto: null },
  { id: 128, codigo: 0, categoria: 'LIMAO', nome: 'ROSA', desconto: null },
  { id: 129, codigo: 0, categoria: 'LIMAO', nome: 'SICILIANO IMPORTADO', desconto: null },
  { id: 127, codigo: 0, categoria: 'LIMAO', nome: 'TAHITI GRAUDO', desconto: null },
  { id: 212, codigo: 0, categoria: 'LIMAO', nome: 'TAHITI MEDIO', desconto: null },
  { id: 132, codigo: 0, categoria: 'MAÇÃ', nome: 'EVA PRIMEIRA', desconto: null },
  { id: 131, codigo: 0, categoria: 'MAÇÃ', nome: 'FUJI CAT 1 TP 80 A 100', desconto: null },
  { id: 130, codigo: 0, categoria: 'MAÇÃ', nome: 'GALA CAT 1 TP 80 A 100', desconto: null },
  { id: 133, codigo: 0, categoria: 'MAÇÃ IMPORTADA', nome: 'GRANNY SMITH TP 80 A 100', desconto: null },
  { id: 213, codigo: 0, categoria: 'MAÇÃ IMPORTADA', nome: 'RED DELICIOUS TP80 A 100', desconto: null },
  { id: 134, codigo: 0, categoria: 'MAMÃO', nome: 'FORMOSA MADURO', desconto: 10.10 },
  { id: 33, codigo: 203412, categoria: 'MAMÃO', nome: 'PAPAYA/HAVAI 24', desconto: 10.10 },
  { id: 135, codigo: 0, categoria: 'MANGA', nome: 'PALMER', desconto: 16.65 },
  { id: 12, codigo: 90548, categoria: 'MANGA', nome: 'TOMMY ATKINS', desconto: 16.65 },
  { id: 13, codigo: 6602, categoria: 'MARACUJÁ', nome: 'AZEDO', desconto: 10.10 },
  { id: 136, codigo: 0, categoria: 'MARACUJÁ', nome: 'DOCE MEDIO', desconto: 10.10 },
  { id: 137, codigo: 0, categoria: 'MELANCIA', nome: 'BABY', desconto: 19.10 },
  { id: 14, codigo: 1046, categoria: 'MELANCIA', nome: 'REDONDA', desconto: 19.10 },
  { id: 138, codigo: 0, categoria: 'MELÃO', nome: 'AMARELO REI (5-7 UND.)', desconto: null },
  { id: 214, codigo: 0, categoria: 'MELÃO', nome: 'AMARELO COMUM 08 A 10 UN', desconto: null },
  { id: 215, codigo: 0, categoria: 'MELÃO', nome: 'ORANGE 5 A 6 UN', desconto: null },
  { id: 139, codigo: 0, categoria: 'MELÃO', nome: 'PELE DE SAPO 5-6-8-10 UN', desconto: null },
  { id: 34, codigo: 93945, categoria: 'MORANGO', nome: 'TIPO 1', desconto: 10.20 },
  { id: 216, codigo: 0, categoria: 'NECTARINA', nome: 'IMPORTADA', desconto: null },
  { id: 217, codigo: 0, categoria: 'NECTARINA', nome: 'NACIONAL', desconto: null },
  { id: 218, codigo: 0, categoria: 'PERA IMPORTADA', nome: 'D\'ANJOU TP 80 A 100', desconto: 19.90 },
  { id: 219, codigo: 0, categoria: 'PERA IMPORTADA', nome: 'PACKHAM\'S TP 80 A 100', desconto: 19.90 },
  { id: 220, codigo: 0, categoria: 'PERA IMPORTADA', nome: 'PORTUGUESA', desconto: 19.90 },
  { id: 19, codigo: 268125, categoria: 'PERA IMPORTADA', nome: 'WILLIAMS TP 80 A 100', desconto: 19.90 },
  { id: 221, codigo: 0, categoria: 'PÊRA NACIONAL', nome: 'YARI', desconto: null },
  { id: 222, codigo: 0, categoria: 'PÊSSEGO', nome: 'IMPORTADO', desconto: null },
  { id: 223, codigo: 0, categoria: 'PÊSSEGO', nome: 'NACIONAL', desconto: null },
  { id: 224, codigo: 0, categoria: 'PITAIA', nome: 'C/12UN', desconto: null },
  { id: 225, codigo: 0, categoria: 'TAMARA FRESCA', nome: 'FRESCA', desconto: null },
  { id: 226, codigo: 0, categoria: 'TANGERINA', nome: 'CRAVO', desconto: 10.10 },
  { id: 227, codigo: 0, categoria: 'TANGERINA', nome: 'MONTEN/BERGAM GRANDE', desconto: 10.10 },
  { id: 15, codigo: 221173, categoria: 'TANGERINA', nome: 'MURKOTE MEDIA', desconto: 10.10 },
  { id: 228, codigo: 0, categoria: 'TANGERINA', nome: 'PONKAN MEDIA', desconto: 10.10 },
  { id: 229, codigo: 0, categoria: 'UVA', nome: 'BENITAKE NACIONAL', desconto: null },
  { id: 230, codigo: 0, categoria: 'UVA', nome: 'BRASIL/CENTENIA NACIONAL', desconto: null },
  { id: 231, codigo: 0, categoria: 'UVA', nome: 'CRINSON IMPORTADA', desconto: null },
  { id: 232, codigo: 0, categoria: 'UVA', nome: 'CRINSON NACIONAL', desconto: null },
  { id: 233, codigo: 0, categoria: 'UVA', nome: 'ITALIA NACIONAL', desconto: null },
  { id: 142, codigo: 0, categoria: 'UVA', nome: 'NIAGARA ROSADA', desconto: null },
  { id: 234, codigo: 0, categoria: 'UVA', nome: 'REDGLO IMPORTADA', desconto: null },
  { id: 235, codigo: 0, categoria: 'UVA', nome: 'RUBI NACIONAL', desconto: null },
  { id: 236, codigo: 0, categoria: 'UVA', nome: 'THOMPSON IMPORTADA', desconto: null },
  { id: 237, codigo: 0, categoria: 'UVA', nome: 'THOMPSON NACIONAL', desconto: null },
  { id: 238, codigo: 0, categoria: 'UVA', nome: 'VITÓRIA NACIONAL', desconto: null },
  { id: 239, codigo: 0, categoria: 'AMORA', nome: 'AMORA', desconto: null },
  { id: 240, codigo: 0, categoria: 'ATEMOIA', nome: '15 UNID', desconto: null },
  { id: 241, codigo: 0, categoria: 'CAJU', nome: 'CAJU', desconto: null },
  { id: 242, codigo: 0, categoria: 'CARAMBOLA', nome: 'CARAMBOLA', desconto: null },
  { id: 243, codigo: 0, categoria: 'CASTANHA', nome: 'PARÁ NACIONAL', desconto: null },
  { id: 244, codigo: 0, categoria: 'CEREJA', nome: 'IMPORTADA', desconto: null },
  { id: 245, codigo: 0, categoria: 'FIGO', nome: 'ROXO', desconto: null },
  { id: 246, codigo: 0, categoria: 'FRAMBOESA', nome: 'FRAMBOESA', desconto: null },
  { id: 9, codigo: 89741, categoria: 'GOIABA', nome: 'VERMELHA', desconto: 10.10 },
  { id: 247, codigo: 0, categoria: 'JABUTICABA', nome: 'JABUTICABA', desconto: null },
  { id: 248, codigo: 0, categoria: 'JACA', nome: 'JACA', desconto: null },
  { id: 249, codigo: 0, categoria: 'KINKAN', nome: 'KINKAN', desconto: null },
  { id: 250, codigo: 0, categoria: 'LICHIA', nome: 'LICHIA', desconto: null },
  { id: 251, codigo: 0, categoria: 'MIRTILO', nome: 'MIRTILO', desconto: null },
  { id: 252, codigo: 0, categoria: 'NÊSPERA', nome: 'NÊSPERA', desconto: null },
  { id: 253, codigo: 0, categoria: 'NOZ', nome: 'PECÃ', desconto: null },
  { id: 254, codigo: 0, categoria: 'PHYSALIS', nome: 'VELUVA IMPORTADA', desconto: null },
  { id: 255, codigo: 0, categoria: 'PINHA (FRUTA DO CONDE)', nome: 'PINHA', desconto: null },
  { id: 256, codigo: 0, categoria: 'ROMA', nome: 'ROMA', desconto: null },
  { id: 2, codigo: 357, categoria: 'ABOBORA', nome: 'HOKAIDO/KABOTIA', desconto: 8.80 },
  { id: 4, codigo: 359, categoria: 'ABOBORA', nome: 'MENINA/PAULISTA', desconto: 10.50 },
  { id: 3, codigo: 90539, categoria: 'ABOBORA', nome: 'MORANGA', desconto: 10.30 },
  { id: 105, codigo: 0, categoria: 'ABOBORA', nome: 'SECA/PESCOÇO', desconto: null },
  { id: 106, codigo: 0, categoria: 'ABOBRINHA', nome: 'BRANCA EXTRA A', desconto: 10.30 },
  { id: 257, codigo: 0, categoria: 'ABOBRINHA', nome: 'BRANCA EXTRA AA', desconto: 10.30 },
  { id: 5, codigo: 111964, categoria: 'ABOBRINHA', nome: 'VERDE EXTRA A', desconto: 10.30 },
  { id: 107, codigo: 0, categoria: 'ABOBRINHA', nome: 'VERDE EXTRA AA', desconto: 10.30 },
  { id: 258, codigo: 0, categoria: 'BERINJELA', nome: 'EXTRA A', desconto: 3.20 },
  { id: 30, codigo: 265691, categoria: 'BERINJELA', nome: 'EXTRA AA', desconto: 3.20 },
  { id: 259, codigo: 0, categoria: 'CAXI', nome: 'CAXI', desconto: null },
  { id: 260, codigo: 0, categoria: 'CHUCHU', nome: 'EXTRA A', desconto: null },
  { id: 261, codigo: 0, categoria: 'CHUCHU', nome: 'EXTRA AA', desconto: null },
  { id: 262, codigo: 0, categoria: 'ERVILHA', nome: 'TORTA (PR)', desconto: null },
  { id: 11, codigo: 266834, categoria: 'JILÓ', nome: 'PRIMEIRA', desconto: 7.10 },
  { id: 263, codigo: 0, categoria: 'MAXIXE', nome: 'PRIMEIRA', desconto: null },
  { id: 16, codigo: 400, categoria: 'MILHO', nome: 'VERDE BANDEJA C/4UN', desconto: 10.10 },
  { id: 264, codigo: 0, categoria: 'MILHO', nome: 'VERDE SC C/50 ESPIGAS', desconto: 10.10 },
  { id: 17, codigo: 203414, categoria: 'PEPINO', nome: 'AODAI/SALADA EXTRA A', desconto: 10.10 },
  { id: 265, codigo: 0, categoria: 'PEPINO', nome: 'AODAI/SALADA EXTRA AA', desconto: 10.10 },
  { id: 266, codigo: 0, categoria: 'PEPINO', nome: 'JAPONÊS EXTRA A', desconto: 10.10 },
  { id: 18, codigo: 1637, categoria: 'PEPINO', nome: 'JAPONÊS EXTRA AA', desconto: 10.10 },
  { id: 267, codigo: 0, categoria: 'PIMENTA', nome: 'AMERICANA', desconto: null },
  { id: 268, codigo: 0, categoria: 'PIMENTA', nome: 'CAMBUCI', desconto: null },
  { id: 269, codigo: 0, categoria: 'PIMENTA', nome: 'DEDO DE MOÇA/ARDIDA', desconto: null },
  { id: 20, codigo: 111965, categoria: 'PIMENTAO', nome: 'AMARELO EXTRA AA', desconto: 10.10 },
  { id: 270, codigo: 0, categoria: 'PIMENTAO', nome: 'VERDE EXTRA A', desconto: 9.10 },
  { id: 21, codigo: 3693, categoria: 'PIMENTAO', nome: 'VERDE EXTRA AA', desconto: 9.10 },
  { id: 22, codigo: 111966, categoria: 'PIMENTAO', nome: 'VERMELHO EXTRA AA', desconto: 9.10 },
  { id: 23, codigo: 90537, categoria: 'QUIABO', nome: 'PRIMEIRA', desconto: 9.10 },
  { id: 140, codigo: 0, categoria: 'TOMATE', nome: 'CEREJA BANDEJA', desconto: 15.00 },
  { id: 271, codigo: 0, categoria: 'TOMATE', nome: 'CEREJA EXTRA AA', desconto: 15.00 },
  { id: 38, codigo: 416, categoria: 'TOMATE', nome: 'LONGA VIDA EXTRA AA', desconto: 15.00 },
  { id: 141, codigo: 0, categoria: 'TOMATE', nome: 'SALADETE EXTRA AA', desconto: 15.00 },
  { id: 272, codigo: 0, categoria: 'VAGEM', nome: 'MACARRAO EXTRA A', desconto: 6.70 },
  { id: 24, codigo: 417, categoria: 'VAGEM', nome: 'MACARRAO EXTRA AA', desconto: 6.70 },
  { id: 273, codigo: 0, categoria: 'AIPIM-MANDIOCA', nome: 'PRIMEIRA', desconto: null },
  { id: 274, codigo: 0, categoria: 'AIPIM-MANDIOCA', nome: 'TOLETE', desconto: null },
  { id: 108, codigo: 0, categoria: 'ALHO NACIONAL', nome: 'ROXO TP 6 A 7', desconto: null },
  { id: 109, codigo: 0, categoria: 'ALHO IMPORTADO', nome: 'ROXO TP 6 A 7', desconto: null },
  { id: 114, codigo: 0, categoria: 'BATATA', nome: 'CASCA ROSADA ESPECIAL', desconto: null },
  { id: 113, codigo: 0, categoria: 'BATATA', nome: 'COMUM ESPECIAL', desconto: null },
  { id: 275, codigo: 0, categoria: 'BATATA', nome: 'COMUM PRIMEIRINHA', desconto: null },
  { id: 115, codigo: 0, categoria: 'BATATA DOCE', nome: 'BRANCA EXTRA', desconto: null },
  { id: 116, codigo: 0, categoria: 'BATATA DOCE', nome: 'ROXA EXTRA', desconto: null },
  { id: 276, codigo: 0, categoria: 'BATATA YAKON', nome: 'YAKON', desconto: null },
  { id: 277, codigo: 0, categoria: 'BETERRABA', nome: 'EXTRA A', desconto: 10.20 },
  { id: 31, codigo: 371, categoria: 'BETERRABA', nome: 'EXTRA AA', desconto: 10.20 },
  { id: 32, codigo: 221161, categoria: 'CARA', nome: 'EXTRA A', desconto: 6.20 },
  { id: 110, codigo: 0, categoria: 'CEBOLA', nome: 'BRANCA NACIONAL', desconto: null },
  { id: 278, codigo: 0, categoria: 'CEBOLA', nome: 'PERA NACIONAL', desconto: null },
  { id: 111, codigo: 0, categoria: 'CEBOLA', nome: 'ROXA', desconto: null },
  { id: 279, codigo: 0, categoria: 'CENOURA', nome: 'COMUM EXTRA A', desconto: null },
  { id: 112, codigo: 0, categoria: 'CENOURA', nome: 'COMUM EXTRA AA', desconto: null },
  { id: 8, codigo: 111968, categoria: 'GENGIBRE', nome: 'PRIMEIRA', desconto: 4.10 },
  { id: 280, codigo: 0, categoria: 'GOBO', nome: 'GOBO', desconto: null },
  { id: 10, codigo: 271015, categoria: 'INHAME-TAIÁ', nome: 'PRIMEIRA', desconto: 10.10 },
  { id: 117, codigo: 0, categoria: 'MANDIOQUINHA/BATATA SALSA', nome: 'PRIMEIRA', desconto: null },
  { id: 281, codigo: 0, categoria: 'NABO', nome: 'BRANCO', desconto: null },
  { id: 282, codigo: 0, categoria: 'RABANETE', nome: 'DZ DE MAÇOS', desconto: null },
  { id: 27, codigo: 361, categoria: 'AGRIAO', nome: 'MAÇO', desconto: 3.30 },
  { id: 28, codigo: 236941, categoria: 'ALFACE', nome: 'AMERICANA MÉDIA', desconto: 3.20 },
  { id: 29, codigo: 362, categoria: 'ALFACE', nome: 'CRESPA MEDIO', desconto: 3.20 },
  { id: 283, codigo: 0, categoria: 'ALHO PORO', nome: 'MAÇO 4 UNID', desconto: null },
  { id: 284, codigo: 0, categoria: 'ALMEIRAO', nome: 'PÃO DE ACUCAR MAÇO', desconto: null },
  { id: 285, codigo: 0, categoria: 'ASPARGO', nome: 'ASPARGO', desconto: null },
  { id: 123, codigo: 0, categoria: 'CEBOLINHA', nome: 'CEBOLINHA', desconto: null },
  { id: 6, codigo: 272822, categoria: 'COENTRO', nome: 'MAÇO', desconto: 2.70 },
  { id: 286, codigo: 0, categoria: 'COUVE BROCOLO', nome: 'AMERICANA DUZIA', desconto: null },
  { id: 287, codigo: 0, categoria: 'COUVE CHINESA', nome: 'GRANDE', desconto: null },
  { id: 7, codigo: 379, categoria: 'COUVE FLOR', nome: 'MÉDIA', desconto: 2.70 },
  { id: 122, codigo: 0, categoria: 'COUVE MANTEIGA', nome: 'MAÇO', desconto: null },
  { id: 288, codigo: 0, categoria: 'ESCAROLA/CHICORIA', nome: 'ESCAROLA/CHICORIA', desconto: null },
  { id: 289, codigo: 0, categoria: 'ESPINAFRE', nome: 'ESPINAFRE', desconto: null },
  { id: 290, codigo: 0, categoria: 'HORTELA', nome: 'HORTELA', desconto: null },
  { id: 36, codigo: 90933, categoria: 'REPOLHO', nome: 'ROXO GRANDE/MEDIO', desconto: 10.00 },
  { id: 35, codigo: 98800, categoria: 'REPOLHO', nome: 'VERDE MEDIO', desconto: 10.00 },
  { id: 37, codigo: 413, categoria: 'RUCULA', nome: 'RUCULA', desconto: 8.60 },
  { id: 291, codigo: 0, categoria: 'SALSAO (AIPO)', nome: 'SALSAO (AIPO)', desconto: null },
  { id: 292, codigo: 0, categoria: 'SALSINHA', nome: 'SALSINHA', desconto: null },
  { id: 293, codigo: 0, categoria: 'OVO', nome: 'BRANCO EXTRA', desconto: null },
  { id: 294, codigo: 0, categoria: 'OVO', nome: 'BRANCO MEDIO', desconto: null },
  { id: 295, codigo: 0, categoria: 'OVO', nome: 'CODORNA', desconto: null },
  { id: 296, codigo: 0, categoria: 'OVO', nome: 'VERMELHO EXTRA', desconto: null },
  { id: 297, codigo: 0, categoria: 'AMENDOIM', nome: 'COM CASCA', desconto: null },
];

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
  dataTabelaCeasa: string;
  itens: ItemNota[];
  totalGeral: number;
  statusValidacao?: 'ok' | 'divergente';
}

interface PrecoCeasa {
  categoria: string;
  tipo: string;
  kgEmbalagem: number;
  valorMc: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const formatarMoeda = (valor: any) => {
  const safeValor = Number(valor);
  if (isNaN(safeValor)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(safeValor);
};

const formatarDataBrasil = (date: Date) => {
  try {
    const dia = date.getUTCDate().toString().padStart(2, '0');
    const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = date.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return '';
  }
};

const formatarDataISO = (dataStr: string) => {
  if (!dataStr || typeof dataStr !== 'string') return '';
  const partes = dataStr.split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dataStr;
};

const calcularPrecoComDesconto = (precoUnitario: number, descontoPercentual: number) => {
  const safePreco = Number(precoUnitario) || 0;
  const safeDesconto = Number(descontoPercentual) || 0;
  const valorDesconto = safePreco * (safeDesconto / 100);
  return Math.round((safePreco - valorDesconto) * 100) / 100;
};

const normalizarTextoMatch = (texto: string) => {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

const validarPreco = (valorNota: number, valorCeasa: number): { status: 'ok' | 'divergente'; diferenca: number } => {
  const safeValorNota = Number(valorNota) || 0;
  const safeValorCeasa = Number(valorCeasa) || 0;
  const diferenca = safeValorNota - safeValorCeasa;
  const isOk = Math.abs(diferenca) < 0.05;
  return {
    status: isOk ? 'ok' : 'divergente',
    diferenca
  };
};

const gerarIdUnico = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface PremiumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; discount?: number }>;
  placeholder: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const PremiumSelect = ({ value, onChange, options = [], placeholder, icon, disabled }: PremiumSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = Array.isArray(options) ? options.find(opt => opt.value === value) : undefined;
  
  const filteredOptions = Array.isArray(options) 
    ? options.filter(opt => opt?.label?.toLowerCase().includes((searchTerm || '').toLowerCase()))
    : [];
  
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
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
        className={`w-full bg-white border rounded-lg px-3 py-2 text-left transition-all shadow-sm flex items-center justify-between group text-sm touch-manipulation ${
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
      
      {isOpen && !disabled && (
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
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
                  className={`w-full px-3 py-2 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between text-sm touch-manipulation ${
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
        </div>
      )}
    </>
  );
};

const UploadPDFButton = ({ onDataExtracted }: { onDataExtracted: (produtos: PrecoCeasa[], dataExtraida?: string) => void }) => {
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar PDF');
      }

      if (!data.produtos || !Array.isArray(data.produtos) || data.produtos.length === 0) {
        setUploadProgress('Nenhum produto reconhecido no PDF');
        setTimeout(() => {
          setUploadProgress('');
          setIsUploading(false);
        }, 3000);
        return;
      }

      setUploadProgress(`${data.totalProdutos || data.produtos.length} produtos encontrados!`);
      onDataExtracted(data.produtos, data.dataExtraida);
      
      setTimeout(() => {
        setUploadProgress('');
        setIsUploading(false);
      }, 2000);

    } catch (error) {
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
        flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all w-full sm:w-auto
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

const ToastContainer = ({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: string) => void }) => {
  if (!toasts.length) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
      {toasts.map((toast) => {
        const config = {
          success: { bg: 'bg-emerald-500', icon: <CheckCircle size={18} />, border: 'border-emerald-600' },
          error: { bg: 'bg-red-500', icon: <AlertCircle size={18} />, border: 'border-red-600' },
          warning: { bg: 'bg-amber-500', icon: <AlertCircle size={18} />, border: 'border-amber-600' },
          info: { bg: 'bg-blue-500', icon: <Info size={18} />, border: 'border-blue-600' }
        };
        
        const current = config[toast.type as keyof typeof config] || config.info;
        
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${current.bg} text-white text-sm animate-in slide-in-from-right-5 duration-300 min-w-[280px] max-w-[400px] border-l-4 ${current.border}`}
          >
            {current.icon}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => onRemove(toast.id)} className="hover:bg-white/20 rounded p-0.5 transition-colors">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default function NovaConferenciaPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notaAtual, setNotaAtual] = useState<NotaFiscal | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotaId, setEditingNotaId] = useState<string | null>(null);
  
  const [formEmpresa, setFormEmpresa] = useState('');
  const [formEmpenho, setFormEmpenho] = useState('');
  const [formNumeroNota, setFormNumeroNota] = useState('');
  
  const [formDataTabela, setFormDataTabela] = useState('');
  
  const [itensCeasa, setItensCeasa] = useState<ItemNota[]>([]);
  const [setupCategoria, setSetupCategoria] = useState('');
  const [setupProdutoId, setSetupProdutoId] = useState('');
  const [setupKgCaixa, setSetupKgCaixa] = useState('');
  const [setupValorCaixa, setSetupValorCaixa] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [precosCeasa, setPrecosCeasa] = useState<PrecoCeasa[]>([]);
  const [resetEffect, setResetEffect] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [isMounted, setIsMounted] = useState(false);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = gerarIdUnico();
    const newToast: ToastMessage = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (message: string, type: string) => {
    addToast(message, type as ToastMessage['type']);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categoriasDisponiveis = Array.from(new Set(PRODUTOS_CONTRATO.filter(p => p?.categoria).map(p => p.categoria))).sort();
  const subtiposDisponiveis = PRODUTOS_CONTRATO
    .filter(p => p?.categoria === setupCategoria)
    .sort((a, b) => (a?.nome || '').localeCompare(b?.nome || ''))
    .map(p => ({ value: p.id.toString(), label: p.nome || 'Sem nome', discount: p.desconto }));

  useEffect(() => {
    if (!isMounted) return;
    
    let isSubscribed = true;
    const verificarConexao = async () => {
      try {
        if (typeof window === 'undefined') return;
        if (typeof supabase === 'undefined' || !supabase) {
          throw new Error("Supabase cliente indefinido");
        }
        const { error } = await supabase.from('ceasa_precos').select('count', { count: 'exact', head: true });
        if (error) throw error;
        if (isSubscribed) setSupabaseStatus('connected');
      } catch (error) {
        if (isSubscribed) setSupabaseStatus('disconnected');
      }
    };
    verificarConexao();
    return () => { isSubscribed = false; };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
    let isSubscribed = true;
    try {
      const hojeStr = formatarDataBrasil(new Date());
      if (isSubscribed) setFormDataTabela(hojeStr);

      const notaEmAndamento = typeof window !== 'undefined' ? window.localStorage.getItem('nota_atual_hortifruti') : null;
      if (notaEmAndamento && isSubscribed) {
        const nota = JSON.parse(notaEmAndamento);
        if (nota && typeof nota === 'object') {
          setNotaAtual(nota);
          setIsEditing(true);
          setEditingNotaId(nota.id || null);
          setFormEmpresa(nota.empresa || '');
          setFormEmpenho(nota.empenho || '');
          setFormNumeroNota(nota.numeroNota || '');
          setFormDataTabela(nota.dataTabelaCeasa || hojeStr);
          setItensCeasa(Array.isArray(nota.itens) ? nota.itens : []);
        }
      }
    } catch (e) {
      console.warn("Cache de nota corrompido. O sistema limpou a sujeira.");
      if (typeof window !== 'undefined') window.localStorage.removeItem('nota_atual_hortifruti');
    } finally {
      if (isSubscribed) setIsLoaded(true);
    }
    return () => { isSubscribed = false; };
  }, [isMounted]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        if (notaAtual) {
          window.localStorage.setItem('nota_atual_hortifruti', JSON.stringify(notaAtual));
        } else {
          window.localStorage.removeItem('nota_atual_hortifruti');
        }
      } catch (e) {
        console.warn("Navegador impediu gravação local.");
      }
    }
  }, [notaAtual, isLoaded]);

  useEffect(() => {
    if (!isMounted || !isLoaded) return;
    
    let isSubscribed = true;
    const carregarPrecosDoBanco = async () => {
      if (supabaseStatus === 'connected' && formDataTabela) {
        try {
          const dtIso = formatarDataISO(formDataTabela);
          if (!dtIso) return;
          const precos = await buscarPrecosCeasa(dtIso);
          if (isSubscribed) {
            if (precos && Array.isArray(precos) && precos.length > 0) {
              setPrecosCeasa(precos);
              showToast(`✅ Tabela do dia ${formDataTabela} carregada (${precos.length} itens)`, 'success');
            } else {
              setPrecosCeasa([]);
              showToast(`⚠️ Nenhuma tabela de ${formDataTabela} encontrada. Faça o upload do PDF.`, 'warning');
            }
          }
        } catch (e) {
          console.warn("Falha ao carregar precos silenciosa.");
        }
      }
    };
    carregarPrecosDoBanco();
    return () => { isSubscribed = false; };
  }, [formDataTabela, supabaseStatus, isLoaded, isMounted]);

  useEffect(() => {
    setSetupProdutoId('');
    setSetupKgCaixa('');
    setSetupValorCaixa('');
    setResetEffect(true);
    const t = setTimeout(() => setResetEffect(false), 500);
    return () => clearTimeout(t);
  }, [setupCategoria]);

  useEffect(() => {
    if (!setupProdutoId) {
      setSetupKgCaixa('');
      setSetupValorCaixa('');
      return;
    }

    if (!setupCategoria || !Array.isArray(precosCeasa) || precosCeasa.length === 0) return;
    
    const produtoSelecionado = PRODUTOS_CONTRATO.find(p => p.id.toString() === setupProdutoId);
    if (!produtoSelecionado) return;
    
    const encontrarPreco = () => {
      const categoriaNorm = normalizarTextoMatch(produtoSelecionado.categoria);
      const nomeNorm = normalizarTextoMatch(produtoSelecionado.nome);

      const candidatos = precosCeasa.filter(p =>
        normalizarTextoMatch(p.categoria) === categoriaNorm
      );

      if (candidatos.length === 0) return null;

      const exato = candidatos.find(p => normalizarTextoMatch(p.tipo) === nomeNorm);
      if (exato) return exato;

      const palavrasBusca = nomeNorm.split(' ');
      const sufixosImportantes = ['AA', 'A', 'B', 'C', 'PRIMEIRA', 'SEGUNDA', 'TERCEIRA', 'EXTRA', 'MEDIA', 'GRANDE'];
      
      let melhorMatch = null;
      let melhorScore = 0;

      for (const candidato of candidatos) {
        const tipo = normalizarTextoMatch(candidato.tipo);
        const palavrasTipo = tipo.split(' ');
        
        let score = 0;
        
        for (const palavra of palavrasBusca) {
          if (palavrasTipo.includes(palavra)) score++;
        }
        
        if (tipo.includes(nomeNorm)) score += 2;
        
        for (const sufixo of sufixosImportantes) {
          if (nomeNorm.includes(sufixo) && tipo.includes(sufixo)) score += 3;
        }
        
        if (tipo.length > nomeNorm.length && tipo.includes(nomeNorm)) score += 1;
        
        if (score > melhorScore) {
          melhorScore = score;
          melhorMatch = candidato;
        }
      }
      
      if (melhorScore >= 1) return melhorMatch;
      
      return null;
    };
    
    const precoEncontrado = encontrarPreco();
    
    if (precoEncontrado) {
      setSetupKgCaixa(Number(precoEncontrado.kgEmbalagem || 0).toString().replace('.', ','));
      setSetupValorCaixa(Number(precoEncontrado.valorMc || 0).toString().replace('.', ','));
      showToast(`Preço carregado!`, 'info');
    } else {
      setSetupKgCaixa('');
      setSetupValorCaixa('');
      showToast(`Preço não encontrado na tabela de ${formDataTabela}`, 'error');
    }
  }, [setupCategoria, setupProdutoId, precosCeasa, formDataTabela]);

  const handlePDFDataExtracted = async (produtos: PrecoCeasa[], dataExtraida?: string) => {
    if (!Array.isArray(produtos)) return;
    setPrecosCeasa(produtos);

    let dataFinalISO = formatarDataISO(formDataTabela);
    let dataFinalBR = formDataTabela;

    if (dataExtraida) {
      if (dataExtraida.includes('/')) {
        dataFinalBR = dataExtraida;
        dataFinalISO = formatarDataISO(dataExtraida);
      } else if (dataExtraida.includes('-')) {
        const [y, m, d] = dataExtraida.split('-');
        dataFinalBR = `${d}/${m}/${y}`;
        dataFinalISO = dataExtraida;
      }
      setFormDataTabela(dataFinalBR);
      showToast(`📅 Data ajustada automaticamente pelo PDF: ${dataFinalBR}`, 'success');
    }

    if (supabaseStatus === 'connected') {
      try {
        await salvarPrecosCeasa(dataFinalISO, produtos);
        showToast(`${produtos.length} preços salvos na nuvem para o dia ${dataFinalBR}!`, 'success');
      } catch (error) {
        showToast('Erro ao salvar no banco, mas dados estão no navegador', 'error');
      }
    } else {
      showToast(`${produtos.length} preços carregados no navegador para ${dataFinalBR}`, 'info');
    }
  };

  const handleAddSetupCeasa = (e: React.FormEvent) => {
    e.preventDefault();
    const produto = PRODUTOS_CONTRATO.find(p => p.id.toString() === setupProdutoId);
    const kg = parseFloat(setupKgCaixa.replace(',', '.'));
    const valor = parseFloat(setupValorCaixa.replace(',', '.'));

    if (!produto || isNaN(kg) || isNaN(valor) || kg <= 0) {
      showToast('Preencha os campos de Peso e Valor corretamente.', 'error');
      return;
    }

    const precoSemDesconto = valor / kg;
    const precoFinalArredondado = calcularPrecoComDesconto(precoSemDesconto, produto.desconto || 0);
    const nomeCompleto = `${produto.categoria || ''} - ${produto.nome || ''}`;

    if (produto.desconto !== null && produto.desconto !== undefined && produto.desconto > 0) {
      addToast(`✅ Adicionado ${produto.categoria} - ${produto.nome} com desconto de ${produto.desconto}%`, 'success');
    } else {
      addToast(`⚠️ Adicionado ${produto.categoria} - ${produto.nome} (sem desconto no edital)`, 'warning');
    }

    const novoItem: ItemNota = {
      id: gerarIdUnico(),
      produtoId: produto.id,
      produtoNome: nomeCompleto,
      desconto: produto.desconto || 0,
      kgCaixa: kg,
      valorCaixa: valor,
      precoUnitarioSemDesconto: precoSemDesconto,
      precoUnitarioComDesconto: precoFinalArredondado,
      quantidadeStr: '',
      quantidade: 0,
      totalSemDesconto: 0,
      total: 0,
      precoUnitarioNotaStr: '',
      precoUnitarioNota: undefined,
      totalNota: 0,
      statusValidacao: undefined,
      diferenca: undefined
    };

    setItensCeasa(prev => [...prev, novoItem]);
    setSetupCategoria('');
    setSetupProdutoId('');
    setSetupKgCaixa('');
    setSetupValorCaixa('');
  };

  const removerItemSetup = (id: string) => {
    setItensCeasa(prev => prev.filter(i => i.id !== id));
  };

  const verificarNotaDuplicada = async (empenho: string, numeroNota: string, notaIdIgnorar?: string): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined') {
        const notasSalvas = window.localStorage.getItem('banco_notas_hortifruti');
        if (notasSalvas) {
          const bancoNotas = JSON.parse(notasSalvas);
          if (Array.isArray(bancoNotas)) {
            const existe = bancoNotas.some((n: NotaFiscal) => 
              n.empenho === empenho && n.numeroNota === numeroNota && n.id !== notaIdIgnorar
            );
            if (existe) return true;
          }
        }
      }
      if (supabaseStatus === 'connected' && typeof supabase !== 'undefined') {
        const { data, error } = await supabase
          .from('notas_fiscais')
          .select('id')
          .eq('empenho', empenho)
          .eq('numero_nota', numeroNota)
          .neq('id', notaIdIgnorar || '')
          .maybeSingle();
        if (!error && data) return true;
      }
    } catch (e) {
      console.warn("Erro ao verificar duplicidade silencioso.");
    }
    return false;
  };

  const iniciarDigitacaoDaNota = async () => {
    if (!formEmpresa || !formEmpenho || !formNumeroNota || !Array.isArray(itensCeasa) || itensCeasa.length === 0) {
      showToast('Preencha os dados e adicione ao menos 1 item.', 'error');
      return;
    }
    
    const isDuplicada = await verificarNotaDuplicada(formEmpenho, formNumeroNota, editingNotaId || undefined);
    if (isDuplicada) {
      showToast(`❌ Já existe uma nota NF ${formNumeroNota} para o Empenho ${formEmpenho}.`, 'error');
      return;
    }
    
    const id = isEditing && editingNotaId ? editingNotaId : gerarIdUnico();

    const novaNota: NotaFiscal = {
      id: id,
      empresa: formEmpresa,
      empenho: formEmpenho,
      numeroNota: formNumeroNota,
      data: formatarDataBrasil(new Date()),
      dataTabelaCeasa: formDataTabela,
      itens: itensCeasa,
      totalGeral: 0
    };

    setNotaAtual(novaNota);
  };

  const handlePrecoNotaChange = (id: string, valorDigitado: string) => {
    if (!notaAtual || !Array.isArray(notaAtual.itens)) return;
    
    const valorSanitizado = (valorDigitado || '').replace(/[^0-9,]/g, '');
    const precoNumerico = parseFloat(valorSanitizado.replace(',', '.')) || 0;
    
    const novosItens = notaAtual.itens.map(item => {
      if (item.id === id) {
        const quantidade = Number(item.quantidade) || 0;
        const totalNota = quantidade * precoNumerico;
        const totalCeasa = quantidade * (Number(item.precoUnitarioComDesconto) || 0);
        
        const validacao = totalCeasa > 0 ? validarPreco(totalNota, totalCeasa) : null;
        
        return {
          ...item,
          precoUnitarioNotaStr: valorSanitizado,
          precoUnitarioNota: precoNumerico,
          totalNota: totalNota,
          precoCeasa: totalCeasa,
          statusValidacao: validacao?.status,
          diferenca: validacao?.diferenca
        };
      }
      return item;
    });
    
    const temDivergencia = novosItens.some(i => i.statusValidacao === 'divergente');
    
    setNotaAtual({
      ...notaAtual,
      itens: novosItens,
      totalGeral: novosItens.reduce((acc, item) => acc + (Number(item.totalNota) || 0), 0),
      statusValidacao: temDivergencia ? 'divergente' : 'ok'
    });
  };

  const handleQuantidadeChange = (id: string, valorDigitado: string) => {
    if (!notaAtual || !Array.isArray(notaAtual.itens)) return;

    const valorSanitizado = (valorDigitado || '').replace(/[^0-9,]/g, '');
    const qtdNumerica = parseFloat(valorSanitizado.replace(',', '.')) || 0;
    
    const novosItens = notaAtual.itens.map(item => {
      if (item.id === id) {
        const totalNota = qtdNumerica * (Number(item.precoUnitarioNota) || 0);
        const totalCeasa = qtdNumerica * (Number(item.precoUnitarioComDesconto) || 0);
        const validacao = totalCeasa > 0 ? validarPreco(totalNota, totalCeasa) : null;
        
        return {
          ...item,
          quantidadeStr: valorSanitizado,
          quantidade: qtdNumerica,
          totalSemDesconto: qtdNumerica * (Number(item.precoUnitarioSemDesconto) || 0),
          total: qtdNumerica * (Number(item.precoUnitarioComDesconto) || 0),
          totalNota: totalNota,
          precoCeasa: totalCeasa,
          statusValidacao: validacao?.status,
          diferenca: validacao?.diferenca
        };
      }
      return item;
    });
    
    const temDivergencia = novosItens.some(i => i.statusValidacao === 'divergente');
    
    setNotaAtual({
      ...notaAtual,
      itens: novosItens,
      totalGeral: novosItens.reduce((acc, item) => acc + (Number(item.totalNota) || 0), 0),
      statusValidacao: temDivergencia ? 'divergente' : 'ok'
    });
  };

  const finalizarNota = async () => {
    if (!notaAtual || !Array.isArray(notaAtual.itens)) return;
    
    setIsSaving(true);
    
    try {
      const temDivergencia = notaAtual.itens.some(i => i.statusValidacao === 'divergente');
      const notaComStatus = {
        ...notaAtual,
        statusValidacao: temDivergencia ? 'divergente' : 'ok' as 'ok' | 'divergente'
      };
      
      let bancoAtualizado;
      if (typeof window !== 'undefined') {
        const notasSalvas = window.localStorage.getItem('banco_notas_hortifruti');
        const bancoNotas = notasSalvas ? JSON.parse(notasSalvas) : [];
        const baseNotasSegura = Array.isArray(bancoNotas) ? bancoNotas : [];
        
        if (isEditing && editingNotaId) {
          bancoAtualizado = baseNotasSegura.map((nota: NotaFiscal) => 
            nota.id === editingNotaId ? notaComStatus : nota
          );
        } else {
          bancoAtualizado = [notaComStatus, ...baseNotasSegura];
        }
        window.localStorage.setItem('banco_notas_hortifruti', JSON.stringify(bancoAtualizado));
      }
      
      if (supabaseStatus === 'connected' && typeof supabase !== 'undefined') {
        try {
          await supabase.from('notas_fiscais').upsert({
            id: notaComStatus.id,
            empresa: notaComStatus.empresa,
            empenho: notaComStatus.empenho,
            numero_nota: notaComStatus.numeroNota,
            data: notaComStatus.data,
            data_tabela_ceasa: notaComStatus.dataTabelaCeasa,
            itens: notaComStatus.itens,
            total_geral: notaComStatus.totalGeral,
            status_validacao: notaComStatus.statusValidacao,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        } catch (supabaseError) {
          console.warn("Salvou localmente apenas.");
        }
      }
      
      showToast('Nota salva com sucesso!', 'success');
      
      setNotaAtual(null);
      setIsEditing(false);
      setEditingNotaId(null);
      setFormEmpresa('');
      setFormEmpenho('');
      setFormNumeroNota('');
      setItensCeasa([]);
      if (typeof window !== 'undefined') window.localStorage.removeItem('nota_atual_hortifruti');
      
      router.push('/dashboard/notas');
      
    } catch (error) {
      showToast('Erro ao salvar nota', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelarNota = () => {
    if (confirm("Cancelar conferência?")) {
      setNotaAtual(null);
      setIsEditing(false);
      setEditingNotaId(null);
      setFormEmpresa('');
      setFormEmpenho('');
      setFormNumeroNota('');
      setItensCeasa([]);
      if (typeof window !== 'undefined') window.localStorage.removeItem('nota_atual_hortifruti');
    }
  };

  const notaTemErro = notaAtual?.statusValidacao === 'divergente';
  
  const kgFloat = parseFloat((setupKgCaixa || '').replace(',', '.'));
  const vlFloat = parseFloat((setupValorCaixa || '').replace(',', '.'));

  const isFormValido = Boolean(setupCategoria) && 
    Boolean(setupProdutoId) && 
    !isNaN(kgFloat) && kgFloat > 0 && 
    !isNaN(vlFloat) && vlFloat > 0;

  if (!isMounted || !isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="ml-3 text-sm text-slate-500">Carregando sistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 pb-20 md:pb-0">
      
      {/* HEADER REFATORADO - Mobile horizontal, Desktop completo */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        
        {/* MOBILE: Layout compacto horizontal */}
        <div className="md:hidden p-3">
          
          {/* Linha 1: Logo + Título + Botão Voltar/Salvar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <Package size={16} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800">Conferência</h1>
                <p className="text-[9px] text-slate-400">de Nota</p>
              </div>
            </div>

            {notaAtual ? (
              <div className="flex gap-2">
                <button onClick={cancelarNota} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                  Cancelar
                </button>
                <button 
                  onClick={finalizarNota} 
                  disabled={isSaving}
                  className={`font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${
                    notaTemErro 
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'
                  }`}
                >
                  <Save size={12} />
                  Salvar
                </button>
              </div>
            ) : (
              <button
                onClick={iniciarDigitacaoDaNota}
                disabled={!Array.isArray(itensCeasa) || itensCeasa.length === 0 || !formEmpresa || !formEmpenho || !formNumeroNota}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <ArrowRight size={12} />
                Validar
              </button>
            )}
          </div>

          {/* Linha 2: Status e indicadores */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {supabaseStatus === 'connected' && (
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">
                <Database size={10} className="text-emerald-600" />
                <span className="text-[9px] text-emerald-700 font-medium">Cloud</span>
              </div>
            )}
            
            <UploadPDFButton onDataExtracted={handlePDFDataExtracted} />
            
            {precosCeasa.length > 0 && (
              <div className="bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                <span className="text-[9px] font-semibold text-emerald-700">
                  📊 {precosCeasa.length} itens
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP: Layout completo original */}
        <div className="hidden md:flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Package size={16} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">Conferência de Nota</h1>
              <p className="text-[11px] text-slate-500">Valide os valores contra a tabela CEASA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {supabaseStatus === 'connected' && (
              <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
                <Database size={12} className="text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-medium">Cloud</span>
              </div>
            )}
            <UploadPDFButton onDataExtracted={handlePDFDataExtracted} />
          </div>
        </div>
      </div>

      {/* Alertas de tabela CEASA */}
      {!notaAtual && precosCeasa.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-800">Tabela CEASA Ativa: {formDataTabela}</h3>
              <p className="text-xs text-emerald-600 font-medium">
                Base de dados com {precosCeasa.length} produtos carregada
              </p>
            </div>
          </div>
          <button onClick={() => setPrecosCeasa([])} className="text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded transition-colors w-full sm:w-auto">
            Limpar Base
          </button>
        </div>
      )}

      {!notaAtual && formDataTabela && precosCeasa.length === 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertCircle size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800">Tabela de {formDataTabela} indisponível</h3>
              <p className="text-xs text-amber-700 font-medium">
                Faça o upload do PDF deste dia ou altere a data abaixo.
              </p>
            </div>
          </div>
        </div>
      )}

      {!notaAtual ? (
        <>
          {/* Dados da Nota Fiscal */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white text-[10px] font-bold">1</div>
                <span className="text-sm font-semibold text-slate-700">Dados da Nota Fiscal</span>
              </div>
            </div>
            
            {/* 🔥 Grid responsivo: mobile empilha, desktop 4 colunas */}
            <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empresa</label>
                <input 
                  type="text" 
                  value={formEmpresa} 
                  onChange={(e) => setFormEmpresa(e.target.value.toUpperCase())} 
                  placeholder="Nome da empresa" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empenho</label>
                <input 
                  type="text" 
                  value={formEmpenho} 
                  onChange={(e) => setFormEmpenho(e.target.value.toUpperCase())} 
                  placeholder="Nº do Empenho" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nº da Nota Fiscal</label>
                <input 
                  type="text" 
                  value={formNumeroNota} 
                  onChange={(e) => setFormNumeroNota(e.target.value.toUpperCase())} 
                  placeholder="Número da NF" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Dia da Tabela CEASA</label>
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
                      if(ano && mes && dia) {
                        const dataUTC = new Date(Date.UTC(parseInt(ano), parseInt(mes) - 1, parseInt(dia)));
                        setFormDataTabela(formatarDataBrasil(dataUTC));
                      }
                    }
                  }}
                  className="w-full bg-emerald-50/30 border border-emerald-200 rounded-lg px-3 py-2 text-sm text-emerald-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Itens da Nota */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-600 rounded flex items-center justify-center text-white text-[10px] font-bold">2</div>
                <span className="text-sm font-semibold text-slate-700">Itens da Nota</span>
              </div>
            </div>

            <div className="p-4">
              {/* Formulário de adição - mobile empilha */}
              <form onSubmit={handleAddSetupCeasa} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Categoria</label>
                  <PremiumSelect
                    value={setupCategoria}
                    onChange={setSetupCategoria}
                    options={categoriasDisponiveis.map(cat => ({ value: cat, label: cat }))}
                    placeholder="Selecione..."
                    icon={<Tag size={12} />}
                  />
                </div>
                
                <div className="flex-[2]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Produto</label>
                  <PremiumSelect
                    value={setupProdutoId}
                    onChange={setSetupProdutoId}
                    options={subtiposDisponiveis}
                    placeholder={setupCategoria ? "Selecione..." : "Escolha categoria"}
                    icon={<Box size={12} />}
                    disabled={!setupCategoria}
                  />
                </div>
                
                <div className="w-full sm:w-[120px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Peso (KG)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={setupKgCaixa} 
                      onChange={(e) => setSetupKgCaixa(e.target.value)} 
                      placeholder="0,00" 
                      className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-800 font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${resetEffect ? 'bg-amber-50 border-amber-400' : 'border-slate-200'}`}
                    />
                    <Weight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                
                <div className="w-full sm:w-[140px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input 
                      type="text" 
                      value={setupValorCaixa} 
                      onChange={(e) => setSetupValorCaixa(e.target.value)} 
                      placeholder="0,00" 
                      className={`w-full bg-white border rounded-lg pl-7 pr-3 py-2 text-sm text-slate-800 font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${resetEffect ? 'bg-amber-50 border-amber-400' : 'border-slate-200'}`}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={!isFormValido}
                  className={`bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 text-sm h-[42px] sm:h-[38px] ${!isFormValido ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Plus size={14} /> Adicionar
                </button>
              </form>

              {/* Lista de itens adicionados - MOBILE: cards, DESKTOP: tabela */}
              {Array.isArray(itensCeasa) && itensCeasa.length > 0 && (
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                  
                  {/* DESKTOP: Tabela original */}
                  <div className="hidden md:block">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                      <span className="font-semibold text-xs text-slate-600">Itens adicionados</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{itensCeasa.length} itens</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase">Produto</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase text-center">Ref.</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-emerald-600 uppercase text-right">Preço Unitário</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase text-center w-10">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {itensCeasa.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-3 py-2 font-semibold text-slate-700 text-xs">
                                {item.produtoNome}
                                {item.desconto === 0 && (
                                  <span className="ml-2 inline-flex items-center gap-0.5 bg-amber-100 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                    <AlertCircle size={10} /> sem desconto
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-medium">{item.kgCaixa}kg</span>
                              </td>
                              <td className="px-3 py-2 text-right font-bold text-emerald-600 text-sm">{formatarMoeda(item.precoUnitarioComDesconto)}</td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => removerItemSetup(item.id)} className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MOBILE: Cards dos itens adicionados */}
                  <div className="md:hidden divide-y divide-slate-100">
                    <div className="bg-slate-50 px-3 py-2 flex justify-between items-center">
                      <span className="font-semibold text-xs text-slate-600">Itens adicionados</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{itensCeasa.length} itens</span>
                    </div>
                    {itensCeasa.map(item => (
                      <div key={item.id} className="p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-700">{item.produtoNome}</p>
                            {item.desconto === 0 && (
                              <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1">
                                <AlertCircle size={10} /> sem desconto
                              </span>
                            )}
                          </div>
                          <button onClick={() => removerItemSetup(item.id)} className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Ref. ({item.kgCaixa}kg)</span>
                          <span className="text-sm font-bold text-emerald-600">{formatarMoeda(item.precoUnitarioComDesconto)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              <button 
                onClick={iniciarDigitacaoDaNota} 
                disabled={!Array.isArray(itensCeasa) || itensCeasa.length === 0 || !formEmpresa || !formEmpenho || !formNumeroNota} 
                className={`mt-4 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  !Array.isArray(itensCeasa) || itensCeasa.length === 0 || !formEmpresa || !formEmpenho || !formNumeroNota
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <ArrowRight size={14} />
                {isEditing ? 'Atualizar Validação' : 'Iniciar Validação'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {/* Header da validação ativa */}
          <div className="bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">Validação Ativa</span>
                <span className="text-slate-400 text-[10px]">Base CEASA: {notaAtual.dataTabelaCeasa}</span>
                {isEditing && (
                  <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide flex items-center gap-1">
                    <Pencil size={10} />
                    Editando
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">{notaAtual.empresa}</h2>
              <p className="text-emerald-400 text-xs">
                Empenho: {notaAtual.empenho} | NF: {notaAtual.numeroNota}
              </p>
            </div>
            
            <div className="flex gap-2 relative z-10 w-full sm:w-auto">
              <button onClick={cancelarNota} className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm flex-1 sm:flex-none">
                Cancelar
              </button>
              <button 
                onClick={finalizarNota} 
                disabled={isSaving}
                className={`font-bold px-5 py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 text-sm flex-1 sm:flex-none ${
                  notaTemErro 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900'
                } disabled:opacity-50`}
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isSaving ? 'Salvando...' : isEditing ? 'Atualizar Nota' : (notaTemErro ? 'Salvar Divergências' : 'Finalizar Validação')}
              </button>
            </div>
          </div>

          {/* Status da validação */}
          <div className={`rounded-lg p-3 flex items-center gap-2 ${
            notaTemErro 
              ? 'bg-rose-100 border border-rose-300 text-rose-700'
              : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
          }`}>
            {notaTemErro ? (
              <>
                <AlertCircle size={18} />
                <span className="text-sm font-semibold">❌ Nota com divergências — revisar antes de enviar ao fornecedor</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span className="text-sm font-semibold">✔ Nota validada com sucesso — todos os valores conferem com a tabela CEASA</span>
              </>
            )}
          </div>

          {/* DESKTOP: Tabela original */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase">Produto</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center">Ref.</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center">Desconto</th>
                    <th className="p-3 text-[10px] font-bold text-emerald-600 uppercase text-right">Preço CEASA/KG</th>
                    <th className="p-3 text-[10px] font-bold text-amber-600 uppercase text-right">Preço NF/KG</th>
                    <th className="p-3 text-[10px] font-bold text-white bg-emerald-500 uppercase text-center">Quantidade (KG)</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-right">Total Nota</th>
                    <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center">Validação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.isArray(notaAtual?.itens) && notaAtual.itens.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`transition-all ${
                        item.statusValidacao === 'divergente'
                          ? 'bg-rose-50 border-l-4 border-l-rose-500'
                          : item.statusValidacao === 'ok'
                          ? 'bg-emerald-50/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 font-semibold text-slate-700 text-xs">{item.produtoNome}</td>
                      <td className="p-3 text-center text-slate-500 text-xs">{item.kgCaixa}kg</td>
                      <td className="p-3 text-center font-bold text-rose-500 bg-rose-50/50 text-xs">-{item.desconto}%</td>
                      <td className="p-3 text-right font-bold text-emerald-600 text-sm">
                        {formatarMoeda(item.precoUnitarioComDesconto)}
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="text" 
                          inputMode="decimal"
                          value={item.precoUnitarioNotaStr ?? ''} 
                          onChange={(e) => handlePrecoNotaChange(item.id, e.target.value)} 
                          placeholder="0,00" 
                          className="w-24 text-right font-bold text-sm text-amber-700 border-2 border-amber-200 rounded-lg py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white" 
                        />
                      </td>
                      <td className="p-2 bg-emerald-50/50">
                        <input 
                          type="text" 
                          inputMode="decimal"
                          value={item.quantidadeStr ?? ''} 
                          onChange={(e) => handleQuantidadeChange(item.id, e.target.value)} 
                          placeholder="0,00" 
                          className="w-24 text-center font-bold text-base text-emerald-900 border-2 border-emerald-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white" 
                        />
                      </td>
                      <td className="p-3 text-right font-bold text-slate-700 text-sm">
                        {formatarMoeda(item.totalNota || 0)}
                        {item.statusValidacao === 'divergente' && item.diferenca !== undefined && (
                          <div className="text-[10px] text-rose-600 font-semibold mt-1">
                            dif: {formatarMoeda(item.diferenca)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {item.statusValidacao === 'divergente' && (
                          <div className="text-rose-600 text-xs font-semibold flex items-center gap-1 justify-center">
                            <AlertCircle size={14} /> Divergente
                          </div>
                        )}
                        {item.statusValidacao === 'ok' && (
                          <div className="text-emerald-600 text-xs font-semibold flex items-center gap-1 justify-center">
                            <CheckCircle size={14} /> Válido
                          </div>
                        )}
                        {!item.statusValidacao && (
                          <div className="text-slate-400 text-xs">Aguardando</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={`p-4 flex flex-col sm:flex-row justify-between items-center gap-2 ${
              notaTemErro ? 'bg-rose-50' : 'bg-emerald-50'
            }`}>
              <div className="flex items-center gap-2">
                {notaTemErro ? (
                  <AlertCircle size={20} className="text-rose-600" />
                ) : (
                  <CheckCircle size={20} className="text-emerald-600" />
                )}
                <span className={`text-sm font-bold ${notaTemErro ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {notaTemErro 
                    ? 'NOTA COM DIVERGÊNCIAS - Enviar correção ao fornecedor' 
                    : 'NOTA VALIDADA - Todos os valores conferem'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total da Nota</p>
                <p className={`text-2xl font-bold ${notaTemErro ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatarMoeda(notaAtual.totalGeral || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* MOBILE: Cards da validação (touch-friendly) */}
          <div className="md:hidden space-y-3">
            {Array.isArray(notaAtual?.itens) && notaAtual.itens.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-3 shadow-sm bg-white ${
                  item.statusValidacao === 'divergente'
                    ? 'border-red-300'
                    : item.statusValidacao === 'ok'
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Produto</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {item.produtoNome}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.statusValidacao === 'ok' && (
                      <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">OK</span>
                    )}
                    {item.statusValidacao === 'divergente' && (
                      <span className="text-red-600 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded-full">DIVERGENTE</span>
                    )}
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{item.desconto}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px]">Ref. (KG/CX)</p>
                    <p className="font-semibold text-slate-700">{item.kgCaixa}kg</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Preço CEASA/KG</p>
                    <p className="font-bold text-emerald-600">{formatarMoeda(item.precoUnitarioComDesconto)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Preço NF/KG</p>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.precoUnitarioNotaStr ?? ''}
                      onChange={(e) => handlePrecoNotaChange(item.id, e.target.value)}
                      placeholder="0,00"
                      className="w-full border-2 border-amber-200 rounded-lg px-2 py-1.5 text-sm text-right font-bold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Quantidade (KG)</p>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.quantidadeStr ?? ''}
                      onChange={(e) => handleQuantidadeChange(item.id, e.target.value)}
                      placeholder="0,00"
                      className="w-full border-2 border-emerald-200 rounded-lg px-2 py-1.5 text-sm text-center font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-1">
                      <p className="text-slate-400 text-[10px]">Total Nota</p>
                      <p className="font-bold text-slate-800 text-base">{formatarMoeda(item.totalNota || 0)}</p>
                    </div>
                    {item.statusValidacao === 'divergente' && item.diferenca !== undefined && (
                      <div className="flex justify-between items-center mt-1 pt-1">
                        <p className="text-red-500 text-[9px] font-semibold">Diferença:</p>
                        <p className="text-red-600 text-xs font-bold">{formatarMoeda(item.diferenca)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className={`rounded-xl p-4 flex flex-col gap-2 ${
              notaTemErro ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notaTemErro ? (
                    <AlertCircle size={18} className="text-rose-600" />
                  ) : (
                    <CheckCircle size={18} className="text-emerald-600" />
                  )}
                  <span className={`text-xs font-bold ${notaTemErro ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {notaTemErro ? 'DIVERGÊNCIAS' : 'VALIDADA'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500">Total da Nota</p>
                  <p className={`text-xl font-bold ${notaTemErro ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatarMoeda(notaAtual.totalGeral || 0)}
                  </p>
                </div>
              </div>
              <p className={`text-[10px] font-medium ${notaTemErro ? 'text-rose-600' : 'text-emerald-600'}`}>
                {notaTemErro 
                  ? '⚠️ Enviar correção ao fornecedor antes do pagamento' 
                  : '✅ Todos os valores conferem com a tabela CEASA'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY SUMMARY - Total fixo no bottom */}
      {notaAtual && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total da Nota</p>
              <p className={`text-base font-bold ${notaTemErro ? 'text-rose-600' : 'text-emerald-600'}`}>
                {formatarMoeda(notaAtual.totalGeral || 0)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-400">Itens</p>
                <p className="text-sm font-semibold text-slate-700">{notaAtual.itens?.length || 0}</p>
              </div>
              {notaTemErro && (
                <div className="bg-rose-100 rounded-full px-2 py-1">
                  <p className="text-[9px] font-semibold text-rose-700 flex items-center gap-1">
                    <AlertCircle size={10} /> Divergente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}