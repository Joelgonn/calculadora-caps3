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

  // ================= MOUNT SAFEGUARD =================
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ================= AUTH =================
  useEffect(() => {
    // ✅ Só executa no client
    if (typeof window === 'undefined') return;
    
    try {
      const auth = localStorage.getItem("auth_hortifruti");

      if (auth !== "true") {
        router.replace("/");
        return;
      }

      setAuthorized(true);

      const saved = localStorage.getItem("sidebar_collapsed");
      if (saved === "true") setCollapsed(true);
    } catch (error) {
      console.warn("Erro ao acessar localStorage:", error);
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

  // ✅ Se não autorizado, não renderiza nada (já vai redirecionar)
  if (!authorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.2 }}
        className="bg-white border-r flex flex-col justify-between shadow-sm"
        style={{ overflow: 'hidden' }}
      >
        {/* TOPO */}
        <div>
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <div className="font-bold text-sm text-slate-800">
                Conferência
              </div>
            )}

            <button 
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
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
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer
                      ${
                        active
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <Icon size={18} />

                    {!collapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-2 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="border-b bg-white px-6 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-sm font-bold text-slate-800">
              {NAV_ITEMS.find((i) => i.href === pathname)?.label ||
                "Dashboard"}
            </h1>
            <p className="text-xs text-slate-400">
              {NAV_ITEMS.find((i) => i.href === pathname)?.description ||
                "Sistema"}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Calendar size={14} />
            {typeof window !== 'undefined' && new Date().toLocaleDateString("pt-BR")}
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
            className="flex-1 p-5 overflow-auto"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}