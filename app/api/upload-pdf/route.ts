import { NextRequest, NextResponse } from 'next/server';
import { 
  parsePDF, 
  extrairProdutosDoTexto,
  unirLinhasQuebradas,
  ProdutoExtraido
} from '@/lib/pdfParser';

export const runtime = 'nodejs';

// ==================== API ROUTE PRINCIPAL ====================
export async function POST(request: NextRequest) {
  const debug = process.env.NODE_ENV === 'development';
  const dataReferencia = new Date().toISOString().split('T')[0];
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nenhum arquivo enviado' 
      }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ 
        success: false, 
        error: 'Arquivo deve ser PDF' 
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Usa o parser isolado com layout-aware
    const textoExtraido = await parsePDF(buffer);
    
    // Processa o texto
    const linhas = textoExtraido.split('\n').filter(l => l.trim().length > 0);
    const linhasCorrigidas = unirLinhasQuebradas(linhas);
    const textoCompleto = linhasCorrigidas.join('\n');

    // Extrai produtos
    let produtosExtraidos: ProdutoExtraido[] = extrairProdutosDoTexto(textoCompleto, dataReferencia, debug);

    // Filtro de qualidade
    produtosExtraidos = produtosExtraidos.filter(p => 
      p.kgEmbalagem > 0 &&
      p.kgEmbalagem < 500 &&
      p.valorMc > 0 &&
      p.valorMc < 10000 &&
      p.categoria.length > 2 &&
      p.tipo.length > 2
    );

    // Remove duplicatas
    const produtosUnicos: ProdutoExtraido[] = [];
    const chaves = new Set<string>();
    
    for (const produto of produtosExtraidos) {
      const chave = `${produto.categoria}|${produto.tipo}|${produto.kgEmbalagem}`;
      if (!chaves.has(chave)) {
        chaves.add(chave);
        produtosUnicos.push(produto);
      }
    }

    if (debug) {
      console.log('\n📊 ===== RESULTADO FINAL =====');
      console.log(`📅 Data referência: ${dataReferencia}`);
      console.log(`📦 Produtos únicos: ${produtosUnicos.length}`);
      produtosUnicos.slice(0, 10).forEach((p, idx) => {
        console.log(`   ${idx + 1}. ${p.categoria} - ${p.tipo} | ${p.kgEmbalagem}kg | R$ ${p.valorMc.toFixed(2)}`);
      });
      console.log('=============================\n');
    }

    // Resposta pronta para Supabase
    return NextResponse.json({
      success: true,
      totalProdutos: produtosUnicos.length,
      produtos: produtosUnicos.map(p => ({
        categoria: p.categoria,
        tipo: p.tipo,
        kgEmbalagem: p.kgEmbalagem,
        valorMc: p.valorMc
      })),
      dataReferencia: dataReferencia
    });

  } catch (error) {
    console.error('❌ Erro ao processar PDF:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao processar o arquivo PDF',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}