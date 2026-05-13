# Calendly booking on `/tuki`

The support page (`/[locale]/tuki`) loads Calendly’s **inline scheduling widget** when **`NEXT_PUBLIC_CALENDLY_EMBED_URL`** is set.

## Keys and secrets

**There is no API key or client secret** for this embed. Calendly’s public event link is enough. Anything you put in **`NEXT_PUBLIC_*`** is exposed to browsers — never put private tokens there.

## Where to put the URL

| Place | Use when |
|--------|-----------|
| **`.env`** or **`.env.local`** in the **project root** | Local `npm run dev` / `next build` on your machine |
| **Docker Compose** | Add the same variable to the **`.env`** file Compose reads, or export it before `docker compose up`. The `web` service should receive `NEXT_PUBLIC_CALENDLY_EMBED_URL` (you may need to add a line under `web.environment` in `docker-compose.yml` if it is not passed through yet). |
| **Vercel / Railway / etc.** | Project → Environment variables → Production & Preview |

After changing **`NEXT_PUBLIC_*`** values, **rebuild** the Next.js app. In **Docker**, those variables are normally inlined during **`npm run build`** in the image builder stage — setting them only on the running container is **not enough** for statically generated content unless you also pass them as **build arguments** when building the image (see your `Dockerfile` / `docker-compose.yml`).

Recommended for Compose: add a **`build.args`** entry for **`NEXT_PUBLIC_CALENDLY_EMBED_URL`** and matching **`ARG` / `ENV`** lines in the **`Dockerfile`** before **`RUN npm run build`**, then `docker compose build --no-cache web`.

## Where the URL comes from (Calendly UI)

1. Log in at [calendly.com](https://calendly.com).
2. Open **Scheduling** → **Event types** (or your dashboard event list).
3. Choose the event → **Copy link** (public invite link).

   Alternatively: **Add to website** → **Inline embed** → copy the `https://calendly.com/...` URL from the snippet.

4. Set:

   ```bash
   NEXT_PUBLIC_CALENDLY_EMBED_URL="https://calendly.com/your-org/your-event"
   ```

Allowed hosts: **`calendly.com`** only, scheme **`https`**.

## CSP (optional hardening)

If you enable **Content-Security-Policy-Report-Only** in `next.config.mjs`, ensure **`script-src`** includes **`https://assets.calendly.com`** (widget loader). **`frame-src`** / **`connect-src`** should already allow Calendly domains.

## Implementation reference

- Component: `components/tuki/BookingCalendarApplet.tsx`
- URL validation: `lib/site/calendly-url.ts`
