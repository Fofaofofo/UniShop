export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function api(path, { method = 'GET', body, form } = {}) {
  const opts = { method, credentials: 'include', headers: {} };
  if (form) opts.body = form;
  else if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(`${API}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error(data.error || 'Ocorreu um erro.'); e.status = res.status; e.data = data; throw e; }
  return data;
}

export const kz = (v) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(Number(v || 0));
export const dt = (d) => (d ? new Date(d).toLocaleDateString('pt-PT', { timeZone: 'UTC' }) : '—');
export const CATEGORIAS = { ALIMENTACAO: 'Alimentação', MATERIAL_ESCOLAR: 'Material escolar', ALUGUER: 'Aluguer' };
export const waLink = (tel, msg) => `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
