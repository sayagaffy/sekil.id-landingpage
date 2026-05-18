# Deploy Guide — Sekil.id Landing Page

Self-hosted deployment ke **home server** dengan **Cloudflare Tunnel**. Target domain: `sekil.id` (marketing landing); `app.sekil.id` di-handle separate stack di repo `sekil.id-backend`.

> **Audiens**: Founder (akses SSH home server + GitHub admin)
> **Estimasi waktu first deploy**: 60–90 menit
> **Estimasi waktu subsequent deploy**: 2–5 menit (manual pull) atau otomatis (kalau setup CI/CD)
>
> Doc ini berisi **inline file content** — copy-paste ke server sesuai instruksi tiap step. Tidak perlu PR ke repo dulu untuk mulai deploy.

---

## Arsitektur

```
              Internet (https://sekil.id)
                     |
                     | TLS 1.3
                     v
            Cloudflare edge (DDoS, WAF, cache)
                     |
                     | encrypted tunnel
                     v
              cloudflared (home server)
                     |
                     | http://localhost:80
                     v
                   Caddy
                     |
                     | (only handler)
                     v
              landingpage:3000  (Next.js standalone)
                     |
                     +--> postgres:5432  (volume: landingpage-pg-data)
                     +--> Resend API (transactional email)
                     +--> Cloudflare Turnstile (captcha verify)
                     +--> Keystatic / GitHub (content CMS, optional)

          backup --(cron @daily)--> /opt/sekil-landingpage/backups/
```

**Public attack surface**: **hanya** Cloudflare Tunnel. Home router tidak perlu port forward, home IP tidak terekspose, ISP block port 80/443 tidak masalah.

**Konsumsi resource** (perkiraan untuk lalu lintas landing page biasa):
- Total RAM: ~512 MB (landingpage 256 + postgres 128 + caddy 32 + backup idle)
- CPU: < 0.5 vCPU rata-rata
- Disk: ~500 MB image + 50 MB data + 100 MB backup rotation = ~700 MB
- Aman untuk berbagi server dengan Home Assistant, Plex, Pi-hole, dsb

---

## Prerequisites

### Di laptop Anda (sekali)

- Repo `sekil.id-landingpage` ter-clone di laptop
- Akun GitHub dengan akses tulis ke repo (untuk Container Registry / GHCR — opsional, kalau pakai CI/CD)
- Akun Cloudflare gratis dengan domain `sekil.id` ter-add

### Di home server (sekali)

- Linux (Ubuntu 22.04+ / Debian 12+ / NixOS / Arch — semuanya OK)
- Docker Engine ≥ 24.0 + Docker Compose plugin ≥ 2.20
- User non-root dengan akses `docker` group
- SSH dari laptop ke home server jalan (key-based, no password)
- Akses outbound ke internet (untuk pull image, Resend API, Cloudflare Tunnel)

### Akun / Layanan eksternal

- **Cloudflare** — Tunnel + DNS + WAF (gratis)
- **Resend** — kirim email lead notification ke sales (gratis 3000/bulan)
- **Cloudflare Turnstile** — captcha untuk form `/demo` & `/kontak` (gratis)
- **Keystatic Cloud** — admin UI untuk content (opsional; `local` mode juga OK untuk single-author)

---

## File yang Harus Dibuat di Repo

5 file baru + 1 patch. Anda bisa create lokal dulu, test, baru commit ke repo nanti.

### 1. `Dockerfile` (root repo)

Multi-stage build mirroring pattern `sekil.id-frontend/Dockerfile`:

```dockerfile
# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json prisma ./
RUN npm ci --legacy-peer-deps

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (postinstall already did, but re-run to ensure
# the binary matches alpine's musl libc — important for some hosts)
RUN npx prisma generate

# NEXT_PUBLIC_* are inlined at build time. Defaults are placeholders;
# pass real values via --build-arg in docker compose / CI.
ARG NEXT_PUBLIC_SITE_URL=https://sekil.id
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=
ARG NEXT_PUBLIC_SENTRY_DSN=
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=${NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG}

RUN npm run build

# ─── Stage 3: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl tini && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone output bundles only the files needed at runtime
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma needs the generated client + schema at runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# tini handles signal forwarding so SIGTERM from docker stop is honoured
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
```

