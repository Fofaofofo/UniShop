'use client';
import { useState } from 'react';
import { api, dt, kz } from '@/lib/api';
import { Badge, Msg, useLoad } from '@/components/ui';

export default function Pagamentos() {
  const [estado, setEstado] = useState('PENDENTE');
  const { data, error, reload } = useLoad(() => api(`/admin/pagamentos?estado=${estado}`), [estado]);
  const [msg, setMsg] = useState({});
  const act = async (fn, ok) => { setMsg({}); try { await fn(); setMsg({ ok }); reload(); } catch (e) { setMsg({ error: e.message }); } };
  const rejeitar = (p) => { const motivo = prompt('Motivo da rejeição:'); if (motivo) act(() => api(`/admin/pagamentos/${p.id}/rejeitar`, { method: 'POST', body: { motivo } }), 'Pagamento rejeitado.'); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-extrabold">Validar pagamentos</h1>
        <select className="input w-44" value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado"><option value="PENDENTE">Pendentes</option><option value="APROVADO">Aprovados</option><option value="REJEITADO">Rejeitados</option></select></div>
      <Msg {...msg} /><Msg error={error} />
      {data?.length === 0 && <p className="panel text-slate-600">Sem pagamentos neste estado.</p>}
      {data?.map((p) => (
        <div key={p.id} className="panel flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm"><p className="font-bold">{p.produto.titulo} · {kz(p.valor)}</p>
            <p>{p.vendedor.nomeCompleto} ({p.vendedor.matricula}) · {p.metodo === 'MULTICAIXA_EXPRESS' ? 'Express' : 'Referência'} · {dt(p.createdAt)}</p>
            {p.referenciaTransacao && <p className="text-slate-600">Operação: {p.referenciaTransacao}</p>}
            {p.comprovativoUrl && <a className="font-semibold text-lagoon underline" href={p.comprovativoUrl} target="_blank" rel="noreferrer">Ver comprovativo</a>}</div>
          {p.estado === 'PENDENTE' ? (
            <div className="flex gap-2"><button className="btn-primary" onClick={() => act(() => api(`/admin/pagamentos/${p.id}/aprovar`, { method: 'POST' }), 'Pagamento aprovado. Produto reativado.')}>Aprovar</button><button className="btn-danger" onClick={() => rejeitar(p)}>Rejeitar</button></div>
          ) : <Badge s={p.estado} />}
        </div>
      ))}
    </div>
  );
}
