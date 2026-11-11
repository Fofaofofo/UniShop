'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

const Icon = ({ name, active = false }) => {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    orders: <><path d="M6 3h12a2 2 0 0 1 2 2v16l-3.5-2-2.5 2-2.5-2L8 21l-4-2V5a2 2 0 0 1 2-2Z" /><path d="M8 8h8M8 12h8" /></>,
    account: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} {...common}>{paths[name]}</svg>;
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('inicio');
  const painel = user?.role === 'ADMIN' ? '/admin' : user?.role === 'VENDEDOR' ? '/vendedor' : '/meus-pedidos';
  const pedidos = user ? '/meus-pedidos' : '/login';
  const conta = user ? painel : '/login';

  // Se estiver na landing screen em tela cheia na rota /landing, podemos ocultar o header ou deixá-lo discreto
  const isLandingRoute = pathname === '/landing';

  useEffect(() => {
    if (pathname === '/') setActiveTab('inicio');
    else if (pathname === '/meus-pedidos') setActiveTab('pedidos');
    else if (pathname === '/login' || pathname.startsWith('/admin') || pathname.startsWith('/vendedor')) setActiveTab('conta');
  }, [pathname]);

  const tabs = [
    { id: 'inicio', label: 'Início', href: '/', icon: 'home', active: pathname === '/' && activeTab === 'inicio' },
    { id: 'explorar', label: 'Explorar', href: '/#catalogo', icon: 'search', active: pathname === '/' && activeTab === 'explorar' },
    { id: 'pedidos', label: 'Pedidos', href: pedidos, icon: 'orders', active: (pathname === '/meus-pedidos' && activeTab !== 'conta') || (pathname === '/login' && activeTab === 'pedidos') },
    { id: 'conta', label: 'Conta', href: conta, icon: 'account', active: (user && pathname.startsWith(painel) && (pathname !== '/meus-pedidos' || activeTab === 'conta')) || (!user && pathname === '/login' && activeTab === 'conta') },
  ];

  if (isLandingRoute) return null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Logo size="md" />

          <nav className="hidden items-center gap-1.5 text-sm md:flex" aria-label="Principal">
            <Link
              href="/#catalogo"
              className="rounded-xl px-3 py-2 font-medium text-slate-600 transition hover:bg-orange-50 hover:text-lagoon dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-amber-400"
            >
              Explorar
            </Link>

            <Link
              href="/landing"
              className="rounded-xl px-3 py-2 font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-amber-400"
              title="Apresentação da plataforma"
            >
              Conhecer UniShop
            </Link>

            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Entrar
                </Link>
                <Link href="/registo" className="btn-primary ml-1">
                  Criar conta
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  href="/meus-pedidos"
                  className="rounded-xl px-3 py-2 font-medium text-slate-600 transition hover:bg-orange-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Meus pedidos
                </Link>
                <Link href={painel} className="btn-primary ml-1">
                  {user.role === 'COMPRADOR' ? 'Minha conta' : 'Painel'}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Sair
                </button>
              </>
            )}

            <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {!loading && !user && (
              <Link href="/login" className="btn-primary !px-3 !py-1.5 text-xs">
                Entrar
              </Link>
            )}
            {user && (
              <Link href={painel} className="btn-primary !px-3 !py-1.5 text-xs">
                {user.role === 'COMPRADOR' ? 'Conta' : 'Painel'}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navegação móvel no rodapé */}
      <nav
        className="glass fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl p-1.5 md:hidden"
        aria-label="Navegação móvel"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            onClick={() => setActiveTab(tab.id)}
            aria-current={tab.active ? 'page' : undefined}
            className={`relative flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-all duration-200 ${
              tab.active
                ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-400/15 dark:text-amber-400'
                : 'text-slate-500 hover:bg-white/70 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
            }`}
          >
            <Icon name={tab.icon} active={tab.active} />
            <span className="truncate">{tab.label}</span>
            {tab.active && (
              <span className="absolute bottom-1 h-0.5 w-5 rounded-full bg-amber-500 dark:bg-amber-400" />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