### 2. Patch `next.config.mjs` — tambah `output: 'standalone'`

`output: 'standalone'` mengubah `next build` dari menghasilkan `.next/` (yang butuh full node_modules) menjadi `.next/standalone/` (self-contained server.js dengan tree-shaken deps). Wajib untuk image Docker yang kecil.

Edit `next.config.mjs`, tambah satu baris ke `nextConfig`:

```js
const nextConfig = {
  output: 'standalone',          // ← TAMBAH BARIS INI di paling atas object
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // ... sisanya tetap
};
```

### 3. `docker-compose.production.yml` (root repo)

```yaml
# docker-compose.production.yml — Sekil.id Landing Page production stack
#
# Single home-server deployment for sekil.id, fronted by Cloudflare Tunnel.
# Cloudflare terminates TLS at the edge; Caddy serves plain HTTP on :80
# (only bound to localhost — only reachable via cloudflared).
#
# Usage on the home server:
#   cp .env.production.example .env.production
#   $EDITOR .env.production          # fill every CHANGE_ME
#   docker login ghcr.io             # if pulling pre-built image from GHCR
#   docker compose -f docker-compose.production.yml --env-file .env.production up -d --build
#
# Services:
#   landingpage  — Next.js standalone server (internal port 3000)
#   postgres     — PostgreSQL 16 for Lead capture form
#   caddy        — HTTP-only reverse proxy with security headers
#   backup       — daily pg_dump with 7-day local retention

x-logging: &default-logging
  driver: json-file
  options:
    max-size: "30m"
    max-file: "3"

services:

  landingpage:
    # Build locally on first deploy. Once you have CI/CD pushing to GHCR,
    # change to: image: ghcr.io/pt-dart-prihaditama-studio/sekil-landingpage:${IMAGE_TAG:-latest}
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        NEXT_PUBLIC_GA_MEASUREMENT_ID: ${NEXT_PUBLIC_GA_MEASUREMENT_ID}
        NEXT_PUBLIC_SENTRY_DSN: ${NEXT_PUBLIC_SENTRY_DSN:-}
        NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: ${NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG:-}
    image: sekil-landingpage:local
    env_file: .env.production
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 128M
    restart: unless-stopped
    networks: [sekil-landing-net]
    logging: *default-logging

  postgres:
    image: postgres:16-alpine
    command:
      - postgres
      - -c
      - max_connections=50
      - -c
      - shared_buffers=128MB
      - -c
      - effective_cache_size=384MB
      - -c
      - work_mem=4MB
      - -c
      - maintenance_work_mem=32MB
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - landingpage-pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          memory: 64M
    restart: unless-stopped
    networks: [sekil-landing-net]
    logging: *default-logging

  caddy:
    image: caddy:2-alpine
    environment:
      SEKIL_LANDINGPAGE_ADDR: landingpage:3000
    volumes:
      - ./deploy/caddy/Caddyfile.production:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
    ports:
      - "127.0.0.1:8081:80"
    depends_on:
      landingpage:
        condition: service_started
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 64M
    restart: unless-stopped
    networks: [sekil-landing-net]
    logging: *default-logging

  backup:
    image: prodrigestivill/postgres-backup-local:16-alpine
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_EXTRA_OPTS: "-Z6 --schema=public --blobs"
      SCHEDULE: "@daily"
      BACKUP_KEEP_DAYS: 7
      BACKUP_KEEP_WEEKS: 4
      BACKUP_KEEP_MONTHS: 3
      HEALTHCHECK_PORT: 8080
      TZ: ${TZ:-Asia/Jakarta}
    volumes:
      - ./backups:/backups
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 128M
    restart: unless-stopped
    networks: [sekil-landing-net]
    logging: *default-logging

networks:
  sekil-landing-net:
    driver: bridge

volumes:
  landingpage-pg-data:
    driver: local
  caddy-data:
    driver: local
  caddy-config:
    driver: local
```

