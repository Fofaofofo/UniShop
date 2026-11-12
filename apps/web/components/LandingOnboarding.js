'use client';
import { useState, useEffect, useCallback } from 'react';
import Logo from '@/components/Logo';

const SLIDES = [
  {
    id: 1,
    tag: 'Boas-Vindas & Identidade',
    tagIconType: 'academic',
    title: 'Bem-vindo ao UniShop ISPTEC',
    subtitle:
      'O marketplace oficial da nossa comunidade acadêmica. Compre, venda e alugue com segurança dentro do campus.',
    image: '/images/slide1-campus.jpg',
    highlights: ['Comunidade Exclusiva', 'Segurança Acadêmica', 'Campus Conectado'],
  },
  {
    id: 2,
    tag: 'Aluguer Seguro com Rastreabilidade',
    tagIconType: 'shield',
    title: 'Alugue Materiais com Total Confiança',
    subtitle:
      'Calculadoras científicas, jalecos e livros. Sistema seguro com identificação por número de matrícula e avaliação de reputação entre colegas.',
    image: '/images/slide2-lab.jpg',
    highlights: ['Identificação por Matrícula', 'Avaliação de Reputação', 'Devoluções Rastreadas'],
  },
  {
    id: 3,
    tag: 'Praticidade & WhatsApp Direto',
    tagIconType: 'chat',
    title: 'Negociação Rápida e Direta',
    subtitle:
      'Encontre lanches, material escolar e serviços no seu bloco e sala. Feche negócios num clique direto pelo WhatsApp do fornecedor!',
    image: '/images/slide3-community.jpg',
    highlights: ['WhatsApp em 1 Clique', 'Localização por Bloco e Sala', 'Negociação Sem Fricção'],
  },
];

const SlideIcon = ({ type }) => {
  if (type === 'academic') {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    );
  }
  if (type === 'shield') {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
};

export default function LandingOnboarding({ onFinish, isStandalone = false }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFinish = useCallback(() => {
    try {
      localStorage.setItem('unishop_onboarding_completed', 'true');
    } catch {}
    if (onFinish) {
      onFinish();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, [onFinish]);

  const goToSlide = useCallback(
    (index) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 450);
    },
    [isAnimating]
  );

  const nextSlide = useCallback(() => {
    if (current < SLIDES.length - 1) {
      goToSlide(current + 1);
    } else {
      handleFinish();
    }
  }, [current, goToSlide, handleFinish]);

  const prevSlide = useCallback(() => {
    if (current > 0) {
      goToSlide(current - 1);
    }
  }, [current, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleFinish]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col justify-between overflow-hidden bg-black text-white select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {SLIDES.map((s, index) => {
        const isActive = index === current;
        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.title} className="h-full w-full object-cover object-center" />
            {/* Overlay refinado: iluminação nítida dos estudantes universitários e contraste perfeito para o texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
          </div>
        );
      })}

      {/* Top Bar: Logotipo UniShop sem emojis e com variante branca para fundo escuro */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-12 sm:pt-8">
        <div className="flex items-center gap-2">
          <Logo size="md" variant="white" link={false} className="drop-shadow-md" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFinish}
            type="button"
            className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-200 hover:border-amber-400 hover:bg-white/20 hover:text-amber-300"
          >
            <span>Saltar</span>
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Navegação por setas laterais (Desktop) */}
      <button
        onClick={prevSlide}
        disabled={current === 0}
        type="button"
        aria-label="Slide anterior"
        className={`absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 p-3 text-white backdrop-blur-md transition-all duration-200 hover:border-amber-400 hover:bg-black/70 hover:text-amber-400 sm:flex ${
          current === 0 ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
        }`}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        type="button"
        aria-label="Próximo slide"
        className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 p-3 text-white backdrop-blur-md transition-all duration-200 hover:border-amber-400 hover:bg-black/70 hover:text-amber-400 opacity-80 hover:opacity-100 sm:flex"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Conteúdo Central e Inferior do Slide */}
      <main className="relative z-20 mx-auto w-full max-w-4xl px-6 pb-8 sm:px-12 sm:pb-12">
        <div className="space-y-6">
          {/* Tag de Contexto com ícone SVG limpo (sem emoji) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
            <SlideIcon type={slide.tagIconType} />
            <span>{slide.tag}</span>
          </div>

          {/* Título e Subtítulo */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
              {slide.title}
            </h1>
            <p className="max-w-2xl text-base text-slate-200 sm:text-xl font-normal leading-relaxed drop-shadow">
              {slide.subtitle}
            </p>
          </div>

          {/* Destaques em pílulas */}
          <div className="flex flex-wrap gap-2 pt-2">
            {slide.highlights.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {h}
              </span>
            ))}
          </div>

          {/* Indicadores de Progresso + Botão de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              {SLIDES.map((_, idx) => {
                const isDotActive = idx === current;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Ir para slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isDotActive
                        ? 'w-10 bg-amber-400 shadow-sm shadow-amber-400/50'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                );
              })}
              <span className="ml-3 text-xs font-semibold text-slate-400">
                0{current + 1} / 0{SLIDES.length}
              </span>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-3">
              <button
                onClick={nextSlide}
                type="button"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base font-bold transition-all duration-300 active:scale-95 shadow-xl ${
                  isLast
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30 hover:from-amber-300 hover:to-amber-500 hover:shadow-amber-500/50'
                    : 'bg-white text-slate-950 hover:bg-slate-100 shadow-white/10'
                }`}
              >
                <span>{isLast ? 'Começar Agora' : 'Próximo'}</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
