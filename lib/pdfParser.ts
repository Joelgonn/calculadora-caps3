// lib/pdfParser.ts - Parser isolado do Next.js bundler

// @ts-ignore - biblioteca sem tipos completos
import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';

// ==================== TIPOS ====================
interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProdutoExtraido {
  categoria: string;
  tipo: string;
  unidade: string;
  kgEmbalagem: number;
  valorMc: number;
  data: string;
  linhaOriginal: string;
}

// ==================== LAYOUT-AWARE PARSING ====================
const agruparPorLinha = (items: TextItem[], toleranciaY: number = 4): TextItem[][] => {
  const linhas: TextItem[][] = [];
  const itemsOrdenados = [...items].sort((a, b) => b.y - a.y);

  for (const item of itemsOrdenados) {
    let adicionou = false;

    for (const linha of linhas) {
      if (Math.abs(linha[0].y - item.y) < toleranciaY) {
        linha.push(item);
        adicionou = true;
        break;
      }
    }

    if (!adicionou) {
      linhas.push([item]);
    }
  }

  return linhas;
};

const reconstruirLinha = (linha: TextItem[]): string => {
  return linha
    .sort((a, b) => a.x - b.x)
    .map(item => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// ==================== PARSER PRINCIPAL ====================
export async function parsePDF(buffer: Buffer): Promise<string> {
  // Configurar worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = undefined;
  
  // Converter Buffer para Uint8Array
  const uint8Array = new Uint8Array(buffer);
  
  // Carregar PDF
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  
  let textoCompleto = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    // Extrai com posição
    const items: TextItem[] = content.items.map((item: any) => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width || 0,
      height: item.height || 0
    }));
    
    // Reconstroi linhas baseado na posição
    const linhasAgrupadas = agruparPorLinha(items, 4);
    
    for (const linha of linhasAgrupadas) {
      const textoLinha = reconstruirLinha(linha);
      if (textoLinha.length > 0) {
        textoCompleto += textoLinha + '\n';
      }
    }
  }

  return textoCompleto;
}

// ==================== UTILITÁRIOS DO PARSER ====================
export const normalizarTexto = (texto: string) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

export const limparTexto = (texto: string) => {
  return texto
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
};

export const ehCategoria = (linha: string) => {
  const palavrasProibidas = /(KG|R\$|CX|SC|UN|FD|MERCADO|PRODUTO|CEASA|PRECO|TABELA|PAGINA|FONTE|TOTAL|VALOR|EMBALAGEM|UNIDADE|CAIXA|SACO|BANDEJA)/i;
  
  return (
    linha === linha.toUpperCase() &&
    linha.length < 30 &&
    linha.length > 2 &&
    !linha.match(/\d/) &&
    !palavrasProibidas.test(linha)
  );
};

export const limparTipo = (texto: string): string => {
  const palavrasRemover = [
    'ESTÁVEL', 'MIN', 'MÁX', 'COMUM', 'EXTRA', 'PRIMEIRA', 
    'TIPO', 'GRAÚDO', 'MÉDIO', 'GRANDE', 'PEQUENO', 'ESPECIAL',
    'SELECIONADO', 'PADRAO', 'STANDARD', 'NACIONAL', 'IMPORTADO'
  ];
  
  let limpo = texto;
  for (const palavra of palavrasRemover) {
    limpo = limpo.replace(new RegExp(`\\b${palavra}\\b`, 'gi'), '');
  }
  
  return limpo
    .replace(/\s+/g, ' ')
    .trim();
};

export const extrairValor = (linha: string): number | null => {
  const valores = linha.match(/\d{1,3}[.,]\d{2}/g);
  if (!valores || valores.length === 0) return null;
  
  const numeros = valores.map(v => parseFloat(v.replace(',', '.')));
  const maiorValor = Math.max(...numeros);
  
  if (maiorValor < 1 || maiorValor > 10000) return null;
  
  return maiorValor;
};

export const unirLinhasQuebradas = (linhas: string[]): string[] => {
  const resultado: string[] = [];

  for (let i = 0; i < linhas.length; i++) {
    let atual = linhas[i];
    const proxima = linhas[i + 1];

    const temUnidade = /(cx|sc|un|fd)\s*\d{1,3}(?:[.,]\d{1,2})?\s*kg/i.test(atual);
    const temPreco = /\d{1,3}[.,]\d{2}/.test(atual);

    if (temUnidade && !temPreco && proxima) {
      if (/\d{1,3}[.,]\d{2}/.test(proxima)) {
        atual += ' ' + proxima;
        i++;
      }
    }

    resultado.push(atual);
  }

  return resultado;
};

export const extrairProdutosDoTexto = (texto: string, dataReferencia: string, debug: boolean = false): ProdutoExtraido[] => {
  const linhas = limparTexto(texto);
  const produtos: ProdutoExtraido[] = [];
  let categoriaAtual = '';

  const unidades = ['cx', 'sc', 'un', 'fd', 'kg'];

  for (let i = 0; i < linhas.length; i++) {
    let linha = linhas[i];
    
    if (linha.length < 3) {
      categoriaAtual = '';
      continue;
    }

    if (ehCategoria(linha)) {
      categoriaAtual = normalizarTexto(linha);
      if (debug) console.log(`📁 Categoria: ${categoriaAtual}`);
      continue;
    }

    const temUnidade = unidades.some(unid => 
      new RegExp(`\\b${unid}\\b`, 'i').test(linha)
    );
    
    if (!temUnidade || !categoriaAtual) continue;

    try {
      const kgMatch = linha.match(/(cx|sc|un|fd)\s*(\d{1,3}(?:[.,]\d{1,2})?)\s*kg/i);
      if (!kgMatch) continue;

      const kg = parseFloat(kgMatch[2].replace(',', '.'));
      if (isNaN(kg) || kg === 0 || kg > 500) continue;

      const valorMc = extrairValor(linha);
      if (!valorMc) continue;

      let tipoBruto = linha
        .replace(/(cx|sc|un|fd)\s*\d{1,3}(?:[.,]\d{1,2})?\s*kg/i, '')
        .replace(/(\d{1,3}(?:[.,]\d{1,2})?)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      let tipo = limparTipo(tipoBruto);
      tipo = normalizarTexto(tipo);

      if (!tipo || tipo.length < 2) continue;

      if (debug) {
        console.log(`   📦 ${categoriaAtual} - ${tipo} | ${kg}kg | R$ ${valorMc}`);
      }

      produtos.push({
        categoria: categoriaAtual,
        tipo: tipo,
        unidade: kgMatch[1].toLowerCase(),
        kgEmbalagem: kg,
        valorMc: valorMc,
        data: dataReferencia,
        linhaOriginal: linha
      });

    } catch (err) {
      if (debug) console.log(`⚠️ Erro: ${linha.substring(0, 50)}`);
      continue;
    }
  }

  return produtos;
};