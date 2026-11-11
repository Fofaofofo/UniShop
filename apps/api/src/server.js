import 'dotenv/config';
import app from './app.js';
import { startCron } from './jobs/mensalidades.cron.js';

// Execução local / servidores persistentes (Render, Railway). Na Vercel usa-se api/index.js + Vercel Cron.
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API a correr em http://localhost:${port}`);
  startCron();
});
