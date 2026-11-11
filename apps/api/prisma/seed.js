import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cursos = ['Engenharia Informática', 'Engenharia Civil', 'Engenharia Eletrotécnica', 'Gestão de Empresas', 'Arquitetura'];
  for (const nome of cursos) await prisma.curso.upsert({ where: { nome }, create: { nome }, update: {} });

  const estrutura = { 'Bloco A': ['Sala 1', 'Sala 2', 'Sala 12', 'Laboratório'], 'Bloco B': ['Sala 3', 'Sala 4', 'Biblioteca'], 'Espaços comuns': ['Esplanada', 'Cantina'] };
  for (const [bn, salas] of Object.entries(estrutura)) {
    const bloco = await prisma.bloco.upsert({ where: { nome: bn }, create: { nome: bn }, update: {} });
    for (const nome of salas) {
      await prisma.sala.upsert({ where: { blocoId_nome: { blocoId: bloco.id, nome } }, create: { nome, blocoId: bloco.id }, update: {} });
    }
  }

  await prisma.configuracao.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', valorMensalidade: 1000, duracaoDias: 30, entidade: '00000', referenciaBase: '000 000 000', numeroExpress: '244900000000', diasAvisoPrevio: 3 },
    update: {},
  });

  const curso = await prisma.curso.findFirst();
  const sala = await prisma.sala.findFirst({ include: { bloco: true } });
  const matricula = (process.env.ADMIN_MATRICULA || 'ADMIN001').toUpperCase();
  await prisma.user.upsert({
    where: { matricula },
    create: {
      nomeCompleto: 'Administrador UniShop', matricula, telefone: process.env.ADMIN_TELEFONE || '244900000000',
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10),
      role: 'ADMIN', telefoneVerificado: true, anoAcademico: 1,
      cursoId: curso.id, blocoId: sala.blocoId, salaId: sala.id,
    },
    update: {},
  });
  console.log(`Seed concluído. Admin: ${matricula}`);
}

main().finally(() => prisma.$disconnect());
