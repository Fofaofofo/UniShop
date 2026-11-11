import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { HttpError, visivel, wrap } from '../lib/utils.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { aprovarPagamento } from '../services/mensalidade.js';

const r = Router();
r.use(requireAuth, requireRole('ADMIN'));

// ── Cursos / Blocos / Salas ──
r.get('/cursos', wrap(async (_q, res) => res.json(await prisma.curso.findMany({ orderBy: { nome: 'asc' } }))));
r.post('/cursos', wrap(async (q, res) => res.status(201).json(await prisma.curso.create({ data: { nome: z.string().trim().min(2).parse(q.body.nome) } }))));
r.patch('/cursos/:id', wrap(async (q, res) => res.json(await prisma.curso.update({ where: { id: q.params.id },
  data: z.object({ nome: z.string().trim().min(2).optional(), ativo: z.boolean().optional() }).parse(q.body) }))));

r.get('/blocos', wrap(async (_q, res) => res.json(await prisma.bloco.findMany({ orderBy: { nome: 'asc' }, include: { salas: { orderBy: { nome: 'asc' } } } }))));
r.post('/blocos', wrap(async (q, res) => res.status(201).json(await prisma.bloco.create({ data: { nome: z.string().trim().min(2).parse(q.body.nome) } }))));
r.patch('/blocos/:id', wrap(async (q, res) => res.json(await prisma.bloco.update({ where: { id: q.params.id },
  data: z.object({ nome: z.string().trim().min(2).optional(), ativo: z.boolean().optional() }).parse(q.body) }))));
r.post('/blocos/:id/salas', wrap(async (q, res) => res.status(201).json(await prisma.sala.create({
  data: { nome: z.string().trim().min(1).parse(q.body.nome), blocoId: q.params.id } }))));
r.patch('/salas/:id', wrap(async (q, res) => res.json(await prisma.sala.update({ where: { id: q.params.id },
  data: z.object({ nome: z.string().trim().min(1).optional(), ativo: z.boolean().optional() }).parse(q.body) }))));

// ── Produtos & destaques ──
r.get('/produtos', wrap(async (_q, res) => {
  res.json(await prisma.produto.findMany({
    where: { estadoAnuncio: { not: 'ELIMINADO' } }, orderBy: { createdAt: 'desc' }, take: 300,
    include: { vendedor: { select: { nomeCompleto: true, matricula: true } }, destaque: { select: { id: true } } },
  }));
}));
r.delete('/produtos/:id', wrap(async (q, res) => {
  await prisma.produto.update({ where: { id: q.params.id }, data: { estadoAnuncio: 'ELIMINADO' } });
  await prisma.destaque.deleteMany({ where: { produtoId: q.params.id } });
  res.json({ ok: true });
}));
r.post('/destaques', wrap(async (q, res) => {
  const { produtoId } = z.object({ produtoId: z.string() }).parse(q.body);
  if (!(await prisma.produto.findFirst({ where: { id: produtoId, ...visivel() } }))) throw new HttpError(400, 'Só produtos com mensalidade ativa podem ser destacados.');
  const ordem = await prisma.destaque.count();
  res.status(201).json(await prisma.destaque.create({ data: { produtoId, ordem } }));
}));
r.delete('/destaques/:produtoId', wrap(async (q, res) => {
  await prisma.destaque.deleteMany({ where: { produtoId: q.params.produtoId } });
  res.json({ ok: true });
}));

// ── Utilizadores ──
r.get('/users', wrap(async (q, res) => {
  const role = z.enum(['COMPRADOR', 'VENDEDOR', 'ADMIN']).optional().parse(q.query.role);
  res.json(await prisma.user.findMany({
    where: role ? { role } : {}, orderBy: { createdAt: 'desc' }, take: 300,
    select: { id: true, nomeCompleto: true, matricula: true, telefone: true, role: true, ativo: true, telefoneVerificado: true,
      curso: { select: { nome: true } }, _count: { select: { produtos: true } } },
  }));
}));
r.patch('/users/:id', wrap(async (q, res) => {
  if (q.params.id === q.user.id) throw new HttpError(400, 'Não pode desativar a sua própria conta.');
  const { ativo } = z.object({ ativo: z.boolean() }).parse(q.body);
  res.json(await prisma.user.update({ where: { id: q.params.id }, data: { ativo }, select: { id: true, ativo: true } }));
}));

