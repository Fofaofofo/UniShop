'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Msg, useLoad } from '@/components/ui';

function Add({ placeholder, onAdd }) {
  const [v, setV] = useState('');
  return <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (v.trim()) { await onAdd(v.trim()); setV(''); } }}>
    <input className="input" placeholder={placeholder} value={v} onChange={(e) => setV(e.target.value)} aria-label={placeholder} /><button className="btn-primary">Adicionar</button></form>;
}
const Toggle = ({ ativo, onClick }) => <button className="btn-ghost !px-2 !py-1" onClick={onClick}>{ativo ? 'Desativar' : 'Ativar'}</button>;

export default function Institucional() {
  const cursos = useLoad(() => api('/admin/cursos'));
  const blocos = useLoad(() => api('/admin/blocos'));
  const [msg, setMsg] = useState({});
  const act = async (fn, reload) => { setMsg({}); try { await fn(); reload(); } catch (e) { setMsg({ error: e.message }); } };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Msg {...msg} />
      <section className="panel space-y-3 lg:col-span-1"><h1 className="text-xl font-extrabold">Cursos oficiais</h1>
        <Add placeholder="Novo curso" onAdd={(nome) => act(() => api('/admin/cursos', { method: 'POST', body: { nome } }), cursos.reload)} />
        <ul className="divide-y divide-line">{cursos.data?.map((c) => (
          <li key={c.id} className={`flex items-center justify-between py-2 text-sm ${c.ativo ? '' : 'text-slate-400 line-through'}`}>{c.nome}
            <Toggle ativo={c.ativo} onClick={() => act(() => api(`/admin/cursos/${c.id}`, { method: 'PATCH', body: { ativo: !c.ativo } }), cursos.reload)} /></li>))}</ul></section>
      <section className="panel space-y-3"><h2 className="text-xl font-extrabold">Blocos e salas</h2>
        <Add placeholder="Novo bloco" onAdd={(nome) => act(() => api('/admin/blocos', { method: 'POST', body: { nome } }), blocos.reload)} />
        {blocos.data?.map((b) => (
          <div key={b.id} className="rounded-md border border-line p-3">
            <div className="mb-2 flex items-center justify-between"><b className={b.ativo ? '' : 'text-slate-400 line-through'}>{b.nome}</b>
              <Toggle ativo={b.ativo} onClick={() => act(() => api(`/admin/blocos/${b.id}`, { method: 'PATCH', body: { ativo: !b.ativo } }), blocos.reload)} /></div>
            <ul className="mb-2 divide-y divide-line">{b.salas.map((s) => (
              <li key={s.id} className={`flex items-center justify-between py-1.5 text-sm ${s.ativo ? '' : 'text-slate-400 line-through'}`}>{s.nome}
                <Toggle ativo={s.ativo} onClick={() => act(() => api(`/admin/salas/${s.id}`, { method: 'PATCH', body: { ativo: !s.ativo } }), blocos.reload)} /></li>))}</ul>
            <Add placeholder={`Nova sala em ${b.nome}`} onAdd={(nome) => act(() => api(`/admin/blocos/${b.id}/salas`, { method: 'POST', body: { nome } }), blocos.reload)} />
          </div>))}</section>
    </div>
  );
}
