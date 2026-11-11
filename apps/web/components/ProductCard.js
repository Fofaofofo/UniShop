import Link from 'next/link';
import { CATEGORIAS, kz } from '@/lib/api';

export default function ProductCard({ p }) {
  return (
    <Link
      href={`/produtos/${p.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-sm shadow-slate-900/[0.03] transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:border-amber-500/50"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.imagemUrl}
        alt={p.titulo}
        className="aspect-[4/3] w-full bg-lagoon-soft dark:bg-slate-800 object-cover transition duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {CATEGORIAS[p.categoria]} · {p.tipo === 'ALUGUER' ? 'Aluguer' : 'Venda'}
        </p>
        <h3 className="line-clamp-2 font-bold leading-snug text-ink dark:text-white">
          {p.titulo}
        </h3>
        <p className="mt-auto pt-2 text-lg font-extrabold text-lagoon dark:text-amber-400">
          {kz(p.preco)}
          {p.tipo === 'ALUGUER' && <span className="text-xs font-medium text-slate-500 dark:text-slate-400"> /aluguer</span>}
        </p>
        {p.sala && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {p.sala.bloco.nome} · {p.sala.nome}
          </p>
        )}
      </div>
    </Link>
  );
}
