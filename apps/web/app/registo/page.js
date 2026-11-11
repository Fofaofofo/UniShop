'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Msg } from '@/components/ui';

function Registo() {
  const sp = useSearchParams();
  const [blocos, setBlocos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [f, setF] = useState({ nomeCompleto: '', matricula: '', telefone: '', password: '', role: 'COMPRADOR', cursoId: '', blocoId: '', salaId: '', anoAcademico: '1' });
  const [telefone, setTelefone] = useState(sp.get('verificar') || '');
  const [codigo, setCodigo] = useState('');
  const [msg, setMsg] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { api('/public/cursos').then(setCursos); api('/public/blocos').then(setBlocos); }, []);
  const salas = blocos.find((b) => b.id === f.blocoId)?.salas || [];
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value, ...(k === 'blocoId' ? { salaId: '' } : {}) }));

  const run = async (fn) => { setMsg({}); setBusy(true); try { await fn(); } catch (e) { setMsg({ error: e.message }); } setBusy(false); };

  const registar = (e) => { e.preventDefault(); run(async () => {
    const r = await api('/auth/registo', { method: 'POST', body: f });
    setTelefone(r.telefone); setMsg({ ok: r.message });
  }); };
  const verificar = (e) => { e.preventDefault(); run(async () => {
    await api('/auth/verificar', { method: 'POST', body: { telefone, codigo } });
    window.location.href = '/login';
  }); };
  const reenviar = () => run(async () => { await api('/auth/reenviar', { method: 'POST', body: { telefone } }); setMsg({ ok: 'Novo código enviado.' }); });

  if (telefone) {
    return (
      <form onSubmit={verificar} className="panel mx-auto max-w-sm space-y-4">
        <h1 className="text-2xl font-extrabold">Confirme o seu WhatsApp</h1>
        <p className="text-sm text-slate-600">Enviámos um código de 6 dígitos para +{telefone}.</p>
        <input className="input text-center text-2xl tracking-widest" inputMode="numeric" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} aria-label="Código de verificação" required />
        <Msg {...msg} />
        <button className="btn-primary w-full" disabled={busy || codigo.length !== 6}>Verificar e ativar conta</button>
        <button type="button" onClick={reenviar} className="btn-ghost w-full" disabled={busy}>Reenviar código</button>
      </form>
    );
  }

  return (
    <form onSubmit={registar} className="panel mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold">Criar conta</h1>
      <p className="text-sm text-slate-600">A identificação usa o seu número de matrícula. Não pedimos o Bilhete de Identidade.</p>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 font-bold">Dados pessoais</legend>
        <div className="sm:col-span-2"><label className="label" htmlFor="n">Nome completo</label><input id="n" className="input" value={f.nomeCompleto} onChange={set('nomeCompleto')} required /></div>
        <div><label className="label" htmlFor="mt">Número de matrícula</label><input id="mt" className="input" value={f.matricula} onChange={set('matricula')} required /></div>
        <div><label className="label" htmlFor="t">Telefone / WhatsApp</label><input id="t" className="input" placeholder="9XX XXX XXX" inputMode="tel" value={f.telefone} onChange={set('telefone')} required /></div>
        <div><label className="label" htmlFor="pw">Password (mín. 8)</label><input id="pw" type="password" minLength={8} className="input" value={f.password} onChange={set('password')} required autoComplete="new-password" /></div>
        <div><label className="label" htmlFor="r">Quero</label>
          <select id="r" className="input" value={f.role} onChange={set('role')}><option value="COMPRADOR">Comprar e alugar</option><option value="VENDEDOR">Vender e alugar itens</option></select></div>
      </fieldset>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 font-bold">Dados académicos</legend>
        <div><label className="label" htmlFor="c">Curso</label>
          <select id="c" className="input" value={f.cursoId} onChange={set('cursoId')} required><option value="">Selecione…</option>{cursos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
        <div><label className="label" htmlFor="a">Ano académico</label>
          <select id="a" className="input" value={f.anoAcademico} onChange={set('anoAcademico')}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}º Ano</option>)}</select></div>
        <div><label className="label" htmlFor="b">Bloco</label>
          <select id="b" className="input" value={f.blocoId} onChange={set('blocoId')} required><option value="">Selecione…</option>{blocos.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}</select></div>
        <div><label className="label" htmlFor="s">Sala / localização</label>
          <select id="s" className="input" value={f.salaId} onChange={set('salaId')} required disabled={!f.blocoId}><option value="">{f.blocoId ? 'Selecione…' : 'Escolha primeiro o bloco'}</option>{salas.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
      </fieldset>
      <Msg {...msg} />
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'A criar conta…' : 'Criar conta e receber código'}</button>
    </form>
  );
}
export default function Page() { return <Suspense><Registo /></Suspense>; }
