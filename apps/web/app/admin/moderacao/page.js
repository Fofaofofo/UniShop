'use client';
import { useState } from 'react';
import { api, dt } from '@/lib/api';
import { Badge, Msg, Stars, useLoad } from '@/components/ui';

export default function Moderacao() {
  const den = useLoad(() => api('/admin/denuncias'));
  const av = useLoad(() => api('/admin/avaliacoes'));
  const [msg, setMsg] = useState({});
  const act = async (fn, reload) => { setMsg({}); try { await fn(); reload(); } catch (e) { setMsg({ error: e.message }); } };
  return (
    <div className="space-y-8">
      <Msg {...msg} />
      <section className="space-y-3"><h1 className="text-2xl font-extrabold">Denúncias</h1>
        {den.data?.length === 0 && <p className="panel text-slate-600">Sem denúncias.</p>}
        {den.data?.map((d) => (
          <div key={d.id} className="panel flex flex-wrap items-center justify-between gap-3 text-sm">
            <div><p className="font-bold">{d.produto.titulo}</p><p>{d.motivo}</p><p className="text-slate-500">por {d.autor.nomeCompleto} · {dt(d.createdAt)}</p></div>
            {d.estado === 'ABERTA' ? <div className="flex gap-2">
              <button className="btn-danger" onClick={() => act(() => api(`/admin/denuncias/${d.id}`, { method: 'PATCH', body: { estado: 'RESOLVIDA', removerProduto: true } }), den.reload)}>Remover anúncio</button>
              <button className="btn-ghost" onClick={() => act(() => api(`/admin/denuncias/${d.id}`, { method: 'PATCH', body: { estado: 'REJEITADA' } }), den.reload)}>Rejeitar denúncia</button></div> : <Badge s={d.estado === 'REJEITADA' ? 'REJEITADO' : 'RESOLVIDA'} />}
          </div>))}
      </section>
      <section className="space-y-3"><h2 className="text-xl font-bold">Auditoria de avaliações</h2>
        {av.data?.map((a) => (
          <div key={a.id} className={`panel flex flex-wrap items-center justify-between gap-3 text-sm ${a.removida ? 'opacity-60' : ''}`}>
            <div><div className="flex items-center gap-2"><Stars value={a.estrelas} /><b>{a.autor.nomeCompleto}</b></div>
              <p>{a.produto ? `Produto: ${a.produto.titulo}` : `Locatário: ${a.alvoUser?.nomeCompleto}`}</p>{a.comentario && <p className="text-slate-700">“{a.comentario}”</p>}</div>
            <button className="btn-ghost" onClick={() => act(() => api(`/admin/avaliacoes/${a.id}`, { method: 'PATCH', body: { removida: !a.removida } }), av.reload)}>{a.removida ? 'Restaurar' : 'Remover'}</button>
          </div>))}
        {av.data?.length === 0 && <p className="panel text-slate-600">Sem avaliações.</p>}
      </section>
    </div>
  );
}
