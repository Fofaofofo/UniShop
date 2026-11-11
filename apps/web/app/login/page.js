'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Msg } from '@/components/ui';

export default function Login() {
  const { refresh } = useAuth();
  const [f, setF] = useState({ matricula: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const u = await api('/auth/login', { method: 'POST', body: f });
      await refresh();
      window.location.href = u.role === 'ADMIN' ? '/admin' : u.role === 'VENDEDOR' ? '/vendedor' : '/';
    } catch (e2) {
      if (e2.data?.precisaVerificar) window.location.href = `/registo?verificar=${e2.data.telefone}`;
      else setErr(e2.message);
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="panel mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-extrabold">Entrar</h1>
      <div><label className="label" htmlFor="m">Número de matrícula</label>
        <input id="m" className="input" value={f.matricula} onChange={(e) => setF({ ...f, matricula: e.target.value })} required autoComplete="username" /></div>
      <div><label className="label" htmlFor="p">Password</label>
        <input id="p" type="password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required autoComplete="current-password" /></div>
      <Msg error={err} />
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'A entrar…' : 'Entrar'}</button>
      <p className="text-sm">Ainda não tem conta? <Link href="/registo" className="font-semibold text-lagoon underline">Criar conta</Link></p>
    </form>
  );
}