> **Catatan port `8081`**: Kalau home server Anda **juga** menjalankan stack `app.sekil.id` di port `80` (mis. cluster sama dengan backend), pakai `8081` untuk landingpage Caddy. Cloudflare Tunnel config nanti routes per-domain ke port masing-masing. Kalau home server hanya untuk landingpage, ganti ke `127.0.0.1:80:80`.

### 4. `deploy/caddy/Caddyfile.production`

```caddy
# Caddyfile.production — Sekil.id Landing Page reverse proxy
#
# Behind Cloudflare Tunnel. TLS terminates at Cloudflare edge.
# Caddy serves plain HTTP on :80, only reachable via cloudflared.

{
    admin off
    auto_https off
    servers {
        trusted_proxies static 127.0.0.1/32
    }
}

:80 {
    # ─── Security headers ────────────────────────────────────────────────────
    # next.config.mjs already sets these on Next responses, but Caddy adds
    # them to static assets and edge cases (404 from Caddy, redirect, etc.)
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options    "nosniff"
        X-Frame-Options           "SAMEORIGIN"
        Referrer-Policy           "strict-origin-when-cross-origin"
        Permissions-Policy        "camera=(), microphone=(), geolocation=()"
        -Server
    }

    # ─── Reverse proxy to Next.js standalone ─────────────────────────────────
    reverse_proxy {$SEKIL_LANDINGPAGE_ADDR} {
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {>X-Forwarded-For}
        header_up X-Forwarded-Proto {scheme}
    }

    # ─── Access log → stdout → docker log rotation ───────────────────────────
    log {
        output stdout
        format json
        level  INFO
    }
}
```

### 5. `.env.production.example` (root repo)

```bash
# .env.production.example — copy to .env.production on the home server,
# fill in real values. NEVER commit .env.production.
# Recommended file mode on the server: chmod 600 .env.production

# ─── Site ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="https://sekil.id"
NODE_ENV="production"
TZ="Asia/Jakarta"

# ─── Database (Postgres in the same docker-compose) ──────────────────────────
DATABASE_URL="postgresql://sekil_landing:CHANGE_ME_POSTGRES_PASSWORD@postgres:5432/sekil_landing"
DATABASE_URL_UNPOOLED="postgresql://sekil_landing:CHANGE_ME_POSTGRES_PASSWORD@postgres:5432/sekil_landing"

# ─── Postgres (used by the postgres service to bootstrap DB on first run) ────
POSTGRES_USER="sekil_landing"
POSTGRES_PASSWORD="CHANGE_ME_POSTGRES_PASSWORD"
POSTGRES_DB="sekil_landing"

# ─── Resend (transactional email — lead notifications to sales) ──────────────
# Production API key from https://resend.com (Settings → API Keys)
RESEND_API_KEY="CHANGE_ME_RESEND_API_KEY"
RESEND_FROM="no-reply@sekil.id"
SALES_NOTIFICATION_EMAIL="dartstudio.team@gmail.com"
REPLY_TO_EMAIL="dartstudio.team@gmail.com"

# ─── Cloudflare Turnstile (captcha) ──────────────────────────────────────────
# Generate sitekey + secret at https://dash.cloudflare.com → Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY="CHANGE_ME_TURNSTILE_SITE_KEY"
TURNSTILE_SECRET_KEY="CHANGE_ME_TURNSTILE_SECRET"

# ─── Analytics ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-8CE7FZYECZ"

# ─── Sentry (optional error tracking) ────────────────────────────────────────
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""

# ─── Keystatic CMS — GitHub mode (for production multi-author setup) ─────────
# If single-author (just you), leave blank to fall back to local filesystem mode.
# Setup guide: https://keystatic.com/docs/github-app
KEYSTATIC_GITHUB_CLIENT_ID=""
KEYSTATIC_GITHUB_CLIENT_SECRET=""
KEYSTATIC_SECRET=""
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=""

# ─── Anthropic API (programmatic content generation script — server-side) ────
# Only needed if you run `npm run content:generate` on this server.
# For most setups you generate content locally and commit MDX to the repo,
# so this can be left blank in production.
ANTHROPIC_API_KEY=""
```

### 6. `.gitignore` — tambah env + backups

Append ke file existing:

