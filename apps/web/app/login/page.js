'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Msg } from '@/components/ui';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function Login() {
  const { refresh } = useAuth();
  const [f, setF] = useState({ matricula: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const u = await api('/auth/login', { method: 'POST', body: f });
      await refresh();
      window.location.href = u.role === 'ADMIN' ? '/admin' : u.role === 'VENDEDOR' ? '/vendedor' : '/';
    } catch (e2) {
      if (e2.data?.precisaVerificar) {
        window.location.href = `/registo?verificar=${e2.data.telefone}`;
      } else {
        setErr(e2.message);
      }
    }
    setBusy(false);
  };

  return (
    <div className="relative -mx-4 -mt-6 -mb-28 min-h-screen overflow-hidden sm:-mx-6 lg:-mx-8 flex items-center justify-center p-4 py-12 sm:py-16">
      {/* Imagem de Fundo de Estudantes Universitários Negros no Campus */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/login-campus.jpg"
        alt="Estudantes em Ambiente Acadêmico ISPTEC"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay translúcido equilibrado: permite ver com total nitidez os estudantes ao fundo */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/50 to-black/40" />

      {/* Botões do Topo */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20 max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-black/50 px-3.5 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-black/70 hover:text-amber-400 border border-white/15"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Vitrine UniShop
        </Link>
        <ThemeToggle className="bg-black/50 border-white/15 text-white hover:bg-black/70 hover:text-amber-400" />
      </div>

      {/* Glassform Central */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={submit}
          className="glassform border-white/30 bg-white/90 dark:border-white/10 dark:bg-slate-950/85 shadow-2xl backdrop-blur-2xl transition-all duration-300 space-y-5"
        >
          {/* Cabeçalho do Card */}
          <div className="text-center space-y-3">
            <div className="inline-flex justify-center mb-1">
              <Logo size="lg" link={false} />
            </div>

            {/* Selo de Ambiente Acadêmico sem emojis */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              Ambiente Acadêmico · Partilha & Oportunidades
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Aceder à Plataforma
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compre, venda e alugue materiais com total segurança e confiança no campus do ISPTEC.
            </p>
          </div>

          {/* Campo Matrícula */}
          <div className="space-y-1.5">
            <label className="label text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300" htmlFor="m">
              Número de Matrícula
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="m"
                className="glassform-input pl-10"
                placeholder="Ex: 20230123 ou AdminUniShop"
                value={f.matricula}
                onChange={(e) => setF({ ...f, matricula: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Campo Password */}
          <div className="space-y-1.5">
            <label className="label text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300" htmlFor="p">
              Palavra-passe
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="p"
                type="password"
                className="glassform-input pl-10"
                placeholder="••••••••"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Msg error={err} />

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy}
          >
            {busy ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <svg className="h-4 w-4 animate-spin text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                A validar credenciais…
              </span>
            ) : (
              'Entrar na Plataforma'
            )}
          </button>

          {/* Rodapé do Card */}
          <div className="pt-2 text-center space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ainda não tem conta no campus?{' '}
              <Link href="/registo" className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
                Criar conta de estudante
              </Link>
            </p>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Autenticação Segura
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Exclusivo ISPTEC
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
