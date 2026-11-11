'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, CATEGORIAS, kz, waLink, dt } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Modal, Msg, Stars, useLoad } from '@/components/ui';

export default function Produto() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: p, error, reload } = useLoad(() => api(`/public/produtos/${id}`), [id]);
  const [msg, setMsg] = useState({});
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ estrelas: 5, comentario: '', motivo: '', data: '' });

  if (error) return <p className="panel">Este produto já não está disponível. <Link href="/" className="font-semibold text-lagoon underline">Voltar à vitrine</Link></p>;
  if (!p) return <p className="text-sm text-slate-500">A carregar…</p>;

  const run = async (fn, ok) => {
    setMsg({});
    try { await fn(); setMsg({ ok }); setModal(null); reload(); } catch (e) { setMsg({ error: e.message, modal: true }); }
  };
  const needLogin = () => !user && (window.location.href = '/login');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.imagemUrl} alt={p.titulo} className="w-full rounded-xl border border-line bg-lagoon-soft object-cover" />
      <div className="space-y-4">
        <p className="text-sm text-slate-500">{CATEGORIAS[p.categoria]} · {p.tipo === 'ALUGUER' ? 'Aluguer' : 'Venda'}</p>
        <h1 className="text-3xl font-extrabold">{p.titulo}</h1>
        <p className="text-2xl font-extrabold text-lagoon">{kz(p.preco)}</p>
        <div className="flex items-center gap-2 text-sm"><Stars value={p.media || 0} /><span>{p.totalAvaliacoes} avaliações</span></div>
        <p className="whitespace-pre-line leading-relaxed">{p.descricao}</p>
        <div className="panel text-sm">
          <p className="font-semibold">{p.vendedor.nomeCompleto}</p>
          <p className="text-slate-600">{p.vendedor.curso.nome}</p>
          {p.sala && <p className="text-slate-600">Local: {p.sala.bloco.nome} · {p.sala.nome}</p>}
        </div>
        {!msg.modal && <Msg error={msg.error} ok={msg.ok} />}
        <div className="flex flex-wrap gap-2">
          <a className="btn-sol" target="_blank" rel="noreferrer" href={waLink(p.vendedor.telefone, `Olá! Vi o seu anúncio "${p.titulo}" no ISPTEC Marketplace.`)}>Falar no WhatsApp</a>
          {p.tipo === 'ALUGUER' && <button className="btn-primary" onClick={() => (user ? setModal('aluguer') : needLogin())}>Pedir aluguer</button>}
          <button className="btn-ghost" onClick={() => (user ? setModal('aval') : needLogin())}>Avaliar</button>
          <button className="btn-ghost" onClick={() => (user ? setModal('den') : needLogin())}>Denunciar</button>
        </div>
        {p.avaliacoes.length > 0 && (
          <section className="space-y-2 pt-2">
            <h2 className="text-lg font-bold">Avaliações</h2>
            {p.avaliacoes.map((a) => (
              <div key={a.id} className="panel !p-3 text-sm">
                <div className="flex items-center justify-between"><b>{a.autor.nomeCompleto}</b><Stars value={a.estrelas} /></div>
                {a.comentario && <p className="mt-1 text-slate-700">{a.comentario}</p>}
                <p className="mt-1 text-xs text-slate-500">{dt(a.createdAt)}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      {modal === 'aluguer' && (
        <Modal title="Pedir aluguer" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div><label className="label" htmlFor="dd">Data prevista de devolução</label>
              <input id="dd" type="date" className="input" min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
            {msg.modal && <Msg error={msg.error} />}
            <button className="btn-primary w-full" onClick={() => run(() => api('/cliente/alugueres', { method: 'POST', body: { produtoId: p.id, dataPrevistaDevolucao: form.data || undefined } }), 'Pedido enviado. Acompanhe em "Meus pedidos".')}>Enviar pedido</button>
          </div>
        </Modal>
      )}
      {modal === 'aval' && (
        <Modal title="Avaliar produto" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <Stars value={form.estrelas} onChange={(n) => setForm({ ...form, estrelas: n })} />
            <textarea className="input" rows={3} placeholder="Comentário (opcional)" value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} />
            {msg.modal && <Msg error={msg.error} />}
            <button className="btn-primary w-full" onClick={() => run(() => api('/cliente/avaliacoes', { method: 'POST', body: { produtoId: p.id, estrelas: form.estrelas, comentario: form.comentario || undefined } }), 'Avaliação publicada.')}>Publicar avaliação</button>
          </div>
        </Modal>
      )}
      {modal === 'den' && (
        <Modal title="Denunciar anúncio" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <textarea className="input" rows={3} placeholder="Explique o problema (mín. 5 caracteres)" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
            {msg.modal && <Msg error={msg.error} />}
            <button className="btn-danger w-full" onClick={() => run(() => api('/cliente/denuncias', { method: 'POST', body: { produtoId: p.id, motivo: form.motivo } }), 'Denúncia enviada à administração.')}>Enviar denúncia</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
