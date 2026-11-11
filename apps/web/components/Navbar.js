'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const painel = user?.role === 'ADMIN' ? '/admin' : user?.role === 'VENDEDOR' ? '/vendedor' : '/meus-pedidos';
  return (
    <header className="sticky top-0 z-40 border-b border-lagoon-dark bg-lagoon text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
          ISPTEC <span className="text-sol">Marketplace</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm" aria-label="Principal">
          {!loading && !user && (<>
            <Link href="/login" className="rounded-md px-3 py-1.5 hover:bg-lagoon-dark">Entrar</Link>
            <Link href="/registo" className="btn-sol">Criar conta</Link>
          </>)}
          {user && (<>
            <Link href={painel} className="rounded-md px-3 py-1.5 hover:bg-lagoon-dark">{user.role === 'COMPRADOR' ? 'Meus pedidos' : 'Painel'}</Link>
            <button onClick={logout} className="rounded-md px-3 py-1.5 hover:bg-lagoon-dark">Sair</button>
          </>)}
        </nav>
      </div>
    </header>
  );
}
