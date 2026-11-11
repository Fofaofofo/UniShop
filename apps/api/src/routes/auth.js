import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { HttpError, PHONE_RE, normalizePhone, randomCode, sha256, wrap } from '../lib/utils.js';
import { cookieOpts, requireAuth, signToken } from '../middlewares/auth.js';
import { sendWhatsApp } from '../services/whatsapp.js';

const r = Router();
r.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }));

const phone = z.string().transform(normalizePhone).refine((v) => PHONE_RE.test(v), 'Telefone inválido (formato 2449XXXXXXXX).');

async function enviarOtp(user) {
  const last = await prisma.otpCode.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  if (last && Date.now() - last.createdAt.getTime() < 60_000) throw new HttpError(429, 'Aguarde 1 minuto antes de pedir novo código.');
  const code = randomCode();
  await prisma.otpCode.create({
    data: { userId: user.id, codigoHash: sha256(user.id + code), expiraEm: new Date(Date.now() + 5 * 60_000) },
  });
  await sendWhatsApp(user.telefone, `ISPTEC Marketplace: O seu código de verificação é ${code}. Introduza este código para ativar a sua conta.`);
}

const registoSchema = z.object({
  nomeCompleto: z.string().trim().min(3),
  matricula: z.string().trim().min(3),
  telefone: phone,
  password: z.string().min(8, 'A password deve ter pelo menos 8 caracteres.'),
  role: z.enum(['COMPRADOR', 'VENDEDOR']),
  cursoId: z.string(), blocoId: z.string(), salaId: z.string(),
  anoAcademico: z.coerce.number().int().min(1).max(6),
});

r.post('/registo', wrap(async (req, res) => {
  const d = registoSchema.parse(req.body);
  const [curso, sala] = await Promise.all([
    prisma.curso.findFirst({ where: { id: d.cursoId, ativo: true } }),
    prisma.sala.findFirst({ where: { id: d.salaId, blocoId: d.blocoId, ativo: true, bloco: { ativo: true } } }),
  ]);
  if (!curso) throw new HttpError(400, 'Curso inválido.');
  if (!sala) throw new HttpError(400, 'A sala não pertence ao bloco selecionado.');
  const user = await prisma.user.create({
    data: {
      nomeCompleto: d.nomeCompleto, matricula: d.matricula.toUpperCase(), telefone: d.telefone,
      passwordHash: await bcrypt.hash(d.password, 10), role: d.role,
      cursoId: d.cursoId, blocoId: d.blocoId, salaId: d.salaId, anoAcademico: d.anoAcademico,
    },
  });
  await enviarOtp(user);
  res.status(201).json({ message: 'Conta criada. Enviámos um código para o seu WhatsApp.', telefone: user.telefone });
}));

r.post('/verificar', wrap(async (req, res) => {
  const { telefone, codigo } = z.object({ telefone: phone, codigo: z.string().length(6) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { telefone } });
  if (!user) throw new HttpError(404, 'Número não encontrado.');
  if (user.telefoneVerificado) throw new HttpError(409, 'Número já verificado.');
  const otp = await prisma.otpCode.findFirst({
    where: { userId: user.id, usadoEm: null, expiraEm: { gt: new Date() } }, orderBy: { createdAt: 'desc' },
  });
  if (!otp || otp.tentativas >= 5) throw new HttpError(400, 'Código expirado. Peça um novo código.');
  if (otp.codigoHash !== sha256(user.id + codigo)) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { tentativas: { increment: 1 } } });
    throw new HttpError(400, 'Código incorreto.');
  }
  await prisma.$transaction([
    prisma.otpCode.update({ where: { id: otp.id }, data: { usadoEm: new Date() } }),
    prisma.user.update({ where: { id: user.id }, data: { telefoneVerificado: true } }),
  ]);
  res.cookie('token', signToken(user), cookieOpts()).json({ message: 'Conta verificada.' });
}));

r.post('/reenviar', wrap(async (req, res) => {
  const { telefone } = z.object({ telefone: phone }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { telefone } });
  if (user && !user.telefoneVerificado) await enviarOtp(user);
  res.json({ message: 'Se o número existir, enviámos um novo código.' });
}));

r.post('/login', wrap(async (req, res) => {
  const { matricula, password } = z.object({ matricula: z.string(), password: z.string() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { matricula: matricula.trim().toUpperCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new HttpError(401, 'Matrícula ou password incorretas.');
  if (!user.ativo) throw new HttpError(403, 'Conta desativada. Contacte a administração.');
  if (!user.telefoneVerificado) return res.status(403).json({ error: 'Verifique o seu número de WhatsApp.', precisaVerificar: true, telefone: user.telefone });
  res.cookie('token', signToken(user), cookieOpts()).json({ id: user.id, nomeCompleto: user.nomeCompleto, role: user.role });
}));

r.post('/logout', (_req, res) => res.clearCookie('token', { ...cookieOpts(), maxAge: undefined }).json({ ok: true }));

r.get('/me', requireAuth, wrap(async (req, res) => {
  const u = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, nomeCompleto: true, matricula: true, telefone: true, role: true, anoAcademico: true,
      curso: { select: { nome: true } }, bloco: { select: { nome: true } }, sala: { select: { nome: true } } },
  });
  res.json(u);
}));

export default r;
