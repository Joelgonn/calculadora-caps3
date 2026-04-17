'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Calendar
} from 'lucide-react';

const NAV_ITEMS = [
  { 
    href: '/dashboard/cadastro', 
    label: 'Nova Conferência', 
    icon: ClipboardList, 
    description: 'Lançar pesos e valores' 
  },
  { 
    href: '/dashboard/notas', 
    label: 'Notas Finalizadas', 
    icon: FileText, 
    description: 'Histórico e relatórios' 
  },
];

// ==================== ANIMAÇÕES SIMPLIFICADAS ====================
// Usando strings literais em vez de objetos complexos
const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 72 }
};

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const tooltipVariants = {
  hidden: { opacity: 0, x: -8, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // 🔐 AUTH
  useEffect(() => {
    const authStatus = localStorage.getItem('auth_hortifruti');
    if (authStatus !== 'true') {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }

    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved === 'true') setCollapsed(true);
  }, [router]);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair do sistema?')) {
      localStorage.removeItem('auth_hortifruti');
      router.push('/');
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      
      {/* SIDEBAR PREMIUM COM ÍCONES MODERNOS */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.2, type: 'tween' }}
        className="relative bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col justify-between shadow-xl z-30"
      >
        {/* Efeito de vidro na sidebar */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/30 pointer-events-none"></div>
        
        {/* TOPO DA SIDEBAR */}
        <div className="relative z-10">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black shadow-md text-sm">
                  C3
                </div>
              </motion.div>
              
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="leading-tight"
                  >
                    <p className="font-bold text-slate-800 text-sm tracking-tight">Conferência</p>
                    <p className="text-[10px] text-slate-400 font-medium">CAPS 3 • Maringá</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button 
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </motion.button>
          </div>

          {/* NAVEGAÇÃO COM ÍCONES LUCIDE */}
          <nav className="p-2 space-y-1">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <div key={item.href} className="relative">
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
                        ${active 
                          ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
                        }`}
                    >
                      {/* INDICADOR ATIVO ANIMADO */}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-r-full shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                        />
                      )}
                      
                      <Icon size={18} className="relative z-10" />
                      
                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10 flex-1 text-sm"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                  
                  {/* TOOLTIP QUANDO COLAPSADO */}
                  {collapsed && hoveredItem === item.href && (
                    <motion.div
                      variants={tooltipVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.15 }}
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 pointer-events-none"
                    >
                      <div className="bg-slate-800 text-white px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shadow-lg border border-white/10 flex items-center gap-1.5">
                        <Icon size={12} />
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-1.5 h-1.5 bg-slate-800 rotate-45"></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM DA SIDEBAR - LOGOUT */}
        <div className="relative z-10 p-2 border-t border-slate-100">
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Sair do Sistema
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER COM ÍCONES MODERNOS */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div>
              <motion.h1 
                key={pathname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-base font-bold text-slate-800"
              >
                {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Dashboard'}
              </motion.h1>
              <motion.p 
                key={`${pathname}-desc`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] text-slate-400"
              >
                {NAV_ITEMS.find(i => i.href === pathname)?.description || 'Sistema de Conferência'}
              </motion.p>
            </div>

            <div className="flex items-center gap-3">
              {/* STATUS DO SISTEMA */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1 rounded-full border border-emerald-200/50 shadow-sm"
              >
                <div className="relative">
                  <span className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full blur-[1px] animate-pulse opacity-50"></span>
                  <span className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full block animate-pulse"></span>
                </div>
                <span className="text-emerald-700 text-[10px] font-bold tracking-wide">ATIVO</span>
              </motion.div>
              
              {/* DATA/HORA */}
              <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
                <Calendar size={12} className="text-slate-400" />
                <span className="text-slate-600 font-medium">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE TRANSITION */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, type: 'tween' }}
            className="flex-1 overflow-auto p-5"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        
      </div>
    </div>
  );
}