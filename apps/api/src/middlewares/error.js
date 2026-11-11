import { ZodError } from 'zod';
import multer from 'multer';

export const notFound = (_req, res) => res.status(404).json({ error: 'Rota não encontrada.' });

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Ficheiro demasiado grande (imagens: máx. 1MB).' });
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'P2002') return res.status(409).json({ error: 'Já existe um registo com estes dados.' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Registo não encontrado.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Erro interno do servidor.' : err.message });
};
