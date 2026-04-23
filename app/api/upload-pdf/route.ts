import { NextRequest, NextResponse } from 'next/server';
import { extrairProdutosDoPDF, ProdutoCEASA } from '@/lib/pdfParser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ==================== UTIL ====================
const normalizarTexto = (texto: string) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

// ==================== VALIDAÇÃO DE DATA ====================
const isDataValida = (data?: string): boolean => {
  if (!data) return false;

  const partes = data.split('/');
  if (partes.length !== 3) return false;

  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const ano = parseInt(partes[2], 10);

  if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return false;

  return (
    ano >= 2020 &&
    ano <= 2100 &&
    mes >= 1 &&
    mes <= 12 &&
    dia >= 1 &&
    dia <= 31
  );
};

// Converter data DD/MM/AAAA para AAAA-MM-DD
const converterDataParaISO = (dataBr: string): string => {
  const partes = dataBr.split('/');
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

// 🔥 VALIDADOR DE PRODUTO (CRÍTICO)
const validarProduto = (p: ProdutoCEASA): boolean => {
  if (!p) return false;

  if (!p.categoria || p.categoria.length < 2) return false;
  if (!p.tipo || p.tipo.length < 2) return false;
  if (!p.valorMc || p.valorMc <= 0 || p.valorMc > 500) return false;
  if (!p.kgEmbalagem || p.kgEmbalagem <= 0 || p.kgEmbalagem > 100) return false;

  return true;
};

// 🔥 SANITIZAÇÃO
const sanitizarProduto = (p: ProdutoCEASA): ProdutoCEASA => {
  return {
    ...p,
    categoria: normalizarTexto(p.categoria),
    tipo: normalizarTexto(p.tipo),
    kgEmbalagem: Number(p.kgEmbalagem),
    valorMc: Number(p.valorMc)
  };
};

// ==================== API ====================
export async function POST(request: NextRequest) {
  const debug = process.env.NODE_ENV === 'development';
  const dataReferenciaDefault = new Date().toISOString().split('T')[0];

  console.log('📄 [API] Iniciando processamento de PDF...');

  try {
    // ==================== 1. FORM DATA ====================
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ [API] Nenhum arquivo enviado');
      return NextResponse.json({
        success: false,
        error: 'Nenhum arquivo enviado'
      }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      console.error('❌ [API] Tipo de arquivo inválido:', file.type);
      return NextResponse.json({
        success: false,
        error: 'Arquivo deve ser PDF'
      }, { status: 400 });
    }

    console.log(`📄 [API] Arquivo: ${file.name} | ${(file.size / 1024).toFixed(2)}KB`);

    // ==================== 2. BUFFER ====================
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validar magic number do PDF
    const isPDF =
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46;

    if (!isPDF) {
      console.error('❌ [API] Arquivo não é um PDF válido');
      return NextResponse.json({
        success: false,
        error: 'Arquivo não é um PDF válido'
      }, { status: 400 });
    }

    // ==================== 3. EXTRAIR PRODUTOS E DATA (USANDO APENAS PDF-PARSE) ====================
    let produtosBrutos: ProdutoCEASA[] = [];
    let dataExtraidaBruta: string | undefined = undefined;

    try {
      // 🔥 REMOVIDO: extrairDataPDFjs
      // 🔥 AGORA USA APENAS O extrairProdutosDoPDF que já extrai a data internamente
      const resultado = await extrairProdutosDoPDF(buffer, undefined, debug);
      produtosBrutos = resultado.produtos;
      dataExtraidaBruta = resultado.dataExtraida; // 👈 Data no formato DD/MM/AAAA vinda do pdf-parse
      
      console.log(`✅ [API] Extraídos: ${produtosBrutos.length} produtos brutos`);
      
      if (dataExtraidaBruta) {
        console.log(`✅ [API] Data extraída do PDF: ${dataExtraidaBruta}`);
      } else {
        console.log(`⚠️ [API] Nenhuma data encontrada no PDF`);
      }
      
    } catch (err) {
      console.error('❌ [API] Erro na extração:', err);
      return NextResponse.json({
        success: false,
        error: 'Erro ao extrair dados do PDF. Verifique se o arquivo é válido.',
        details: err instanceof Error ? err.message : 'Erro desconhecido'
      }, { status: 422 });
    }

    // ==================== 4. SANITIZAÇÃO ====================
    const produtosSanitizados: ProdutoCEASA[] = [];
    const rejeitados: ProdutoCEASA[] = [];

    for (const p of produtosBrutos) {
      const sanitizado = sanitizarProduto(p);

      if (validarProduto(sanitizado)) {
        produtosSanitizados.push(sanitizado);
      } else {
        rejeitados.push(p);
        if (debug) {
          console.warn(`⚠️ [API] Produto rejeitado: ${p.categoria} | ${p.tipo} | ${p.kgEmbalagem}kg | R$ ${p.valorMc}`);
        }
      }
    }

    console.log(`✅ [API] Após sanitização: ${produtosSanitizados.length} produtos válidos`);

    // ==================== 5. REMOVER DUPLICADOS ====================
    const mapa = new Map<string, ProdutoCEASA>();

    for (const p of produtosSanitizados) {
      const chave = `${p.categoria}|${p.tipo}|${p.kgEmbalagem}`;
      if (!mapa.has(chave)) {
        mapa.set(chave, p);
      }
    }

    const produtosUnicos = Array.from(mapa.values());

    console.log(`✅ [API] Após remoção de duplicados: ${produtosUnicos.length} produtos únicos`);

    // ==================== 6. DEFINIR DATA DE REFERÊNCIA ====================
    let dataReferenciaFinal: string;
    let dataExtraidaISO: string | undefined = undefined;
    
    // Converte a data extraída (DD/MM/AAAA) para ISO (AAAA-MM-DD) se for válida
    if (dataExtraidaBruta && isDataValida(dataExtraidaBruta)) {
      dataExtraidaISO = converterDataParaISO(dataExtraidaBruta);
      dataReferenciaFinal = dataExtraidaISO;
      console.log(`📅 [API] Usando data do PDF (pdf-parse): ${dataExtraidaBruta} -> ${dataExtraidaISO}`);
    } else {
      const dataDoForm = formData.get('dataReferencia') as string | null;
      if (dataDoForm) {
        dataReferenciaFinal = dataDoForm;
        console.log(`📅 [API] Usando data do formulário: ${dataDoForm}`);
      } else {
        dataReferenciaFinal = dataReferenciaDefault;
        console.log(`📅 [API] Usando data atual (fallback): ${dataReferenciaDefault}`);
      }
    }

    // ==================== 7. DEBUG ====================
    if (debug) {
      console.log('\n📊 ===== DEBUG API =====');
      console.log(`📅 Data referência (usada nos produtos): ${dataReferenciaFinal}`);
      console.log(`📅 Data extraída do PDF (pdf-parse): ${dataExtraidaBruta || '❌ Não encontrada'}`);
      console.log(`✔ Válidos e únicos: ${produtosUnicos.length}`);
      console.log(`❌ Rejeitados: ${rejeitados.length}`);

      if (rejeitados.length > 0) {
        console.log('⚠️ Produtos rejeitados (amostra):');
        rejeitados.slice(0, 10).forEach((p, idx) => {
          console.log(`   ${idx + 1}. ${p.categoria} | ${p.tipo} | ${p.kgEmbalagem}kg | R$ ${p.valorMc}`);
        });
        if (rejeitados.length > 10) {
          console.log(`   ... e mais ${rejeitados.length - 10} produtos rejeitados`);
        }
      }

      if (produtosUnicos.length > 0) {
        console.log('✅ Produtos válidos (amostra):');
        produtosUnicos.slice(0, 10).forEach((p, idx) => {
          const tipoDisplay = p.tipo.length > 40 ? p.tipo.substring(0, 37) + '...' : p.tipo;
          console.log(`   ${idx + 1}. ${p.categoria} - ${tipoDisplay} | ${p.kgEmbalagem}kg | R$ ${p.valorMc.toFixed(2)}`);
        });
        if (produtosUnicos.length > 10) {
          console.log(`   ... e mais ${produtosUnicos.length - 10} produtos válidos`);
        }
      }
      console.log('=======================\n');
    }

    // ==================== 8. RESPOSTA ====================
    if (produtosUnicos.length === 0) {
      console.warn('⚠️ [API] Nenhum produto válido encontrado no PDF');
      return NextResponse.json({
        success: false,
        error: 'Nenhum produto válido encontrado no PDF. Verifique se o arquivo contém dados da CEASA no formato esperado.',
        produtos: [],
        totalProdutos: 0,
        rejeitados: rejeitados.length
      }, { status: 200 });
    }

    const respostaProdutos = produtosUnicos.map(p => ({
      categoria: p.categoria,
      tipo: p.tipo,
      kgEmbalagem: p.kgEmbalagem,
      valorMc: p.valorMc,
      dataReferencia: dataReferenciaFinal
    }));

    console.log(`✅ [API] Sucesso! Retornando ${respostaProdutos.length} produtos para o frontend`);

    return NextResponse.json({
      success: true,
      totalProdutos: respostaProdutos.length,
      produtos: respostaProdutos,
      dataReferencia: dataReferenciaFinal,
      dataExtraida: dataExtraidaBruta, // 👈 Envia a data no formato DD/MM/AAAA
      rejeitadosCount: rejeitados.length
    });

  } catch (error) {
    console.error('❌ [API] Erro inesperado:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno ao processar o PDF',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}