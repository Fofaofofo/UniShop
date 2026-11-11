'use client';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Stars, useLoad } from '@/components/ui';

export default function Dashboard() {
  const { data: d, error } = useLoad(() => api('/vendedor/dashboard'));
  if (error) return <p className="text-red-700">{error}</p>;
  if (!d) return <p className="text-sm text-slate-500">A carregar…</p>;
  const stat = (label, v) => <div className="panel"><p className="text-sm text-slate-600">{label}</p><p className="mt-1 text-3xl font-extrabold">{v}</p></div>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Resumo da sua banca</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stat('Produtos ativos', d.ativos)}
        {stat('Ocultos (mensalidade expirada)', d.ocultos)}
        {stat('Pedidos de aluguer', d.totalAlugueres)}
        <div className="panel"><p className="text-sm text-slate-600">Avaliação média</p>
          <div className="mt-2 flex items-center gap-2"><Stars value={d.mediaEstrelas || 0} /><span className="font-bold">{d.mediaEstrelas ? d.mediaEstrelas.toFixed(1) : '—'}</span></div></div>
      </div>
      {d.totalProdutos === 0 && <p className="panel">Ainda não tem produtos. <Link className="font-semibold text-lagoon underline" href="/vendedor/produtos/novo">Cadastre o primeiro</Link>.</p>}
      {d.aExpirar.length > 0 && (
        <section className="rounded-lg border border-sol bg-amber-50 p-5" aria-label="Mensalidades a expirar">
          <h2 className="mb-2 text-lg font-bold">Mensalidades a expirar</h2>
          <ul className="space-y-1 text-sm">{d.aExpirar.map((p) => <li key={p.id}><b>{p.titulo}</b>: {p.dias <= 0 ? 'expira hoje' : `faltam ${p.dias} dia(s)`}</li>)}</ul>
          <Link href="/vendedor/produtos" className="btn-sol mt-3">Renovar agora</Link>
        </section>
      )}
    </div>
  );
}
