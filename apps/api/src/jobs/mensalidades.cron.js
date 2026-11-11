import cron from 'node-cron';
import { prisma } from '../lib/prisma.js';
import { sendWhatsApp } from '../services/whatsapp.js';
import { addDays, fmtDate, startOfDay } from '../lib/utils.js';

async function notificar(produto, tipo, texto) {
  const dataAlvo = startOfDay(produto.mensalidadeExpiraEm);
  const where = { produtoId_tipo_dataAlvo: { produtoId: produto.id, tipo, dataAlvo } };
  if (await prisma.notificacaoLog.findUnique({ where })) return; // idempotência
  try {
    await sendWhatsApp(produto.vendedor.telefone, texto);
    await prisma.notificacaoLog.create({ data: { produtoId: produto.id, tipo, dataAlvo } });
  } catch (e) {
    console.error(`[cron] falha ao notificar ${produto.id}:`, e.message);
  }
}

export async function runMensalidades() {
  const now = new Date();
  const include = { vendedor: { select: { nomeCompleto: true, telefone: true } } };

  // 1) Expirados: desativa e envia aviso final
  const expirados = await prisma.produto.findMany({
    where: { estadoMensalidade: 'ATIVO', mensalidadeExpiraEm: { lte: now } }, include,
  });
  for (const p of expirados) {
    await prisma.produto.update({ where: { id: p.id }, data: { estadoMensalidade: 'EXPIRADO' } });
    await notificar(p, 'MENSALIDADE_EXPIRADA',
      `Aviso: A mensalidade do produto '${p.titulo}' expirou hoje. O anúncio foi temporariamente desativado. Regularize o pagamento no seu painel para voltar a exibi-lo.`);
  }

  // 2) Faltam exatamente N dias (3 por omissão)
  const cfg = await prisma.configuracao.findUnique({ where: { id: 'singleton' } });
  const dias = cfg?.diasAvisoPrevio ?? 3;
  const alvo = startOfDay(addDays(now, dias));
  const aviso = await prisma.produto.findMany({
    where: { estadoMensalidade: 'ATIVO', mensalidadeExpiraEm: { gte: alvo, lt: addDays(alvo, 1) } }, include,
  });
  for (const p of aviso) {
    await notificar(p, 'MENSALIDADE_3_DIAS',
      `Olá, ${p.vendedor.nomeCompleto}! A mensalidade do seu produto '${p.titulo}' expira em ${dias} dias (${fmtDate(p.mensalidadeExpiraEm)}). Renove para evitar a desativação automática na vitrine do ISPTEC Marketplace.`);
  }

  // 3) Alugueres em atraso
  await prisma.aluguer.updateMany({
    where: { estado: 'EM_CURSO', dataPrevistaDevolucao: { lt: now } }, data: { estado: 'ATRASADO' },
  });
  console.log(`[cron] mensalidades: ${expirados.length} expirados, ${aviso.length} avisos`);
}

export function startCron() {
  cron.schedule('0 8 * * *', () => runMensalidades().catch(console.error), { timezone: 'Africa/Luanda' });
  runMensalidades().catch(console.error); // recupera dias perdidos se o servidor esteve parado
}
