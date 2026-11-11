import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { HttpError, addDays, wrap } from '../lib/utils.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { uploadComprovativo, uploadImagem } from '../middlewares/upload.js';
import { saveFile } from '../services/storage.js';

const r = Router();
r.use(requireAuth, requireRole('VENDEDOR'));

const own = async (id, userId) => {
  const p = await prisma.produto.findFirst({ where: { id, vendedorId: userId, estadoAnuncio: { not: 'ELIMINADO' } } });
  if (!p) throw new HttpError(404, 'Produto não encontrado.');
  return p;
};
const diasRestantes = (p) => (p.mensalidadeExpiraEm ? Math.ceil((p.mensalidadeExpiraEm - Date.now()) / 86400000) : null);

// Estado apresentado ao vendedor: Ativo / Oculto / Pendente / Pausado
const estadoVisual = (p) => {
  if (p.estadoAnuncio === 'PENDENTE' || p.estadoMensalidade === 'PENDENTE') return 'PENDENTE';
  if (p.estadoAnuncio === 'PAUSADO') return 'PAUSADO';
  return p.estadoMensalidade === 'ATIVO' && p.mensalidadeExpiraEm > new Date() ? 'ATIVO' : 'OCULTO';
};

r.get('/dashboard', wrap(async (req, res) => {
  const where = { vendedorId: req.user.id, estadoAnuncio: { not: 'ELIMINADO' } };
  const [produtos, alugueres, rating] = await Promise.all([
    prisma.produto.findMany({ where }),
    prisma.aluguer.count({ where: { produto: { vendedorId: req.user.id } } }),
    prisma.avaliacao.aggregate({ where: { produto: { vendedorId: req.user.id }, removida: false }, _avg: { estrelas: true } }),
  ]);
  const ativos = produtos.filter((p) => estadoVisual(p) === 'ATIVO');
  res.json({
    totalProdutos: produtos.length, ativos: ativos.length,
    aExpirar: ativos.filter((p) => diasRestantes(p) <= 7).map((p) => ({ id: p.id, titulo: p.titulo, dias: diasRestantes(p) })),
    ocultos: produtos.filter((p) => estadoVisual(p) === 'OCULTO').length,
    totalAlugueres: alugueres, mediaEstrelas: rating._avg.estrelas,
  });
}));

r.get('/pagamento-info', wrap(async (_q, res) => {
  const c = await prisma.configuracao.findUnique({ where: { id: 'singleton' } });
  res.json({ valorMensalidade: c?.valorMensalidade ?? null, duracaoDias: c?.duracaoDias ?? 30,
    entidade: c?.entidade ?? null, referenciaBase: c?.referenciaBase ?? null, numeroExpress: c?.numeroExpress ?? null });
}));

r.get('/produtos', wrap(async (req, res) => {
  const ps = await prisma.produto.findMany({
    where: { vendedorId: req.user.id, estadoAnuncio: { not: 'ELIMINADO' } }, orderBy: { createdAt: 'desc' },
    include: { sala: { select: { nome: true, bloco: { select: { nome: true } } } },
      pagamentos: { where: { estado: 'PENDENTE' }, select: { id: true } } },
  });
  res.json(ps.map((p) => ({ ...p, estadoVisual: estadoVisual(p), diasRestantes: diasRestantes(p), pagamentoPendente: p.pagamentos.length > 0 })));
}));

const prodSchema = z.object({
  titulo: z.string().trim().min(3).max(120), descricao: z.string().trim().min(10).max(2000),
  categoria: z.enum(['ALIMENTACAO', 'MATERIAL_ESCOLAR', 'ALUGUER']), tipo: z.enum(['VENDA', 'ALUGUER']),
  preco: z.coerce.number().positive(), salaId: z.string().optional(),
});

r.post('/produtos', uploadImagem, wrap(async (req, res) => {
  const d = prodSchema.parse(req.body);
  if (!req.file) throw new HttpError(400, 'A fotografia é obrigatória (máx. 1MB).');
  const imagemUrl = await saveFile(req.file, 'produtos');
  res.status(201).json(await prisma.produto.create({ data: { ...d, salaId: d.salaId || null, imagemUrl, vendedorId: req.user.id } }));
}));

r.put('/produtos/:id', uploadImagem, wrap(async (req, res) => {
  await own(req.params.id, req.user.id);
  const d = prodSchema.parse(req.body);
  const data = { ...d, salaId: d.salaId || null };
  if (req.file) data.imagemUrl = await saveFile(req.file, 'produtos');
  res.json(await prisma.produto.update({ where: { id: req.params.id }, data }));
}));

r.patch('/produtos/:id/pausar', wrap(async (req, res) => {
  const p = await own(req.params.id, req.user.id);
  if (p.estadoAnuncio === 'PENDENTE') throw new HttpError(400, 'Pague a mensalidade para publicar o produto.');
  const estadoAnuncio = p.estadoAnuncio === 'PAUSADO' ? 'PUBLICADO' : 'PAUSADO';
  res.json(await prisma.produto.update({ where: { id: p.id }, data: { estadoAnuncio } }));
}));

