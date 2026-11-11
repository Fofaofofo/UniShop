'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, CATEGORIAS } from '@/lib/api';
import { Msg } from '@/components/ui';

const MAX = 1024 * 1024 - 1;

export default function ProductForm({ produto }) {
  const router = useRouter();
  const [blocos, setBlocos] = useState([]);
  const [f, setF] = useState({
    titulo: produto?.titulo || '', descricao: produto?.descricao || '', categoria: produto?.categoria || 'ALIMENTACAO',
    tipo: produto?.tipo || 'VENDA', preco: produto?.preco ? Number(produto.preco) : '', salaId: produto?.salaId || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(produto?.imagemUrl || '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('/public/blocos').then(setBlocos); }, []);

  const set = (k) => (e) => setF((s) => {
    const v = e.target.value; const n = { ...s, [k]: v };
    if (k === 'categoria') n.tipo = v === 'ALUGUER' ? 'ALUGUER' : s.tipo === 'ALUGUER' ? 'VENDA' : s.tipo;
    return n;
  });

  const onFile = (e) => {
    const x = e.target.files[0]; setErr('');
    if (!x) return;
    if (x.size > MAX) { setErr('A fotografia deve ter menos de 1MB. Reduza a resolução e tente de novo.'); e.target.value = ''; return; }
    setFile(x); setPreview(URL.createObjectURL(x));
  };

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!produto && !file) return setErr('Adicione uma fotografia (máx. 1MB).');
    setBusy(true);
    try {
      const form = new FormData();
      Object.entries(f).forEach(([k, v]) => v !== '' && form.append(k, v));
      if (file) form.append('imagem', file);
      await api(produto ? `/vendedor/produtos/${produto.id}` : '/vendedor/produtos', { method: produto ? 'PUT' : 'POST', form });
      router.push('/vendedor/produtos');
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="panel max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold">{produto ? 'Editar produto' : 'Cadastrar produto ou aluguer'}</h1>
      <div><label className="label" htmlFor="t">Título</label><input id="t" className="input" value={f.titulo} onChange={set('titulo')} required minLength={3} /></div>
      <div><label className="label" htmlFor="d">Descrição</label><textarea id="d" className="input" rows={4} value={f.descricao} onChange={set('descricao')} required minLength={10} /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className="label" htmlFor="c">Categoria</label><select id="c" className="input" value={f.categoria} onChange={set('categoria')}>{Object.entries(CATEGORIAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="label" htmlFor="ti">Tipo</label><select id="ti" className="input" value={f.tipo} onChange={set('tipo')}><option value="VENDA">Venda</option><option value="ALUGUER">Aluguer</option></select></div>
        <div><label className="label" htmlFor="p">Preço (Kz)</label><input id="p" type="number" min="1" step="any" className="input" value={f.preco} onChange={set('preco')} required /></div>
      </div>
      <div><label className="label" htmlFor="s">Localização de entrega (opcional)</label>
        <select id="s" className="input" value={f.salaId} onChange={set('salaId')}><option value="">Sem localização</option>
          {blocos.map((b) => <optgroup key={b.id} label={b.nome}>{b.salas.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</optgroup>)}</select></div>
      <div><label className="label" htmlFor="i">Fotografia (JPG, PNG ou WebP, menos de 1MB)</label>
        <input id="i" type="file" accept="image/jpeg,image/png,image/webp" className="input" onChange={onFile} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img src={preview} alt="Pré-visualização" className="mt-2 h-32 rounded-md object-cover" />}</div>
      {!produto && <p className="rounded-md bg-lagoon-soft p-3 text-sm">O produto fica <b>Pendente</b> e só aparece na vitrine depois de pagar a mensalidade (em “Produtos e alugueres”).</p>}
      <Msg error={err} />
      <button className="btn-primary" disabled={busy}>{busy ? 'A guardar…' : produto ? 'Guardar alterações' : 'Cadastrar produto'}</button>
    </form>
  );
}
