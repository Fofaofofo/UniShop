'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { kz } from '@/lib/api';

// Carrossel de destaques com rolagem automática (pausa ao passar o rato / reduzir movimento)
export default function Carousel({ items }) {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  useEffect(() => {
    if (items.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => { if (!paused.current) setI((x) => (x + 1) % items.length); }, 4500);
    return () => clearInterval(t);
  }, [items.length]);
  if (!items.length) return null;
  const p = items[i % items.length];
  return (
    <section aria-label="Produtos em destaque" className="relative overflow-hidden rounded-xl bg-ink text-white"
      onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <Link href={`/produtos/${p.id}`} className="grid sm:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.imagemUrl} alt={p.titulo} className="h-56 w-full object-cover sm:h-72" />
        <div className="flex flex-col justify-center gap-2 p-6">
          <p className="text-sm font-semibold text-sol">Em destaque</p>
          <h2 className="text-2xl font-extrabold sm:text-3xl">{p.titulo}</h2>
          <p className="text-xl font-bold">{kz(p.preco)}</p>
          <p className="text-sm text-white/70">Vendido por {p.vendedor.nomeCompleto}</p>
        </div>
      </Link>
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {items.map((_, n) => (
          <button key={n} onClick={() => setI(n)} aria-label={`Destaque ${n + 1}`}
            className={`h-2.5 w-2.5 rounded-full ${n === i % items.length ? 'bg-sol' : 'bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
}
