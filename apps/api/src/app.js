import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './services/storage.js';
import { errorHandler, notFound } from './middlewares/error.js';
import { runMensalidades } from './jobs/mensalidades.cron.js';
import auth from './routes/auth.js';
import publico from './routes/public.js';
import cliente from './routes/cliente.js';
import vendedor from './routes/vendedor.js';
import admin from './routes/admin.js';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não definido.');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (process.env.WEB_URL || 'http://localhost:3000').split(','), credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use('/uploads', express.static(UPLOAD_DIR));

// Vercel Cron chama este endpoint (Authorization: Bearer CRON_SECRET)
app.get('/cron/mensalidades', async (req, res, next) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Não autorizado.' });
  try { await runMensalidades(); res.json({ ok: true }); } catch (e) { next(e); }
});

app.get('/health', (_q, res) => res.json({ ok: true }));
app.use('/auth', auth);
app.use('/public', publico);
app.use('/cliente', cliente);
app.use('/vendedor', vendedor);
app.use('/admin', admin);
app.use(notFound);
app.use(errorHandler);

export default app;