```gitignore
# env (only *.example committed)
.env.production
.env.staging

# backup dumps (runtime artifact)
backups/
```

---

## Generate Prisma Migrations (sekali, di laptop)

Saat ini repo cuma punya `schema.prisma` tanpa migration history. Untuk production deploy, **generate migration file dulu** supaya schema bisa di-apply ke DB production dengan jejak audit yang jelas.

Di laptop Anda:

```bash
cd ~/Project/.../sekil.id-landingpage

# Pastikan dev DB ada
psql -h localhost -U sekil_super_admin -d postgres -c "CREATE DATABASE sekil_landing_dev;" 2>/dev/null || true

# Generate migration baseline dari schema
DATABASE_URL="postgresql://sekil_super_admin:dev@localhost:5432/sekil_landing_dev" \
  DATABASE_URL_UNPOOLED="postgresql://sekil_super_admin:dev@localhost:5432/sekil_landing_dev" \
  npx prisma migrate dev --name init

# Ini akan membuat prisma/migrations/<timestamp>_init/migration.sql
# Commit folder ini ke repo.
```

Migration file ini akan otomatis di-apply oleh container `landingpage` saat startup (lewat command `prisma migrate deploy` — kita perlu tambah di Dockerfile entrypoint nanti, ATAU jalankan manual sekali).

**Quick win untuk first deploy** (kalau Anda mau skip Prisma migration setup proper): jalankan `prisma db push` sekali manual setelah container up. Detail di step "First Deploy" di bawah.

---

## Setup Home Server

### 1. Install Docker (kalau belum)

```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version          # ≥ 24.0
docker compose version    # ≥ 2.20
```

### 2. Setup deploy directory

```bash
sudo mkdir -p /opt/sekil-landingpage
sudo chown $USER:$USER /opt/sekil-landingpage
cd /opt/sekil-landingpage
```

### 3. Transfer file dari laptop ke server

Pilih salah satu:

**Opsi A — git clone (recommended)**:
```bash
# Di server
cd /opt/sekil-landingpage
git clone https://github.com/PT-DART-PRIHADITAMA-STUDIO/sekil.id-landingpage.git .
# Setelah commit file Dockerfile + docker-compose.production.yml + etc. ke repo,
# next deploy cukup: git pull
```

**Opsi B — scp / rsync (kalau belum mau commit ke repo)**:
```bash
# Di laptop
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.env*' \
  ~/Project/.../sekil.id-landingpage/ \
  user@home-server:/opt/sekil-landingpage/
```

### 4. Setup env

```bash
cd /opt/sekil-landingpage
cp .env.production.example .env.production
chmod 600 .env.production
$EDITOR .env.production    # isi semua CHANGE_ME

# Generate strong Postgres password
openssl rand -base64 32 | tr -d '/+=' | head -c 32
# Paste hasilnya ke POSTGRES_PASSWORD + DATABASE_URL (dua tempat, harus sama)
```

Verify no `CHANGE_ME` left:
```bash
grep -c CHANGE_ME .env.production
# Expected: 0
```

---

## Setup Cloudflare Tunnel

Kalau Anda **sudah** punya tunnel buat `app.sekil.id`, tambahkan ingress baru. Kalau belum, setup dari awal.

### Install cloudflared (kalau belum)

```bash
# Di home server
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Login (akan buka URL — paste ke browser di laptop)
cloudflared tunnel login
```

### Buat tunnel + config

```bash
# Buat tunnel
cloudflared tunnel create sekil-landingpage
# Catat TUNNEL_ID dari output

# Edit config existing kalau ada (untuk app.sekil.id), atau buat baru
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml <<'EOF'
tunnel: <TUNNEL_ID_LANDINGPAGE>
credentials-file: /home/USER/.cloudflared/<TUNNEL_ID_LANDINGPAGE>.json

ingress:
  - hostname: sekil.id
    service: http://localhost:8081

  # Kalau di server yang sama dengan app.sekil.id, tambah juga:
  - hostname: app.sekil.id
    service: http://localhost:80

  # Catch-all
  - service: http_status:404
EOF

# Route DNS
cloudflared tunnel route dns sekil-landingpage sekil.id
cloudflared tunnel route dns sekil-landingpage www.sekil.id   # next.config redirect ke apex

# Install sebagai systemd service
sudo cloudflared service install
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared
```

