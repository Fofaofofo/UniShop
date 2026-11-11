'use client';
import { useEffect, useState } from 'react';
import { api, CATEGORIAS } from '@/lib/api';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import LandingOnboarding from '@/components/LandingOnboarding';

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [res, setRes] = useState({ items: [], pages: 1 });
  const [f, setF] = useState({ q: '', categoria: '', tipo: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  // Verificar se o utilizador já visualizou o onboarding inicial
  useEffect(() => {
    try {
      const completed = localStorage.getItem('unishop_onboarding_completed');
      if (!completed) {
        setShowOnboarding(true);
      }
    } catch {}
    setHasCheckedOnboarding(true);
  }, []);

  useEffect(() => {
    api('/public/destaques').then(setDestaques).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    const t = setTimeout(() => {
      api(`/public/produtos?${qs}`).then(setRes).catch(() => {}).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [f]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v, page: k === 'page' ? v : 1 }));

  const closeOnboarding = () => {
    try {
      localStorage.setItem('unishop_onboarding_completed', 'true');
    } catch {}
    setShowOnboarding(false);
  };

  return (
    <>
      {/* Se o onboarding inicial estiver ativo, exibe em tela cheia com transição fluida */}
      {showOnboarding && hasCheckedOnboarding && (
        <LandingOnboarding onFinish={closeOnboarding} />
      )}

      <div className="space-y-8">
        {/* Banner Hero / Apresentação Institucional */}
        <section className="flex flex-col gap-3 py-2 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-lagoon dark:text-amber-400">
              O seu campus, mais perto
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-400/20 transition duration-200"
            >
              <span>✨</span>
              <span>Conheça os Valores do UniShop</span>
            </button>
          </div>

          <h1 className="max-w-3xl text-3xl font-extrabold sm:text-5xl text-slate-900 dark:text-white">
            Encontre o que precisa.<br className="hidden sm:block" /> Partilhe o que tem.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            O marketplace oficial da comunidade acadêmica do ISPTEC. Produtos, oportunidades e alugueres com total confiança.
          </p>
        </section>

        {/* Carrossel de Destaques da Vitrine */}
        <Carousel items={destaques} />

        {/* Barra de Filtros e Pesquisa */}
        <section
          id="catalogo"
          aria-label="Pesquisa"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-line/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-colors dark:border-slate-800/80 dark:bg-slate-900/90 sm:flex sm:items-center sm:gap-3 sm:space-y-0 sm:p-5"
        >
          <div className="hidden min-w-36 sm:block">
            <p className="font-bold text-slate-900 dark:text-white">Explorar</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Encontre um produto</p>
          </div>
          <input
            className="input flex-1"
            type="search"
            placeholder="Pesquisar bolinhos, calculadoras, jalecos…"
            value={f.q}
            onChange={(e) => set('q', e.target.value)}
            aria-label="Pesquisar produtos"
          />
          <select
            className="input sm:w-48"
            value={f.categoria}
            onChange={(e) => set('categoria', e.target.value)}
            aria-label="Categoria"
          >
            <option value="">Todas as categorias</option>
            {Object.entries(CATEGORIAS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select
            className="input sm:w-40"
            value={f.tipo}
            onChange={(e) => set('tipo', e.target.value)}
            aria-label="Tipo"
          >
            <option value="">Venda e aluguer</option>
            <option value="VENDA">Venda</option>
            <option value="ALUGUER">Aluguer</option>
          </select>
        </section>

        {/* Título da Seção de Produtos */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-lagoon dark:text-amber-400">Feito para a comunidade</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Produtos em destaque</h2>
          </div>
          <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
            Descubra artigos perto da sua sala ou bloco
          </span>
        </div>

        {!loading && res.items.length === 0 && (
          <p className="panel text-center text-slate-600 dark:text-slate-400">
            Nenhum produto encontrado. Tente outra pesquisa ou categoria.
          </p>
        )}

        {/* Grelha de Produtos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {res.items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {/* Paginação */}
        {res.pages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button className="btn-ghost" disabled={f.page <= 1} onClick={() => set('page', f.page - 1)}>
              Anterior
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Página {f.page} de {res.pages}
            </span>
            <button className="btn-ghost" disabled={f.page >= res.pages} onClick={() => set('page', f.page + 1)}>
              Seguinte
            </button>
          </div>
        )}
      </div>
    </>
  );
}
