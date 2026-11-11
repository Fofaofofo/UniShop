import { prisma } from '../lib/prisma.js';
import { HttpError, addDays, startOfDay } from '../lib/utils.js';

// Aprova um pagamento e renova a mensalidade do produto (transação atómica)
export async function aprovarPagamento(pagamentoId, adminId) {
  return prisma.$transaction(async (tx) => {
    const pg = await tx.pagamento.findUnique({ where: { id: pagamentoId }, include: { produto: true } });
    if (!pg) throw new HttpError(404, 'Pagamento não encontrado.');
    if (pg.estado !== 'PENDENTE') throw new HttpError(409, 'Este pagamento já foi processado.');
    const cfg = await tx.configuracao.findUnique({ where: { id: 'singleton' } });
    const dias = cfg?.duracaoDias ?? 30;

    // Renovação antecipada não perde dias
    const now = new Date();
    const atual = pg.produto.mensalidadeExpiraEm;
    const base = atual && atual > now ? atual : now;
    const expira = startOfDay(addDays(base, dias));

    await tx.pagamento.update({
      where: { id: pg.id },
      data: { estado: 'APROVADO', validadoPorId: adminId, validadoEm: now },
    });
    return tx.produto.update({
      where: { id: pg.produtoId },
      data: {
        estadoMensalidade: 'ATIVO',
        mensalidadeExpiraEm: expira,
        estadoAnuncio: pg.produto.estadoAnuncio === 'PENDENTE' ? 'PUBLICADO' : pg.produto.estadoAnuncio,
      },
    });
  });
}
