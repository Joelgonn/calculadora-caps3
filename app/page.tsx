'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SENHA_SISTEMA = 'caps3maringa';

// ==================== COMPONENTE TOAST PREMIUM ====================
const Toast = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => {
  const isSuccess = type === 'success';
  
  useEffect(() => { 
    const timer = setTimeout(onClose, 3000); 
    return () => clearTimeout(timer); 
  }, [onClose]);
  
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-xl border animate-fade-in transition-all duration-300 transform translate-y-0 ${isSuccess ? 'bg-emerald-500/90 border-emerald-400/50' : 'bg-rose-500/90 border-rose-400/50'} text-white`}>
      <span className="text-xl drop-shadow-md">{isSuccess ? '✨' : '⚠️'}</span>
      <p className="font-bold tracking-wide text-sm drop-shadow-md">{message}</p>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function LandingPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type: string) => setToast({ message, type });

  useEffect(() => {
    const authStatus = localStorage.getItem('auth_hortifruti');
    if (authStatus === 'true') {
      router.push('/dashboard/cadastro');
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SENHA_SISTEMA) {
      setIsLoading(true);
      localStorage.setItem('auth_hortifruti', 'true');
      showToast('Acesso liberado. Iniciando painel...', 'success');
      
      setTimeout(() => {
        router.push('/dashboard/cadastro');
      }, 1500);
      
    } else {
      setError('Credenciais inválidas. Tente novamente.');
      showToast('Falha na autenticação', 'error');
      setPassword('');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-900 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        <p className="text-emerald-500 font-bold text-sm tracking-widest animate-pulse uppercase">Conectando...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* ===== CSS INJETADO PARA AS NOVAS ANIMAÇÕES ===== */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes shine {
          100% { left: 125%; }
        }
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}} />

      {/* ===== BACKGROUND: IMAGEM REAL PREMIUM + OVERLAY ===== */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop" 
          alt="Hortifrúti Background" 
          className="w-full h-full object-cover opacity-50 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-slate-900/80 to-slate-900/95 backdrop-blur-[3px]"></div>
      </div>

      {/* ===== HEADER RESPONSIVO ===== */}
      <div className="absolute top-0 w-full p-6 md:p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 group-hover:bg-white/20 transition-all duration-300">
            <img src="/favicon.ico" alt="Logo" className="w-7 h-7 object-contain filter drop-shadow-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-widest text-sm drop-shadow-md">MARINGÁ</span>
            <span className="text-emerald-400 font-bold text-xs hidden md:block drop-shadow-md">SEC. DE SAÚDE • CAPS 3</span>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-xs font-bold text-emerald-400 shadow-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full relative shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
          SISTEMA ATIVO
        </div>
      </div>

      {/* ===== CARD PREMIUM (SUPER VIVO) ===== */}
      <div className="relative z-10 w-full max-w-[440px] mx-4">
        
        {/* Glow Brilhante atrás do Card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 rounded-[2.8rem] blur-xl opacity-30 animate-pulse"></div>

        {/* O Card em si */}
        <div className="relative p-8 md:p-10 bg-white/85 backdrop-blur-3xl rounded-[2.5rem] border-t-2 border-l-2 border-t-white border-l-white border-b border-r border-b-white/40 border-r-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-500">
          
          {/* Luzes dinâmicas rotativas DENTRO do card */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none animate-spin-slow opacity-40">
            <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply blur-[80px]"></div>
            <div className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply blur-[80px]"></div>
          </div>

          {/* Ícone Personalizado (Favicon) - Agora Flutuante! */}
          <div className="relative w-28 h-28 mx-auto mb-8 animate-float">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-40"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white group">
              <img 
                src="/favicon.ico" 
                alt="Logo do Sistema" 
                className="w-14 h-14 object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-5xl">📦</span>';
                }}
              />
            </div>
          </div>

          {/* Textos */}
          <div className="relative text-center mb-10 z-10">
            <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Painel CAPS 3</h1>
            <p className="text-slate-500 text-sm font-semibold px-2 leading-relaxed">
              Autenticação segura para gestão de hortifrúti.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="relative space-y-6 z-10">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <span className="text-slate-400 group-focus-within:text-emerald-600 transition-colors text-lg">🔑</span>
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }} 
                  className={`w-full bg-white/70 backdrop-blur-md border-2 ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30' : 'border-white/80 focus:border-emerald-500 focus:ring-emerald-500/30'} rounded-2xl pl-14 pr-5 py-4 text-slate-800 font-black tracking-widest placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]`}
                  placeholder="DIGITE A SENHA..." 
                  autoFocus 
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-rose-600 text-xs mt-2 ml-2 font-bold animate-fade-in flex items-center gap-1.5">
                  <span className="bg-rose-100 text-rose-600 rounded-full w-4 h-4 flex items-center justify-center">!</span>
                  {error}
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!password || isLoading}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-black py-4 rounded-2xl transition-all duration-500 shadow-[0_10px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border border-emerald-400/50"
            >
              {/* Efeito de Reflexo de Luz passando pelo botão (Shine) */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
              
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="tracking-wide text-lg relative z-10 drop-shadow-md">ACESSAR SISTEMA</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300 relative z-10 text-xl drop-shadow-md">➔</span>
                </>
              )}
            </button>
          </form>

          {/* Rodapé Interno */}
          <div className="relative mt-8 pt-6 border-t border-slate-200/60 flex justify-center items-center gap-2 opacity-80 z-10">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-slate-600 font-bold tracking-wider uppercase">
              Conexão Criptografada
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}