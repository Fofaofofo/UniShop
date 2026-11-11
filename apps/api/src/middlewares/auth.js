import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { HttpError, wrap } from '../lib/utils.js';

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const cookieOpts = () => {
  const prod = process.env.NODE_ENV === 'production';
  return { httpOnly: true, secure: prod, sameSite: prod ? 'none' : 'lax', maxAge: 7 * 86400000, path: '/' };
};

const load = async (req) => {
  const h = req.headers.authorization;
  const token = req.cookies?.token || (h?.startsWith('Bearer ') ? h.slice(7) : null);
  if (!token) return null;
  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET);
    const u = await prisma.user.findUnique({
      where: { id: sub },
      select: { id: true, role: true, ativo: true, nomeCompleto: true, telefone: true, matricula: true },
    });
    return u && u.ativo ? u : null;
  } catch { return null; }
};

export const requireAuth = wrap(async (req, _res, next) => {
  const u = await load(req);
  if (!u) throw new HttpError(401, 'Sessão inválida. Inicie sessão novamente.');
  req.user = u;
  next();
});

export const requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new HttpError(403, 'Sem permissão para esta ação.'));
