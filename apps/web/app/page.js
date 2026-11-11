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
    <div className="space-y-6">
      <Carousel items={destaques} />
      <section aria-label="Pesquisa" className="flex flex-col gap-2 sm:flex-row">
        <input className="input flex-1" type="search" placeholder="Pesquisar bolinhos, calculadoras, jalecos…" value={f.q} onChange={(e) => set('q', e.target.value)} aria-label="Pesquisar produtos" />
        <select className="input sm:w-48" value={f.categoria} onChange={(e) => set('categoria', e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {Object.entries(CATEGORIAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input sm:w-40" value={f.tipo} onChange={(e) => set('tipo', e.target.value)} aria-label="Tipo">
          <option value="">Venda e aluguer</option><option value="VENDA">Venda</option><option value="ALUGUER">Aluguer</option>
        </select>
      </section>
      {!loading && res.items.length === 0 && (
        <p className="panel text-center text-slate-600">Nenhum produto encontrado. Tente outra pesquisa ou categoria.</p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
