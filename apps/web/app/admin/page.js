'use client';
import { useEffect, useState } from 'react';
import { api, dt } from '@/lib/api';
import { Badge, Msg, useLoad } from '@/components/ui';

export default function Financas() {
  const cfg = useLoad(() => api('/admin/config'));
  const mens = useLoad(() => api('/admin/mensalidades'));
  const [f, setF] = useState({ valorMensalidade: '', duracaoDias: 30, entidade: '', referenciaBase: '', numeroExpress: '', diasAvisoPrevio: 3 });
  const [msg, setMsg] = useState({});
  useEffect(() => { if (cfg.data) setF({ ...f, ...Object.fromEntries(Object.entries(cfg.data).map(([k, v]) => [k, v ?? ''])) }); /* eslint-disable-next-line */ }, [cfg.data]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async (e) => {
    e.preventDefault(); setMsg({});
    try { await api('/admin/config', { method: 'PUT', body: { ...f, entidade: f.entidade || null, referenciaBase: f.referenciaBase || null, numeroExpress: f.numeroExpress || null } }); setMsg({ ok: 'Configuração guardada.' }); }
    catch (e2) { setMsg({ error: e2.message }); }
  };
  const field = (k, label, type = 'text') => <div><label className="label" htmlFor={k}>{label}</label><input id={k} type={type} className="input" value={f[k]} onChange={set(k)} /></div>;

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="panel max-w-2xl space-y-4">
        <h1 className="text-2xl font-extrabold">Taxa e dados de pagamento</h1>
        <div className="grid gap-3 sm:grid-cols-3">{field('valorMensalidade', 'Mensalidade por produto (Kz)', 'number')}{field('duracaoDias', 'Duração (dias)', 'number')}{field('diasAvisoPrevio', 'Aviso prévio (dias)', 'number')}</div>
        <div className="grid gap-3 sm:grid-cols-3">{field('entidade', 'Entidade Multicaixa')}{field('referenciaBase', 'Referência')}{field('numeroExpress', 'Nº Multicaixa Express')}</div>
        <Msg {...msg} />
        <button className="btn-primary">Guardar configuração</button>
      </form>
      <section className="space-y-3"><h2 className="text-xl font-bold">Controlo de mensalidades por vendedor</h2>
        <div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[640px]">
          <thead className="bg-paper"><tr><th className="th">Vendedor</th><th className="th">Produto</th><th className="th">Estado</th><th className="th">Expira em</th><th className="th">Dias restantes</th></tr></thead>
          <tbody className="divide-y divide-line">{mens.data?.flatMap((v) => v.produtos.map((p) => (
            <tr key={p.id}><td className="td">{v.nomeCompleto}<p className="text-xs text-slate-500">{v.matricula}</p></td><td className="td">{p.titulo}</td><td className="td"><Badge s={p.estadoMensalidade} /></td><td className="td">{dt(p.mensalidadeExpiraEm)}</td><td className="td">{p.diasRestantes > 0 ? p.diasRestantes : '—'}</td></tr>)))}</tbody>
        </table>{mens.data?.length === 0 && <p className="p-4 text-sm text-slate-600">Ainda não há vendedores com produtos.</p>}</div>
      </section>
    </div>
  );
}
