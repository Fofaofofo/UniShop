'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api, dt, kz, CATEGORIAS } from '@/lib/api';
import { Badge, Modal, Msg, useLoad } from '@/components/ui';

function PayModal({ produto, onClose, onDone }) {
  const { data: info } = useLoad(() => api('/vendedor/pagamento-info'));
  const [metodo, setMetodo] = useState('REFERENCIA_MULTICAIXA');
  const [ref, setRef] = useState('');
  const [file, setFile] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const enviar = async () => {
    setErr(''); setBusy(true);
    try {
      const form = new FormData();
      form.append('metodo', metodo);
      if (ref) form.append('referenciaTransacao', ref);
      if (file) form.append('comprovativo', file);
      await api(`/vendedor/produtos/${produto.id}/pagamentos`, { method: 'POST', form });
      onDone();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  const row = (k, v) => v && <div className="flex justify-between gap-4 border-b border-line py-1.5 text-sm"><span className="text-slate-600">{k}</span><b>{v}</b></div>;

  return (
    <Modal title={`Pagar mensalidade: ${produto.titulo}`} onClose={onClose}>
      {!info ? <p className="text-sm">A carregar…</p> : (
        <div className="space-y-4">
          <p className="text-sm">Valor: <b className="text-lg">{kz(info.valorMensalidade)}</b> por {info.duracaoDias} dias.</p>
          <div className="flex gap-2" role="tablist">
            {[['REFERENCIA_MULTICAIXA', 'Referência Multicaixa'], ['MULTICAIXA_EXPRESS', 'Multicaixa Express']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={metodo === k} onClick={() => setMetodo(k)} className={metodo === k ? 'btn-primary flex-1' : 'btn-ghost flex-1'}>{l}</button>
            ))}
          </div>
          <div className="rounded-md bg-lagoon-soft p-3">
            {metodo === 'REFERENCIA_MULTICAIXA' ? (<>{row('Entidade', info.entidade)}{row('Referência', info.referenciaBase)}</>) : row('Número Express', info.numeroExpress)}
            {row('Valor', kz(info.valorMensalidade))}
          </div>
          <div><label className="label" htmlFor="rt">Dados da transferência (opcional se anexar comprovativo)</label>
            <input id="rt" className="input" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Nº da operação" /></div>
          <div><label className="label" htmlFor="cp">Comprovativo (imagem ou PDF, máx. 3MB)</label>
            <input id="cp" type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files[0] || null)} className="input" /></div>
          <Msg error={err} />
          <button className="btn-sol w-full" onClick={enviar} disabled={busy}>{busy ? 'A enviar…' : 'Enviar para validação'}</button>
        </div>
      )}
    </Modal>
  );
}

export default function Produtos() {
  const { data, error, reload } = useLoad(() => api('/vendedor/produtos'));
  const [pay, setPay] = useState(null);
  const [msg, setMsg] = useState({});
  const act = async (fn, ok) => { setMsg({}); try { await fn(); setMsg({ ok }); reload(); } catch (e) { setMsg({ error: e.message }); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-extrabold">Produtos e alugueres</h1>
        <Link href="/vendedor/produtos/novo" className="btn-primary">Cadastrar produto</Link></div>
      <Msg {...msg} /><Msg error={error} />
      {data?.length === 0 && <p className="panel text-slate-600">Sem produtos ainda. Cadastre o primeiro e pague a mensalidade para o publicar.</p>}
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        {data?.length > 0 && (
          <table className="w-full min-w-[760px]">
            <thead className="bg-paper"><tr><th className="th">Produto</th><th className="th">Categoria</th><th className="th">Preço</th><th className="th">Estado</th><th className="th">Mensalidade até</th><th className="th">Ações</th></tr></thead>
            <tbody className="divide-y divide-line">
              {data.map((p) => (
                <tr key={p.id}>
                  <td className="td"><div className="flex items-center gap-2">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.imagemUrl} alt="" className="h-10 w-10 rounded object-cover" /><b>{p.titulo}</b></div></td>
                  <td className="td">{CATEGORIAS[p.categoria]} · {p.tipo === 'ALUGUER' ? 'Aluguer' : 'Venda'}</td>
                  <td className="td">{kz(p.preco)}</td>
                  <td className="td"><Badge s={p.estadoVisual} />{p.pagamentoPendente && <p className="mt-1 text-xs text-amber-700">Pagamento em validação</p>}</td>
                  <td className="td">{dt(p.mensalidadeExpiraEm)}{p.diasRestantes != null && p.diasRestantes > 0 && <p className="text-xs text-slate-500">{p.diasRestantes} dia(s)</p>}</td>
                  <td className="td"><div className="flex flex-wrap gap-1.5">
                    {!p.pagamentoPendente && (p.estadoVisual !== 'ATIVO' || p.diasRestantes <= 7) && <button className="btn-sol !px-2 !py-1" onClick={() => setPay(p)}>Pagar mensalidade</button>}
                    <Link className="btn-ghost !px-2 !py-1" href={`/vendedor/produtos/${p.id}`}>Editar</Link>
                    {p.estadoAnuncio !== 'PENDENTE' && <button className="btn-ghost !px-2 !py-1" onClick={() => act(() => api(`/vendedor/produtos/${p.id}/pausar`, { method: 'PATCH' }), p.estadoAnuncio === 'PAUSADO' ? 'Anúncio retomado.' : 'Anúncio pausado.')}>{p.estadoAnuncio === 'PAUSADO' ? 'Retomar' : 'Pausar'}</button>}
                    <button className="btn-ghost !px-2 !py-1 !text-red-700" onClick={() => confirm(`Eliminar “${p.titulo}”?`) && act(() => api(`/vendedor/produtos/${p.id}`, { method: 'DELETE' }), 'Produto eliminado.')}>Eliminar</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {pay && <PayModal produto={pay} onClose={() => setPay(null)} onDone={() => { setPay(null); setMsg({ ok: 'Comprovativo enviado. O administrador vai validar o pagamento.' }); reload(); }} />}
    </div>
  );
}
