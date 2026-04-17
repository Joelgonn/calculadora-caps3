'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard/cadastro', label: 'Nova Conferência', icon: '📝' },
  { href: '/dashboard/notas', label: 'Notas', icon: '📂' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('auth_hortifruti');
    if (authStatus !== 'true') {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_hortifruti');
    router.push('/');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando credenciais...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">

        {/* TOP */}
        <div>
          <div className="p-4 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black shadow-md">
              C3
            </div>
            <div>
              <p className="font-black text-slate-800 text-sm">Conferência</p>
              <p className="text-xs text-slate-400">CAPS 3</p>
            </div>
          </div>

          {/* NAV */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                    ${active
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

          {/* LEFT */}
          <div>
            <h1 className="text-lg font-black text-slate-800">
              {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-slate-400">
              Prefeitura de Maringá
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Online
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
}