import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { HttpError, visivel, wrap } from '../lib/utils.js';
import { requireAuth } from '../middlewares/auth.js';

const r = Router();
r.use(requireAuth);

// Pedido de aluguer
r.post('/alugueres', wrap(async (req, res) => {
  const d = z.object({ produtoId: z.string(), dataPrevistaDevolucao: z.coerce.date().optional() }).parse(req.body);
  const p = await prisma.produto.findFirst({ where: { id: d.produtoId, tipo: 'ALUGUER', ...visivel() } });
  if (!p) throw new HttpError(404, 'Item de aluguer indisponível.');
  if (p.vendedorId === req.user.id) throw new HttpError(400, 'Não pode alugar o seu próprio item.');
  if (d.dataPrevistaDevolucao && d.dataPrevistaDevolucao <= new Date()) throw new HttpError(400, 'A data de devolução deve ser futura.');
  const a = await prisma.aluguer.create({
    data: { produtoId: p.id, locatarioId: req.user.id, dataPrevistaDevolucao: d.dataPrevistaDevolucao },
  });
  res.status(201).json(a);
}));

r.get('/alugueres/meus', wrap(async (req, res) => {
  res.json(await prisma.aluguer.findMany({
    where: { locatarioId: req.user.id }, orderBy: { createdAt: 'desc' },
    include: { produto: { select: { titulo: true, imagemUrl: true, vendedor: { select: { nomeCompleto: true, telefone: true } } } } },
  }));
}));

r.post('/avaliacoes', wrap(async (req, res) => {
  const d = z.object({ produtoId: z.string(), estrelas: z.coerce.number().int().min(1).max(5), comentario: z.string().max(500).optional() }).parse(req.body);
  const p = await prisma.produto.findFirst({ where: { id: d.produtoId, ...visivel() } });
  if (!p) throw new HttpError(404, 'Produto indisponível.');
  if (p.vendedorId === req.user.id) throw new HttpError(400, 'Não pode avaliar o seu próprio produto.');
  res.status(201).json(await prisma.avaliacao.create({ data: { ...d, autorId: req.user.id } }));
}));

r.post('/denuncias', wrap(async (req, res) => {
  const d = z.object({ produtoId: z.string(), motivo: z.string().trim().min(5).max(500) }).parse(req.body);
  res.status(201).json(await prisma.denuncia.create({ data: { ...d, autorId: req.user.id } }));
}));

export default r;
