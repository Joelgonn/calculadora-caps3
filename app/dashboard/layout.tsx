"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Calendar,
} from "lucide-react";

// ================= NAV =================
const NAV_ITEMS = [
  {
    href: "/dashboard/cadastro",
    label: "Nova Conferência",
    icon: ClipboardList,
    description: "Lançar pesos e valores",
  },
  {
    href: "/dashboard/notas",
    label: "Notas Finalizadas",
    icon: FileText,
    description: "Histórico e relatórios",
  },
];

// ================= ANIMAÇÕES =================
const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 72 },
};

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// ================= COMPONENT =================
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  // ================= MOUNT SAFEGUARD =================
  useEffect(() => {
    setIsMounted(true);
    // ✅ Data segura - só no client
    setCurrentDate(new Date().toLocaleDateString("pt-BR"));
  }, []);

  // ================= AUTH =================
  useEffect(() => {
    // ✅ Só executa no client
    if (typeof window === 'undefined') return;
    
    try {
      const auth = localStorage.getItem("auth_hortifruti");

      if (auth !== "true") {
        // ✅ Estado correto definido antes do redirect
        setAuthorized(false);
        router.replace("/");
        return;
      }

      setAuthorized(true);

      const saved = localStorage.getItem("sidebar_collapsed");
      if (saved === "true") setCollapsed(true);
    } catch (error) {
      console.warn("Erro ao acessar localStorage:", error);
      setAuthorized(false);
      router.replace("/");
    }
  }, [router]);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem("sidebar_collapsed", String(next));
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_hortifruti");
    }
    router.replace("/");
  };

  // ✅ Blindagem contra hydration error - mostra loading enquanto verifica auth
  if (!isMounted || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // ✅ CORREÇÃO CRÍTICA: NUNCA retornar null no layout do App Router
  // ✅ Mostra mensagem de redirecionamento em vez de quebrar a árvore React
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm font-medium">Redirecionando para login...</p>
          <p className="text-slate-400 text-xs mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.2 }}
        className="bg-white border-r flex flex-col justify-between shadow-sm relative z-10"
        style={{ overflow: 'hidden' }}
      >
        {/* TOPO */}
        <div>
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-sm text-emerald-600"
              >
                CAPS 3
              </motion.div>
            )}

            <button 
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? (
                <ChevronRight size={18} className="text-slate-500" />
              ) : (
                <ChevronLeft size={18} className="text-slate-500" />
              )}
            </button>
          </div>

          {/* NAV */}
          <nav className="p-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: collapsed ? 0 : 4 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer
                      ${
                        active
                          ? "bg-emerald-50 text-emerald-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <Icon size={18} className={active ? "text-emerald-600" : "text-slate-400"} />

                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-2 border-t">
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: collapsed ? 0 : 4 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition group"
          >
            <LogOut size={18} className="group-hover:text-red-500" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sair
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="border-b bg-white/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-bold text-slate-800">
              {NAV_ITEMS.find((i) => i.href === pathname)?.label ||
                "Dashboard"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {NAV_ITEMS.find((i) => i.href === pathname)?.description ||
                "Sistema de gestão"}
            </p>
          </div>

          {/* ✅ CORREÇÃO: Data vinda do state, não new Date() direto no render */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Calendar size={14} className="text-emerald-500" />
            <span className="font-medium">{currentDate}</span>
          </div>
        </header>

        {/* PAGE */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex-1 p-6 overflow-auto"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}