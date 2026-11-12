'use client';
import { useState } from 'react';
import { api, dt, waLink } from '@/lib/api';
import { Badge, Modal, Msg, Stars, useLoad } from '@/components/ui';

export default function Pedidos() {
  const { data, error, reload } = useLoad(() => api('/vendedor/alugueres'));
  const [msg, setMsg] = useState({});
  const [rate, setRate] = useState(null);
  const [r, setR] = useState({ estrelas: 5, comentario: '' });
  const act = async (fn, ok) => { setMsg({}); try { await fn(); setMsg({ ok }); setRate(null); reload(); } catch (e) { setMsg({ error: e.message }); } };
  const mudar = (a, estado) => act(() => api(`/vendedor/alugueres/${a.id}`, { method: 'PATCH', body: { estado } }), 'Pedido atualizado.');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Pedidos e clientes</h1>
      <Msg {...msg} /><Msg error={error} />
      {data?.length === 0 && <p className="panel text-slate-600">Ainda não recebeu pedidos de aluguer.</p>}
      {data?.map((a) => (
        <div key={a.id} className="panel space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><p className="font-bold">{a.produto.titulo}</p>
              <p className="text-sm">{a.locatario.nomeCompleto} · matrícula {a.locatario.matricula} · {a.locatario.curso.nome}</p>
              <p className="text-sm text-slate-600">Devolução prevista: {dt(a.dataPrevistaDevolucao)}{a.dataDevolucao && ` · Devolvido em ${dt(a.dataDevolucao)}`}</p></div>
            <Badge s={a.estado} />
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="btn-ghost" target="_blank" rel="noreferrer" href={waLink(a.locatario.telefone, `Olá ${a.locatario.nomeCompleto}! Sobre o aluguer de "${a.produto.titulo}".`)}>WhatsApp</a>
            {a.estado === 'SOLICITADO' && <><button className="btn-primary" onClick={() => mudar(a, 'EM_CURSO')}>Aceitar e entregar</button><button className="btn-ghost" onClick={() => mudar(a, 'CANCELADO')}>Recusar</button></>}
            {['EM_CURSO', 'ATRASADO'].includes(a.estado) && <button className="btn-primary" onClick={() => mudar(a, 'DEVOLVIDO')}>Marcar como devolvido</button>}
            {a.estado === 'DEVOLVIDO' && (a.avaliacoes.length ? <span className="flex items-center gap-1 text-sm">Avaliou: <Stars value={a.avaliacoes[0].estrelas} /></span> : <button className="btn-sol" onClick={() => setRate(a)}>Avaliar locatário</button>)}
          </div>
        </div>
      ))}
      {rate && (
        <Modal title={`Avaliar ${rate.locatario.nomeCompleto}`} onClose={() => setRate(null)}>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Considere a pontualidade na entrega e o estado do material devolvido.</p>
            <Stars value={r.estrelas} onChange={(n) => setR({ ...r, estrelas: n })} />
            <textarea className="input" rows={3} value={r.comentario} onChange={(e) => setR({ ...r, comentario: e.target.value })} placeholder="Comentário" />
            <button className="btn-primary w-full" onClick={() => act(() => api(`/vendedor/alugueres/${rate.id}/avaliar`, { method: 'POST', body: { estrelas: r.estrelas, comentario: r.comentario || undefined } }), 'Avaliação registada.')}>Guardar avaliação</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
