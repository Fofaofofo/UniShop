import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { HttpError, visivel, wrap } from '../lib/utils.js';

const r = Router();
const card = {
  id: true, titulo: true, preco: true, imagemUrl: true, categoria: true, tipo: true,
  sala: { select: { nome: true, bloco: { select: { nome: true } } } },
  vendedor: { select: { nomeCompleto: true } },
};

r.get('/cursos', wrap(async (_q, res) => res.json(await prisma.curso.findMany({ where: { ativo: true }, orderBy: { nome: 'asc' } }))));
r.get('/blocos', wrap(async (_q, res) => res.json(
  await prisma.bloco.findMany({ where: { ativo: true }, orderBy: { nome: 'asc' },
    include: { salas: { where: { ativo: true }, orderBy: { nome: 'asc' } } } }))));

r.get('/produtos', wrap(async (req, res) => {
  const q = z.object({
    q: z.string().optional(), categoria: z.enum(['ALIMENTACAO', 'MATERIAL_ESCOLAR', 'ALUGUER']).optional(),
    tipo: z.enum(['VENDA', 'ALUGUER']).optional(), page: z.coerce.number().int().min(1).default(1),
  }).parse(req.query);
  const where = {
    ...visivel(),
    ...(q.categoria && { categoria: q.categoria }), ...(q.tipo && { tipo: q.tipo }),
    ...(q.q && { OR: [{ titulo: { contains: q.q, mode: 'insensitive' } }, { descricao: { contains: q.q, mode: 'insensitive' } }] }),
  };
  const take = 12;
  const [total, items] = await Promise.all([
    prisma.produto.count({ where }),
    prisma.produto.findMany({ where, select: card, orderBy: { createdAt: 'desc' }, take, skip: (q.page - 1) * take }),
  ]);
  res.json({ items, total, pages: Math.max(1, Math.ceil(total / take)) });
}));

r.get('/produtos/:id', wrap(async (req, res) => {
  const p = await prisma.produto.findFirst({
    where: { id: req.params.id, ...visivel() },
    select: { ...card, descricao: true,
      vendedor: { select: { id: true, nomeCompleto: true, telefone: true, curso: { select: { nome: true } } } } },
  });
  if (!p) throw new HttpError(404, 'Produto indisponível.');
  const [agg, avaliacoes] = await Promise.all([
    prisma.avaliacao.aggregate({ where: { produtoId: p.id, removida: false }, _avg: { estrelas: true }, _count: true }),
    prisma.avaliacao.findMany({ where: { produtoId: p.id, removida: false }, orderBy: { createdAt: 'desc' }, take: 20,
      select: { id: true, estrelas: true, comentario: true, createdAt: true, autor: { select: { nomeCompleto: true } } } }),
  ]);
  res.json({ ...p, media: agg._avg.estrelas, totalAvaliacoes: agg._count, avaliacoes });
}));

// Carrossel: apenas destaques cujo produto continua visível
r.get('/destaques', wrap(async (_q, res) => {
  const d = await prisma.destaque.findMany({
    where: { ativo: true, produto: visivel() }, orderBy: { ordem: 'asc' }, take: 10,
    select: { produto: { select: card } },
  });
  res.json(d.map((x) => x.produto));
}));

export default r;