// ── Finanças ──
r.get('/config', wrap(async (_q, res) => res.json(await prisma.configuracao.findUnique({ where: { id: 'singleton' } }))));
r.put('/config', wrap(async (q, res) => {
  const d = z.object({
    valorMensalidade: z.coerce.number().positive(), duracaoDias: z.coerce.number().int().min(1).max(365).default(30),
    entidade: z.string().trim().optional().nullable(), referenciaBase: z.string().trim().optional().nullable(),
    numeroExpress: z.string().trim().optional().nullable(), diasAvisoPrevio: z.coerce.number().int().min(1).max(30).default(3),
  }).parse(q.body);
  res.json(await prisma.configuracao.upsert({ where: { id: 'singleton' }, create: { id: 'singleton', ...d }, update: d }));
}));

r.get('/pagamentos', wrap(async (q, res) => {
  const estado = z.enum(['PENDENTE', 'APROVADO', 'REJEITADO']).optional().parse(q.query.estado);
  res.json(await prisma.pagamento.findMany({
    where: estado ? { estado } : {}, orderBy: { createdAt: 'desc' }, take: 200,
    include: { produto: { select: { titulo: true } }, vendedor: { select: { nomeCompleto: true, matricula: true, telefone: true } } },
  }));
}));
r.post('/pagamentos/:id/aprovar', wrap(async (q, res) => res.json(await aprovarPagamento(q.params.id, q.user.id))));
r.post('/pagamentos/:id/rejeitar', wrap(async (q, res) => {
  const { motivo } = z.object({ motivo: z.string().trim().min(3).max(300) }).parse(q.body);
  const pg = await prisma.pagamento.findUnique({ where: { id: q.params.id } });
  if (!pg || pg.estado !== 'PENDENTE') throw new HttpError(409, 'Pagamento já processado.');
  res.json(await prisma.pagamento.update({ where: { id: pg.id },
    data: { estado: 'REJEITADO', motivoRejeicao: motivo, validadoPorId: q.user.id, validadoEm: new Date() } }));
}));

r.get('/mensalidades', wrap(async (_q, res) => {
  const vs = await prisma.user.findMany({
    where: { role: 'VENDEDOR', produtos: { some: { estadoAnuncio: { not: 'ELIMINADO' } } } },
    select: { id: true, nomeCompleto: true, matricula: true,
      produtos: { where: { estadoAnuncio: { not: 'ELIMINADO' } }, select: { id: true, titulo: true, estadoMensalidade: true, mensalidadeExpiraEm: true } } },
  });
  res.json(vs.map((v) => ({ ...v, produtos: v.produtos.map((p) => ({ ...p,
    diasRestantes: p.mensalidadeExpiraEm ? Math.ceil((p.mensalidadeExpiraEm - Date.now()) / 86400000) : null })) })));
}));

// ── Moderação ──
r.get('/denuncias', wrap(async (_q, res) => res.json(await prisma.denuncia.findMany({
  orderBy: [{ estado: 'asc' }, { createdAt: 'desc' }], take: 200,
  include: { produto: { select: { id: true, titulo: true } }, autor: { select: { nomeCompleto: true } } } }))));
r.patch('/denuncias/:id', wrap(async (q, res) => {
  const d = z.object({ estado: z.enum(['RESOLVIDA', 'REJEITADA']), removerProduto: z.boolean().optional() }).parse(q.body);
  const den = await prisma.denuncia.update({ where: { id: q.params.id }, data: { estado: d.estado } });
  if (d.removerProduto) {
    await prisma.produto.update({ where: { id: den.produtoId }, data: { estadoAnuncio: 'ELIMINADO' } });
    await prisma.destaque.deleteMany({ where: { produtoId: den.produtoId } });
  }
  res.json(den);
}));
r.get('/avaliacoes', wrap(async (_q, res) => res.json(await prisma.avaliacao.findMany({
  orderBy: { createdAt: 'desc' }, take: 200,
  include: { autor: { select: { nomeCompleto: true } }, produto: { select: { titulo: true } }, alvoUser: { select: { nomeCompleto: true } } } }))));
r.patch('/avaliacoes/:id', wrap(async (q, res) => res.json(await prisma.avaliacao.update({ where: { id: q.params.id },
  data: { removida: z.object({ removida: z.boolean() }).parse(q.body).removida } }))));

export default r;
