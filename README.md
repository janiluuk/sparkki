# Verso

Next.js site for Verso — refurbishment, DIY guides, orders, and admin tools.

## Local development

### Database with Docker

Postgres and **automatic Prisma migrations** are part of the default Compose stack:

```bash
docker compose up -d
```

This starts `db`, waits until it is healthy, then runs the one-shot **`migrate`** service (`prisma migrate deploy`). Copy `.env.example` to `.env` / `.env.local` and keep `DATABASE_URL` aligned with `POSTGRES_*` (defaults match `docker-compose.yml`).

Run the app on the host:

```bash
npm install
npx prisma generate
npm run dev
```

Seed admin + guides (optional):

```bash
npx prisma db seed
```

### App in Docker (production-like)

Build and run the Next.js standalone image after migrations:

```bash
docker compose --profile app up -d --build
```

The `web` service waits for **`migrate`** to finish successfully, then starts (the image entrypoint also runs `prisma migrate deploy` for safety).

### Environment variables

See [`.env.example`](./.env.example) for `DATABASE_URL`, auth, Stripe, email, and public URLs.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
