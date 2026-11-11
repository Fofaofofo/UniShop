'use client';
import { useState } from 'react';
import { api, dt, kz } from '@/lib/api';
import { Badge, Msg, useLoad } from '@/components/ui';

export default function Produtos() {
  const { data, error, reload } = useLoad(() => api('/admin/produtos'));
  const [msg, setMsg] = useState({});
  const act = async (fn, ok) => { setMsg({}); try { await fn(); setMsg({ ok }); reload(); } catch (e) { setMsg({ error: e.message }); } };
  const ativo = (p) => p.estadoAnuncio === 'PUBLICADO' && p.estadoMensalidade === 'ATIVO';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Produtos e carrossel de destaque</h1>
      <p className="text-sm text-slate-600">Só produtos com mensalidade ativa podem aparecer no carrossel da página principal.</p>
      <Msg {...msg} /><Msg error={error} />
      <div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[760px]">
        <thead className="bg-paper"><tr><th className="th">Produto</th><th className="th">Vendedor</th><th className="th">Preço</th><th className="th">Mensalidade</th><th className="th">Ações</th></tr></thead>
        <tbody className="divide-y divide-line">{data?.map((p) => (
          <tr key={p.id}><td className="td font-semibold">{p.titulo}</td><td className="td">{p.vendedor.nomeCompleto}</td><td className="td">{kz(p.preco)}</td>
            <td className="td"><Badge s={p.estadoMensalidade} /><p className="text-xs text-slate-500">{dt(p.mensalidadeExpiraEm)}</p></td>
            <td className="td"><div className="flex gap-1.5">
              {p.destaque ? <button className="btn-sol !px-2 !py-1" onClick={() => act(() => api(`/admin/destaques/${p.id}`, { method: 'DELETE' }), 'Removido do carrossel.')}>Remover destaque</button>
                : <button className="btn-ghost !px-2 !py-1" disabled={!ativo(p)} onClick={() => act(() => api('/admin/destaques', { method: 'POST', body: { produtoId: p.id } }), 'Adicionado ao carrossel.')}>Destacar</button>}
              <button className="btn-ghost !px-2 !py-1 !text-red-700" onClick={() => confirm(`Remover “${p.titulo}” da plataforma?`) && act(() => api(`/admin/produtos/${p.id}`, { method: 'DELETE' }), 'Produto removido.')}>Remover</button>
            </div></td></tr>))}</tbody>
      </table></div>
    </div>
  );
}
