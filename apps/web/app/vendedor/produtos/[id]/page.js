'use client';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLoad } from '@/components/ui';
import ProductForm from '@/components/ProductForm';

export default function Editar() {
  const { id } = useParams();
  const { data } = useLoad(() => api('/vendedor/produtos'), [id]);
  const p = data?.find((x) => x.id === id);
  if (!data) return <p className="text-sm text-slate-500">A carregar…</p>;
  if (!p) return <p className="panel">Produto não encontrado.</p>;
  return <ProductForm produto={p} />;
}
