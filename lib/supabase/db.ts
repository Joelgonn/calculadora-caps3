// lib/supabase/db.ts
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

// ==================== TIPOS ====================

export interface ItemNota {
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

export interface NotaFiscal {
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

export interface PrecoCeasa {
  categoria: string;
  tipo: string;
  kgEmbalagem: number;
  valorMc: number;
  dataReferencia?: string;
}

// ==================== HELPER SEGURO PARA NÚMEROS ====================

/**
 * 🔥 Converte qualquer valor para número de forma segura
 * Evita NaN e Infinity, retorna 0 em caso de valor inválido
 */
const toNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  if (!isFinite(n)) return 0;
  return isNaN(n) ? 0 : n;
};

// ==================== SANITIZADORES ====================

/**
 * 🔥 Sanitiza um item antes de enviar para o Supabase
 * Remove undefined, NaN, Infinity e valores não serializáveis
 * 🔥 CORREÇÃO: Preserva valores 0 (não converte para null)
 */
const sanitizarItem = (item: ItemNota): any => {
  return {
    id: item.id || uuidv4(),
    produtoId: toNumber(item.produtoId),
    produtoNome: String(item.produtoNome || ''),
    desconto: toNumber(item.desconto),
    kgCaixa: toNumber(item.kgCaixa),
    valorCaixa: toNumber(item.valorCaixa),
    precoUnitarioSemDesconto: toNumber(item.precoUnitarioSemDesconto),
    precoUnitarioComDesconto: toNumber(item.precoUnitarioComDesconto),
    quantidadeStr: String(item.quantidadeStr || '0'),
    quantidade: toNumber(item.quantidade),
    totalSemDesconto: toNumber(item.totalSemDesconto),
    total: toNumber(item.total),

    // 🔥 CORREÇÃO: Strings podem ser vazias, mas null é diferente de ""
    precoUnitarioNotaStr: item.precoUnitarioNotaStr !== undefined && item.precoUnitarioNotaStr !== null
      ? String(item.precoUnitarioNotaStr)
      : null,

    // 🔥 CORREÇÃO: Usa !== undefined para preservar valor 0
    precoUnitarioNota: item.precoUnitarioNota !== undefined
      ? toNumber(item.precoUnitarioNota)
      : null,

    // 🔥 CORREÇÃO: Usa !== undefined para preservar valor 0
    totalNota: item.totalNota !== undefined
      ? toNumber(item.totalNota)
      : null,

    // 🔥 CORREÇÃO: Usa !== undefined para preservar valor 0
    precoCeasa: item.precoCeasa !== undefined
      ? toNumber(item.precoCeasa)
      : null,

    // 🔥 CORREÇÃO: Usa !== undefined para preservar valor 0
    diferenca: item.diferenca !== undefined
      ? toNumber(item.diferenca)
      : null,

    // 🔥 CORREÇÃO: Regra explícita, não mascara erro
    statusValidacao: item.statusValidacao === 'divergente' ? 'divergente' : 'ok'
  };
};

/**
 * 🔥 Sanitiza uma nota fiscal completa antes de enviar para o Supabase
 */
const sanitizarNota = (nota: NotaFiscal): any => {
  // Garantir que os itens estejam sanitizados
  const itensSanitizados = nota.itens.map(item => sanitizarItem(item));
  
  // Validar se a serialização JSON funciona (teste crítico)
  try {
    JSON.stringify(itensSanitizados);
  } catch (serializeError) {
    console.error('❌ Erro de serialização dos itens:', serializeError);
    throw new Error(`Não foi possível serializar os itens da nota: ${serializeError instanceof Error ? serializeError.message : 'Erro desconhecido'}`);
  }
  
  return {
    id: nota.id,
    empresa: String(nota.empresa || ''),
    empenho: String(nota.empenho || ''),
    numero_nota: String(nota.numeroNota || ''),
    data: nota.data || new Date().toISOString().split('T')[0],
    data_tabela_ceasa: nota.dataTabelaCeasa || new Date().toISOString().split('T')[0],
    itens: itensSanitizados,
    total_geral: toNumber(nota.totalGeral),
    status_validacao: nota.statusValidacao === 'divergente' ? 'divergente' : 'ok',
    updated_at: new Date().toISOString()
  };
};

/**
 * 🔥 Sanitiza um produto CEASA antes de enviar para o Supabase
 */
const sanitizarProdutoCeasa = (produto: PrecoCeasa): any => {
  return {
    categoria: String(produto.categoria || ''),
    tipo: String(produto.tipo || ''),
    kgEmbalagem: toNumber(produto.kgEmbalagem),
    valorMc: toNumber(produto.valorMc),
    dataReferencia: produto.dataReferencia || new Date().toISOString().split('T')[0]
  };
};

// ==================== NOTAS FISCAIS ====================

/**
 * Salva ou atualiza uma nota fiscal no Supabase
 * 🔥 Usa UPSERT com onConflict: 'id' - se ID existe, atualiza; se não, insere
 * 🔥 Inclui sanitização completa antes de enviar
 */
export const salvarNotaFiscal = async (nota: NotaFiscal) => {
  try {
    // 🔥 SANITIZAR ANTES DE ENVIAR
    const notaSanitizada = sanitizarNota(nota);
    
    // 🔥 DEBUG: Verificar se a serialização funciona
    const testJson = JSON.stringify(notaSanitizada.itens);
    console.log(`✅ [DEBUG] Itens serializáveis: ${testJson.length} caracteres`);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .upsert(notaSanitizada, { 
        onConflict: 'id' 
      })
      .select();

    if (error) {
      // 🔥 LOG DETALHADO DO ERRO
      console.error('❌ Erro Supabase detalhado:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        full: error
      });
      throw error;
    }
    
    console.log(`✅ Nota ${nota.id} salva/atualizada com sucesso no Supabase`);
    return data;
    
  } catch (error) {
    // 🔥 RELANÇAR COM MAIS CONTEXTO
    console.error('❌ Erro ao salvar nota fiscal:', error);
    throw new Error(`Falha ao salvar nota no Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Busca uma nota fiscal pelo ID
 */
export const buscarNotaFiscal = async (id: string) => {
  const { data, error } = await supabase
    .from('notas_fiscais')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ Erro ao buscar nota fiscal:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  return data as NotaFiscal;
};

/**
 * Lista todas as notas fiscais (ordenadas por data decrescente)
 */
export const listarNotasFiscais = async () => {
  const { data, error } = await supabase
    .from('notas_fiscais')
    .select('*')
    .order('data', { ascending: false });

  if (error) {
    console.error('❌ Erro ao listar notas fiscais:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  return data as NotaFiscal[];
};

/**
 * Deleta uma nota fiscal pelo ID
 */
export const deletarNotaFiscal = async (id: string) => {
  const { error } = await supabase
    .from('notas_fiscais')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ Erro ao deletar nota fiscal:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  console.log(`✅ Nota ${id} deletada com sucesso`);
  return true;
};

// ==================== CEASA PREÇOS ====================

/**
 * Salva ou atualiza preços da CEASA
 * 🔥 Usa UPSERT com onConflict: 'data' - se já existe preço para esta data, atualiza
 * 🔥 Inclui sanitização completa antes de enviar
 */
export const salvarPrecosCeasa = async (data: string, produtos: PrecoCeasa[]) => {
  try {
    // 🔥 SANITIZAR PRODUTOS ANTES DE ENVIAR
    const produtosSanitizados = produtos.map(p => sanitizarProdutoCeasa(p));
    
    // 🔥 DEBUG: Verificar se a serialização funciona
    const testJson = JSON.stringify(produtosSanitizados);
    console.log(`✅ [DEBUG] ${produtosSanitizados.length} produtos serializáveis: ${testJson.length} caracteres`);
    
    const id = uuidv4();
    
    const { data: result, error } = await supabase
      .from('ceasa_precos')
      .upsert({
        id: id,
        data: data,
        produtos: produtosSanitizados,
        total_produtos: produtosSanitizados.length,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'data'
      })
      .select();

    if (error) {
      // 🔥 LOG DETALHADO DO ERRO
      console.error('❌ Erro Supabase detalhado (CEASA):', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        full: error
      });
      throw error;
    }
    
    console.log(`✅ ${produtosSanitizados.length} preços CEASA salvos para data ${data}`);
    return result;
    
  } catch (error) {
    console.error('❌ Erro ao salvar preços CEASA:', error);
    throw new Error(`Falha ao salvar preços CEASA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Busca preços da CEASA por data
 */
export const buscarPrecosCeasa = async (data: string) => {
  try {
    const { data: result, error } = await supabase
      .from('ceasa_precos')
      .select('produtos')
      .eq('data', data)
      .maybeSingle();

    if (error) {
      console.error('❌ Erro ao buscar preços CEASA:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }
    
    const produtos = result?.produtos || [];
    console.log(`✅ ${produtos.length} preços CEASA encontrados para data ${data}`);
    return produtos;
    
  } catch (error) {
    console.error('❌ Erro inesperado ao buscar preços CEASA:', error);
    return [];
  }
};

/**
 * Lista todos os preços da CEASA (ordenados por data decrescente)
 */
export const listarPrecosCeasa = async () => {
  const { data, error } = await supabase
    .from('ceasa_precos')
    .select('*')
    .order('data', { ascending: false });

  if (error) {
    console.error('❌ Erro ao listar preços CEASA:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  return data;
};

/**
 * Deleta preços da CEASA por data
 */
export const deletarPrecosCeasa = async (data: string) => {
  const { error } = await supabase
    .from('ceasa_precos')
    .delete()
    .eq('data', data);

  if (error) {
    console.error('❌ Erro ao deletar preços CEASA:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  console.log(`✅ Preços CEASA para data ${data} deletados com sucesso`);
  return true;
};