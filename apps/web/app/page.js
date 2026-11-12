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

      <div className="space-y-10">
        {/* Banner Hero / Apresentação Institucional Otimizada para SEO */}
        <section className="flex flex-col gap-3 py-2 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-lagoon dark:text-amber-400">
              ISPTEC · Campus Marketplace
            </span>
            <button
              onClick={() => setShowOnboarding(true)}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-400/20 transition duration-200"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Conhecer o UniShop</span>
            </button>
          </div>

          <h1 className="max-w-3xl text-3xl font-extrabold sm:text-5xl text-slate-900 dark:text-white leading-tight">
            UniShop ISPTEC:<br className="hidden sm:block" /> Compre, Venda e Alugue no Campus.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            O marketplace oficial da comunidade acadêmica do{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              ISPTEC (Instituto Superior Politécnico de Tecnologias e Ciências)
            </strong>
            . Encontre jalecos de laboratório, calculadoras científicas, livros universitários e serviços entre colegas no seu bloco e sala.
          </p>
        </section>

        {/* Carrossel de Destaques da Vitrine */}
        <Carousel items={destaques} />

        {/* Barra de Filtros e Pesquisa com Indexação e Acessibilidade */}
        <section
          id="catalogo"
          aria-label="Catálogo de Produtos do ISPTEC"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-line/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-colors dark:border-slate-800/80 dark:bg-slate-900/90 sm:flex sm:items-center sm:gap-3 sm:space-y-0 sm:p-5"
        >
          <div className="hidden min-w-36 sm:block">
            <p className="font-bold text-slate-900 dark:text-white">Explorar</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Catálogo do ISPTEC</p>
          </div>
          <input
            className="input flex-1"
            type="search"
            placeholder="Pesquisar calculadoras, jalecos, livros de engenharia, bolinhos…"
            value={f.q}
            onChange={(e) => set('q', e.target.value)}
            aria-label="Pesquisar produtos no campus do ISPTEC"
          />
          <select
            className="input sm:w-48"
            value={f.categoria}
            onChange={(e) => set('categoria', e.target.value)}
            aria-label="Filtrar por Categoria"
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
            aria-label="Filtrar por Venda ou Aluguer"
          >
            <option value="">Venda e aluguer</option>
            <option value="VENDA">Apenas Venda</option>
            <option value="ALUGUER">Apenas Aluguer</option>
          </select>
        </section>

        {/* Título da Seção de Produtos */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-lagoon dark:text-amber-400">Feito para a comunidade universitária</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Artigos e Oportunidades no ISPTEC</h2>
          </div>
          <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
            Disponível nos Blocos A, B e espaços comuns
          </span>
        </div>

        {!loading && res.items.length === 0 && (
          <p className="panel text-center text-slate-600 dark:text-slate-400 py-8">
            Nenhum artigo encontrado para a pesquisa atual. Experimente buscar termos como &quot;calculadora&quot;, &quot;jaleco&quot; ou explorar todas as categorias.
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
          <div className="flex items-center justify-center gap-3 pt-4">
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

        {/* Bloco de SEO e Autoridade Institucional (E-E-A-T do Google) */}
        <section className="mt-16 rounded-3xl border border-slate-200/80 bg-white/70 p-6 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/60 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            UniShop ISPTEC: O Marketplace Universitário de Referência em Luanda
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            O <strong>UniShop</strong> nasceu para atender com excelência a comunidade acadêmica do{' '}
            <strong>ISPTEC (Instituto Superior Politécnico de Tecnologias e Ciências)</strong>, localizado em Talatona, Luanda. A plataforma conecta estudantes, professores e funcionários para a compra, venda e aluguer rastreado de materiais essenciais aos cursos de Engenharia (Informática, Mecânica, Petróleos, Química, Civil, Eletrotécnica) e Gestão. Com identificação por número de matrícula institucional e contato direto via WhatsApp, garantimos negociações ágeis, transparentes e seguras dentro do campus.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Aluguer de Jalecos e Calculadoras</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Alugue calculadoras científicas e jalecos para laboratórios práticos sem burocracia, com garantia de devolução controlada.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Localização no Bloco e Sala</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Saiba exatamente onde encontrar o vendedor no campus: Bloco A, Bloco B, Cantina ou Esplanada do ISPTEC.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Segurança por Matrícula</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Autenticação vinculada à matrícula de estudante para total credibilidade e reputação entre colegas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
