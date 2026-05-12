# Verso Checker

Small **Tauri 2** desktop app that runs the same pure **`checkCompatibility`** logic as the Verso website (`../../lib/compatibility.ts`). Output is JSON (`input` + `output`) with optional copy-to-clipboard.

## Prerequisites

- **Rust** toolchain (`cargo`, `rustc`)
- **Node 20+**
- **Linux**: WebKitGTK and other [Tauri Linux dependencies](https://v2.tauri.app/start/prerequisites/) (e.g. Debian: `libwebkit2gtk-4.1-dev`, `build-essential`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`)

## Commands

```bash
cd apps/verso-checker
npm install
npm run tauri dev          # desktop window + hot reload
npm run build              # Vite frontend only (into dist/)
npm run tauri build        # native installer / bundle
```

The Vite dev server defaults to port **1420** (see `vite.config.ts`). The Rust crate is **`verso-checker`** (`src-tauri/`).

---

## Laptop spec / AI lookup (LAN) — how it relates to this app

**Important:** Web search (SearXNG) and the optional **local LLM** are implemented in the **Next.js** app (`lib/laptop-specs.ts`, `POST /api/public/laptop-specs`), **not** inside Verso Checker. The checker UI only runs **`checkCompatibility`** offline in the webview.

### Where env vars live

Configure these on the machine that runs **`next dev`**, **`next start`**, or the **`web` Docker service** — *not* in `apps/verso-checker/.env` unless you later add a networked feature.

| Variable | Purpose |
|----------|---------|
| `SPECS_SEARXNG_BASE_URL` | SearXNG base (no trailing slash). Default in code: `https://search.dudeisland.eu`. |
| `SPECS_AI_BASE_URL` | OpenAI-compatible or Ollama base, e.g. `http://192.168.2.101:8080`. **Must be reachable from the Node.js process** (see below). |
| `SPECS_AI_MODEL` | Model id on your server (e.g. `llama3`). |
| `SPECS_AI_KIND` | `openai` \| `ollama` \| `auto` (default `auto`). |
| `SPECS_AI_API_KEY` | Optional `Bearer` for OpenAI-compatible gateways. |
| `SPECS_LOOKUP_ENABLED` | Set to `false` to disable all spec lookups. |

See repo root **`.env.example`** for the full list.

### Reachability from Docker vs host

- **`SPECS_AI_BASE_URL=http://192.168.2.101:8080`** works if the Verso **Node process** can open a TCP route to that host:port.
- If Verso runs in **Docker** and the LLM is on the **LAN**, the container must see `192.168.2.x` (often add **`extra_hosts`** / host gateway, use **host** Docker network for `web`, or run the stack on the same host as the LLM). A container that only sees the bridge network may **not** reach a random LAN IP.
- **SearXNG** at `https://search.dudeisland.eu` needs outbound HTTPS from the same Node process (no special LAN rule unless you block egress).

### Using spec hints today (without changing the checker)

1. **Browser:** open your deployed Verso **`/palvelu`** wizard or **`/tilaus`** — they call `POST /api/public/laptop-specs` / order lookup server-side.
2. **CLI on LAN:** from any host that can reach Verso:

   ```bash
   curl -sS -X POST "http://192.168.2.100:1337/api/public/laptop-specs" \
     -H "Content-Type: application/json" \
     -d '{"make":"Lenovo","model":"ThinkPad T480"}' | jq .
   ```

   Replace host/port with your `APP_PORT` / reverse proxy URL.

### Future: spec panel inside Verso Checker

If you add a “Fetch specs” button that calls your Verso API:

1. Expose Verso over **HTTPS or HTTP on the LAN** (same trust domain as you accept for API keys).
2. **Tauri 2 HTTP allowlist:** extend `src-tauri/capabilities/default.json` with the HTTP plugin scope for your API origin (see [Tauri HTTP client](https://v2.tauri.app/plugin/http-client/) / permissions docs). `core:default` alone does not allow arbitrary `fetch` to custom origins unless the webview CSP and Tauri allowlist permit it.
3. Prefer a **`VITE_VERSO_API_BASE`** (e.g. `http://192.168.2.100:1337`) in `apps/verso-checker/.env` for dev; never bake secrets into the client — the public **`POST /api/public/laptop-specs`** is already rate-limited but not a secret channel.

Until then, treat the checker as the **offline compatibility / JSON** tool and the **site** as the place for **networked spec hints**.