### Konfigurasi di Cloudflare Dashboard

`sekil.id` zone di Cloudflare → ikuti:

- **SSL/TLS** → mode **Full (strict)**
- **SSL/TLS → Edge Certificates** → **Always Use HTTPS**: ON
- **SSL/TLS → Edge Certificates** → **HSTS**: enable dengan max-age 31536000
- **Rules → Page Rules** → tambah `*sekil.id/*` → Cache Level: Cache Everything (landing page static, fine to cache)
- **Security → WAF** → enable Managed Ruleset
- **Security → Bots** → enable Bot Fight Mode

---

## First Deploy

Di home server:

```bash
cd /opt/sekil-landingpage

# Build image lokal (akan butuh ~3-5 menit pertama kali)
docker compose -f docker-compose.production.yml --env-file .env.production build

# Bring up stack
docker compose -f docker-compose.production.yml --env-file .env.production up -d

# Tunggu ~20 detik, cek status semua service
docker compose -f docker-compose.production.yml ps
# Setiap service harus "running" atau "healthy"

# Apply Prisma schema sekali (kalau belum bikin migration baseline)
docker compose -f docker-compose.production.yml --env-file .env.production exec landingpage \
  npx prisma db push
# ATAU kalau sudah ada prisma/migrations/ di repo:
docker compose -f docker-compose.production.yml --env-file .env.production exec landingpage \
  npx prisma migrate deploy

# Smoke test via Cloudflare
curl -sI https://sekil.id
# Expected: HTTP/2 200, Strict-Transport-Security header dari Cloudflare + Caddy

# Smoke test via localhost (skip Cloudflare)
curl -sI http://localhost:8081
# Expected: HTTP/1.1 200, server header tidak ada (kita strip)
```

Kalau ada service yang `unhealthy` atau `restarting`:
```bash
docker compose -f docker-compose.production.yml logs --tail=50 <service-name>
```

---

## Subsequent Deploys

### Cara A — Manual SSH pull (paling simple, no CI/CD)

```bash
ssh user@home-server
cd /opt/sekil-landingpage
git pull origin main
docker compose -f docker-compose.production.yml --env-file .env.production build landingpage
docker compose -f docker-compose.production.yml --env-file .env.production up -d landingpage
# Kalau ada migration baru:
docker compose -f docker-compose.production.yml --env-file .env.production exec landingpage \
  npx prisma migrate deploy
```

### Cara B — GitHub Actions push image ke GHCR (recommended jangka panjang)

Buat `.github/workflows/deploy-production.yml` dengan pattern yang sama seperti repo `sekil.id-frontend` (referensi: file di repo backend `docs/runbooks/production-deployment-runbook.md`). Workflow akan:
1. Build image dengan `NEXT_PUBLIC_*` build-args dari GitHub Variables
2. Push ke `ghcr.io/pt-dart-prihaditama-studio/sekil-landingpage:sha-<commit>`
3. SSH ke home server, `docker compose pull landingpage && up -d`

Detail workflow file di luar scope deploy.md ini — minta saya bikin terpisah kalau perlu.

---

## Rollback

Kalau deploy memecahkan production:

```bash
ssh user@home-server
cd /opt/sekil-landingpage

# Roll repo back ke commit sebelumnya
git log --oneline -5      # cari SHA bagus terakhir
git checkout <PREV_SHA>

# Rebuild + restart
docker compose -f docker-compose.production.yml --env-file .env.production build landingpage
docker compose -f docker-compose.production.yml --env-file .env.production up -d landingpage

curl -sf https://sekil.id
```

Kalau deploy buruk include migration yang break:
```bash
# Roll Prisma migration back
docker compose -f docker-compose.production.yml --env-file .env.production exec landingpage \
  npx prisma migrate resolve --rolled-back <MIGRATION_NAME>
# Atau restore dari backup (lihat section berikut)
```

---

## Backup & Restore

### Backup berjalan otomatis

