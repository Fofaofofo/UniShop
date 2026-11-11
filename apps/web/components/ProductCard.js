import Link from 'next/link';
import { CATEGORIAS, kz } from '@/lib/api';

export default function ProductCard({ p }) {
  return (
    <Link href={`/produtos/${p.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-sm shadow-slate-900/[0.03] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.imagemUrl} alt={p.titulo} className="aspect-[4/3] w-full bg-lagoon-soft object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-slate-500">{CATEGORIAS[p.categoria]} · {p.tipo === 'ALUGUER' ? 'Aluguer' : 'Venda'}</p>
        <h3 className="line-clamp-2 font-bold leading-snug text-ink">{p.titulo}</h3>
        <p className="mt-auto pt-2 text-lg font-extrabold text-lagoon">{kz(p.preco)}{p.tipo === 'ALUGUER' && <span className="text-xs font-medium text-slate-500"> /aluguer</span>}</p>
        {p.sala && <p className="text-xs text-slate-500">{p.sala.bloco.nome} · {p.sala.nome}</p>}
      </div>
    </Link>
  );
}
