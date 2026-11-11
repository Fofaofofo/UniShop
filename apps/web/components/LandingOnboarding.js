'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const SLIDES = [
  {
    id: 1,
    tag: 'Boas-Vindas & Identidade',
    tagIcon: '🎓',
    title: 'Bem-vindo ao UniShop ISPTEC',
    subtitle:
      'O marketplace oficial da nossa comunidade acadêmica. Compre, venda e alugue com segurança dentro do campus.',
    image: '/images/slide1-campus.jpg',
    highlights: ['Comunidade Exclusiva', 'Segurança Acadêmica', 'Campus Conectado'],
  },
  {
    id: 2,
    tag: 'Aluguer Seguro com Rastreabilidade',
    tagIcon: '🔬',
    title: 'Alugue Materiais com Total Confiança',
    subtitle:
      'Calculadoras científicas, jalecos e livros. Sistema seguro com identificação por número de matrícula e avaliação de reputação entre colegas.',
    image: '/images/slide2-lab.jpg',
    highlights: ['Identificação por Matrícula', 'Avaliação de Reputação', 'Devoluções Rastreadas'],
  },
  {
    id: 3,
    tag: 'Praticidade & WhatsApp Direto',
    tagIcon: '⚡',
    title: 'Negociação Rápida e Direta',
    subtitle:
      'Encontre lanches, material escolar e serviços no seu bloco e sala. Feche negócios num clique direto pelo WhatsApp do fornecedor!',
    image: '/images/slide3-community.jpg',
    highlights: ['WhatsApp em 1 Clique', 'Localização por Bloco e Sala', 'Negociação Sem Fricção'],
  },
];

export default function LandingOnboarding({ onFinish, isStandalone = false }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Manipulador de conclusão do onboarding
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

  const goToSlide = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 450);
  }, [isAnimating]);

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

  // Navegação por teclado
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

  // Gestos de Touch / Swipe
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
      {/* Background Slides com transição suave */}
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
            <img
              src={s.image}
              alt={s.title}
              className="h-full w-full object-cover object-center"
            />
            {/* Overlay em camadas: Preto Profundo #000000 e Amarelo Ouro #F59E0B */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-black/70 mix-blend-screen" />
          </div>
        );
      })}

      {/* Top Bar: Logotipo UniShop + Botão Saltar */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-12 sm:pt-8">
        <div className="flex items-center gap-2">
          <Logo size="md" link={false} className="drop-shadow-md" />
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

      {/* Navegação por setas laterais discretas (Desktop) */}
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
          {/* Tag de Contexto com ícone */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
            <span>{slide.tagIcon}</span>
            <span>{slide.tag}</span>
          </div>

          {/* Título e Subtítulo com tipografia destacada */}
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

          {/* Barra de Ações Inferior: Indicadores de Progresso + Botão de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            {/* Indicadores de Progresso (Dots interativos) */}
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

            {/* Botão de Ação: "Próximo" ou "Começar Agora" */}
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

