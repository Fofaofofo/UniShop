'use client';
import { api, dt, kz } from '@/lib/api';
import { Badge, useLoad } from '@/components/ui';

export default function Financeiro() {
  const pg = useLoad(() => api('/vendedor/pagamentos'));
  const pr = useLoad(() => api('/vendedor/produtos'));
  return (
    <div className="space-y-8">
      <section className="space-y-3"><h1 className="text-2xl font-extrabold">Mensalidades por produto</h1>
        <div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[560px]">
          <thead className="bg-paper"><tr><th className="th">Produto</th><th className="th">Estado</th><th className="th">Válida até</th><th className="th">Dias restantes</th></tr></thead>
          <tbody className="divide-y divide-line">{pr.data?.map((p) => <tr key={p.id}><td className="td font-semibold">{p.titulo}</td><td className="td"><Badge s={p.estadoVisual} /></td><td className="td">{dt(p.mensalidadeExpiraEm)}</td><td className="td">{p.diasRestantes > 0 ? p.diasRestantes : '—'}</td></tr>)}</tbody>
        </table>{pr.data?.length === 0 && <p className="p-4 text-sm text-slate-600">Sem produtos.</p>}</div>
        <p className="text-sm text-slate-600">Para renovar, use “Pagar mensalidade” em <a className="font-semibold text-lagoon underline" href="/vendedor/produtos">Produtos e alugueres</a>.</p>
      </section>
      <section className="space-y-3"><h2 className="text-xl font-bold">Histórico de pagamentos</h2>
        <div className="overflow-x-auto rounded-lg border border-line bg-white"><table className="w-full min-w-[640px]">
          <thead className="bg-paper"><tr><th className="th">Data</th><th className="th">Produto</th><th className="th">Valor</th><th className="th">Método</th><th className="th">Estado</th></tr></thead>
          <tbody className="divide-y divide-line">{pg.data?.map((p) => <tr key={p.id}><td className="td">{dt(p.createdAt)}</td><td className="td">{p.produto.titulo}</td><td className="td">{kz(p.valor)}</td><td className="td">{p.metodo === 'MULTICAIXA_EXPRESS' ? 'Express' : 'Referência'}</td>
            <td className="td"><Badge s={p.estado} />{p.motivoRejeicao && <p className="text-xs text-red-700">{p.motivoRejeicao}</p>}</td></tr>)}</tbody>
        </table>{pg.data?.length === 0 && <p className="p-4 text-sm text-slate-600">Ainda não submeteu pagamentos.</p>}</div>
      </section>
    </div>
  );
}
