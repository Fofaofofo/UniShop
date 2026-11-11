
# UniShop

Monorepo: `apps/api` (Node + Express + Prisma + PostgreSQL) e `apps/web` (Next.js App Router + Tailwind).

## Arranque local

1. **Base de dados** — crie uma BD PostgreSQL e copie o ambiente:
   ```bash
   cp apps/api/.env.example apps/api/.env        # ajuste DATABASE_URL e JWT_SECRET
   cp apps/web/.env.example apps/web/.env.local
   ```
2. **Instalar e migrar**
   ```bash
   npm install
   cd apps/api
   npx prisma migrate dev --name init
   npm run db:seed          # cursos, blocos/salas, configuração e admin
   ```
3. **Correr** (dois terminais, na raiz): `npm run dev:api` e `npm run dev:web`
4. Abra http://localhost:3000. Admin: matrícula `ADMIN001` / password `Admin@12345` (mude no `.env` antes do seed).

Sem credenciais de WhatsApp/Supabase, o código OTP e os lembretes aparecem **na consola da API** e as imagens ficam em `apps/api/uploads`.

## Fluxo para testar
1. Admin: confirme a taxa e os dados Multicaixa em *Finanças e taxas*.
2. Registe um vendedor (código OTP na consola) → *Cadastrar produto* (imagem < 1MB).
3. Vendedor: *Pagar mensalidade* → anexar comprovativo.
4. Admin: *Validar pagamentos* → Aprovar → o produto aparece na vitrine.
5. Admin: *Produtos e destaques* → Destacar (carrossel da página principal).

## Regras implementadas
- Vitrine/pesquisa: `PUBLICADO + mensalidade ATIVA + expiraEm > agora` (filtro na query, não depende só do cron).
- Cron diário 08:00 (Africa/Luanda): expira produtos, avisa 3 dias antes e no dia do vencimento (idempotente via `NotificacaoLog`), marca alugueres atrasados.
- Aprovação de pagamento: transação atómica; renovação antecipada não perde dias.
- OTP WhatsApp: hash no BD, 5 min de validade, 5 tentativas, 1 reenvio/min.
- Imagem de produto < 1MB validada no browser e no servidor (multer).

## Deploy na Vercel (2 projetos) + Supabase
Projeto **API** — Root Directory `apps/api` (Framework: Other). Variáveis: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `NODE_ENV=production`,
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET=marketplace`, `WHATSAPP_URL_BASE`, `WHATSAPP_INSTANCE`, `WHATSAPP_API_KEY`, `CRON_SECRET`.
O cron diário (07:00 UTC = 08:00 Luanda) está em `apps/api/vercel.json` e chama `/cron/mensalidades`.

Projeto **WEB** — Root Directory `apps/web` (Next.js). Variáveis: `NEXT_PUBLIC_API_URL=/api` e `API_ORIGIN=https://<url-do-projeto-api>.vercel.app`.

Na Vercel não há disco persistente: as imagens usam sempre o Supabase Storage (`SUPABASE_URL` + `SUPABASE_SERVICE_KEY` obrigatórios).
Alterações futuras ao schema: `cd apps/api && npx prisma db push` (a BD inicial foi criada por SQL, sem pasta de migrações).
