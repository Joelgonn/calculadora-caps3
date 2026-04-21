import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não configuradas!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Não configurada');
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Teste de conexão (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  supabase.from('notas_fiscais').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error('❌ Erro de conexão com Supabase:', error.message);
      } else {
        console.log('✅ Supabase conectado com sucesso!');
      }
    });
}