import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL || '';
const needsFlag = url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true');
const datasourceUrl = needsFlag ? `${url}${url.includes('?') ? '&' : '?'}pgbouncer=true&connection_limit=1` : undefined;

export const prisma = new PrismaClient(datasourceUrl ? { datasourceUrl } : undefined);
