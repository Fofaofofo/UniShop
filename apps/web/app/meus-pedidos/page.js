'use client';
import { api, dt, waLink } from '@/lib/api';
import { Badge, Guard, useLoad } from '@/components/ui';

function Pedidos() {
  const { data, error } = useLoad(() => api('/cliente/alugueres/meus'));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Meus pedidos de aluguer</h1>
      {error && <p className="text-red-700">{error}</p>}
      {data?.length === 0 && <p className="panel text-slate-600">Ainda não pediu nenhum aluguer. Explore a vitrine e filtre por “Aluguer”.</p>}
      {data?.map((a) => (
        <div key={a.id} className="panel flex flex-wrap items-center justify-between gap-3">
          <div><p className="font-bold">{a.produto.titulo}</p>
            <p className="text-sm text-slate-600">Devolução prevista: {dt(a.dataPrevistaDevolucao)} · Vendedor: {a.produto.vendedor.nomeCompleto}</p></div>
          <div className="flex items-center gap-2"><Badge s={a.estado} />
            <a className="btn-ghost" target="_blank" rel="noreferrer" href={waLink(a.produto.vendedor.telefone, `Olá! Sobre o meu pedido de aluguer: ${a.produto.titulo}`)}>WhatsApp</a></div>
        </div>
      ))}
    </div>
  );
}
export default function Page() { return <Guard><Pedidos /></Guard>; }