Container `backup` (`prodrigestivill/postgres-backup-local`) jalankan `pg_dump -Fc -Z6` daily jam 02:00 Asia/Jakarta. Retention:
- Daily: 7
- Weekly: 4
- Monthly: 3

File landed di `/opt/sekil-landingpage/backups/` host.

```bash
# Verify backup berjalan
ls -lh /opt/sekil-landingpage/backups/daily/
# Expected: sekil_landing-YYYYMMDD.sql.gz files
```

### Manual backup sebelum operasi berisiko

```bash
cd /opt/sekil-landingpage
docker compose -f docker-compose.production.yml --env-file .env.production exec postgres \
  pg_dump -U sekil_landing -Fc sekil_landing > "backups/manual-$(date +%Y%m%d-%H%M%S).dump"
```

### Restore

```bash
cd /opt/sekil-landingpage

# Stop landingpage supaya tidak ada koneksi aktif ke DB
docker compose -f docker-compose.production.yml --env-file .env.production stop landingpage

# Restore (replace FILENAME)
docker compose -f docker-compose.production.yml --env-file .env.production exec -T postgres \
  pg_restore -U sekil_landing -d sekil_landing --clean --if-exists \
  < backups/daily/sekil_landing-YYYYMMDD.sql.gz

# Bring landingpage back
docker compose -f docker-compose.production.yml --env-file .env.production up -d landingpage

# Smoke test
curl -sf https://sekil.id
```

> **Critical follow-up sebelum traffic produksi**: sync `/opt/sekil-landingpage/backups/` ke off-site storage (Backblaze B2, R2, atau rsync ke laptop). Home server lost = backup lost. Lead capture data hilang = potential customer hilang.

---

## Monitoring & Logs

### Live tail logs

```bash
docker compose -f docker-compose.production.yml logs -f --tail=100 landingpage
```

### Resource usage

```bash
docker stats --no-stream
# Total memory landingpage stack should be < 600MB total
```

### Disk

```bash
df -h /opt/sekil-landingpage
docker system df
```

Kalau disk penuh:
```bash
# Prune unused images & build cache (volumes aman, tidak terhapus)
docker system prune -af
```

### Cloudflare Tunnel

```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -f
```

### Cek apakah Lead form jalan

```bash
# Insert test lead via API
curl -X POST https://sekil.id/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Deploy",
    "email": "test@deploy.test",
    "whatsapp": "+62812345678",
    "institutionName": "Test",
    "institutionType": "Sekolah",
    "estimatedSeats": "100",
    "interestedProducts": ["PsyAI"]
  }'

# Cek di DB
docker compose -f docker-compose.production.yml --env-file .env.production exec postgres \
  psql -U sekil_landing -d sekil_landing -c "SELECT * FROM \"Lead\" ORDER BY \"createdAt\" DESC LIMIT 5;"
```

---

## Pre-launch Checklist

Tick semua sebelum kasih URL ke user pertama.

### Infrastructure
- [ ] Home server Docker installed, user non-root in docker group
- [ ] Cloudflare Tunnel berjalan sebagai systemd service
- [ ] DNS `sekil.id` + `www.sekil.id` route ke tunnel di Cloudflare dashboard
- [ ] Cloudflare SSL mode = Full (strict), HSTS ON, Always Use HTTPS ON

### Secrets di `.env.production`
- [ ] `chmod 600 .env.production`
- [ ] `POSTGRES_PASSWORD` strong, match `DATABASE_URL` (dua tempat)
- [ ] `RESEND_API_KEY` valid (test kirim email)
- [ ] `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` production keys (bukan staging)
- [ ] `grep -c CHANGE_ME .env.production` returns 0

### Smoke tests
- [ ] `curl -sI https://sekil.id` returns 200 dengan TLS dari Cloudflare
- [ ] Browser `https://sekil.id` load homepage, navigation jalan
- [ ] Halaman `/solusi`, `/produk`, `/blog`, `/harga`, `/demo`, `/kontak` semua load OK
- [ ] Form `/demo` submit berhasil, lead masuk ke DB, email notification masuk ke sales inbox
- [ ] Turnstile captcha tampil di form
- [ ] CTA "Mulai Asesmen" link ke `https://app.sekil.id` (bukan `app.sekil.id` tanpa https)
- [ ] No console errors di browser DevTools
- [ ] Google Analytics tag fired (cek Realtime di GA dashboard)
- [ ] `robots.txt` + `sitemap.xml` accessible
- [ ] `next-sitemap` ran post-build (cek `public/sitemap.xml` ada)

