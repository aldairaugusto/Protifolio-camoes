# Portfólio — Leonel Ganga Camões (Passo 1)

Next.js 15 + TypeScript + Prisma + PostgreSQL, pronto para a Vercel.

## Correr localmente

1. `npm install`
2. Copia `.env.example` para `.env` e preenche `DATABASE_URL` e `DIRECT_URL`
   (cria uma base de dados grátis no Neon: https://neon.tech).
   Define também `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `AUTH_SECRET` (gera com `openssl rand -base64 32`).
3. `npm run db:push`   → cria as tabelas
4. `npm run db:seed`   → insere o admin e o conteúdo actual do portfólio
5. Copia para a pasta `public/`:
   - `leonel.jpeg`  (a foto de perfil)
   - `cv-leonel-camoes.pdf`  (o CV)
6. `npm run dev` → http://localhost:3000

## Deploy na Vercel

1. Faz push para o GitHub e importa o repositório na Vercel.
2. Em Settings → Environment Variables, adiciona `DATABASE_URL`, `DIRECT_URL` e `AUTH_SECRET`.
3. Corre `db:push` e `db:seed` uma vez a partir do teu PC (com o `.env` apontado para a mesma BD).

## Admin (passo 2)

- Login em `/admin/login`; sessão em cookie `httpOnly` (7 dias).
- `/admin/conta` permite trocar a senha.
- Limite: 5 tentativas falhadas por IP+e-mail a cada 15 min.

## Painel (passo 3)

- `/admin/perfil`: textos, contactos, foto e CV.
- `/admin/experiencia`, `educacao`, `habilidades`, `formacoes`, `idiomas`: adicionar, editar, apagar e reordenar.
- Uploads: Vercel Blob (`BLOB_READ_WRITE_TOKEN`). Em local, sem token, grava em `public/uploads`.
- Na Vercel: Storage → Create → Blob → Connect to Project (cria o token sozinho).

## Próximo passo (opcional)

3. Painéis de edição (CRUD) + upload de foto e CV