r.delete('/produtos/:id', wrap(async (req, res) => {
  await own(req.params.id, req.user.id);
  await prisma.produto.update({ where: { id: req.params.id }, data: { estadoAnuncio: 'ELIMINADO' } });
  await prisma.destaque.deleteMany({ where: { produtoId: req.params.id } });
  res.json({ ok: true });
}));

// Submissão do comprovativo de pagamento
r.post('/produtos/:id/pagamentos', uploadComprovativo, wrap(async (req, res) => {
  const p = await own(req.params.id, req.user.id);
  const d = z.object({ metodo: z.enum(['REFERENCIA_MULTICAIXA', 'MULTICAIXA_EXPRESS']), referenciaTransacao: z.string().trim().max(100).optional() }).parse(req.body);
  if (!req.file && !d.referenciaTransacao) throw new HttpError(400, 'Anexe o comprovativo ou indique os dados da transferência.');
  if (await prisma.pagamento.findFirst({ where: { produtoId: p.id, estado: 'PENDENTE' } })) throw new HttpError(409, 'Já existe um pagamento em validação para este produto.');
  const cfg = await prisma.configuracao.findUnique({ where: { id: 'singleton' } });
  if (!cfg) throw new HttpError(503, 'A taxa ainda não foi configurada pelo administrador.');
  const comprovativoUrl = req.file ? await saveFile(req.file, 'comprovativos') : null;
  res.status(201).json(await prisma.pagamento.create({
    data: { produtoId: p.id, vendedorId: req.user.id, valor: cfg.valorMensalidade, ...d, comprovativoUrl },
  }));
}));

r.get('/pagamentos', wrap(async (req, res) => {
  res.json(await prisma.pagamento.findMany({
    where: { vendedorId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 100,
    include: { produto: { select: { titulo: true } } },
  }));
}));

// Pedidos & clientes (alugueres)
r.get('/alugueres', wrap(async (req, res) => {
  res.json(await prisma.aluguer.findMany({
    where: { produto: { vendedorId: req.user.id } }, orderBy: { createdAt: 'desc' },
    include: { produto: { select: { titulo: true } },
      locatario: { select: { id: true, nomeCompleto: true, matricula: true, telefone: true, curso: { select: { nome: true } } } },
      avaliacoes: { where: { autorId: req.user.id }, select: { id: true, estrelas: true } } },
  }));
}));

const TRANSICOES = { SOLICITADO: ['EM_CURSO', 'CANCELADO'], EM_CURSO: ['DEVOLVIDO'], ATRASADO: ['DEVOLVIDO'] };
r.patch('/alugueres/:id', wrap(async (req, res) => {
  const d = z.object({ estado: z.enum(['EM_CURSO', 'DEVOLVIDO', 'CANCELADO']), dataPrevistaDevolucao: z.coerce.date().optional() }).parse(req.body);
  const a = await prisma.aluguer.findFirst({ where: { id: req.params.id, produto: { vendedorId: req.user.id } } });
  if (!a) throw new HttpError(404, 'Pedido não encontrado.');
  if (!TRANSICOES[a.estado]?.includes(d.estado)) throw new HttpError(400, 'Transição de estado inválida.');
  const now = new Date();
  const data = { estado: d.estado };
  if (d.estado === 'EM_CURSO') {
    data.dataInicio = now;
    data.dataPrevistaDevolucao = d.dataPrevistaDevolucao || a.dataPrevistaDevolucao || addDays(now, 1);
  }
  if (d.estado === 'DEVOLVIDO') data.dataDevolucao = now;
  res.json(await prisma.aluguer.update({ where: { id: a.id }, data }));
}));

// Vendedor avalia o locatário (pontualidade, estado do material)
r.post('/alugueres/:id/avaliar', wrap(async (req, res) => {
  const d = z.object({ estrelas: z.coerce.number().int().min(1).max(5), comentario: z.string().max(500).optional() }).parse(req.body);
  const a = await prisma.aluguer.findFirst({ where: { id: req.params.id, produto: { vendedorId: req.user.id } } });
  if (!a) throw new HttpError(404, 'Pedido não encontrado.');
  if (a.estado !== 'DEVOLVIDO') throw new HttpError(400, 'Só pode avaliar após a devolução.');
  if (await prisma.avaliacao.findFirst({ where: { aluguerId: a.id, autorId: req.user.id } })) throw new HttpError(409, 'Já avaliou este aluguer.');
  res.status(201).json(await prisma.avaliacao.create({ data: { ...d, autorId: req.user.id, alvoUserId: a.locatarioId, aluguerId: a.id } }));
}));

export default r;
