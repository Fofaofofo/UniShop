import Link from 'next/link';
import { CATEGORIAS, kz } from '@/lib/api';

export default function ProductCard({ p }) {
  return (
    <Link href={`/produtos/${p.id}`} className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white hover:border-lagoon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.imagemUrl} alt={p.titulo} className="aspect-[4/3] w-full bg-lagoon-soft object-cover" loading="lazy" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-slate-500">{CATEGORIAS[p.categoria]} · {p.tipo === 'ALUGUER' ? 'Aluguer' : 'Venda'}</p>
        <h3 className="font-bold leading-snug">{p.titulo}</h3>
        <p className="mt-auto pt-2 text-lg font-extrabold text-lagoon">{kz(p.preco)}{p.tipo === 'ALUGUER' && <span className="text-xs font-medium text-slate-500"> /aluguer</span>}</p>
        {p.sala && <p className="text-xs text-slate-500">{p.sala.bloco.nome} · {p.sala.nome}</p>}
      </div>
    </Link>
  );
}
