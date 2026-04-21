import pdf from 'pdf-parse';

// ==================== TIPOS ====================
export interface ProdutoCEASA {
  categoria: string;
  tipo: string;
  kgEmbalagem: number;
  valorMc: number;
  dataReferencia?: string;
  rawProduto?: string;
  rawTipo?: string;
}

// ==================== CATEGORIAS ====================
const CATEGORIAS_CONHECIDAS = [
  'ABACATE','ABACAXI','AMEIXA','BANANA','CAQUI','COCO','KIWI',
  'LARANJA','LIMA PERSIA','LIMAO','MAÇÃ IMPORTADA','MAÇÃ','MAMÃO',
  'MANGA','MARACUJÁ','MELANCIA','MELÃO','MORANGO','NECTARINA',
  'PERA IMPORTADA','PÊRA NACIONAL','PÊSSEGO','PITAIA','TAMARA FRESCA',
  'TANGERINA','UVA','AMORA','ATEMOIA','CAJU','CARAMBOLA','CASTANHA',
  'CEREJA','FIGO','FRAMBOESA','GOIABA','JABUTICABA','JACA','KINKAN',
  'LICHIA','MIRTILO','NÊSPERA','NOZ','PHYSALIS','PINHA (FRUTA DO CONDE)',
  'ROMA','ABOBORA','ABOBRINHA','BERINJELA','CAXI','CHUCHU','ERVILHA',
  'JILÓ','MAXIXE','MILHO','PEPINO','PIMENTA','PIMENTAO','QUIABO',
  'TOMATE','VAGEM','AIPIM-MANDIOCA','ALHO IMPORTADO','ALHO NACIONAL',
  'BATATA DOCE','BATATA YAKON','BATATA','BETERRABA','CARA','CEBOLA',
  'CENOURA','GENGIBRE','GOBO','INHAME-TAIÁ','MANDIOQUINHA/BATATA SALSA',
  'NABO','RABANETE','AGRIAO','ALFACE','ALHO PORO','ALMEIRAO','ASPARGO',
  'CEBOLINHA','COENTRO','COUVE BROCOLO','COUVE CHINESA','COUVE FLOR',
  'COUVE MANTEIGA','ESCAROLA/CHICORIA','ESPINAFRE','HORTELA','REPOLHO',
  'RUCULA','SALSAO (AIPO)','SALSINHA','OVO','AMENDOIM'
];

// 🔥 REMOVER APENAS RUÍDO (NÃO CLASSIFICAÇÃO)
// NÃO REMOVE: EXTRA, PRIMEIRA, A, AA, MEDIA, GRANDE, etc.
const PALAVRAS_REMOVER_TIPO = [
  'NACIONAL', 'IMPORTADA', 'TIPO', 'CLASSE'
];

// ==================== UTIL ====================
const normalizarTexto = (texto: string): string => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
};

const normalizarLinhas = (texto: string): string[] => {
  return texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
};

// ==================== EXTRAÇÃO ====================
const extrairCategoria = (produto: string): string => {
  const upper = normalizarTexto(produto);

  for (const cat of CATEGORIAS_CONHECIDAS) {
    if (upper.includes(normalizarTexto(cat))) return cat;
  }

  return produto.split(' ')[0].toUpperCase();
};

// ==================== PARSER ====================
const extrairPorColuna = (linha: string, currentCategory: string) => {
  const matches = [...linha.matchAll(/\d+,\d{2}/g)];
  if (matches.length < 2) return null;

  const idx = matches[0].index!;
  const esquerda = linha.slice(0, idx).trim();
  const direita = linha.slice(idx).trim();

  const valores = direita.match(/\d+,\d{2}/g)!.map(v => parseFloat(v.replace(',', '.')));
  const valorMc = valores[1] ?? valores[0];

  if (!valorMc || valorMc <= 0 || valorMc > 500) return null;

  // KG
  let kg = 1;
  const kgMatch = esquerda.match(/(\d+[.,]?\d*)\s*[Kk][Gg]/);
  if (kgMatch) kg = parseFloat(kgMatch[1].replace(',', '.'));

  // NOME BRUTO - preserva o máximo de informação
  let nome = esquerda
    .replace(/\d+[.,]?\d*/g, '')
    .replace(/\b(cx|sc|un|kg|dz|mç|bj|eg)\b/gi, '')
    .replace(/\b(PR|SP|MG|RS|SC|BA)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!nome || nome.length < 2) return null;

  nome = normalizarTexto(nome);

  // CATEGORIA
  const categoria = currentCategory || extrairCategoria(nome);

  // REMOVE CATEGORIA → vira tipo (preserva especificações como EXTRA, AA, PRIMEIRA)
  let tipo = nome;
  const catNorm = normalizarTexto(categoria);

  if (tipo.includes(catNorm)) {
    tipo = tipo.replace(catNorm, '').trim();
  }

  // 🔥 LIMPEZA CONTROLADA (SÓ REMOVE RUÍDO, NÃO DESTRÓI ESPECIFICAÇÕES)
  // NÃO remove: EXTRA, PRIMEIRA, A, AA, MEDIA, GRANDE
  const removerPattern = new RegExp(`\\b(${PALAVRAS_REMOVER_TIPO.join('|')})\\b`, 'gi');
  tipo = tipo.replace(removerPattern, '').replace(/\s+/g, ' ').trim();

  if (!tipo) tipo = nome;

  return {
    produto: categoria,
    tipo,
    kg,
    valorMc
  };
};

// ==================== PDF ====================
export async function parsePDF(file: Buffer | Uint8Array): Promise<string> {
  const buffer = file instanceof Uint8Array ? Buffer.from(file) : file;

  const data = await pdf(buffer);
  return data.text || '';
}

// ==================== MAIN ====================
export async function extrairProdutosDoPDF(
  file: Buffer | Uint8Array,
  dataReferencia?: string,
  debug?: boolean
): Promise<ProdutoCEASA[]> {

  const texto = await parsePDF(file);
  const linhas = normalizarLinhas(texto);

  const produtos: ProdutoCEASA[] = [];
  let currentCategory = '';

  for (const linha of linhas) {

    const textoLimpo = normalizarTexto(linha);
    const header = CATEGORIAS_CONHECIDAS.find(c => normalizarTexto(c) === textoLimpo);

    if (header) {
      currentCategory = header;
      continue;
    }

    if (linha.length < 10) continue;

    const parsed = extrairPorColuna(linha, currentCategory);
    if (!parsed) continue;

    produtos.push({
      categoria: parsed.produto,
      tipo: parsed.tipo,
      kgEmbalagem: parsed.kg,
      valorMc: parsed.valorMc,
      dataReferencia: dataReferencia || new Date().toISOString().split('T')[0],
      rawProduto: parsed.produto,
      rawTipo: parsed.tipo
    });
  }

  // REMOVER DUPLICADOS
  const map = new Map<string, ProdutoCEASA>();

  for (const p of produtos) {
    const chave = `${p.categoria}|${p.tipo}|${p.kgEmbalagem}`;
    if (!map.has(chave)) map.set(chave, p);
  }

  return Array.from(map.values());
}