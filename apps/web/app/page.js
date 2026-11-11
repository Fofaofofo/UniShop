'use client';
import { useEffect, useState } from 'react';
import { api, CATEGORIAS } from '@/lib/api';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [res, setRes] = useState({ items: [], pages: 1 });
  const [f, setF] = useState({ q: '', categoria: '', tipo: '', page: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { api('/public/destaques').then(setDestaques).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    const t = setTimeout(() => api(`/public/produtos?${qs}`).then(setRes).catch(() => {}).finally(() => setLoading(false)), 250);
    return () => clearTimeout(t);
  }, [f]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v, page: k === 'page' ? v : 1 }));

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 py-2 sm:py-4">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">O seu campus, mais perto</p>
        <h1 className="max-w-3xl text-3xl font-extrabold sm:text-5xl">Encontre o que precisa.<br className="hidden sm:block" /> Partilhe o que tem.</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Produtos, oportunidades e alugueres numa só comunidade.</p>
      </section>
      <Carousel items={destaques} />
      <section id="catalogo" aria-label="Pesquisa" className="scroll-mt-24 space-y-4 rounded-3xl border border-line/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] sm:flex sm:items-center sm:gap-3 sm:space-y-0 sm:p-5">
        <div className="hidden min-w-36 sm:block">
          <p className="font-bold">Explorar</p>
          <p className="text-xs text-slate-500">Encontre um produto</p>
        </div>
        <input className="input flex-1" type="search" placeholder="Pesquisar bolinhos, calculadoras, jalecos…" value={f.q} onChange={(e) => set('q', e.target.value)} aria-label="Pesquisar produtos" />
        <select className="input sm:w-48" value={f.categoria} onChange={(e) => set('categoria', e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {Object.entries(CATEGORIAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input sm:w-40" value={f.tipo} onChange={(e) => set('tipo', e.target.value)} aria-label="Tipo">
          <option value="">Venda e aluguer</option><option value="VENDA">Venda</option><option value="ALUGUER">Aluguer</option>
        </select>
      </section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-lagoon">Feito para a comunidade</p>
          <h2 className="text-2xl font-extrabold">Produtos em destaque</h2>
        </div>
        <span className="hidden text-sm text-slate-500 sm:block">Descubra algo especial hoje</span>
      </div>
      {!loading && res.items.length === 0 && (
        <p className="panel text-center text-slate-600">Nenhum produto encontrado. Tente outra pesquisa ou categoria.</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {res.items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {res.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button className="btn-ghost" disabled={f.page <= 1} onClick={() => set('page', f.page - 1)}>Anterior</button>
          <span className="text-sm">Página {f.page} de {res.pages}</span>
          <button className="btn-ghost" disabled={f.page >= res.pages} onClick={() => set('page', f.page + 1)}>Seguinte</button>
        </div>
      )}
    </div>
  );
}
