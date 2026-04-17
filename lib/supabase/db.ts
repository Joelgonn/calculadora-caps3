import { supabase } from './client';

// ==================== PREÇOS CEASA ====================
export async function salvarPrecosCeasa(data: string, produtos: any[]) {
  try {
    // Verificar se já existe registro para esta data
    const { data: existing } = await supabase
      .from('ceasa_precos')
      .select('id')
      .eq('data', data)
      .maybeSingle();

    if (existing) {
      // Atualizar registro existente
      const { data: result, error } = await supabase
        .from('ceasa_precos')
        .update({
          produtos: produtos,
          total_produtos: produtos.length,
          updated_at: new Date().toISOString()
        })
        .eq('data', data)
        .select();

      if (error) throw error;
      console.log(`✅ Preços atualizados para ${data}`);
      return result;
    } else {
      // Inserir novo registro
      const { data: result, error } = await supabase
        .from('ceasa_precos')
        .insert({
          data: data,
          produtos: produtos,
          total_produtos: produtos.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      console.log(`✅ Preços salvos para ${data}`);
      return result;
    }
  } catch (error) {
    console.error('❌ Erro ao salvar preços CEASA:', error);
    throw error;
  }
}

export async function buscarPrecosCeasa(data: string) {
  try {
    const { data: result, error } = await supabase
      .from('ceasa_precos')
      .select('produtos')
      .eq('data', data)
      .maybeSingle(); // Retorna null se não encontrar, em vez de erro

    if (error) {
      console.error('Erro ao buscar preços CEASA:', error);
      return null;
    }
    
    if (!result) {
      console.log(`📭 Nenhum preço encontrado para ${data}`);
      return null;
    }
    
    console.log(`📦 ${result.produtos?.length || 0} preços carregados para ${data}`);
    return result.produtos || null;
  } catch (error) {
    console.error('❌ Erro ao buscar preços CEASA:', error);
    return null;
  }
}

// ==================== NOTAS FISCAIS ====================
export async function salvarNotaFiscal(nota: any) {
  try {
    const { data: result, error } = await supabase
      .from('notas_fiscais')
      .insert({
        empresa: nota.empresa,
        empenho: nota.empenho,
        data: nota.data,
        data_tabela_ceasa: nota.dataTabelaCeasa,
        itens: nota.itens,
        total_geral: nota.totalGeral,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    console.log(`✅ Nota fiscal ${nota.empenho} salva com sucesso`);
    return result;
  } catch (error) {
    console.error('❌ Erro ao salvar nota fiscal:', error);
    throw error;
  }
}

export async function buscarTodasNotas() {
  try {
    const { data: result, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return result || [];
  } catch (error) {
    console.error('❌ Erro ao buscar notas:', error);
    return [];
  }
}

export async function buscarNotasPorEmpresa(empresa: string) {
  try {
    const { data: result, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .ilike('empresa', `%${empresa}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return result || [];
  } catch (error) {
    console.error('❌ Erro ao buscar notas por empresa:', error);
    return [];
  }
}

export async function deletarNotaFiscal(id: string) {
  try {
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Nota fiscal ${id} deletada com sucesso`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar nota fiscal:', error);
    return false;
  }
}