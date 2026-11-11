import crypto from 'crypto';

export const normalizePhone = (v = '') => {
  let d = String(v).replace(/\D/g, '');
  if (d.length === 9 && d.startsWith('9')) d = '244' + d;
  return d;
};
export const PHONE_RE = /^244\d{9}$/;

export const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
export const randomCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');

// As mensalidades expiram à 00:00 (UTC) do dia de vencimento
export const startOfDay = (d) => {
  const x = new Date(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
};
export const addDays = (d, n) => new Date(new Date(d).getTime() + n * 86400000);
export const fmtDate = (d) => {
  const x = new Date(d);
  return `${String(x.getUTCDate()).padStart(2, '0')}/${String(x.getUTCMonth() + 1).padStart(2, '0')}/${x.getUTCFullYear()}`;
};

// Filtro estrito da vitrine e das pesquisas
export const visivel = () => ({
  estadoAnuncio: 'PUBLICADO',
  estadoMensalidade: 'ATIVO',
  mensalidadeExpiraEm: { gt: new Date() },
});

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