### Backup
- [ ] Folder `/opt/sekil-landingpage/backups/` writable
- [ ] Tunggu 24 jam, verify `backups/daily/sekil_landing-YYYYMMDD.sql.gz` ada
- [ ] Test restore di throwaway DB
- [ ] (Follow-up post-launch) Setup off-site sync ke B2/R2

### Operations
- [ ] Anda tahu cara baca logs (`docker compose logs -f landingpage`)
- [ ] Anda tahu cara rollback (`git checkout <prev>` + rebuild)
- [ ] Anda tahu cara restore dari backup
- [ ] Setup uptime monitoring eksternal (UptimeRobot gratis, Better Stack gratis tier)
- [ ] Anda tahu lokasi `.env.production` dan punya copy aman (password manager)

Setelah semua checklist hijau, share URL `https://sekil.id` ke design partner / first prospects.

---

## Troubleshooting

### `prisma generate` gagal saat build Docker

**Gejala**: `Error: Cannot find module '@prisma/client'`
**Sebab**: `prisma generate` butuh schema ada saat install. Pastikan `COPY prisma ./prisma` jalan SEBELUM `npm ci` di Dockerfile stage `deps`.

### Caddy "no available upstreams"

**Gejala**: `502 Bad Gateway` dari Cloudflare
**Cek**:
```bash
docker compose logs caddy
docker compose logs landingpage
```
Kemungkinan landingpage container belum ready / crash. Lihat log landingpage untuk root cause.

### Cloudflare Tunnel "connection refused"

**Sebab**: Caddy mungkin tidak listen di port yang tunnel config harapkan.
**Cek**:
```bash
ss -tlnp | grep -E '80|8081'
# Should show Caddy bound to 127.0.0.1:80 (atau 8081, sesuai compose)
```

Pastikan `cloudflared` config.yml `service: http://localhost:8081` (atau `:80`) match dengan yang Caddy listen.

### Form submission gagal silently

**Cek**:
1. Browser DevTools → Network tab → lihat response `POST /api/leads`
2. Container logs: `docker compose logs landingpage --tail 100`
3. DB connection: `docker compose exec postgres psql -U sekil_landing -d sekil_landing -c "\dt"`
4. Resend API key: test dengan `curl -X POST https://api.resend.com/emails -H "Authorization: Bearer YOUR_KEY"`

### Memory OOM kill

**Gejala**: container `landingpage` restart-loop, logs nya kepotong
**Cek**: `docker stats` saat traffic naik
**Fix**: naikkan limit di docker-compose dari `512M` ke `768M` atau `1G`. Atau cek apakah ada memory leak di server actions Anda.

---

## Cost Estimate

| Item | Cost/bulan |
|---|---|
| Home server listrik (asumsi server kecil ~15W, 24/7) | ~Rp30k |
| Cloudflare (Tunnel + DNS + WAF) | Gratis |
| Resend (sampai 3000 email/bulan) | Gratis |
| Cloudflare Turnstile | Gratis |
| Domain `sekil.id` (dibagi pro-rata) | ~Rp15k |
| **Total** | **~Rp45k/bulan** |

Naik ke ~Rp70k/bulan kalau hit > 3000 lead emails/bulan (Resend tier paid mulai $20/mo).

---

## What's Next

Setelah landing page production stable:

1. **Monitoring**: setup UptimeRobot ping `/api/health` (kalau Anda mau add health endpoint)
2. **Off-site backup**: rsync `/opt/sekil-landingpage/backups/` ke B2 / R2 / laptop
3. **CI/CD**: setup GitHub Actions deploy workflow (minta saya bikin terpisah)
4. **Keystatic GitHub mode**: kalau ada author non-founder yang mau tulis blog content via UI
5. **A/B testing infra**: Cloudflare Workers atau Vercel-style edge functions kalau mau test hero copy variants
