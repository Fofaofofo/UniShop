'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function Guard({ roles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || (roles && !roles.includes(user.role)))) router.replace('/login');
  }, [user, loading, roles, router]);
  if (loading || !user || (roles && !roles.includes(user.role))) return <p className="p-8 text-sm text-slate-500 dark:text-slate-400">A carregar…</p>;
  return children;
}

export function Msg({ error, ok }) {
  if (!error && !ok) return null;
  return (
    <p
      role="alert"
      className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${
        error
          ? 'bg-red-50 text-red-800 border border-red-200 dark:border-red-900/50 dark:bg-red-950/70 dark:text-red-300'
          : 'bg-lagoon-soft text-lagoon-dark border border-amber-200 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-300'
      }`}
    >
      {error || ok}
    </p>
  );
}

const BADGE = {
  ATIVO: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
  OCULTO: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  PENDENTE: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
  PAUSADO: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
  APROVADO: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
  REJEITADO: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300',
  EXPIRADO: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  SOLICITADO: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
  EM_CURSO: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
  DEVOLVIDO: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
  ATRASADO: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300',
  CANCELADO: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  ABERTA: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
  RESOLVIDA: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
};

export const Badge = ({ s }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[s] || 'bg-slate-100 dark:bg-slate-800 dark:text-slate-300'}`}>
    {s.replace('_', ' ')}
  </span>
);

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/70" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="btn-ghost !px-2.5 !py-1 text-xs" aria-label="Fechar">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Stars({ value = 0, onChange }) {
  return (
    <span className="inline-flex" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value || 0} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`text-xl leading-none transition-colors ${n <= Math.round(value) ? 'text-sol dark:text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
          aria-label={`${n} estrelas`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export function useLoad(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const reload = () => fn().then(setData).catch((e) => setError(e.message));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, deps);
  return { data, error, reload, setData };
}

export function SubNav({ links }) {
  const path = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-line pb-3 dark:border-slate-800" aria-label="Secções">
      {links.map(([href, label]) => (
        <a
          key={href}
          href={href}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            path === href
              ? 'bg-lagoon text-white dark:bg-amber-500 dark:text-slate-950 font-bold'
              : 'hover:bg-lagoon-soft dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
