# Deploy Guide — Sekil.id Landing Page

Self-hosted deployment ke **home server** dengan **Cloudflare Tunnel**. Target domain: `sekil.id`.

> **Audiens**: Founder + team member dengan akses SSH ke VM-B
> **Estimasi waktu first deploy**: 45–60 menit (setelah VM-A cloudflared selesai)
> **Estimasi waktu subsequent deploy**: 2–5 menit via GitHub Actions

---

## Topologi

```text
              Internet (https://sekil.id)
                     |
                     | TLS 1.3 (Cloudflare edge terminates)
                     v
            Cloudflare edge (DDoS, WAF, cache, HSTS)
                     |
                     | encrypted tunnel
                     v
      ┌──────────────────────────────────┐
      │ VM-A — cloudflared gateway       │
      │  systemd: cloudflared.service    │
      │  Ingress: sekil.id →             │
      │    http://<VM-B-private-ip>:3000 │
      └──────────────────────────────────┘
                     |
                     | private network (Tailscale / WireGuard / VPC)
                     | http://<VM-B-private-ip>:3000
                     v
      ┌──────────────────────────────────┐
      │ VM-B — docker compose host       │
      │  • migrate  (one-shot prisma)    │
      │  • landingpage :3000             │
      │  • postgres  :5432 (internal)    │
      │  • backup    (daily pg_dump)     │
      └──────────────────────────────────┘

          backup ──(cron @daily)──> ./backups/
```

**Kenapa tidak ada reverse proxy:**

- TLS dihandle Cloudflare edge
- Security headers di-set via `next.config.mjs` (type-safe, code-reviewed)
- Single app per tunnel — tidak perlu reverse proxy router
- Reverse proxy bisa ditambahkan nanti jika butuh multi-app routing di satu VM-B

**Public attack surface**: hanya Cloudflare Tunnel. VM-B tidak perlu port forward. Home IP tidak terekspose.

**Konsumsi resource VM-B** (estimasi landing page biasa):

- RAM: ~512 MB (landingpage 256 + postgres 128 + backup idle)
- CPU: < 0.5 vCPU rata-rata
- Disk: ~500 MB image + 50 MB DB + 100 MB backup rotation

---

## Prerequisites

### VM-A (cloudflared gateway)

> Setup cloudflared di VM-A dibahas di **runbook terpisah** (belum tersedia).
> Hubungi Founder untuk mendapatkan akses credential tunnel.
>
> Yang perlu dilakukan di VM-A:
>
> - Install cloudflared, create tunnel `sekil-landingpage`
> - Ingress config: `hostname: sekil.id, service: http://<VM-B-private-ip>:3000`
> - Firewall: hanya izinkan traffic dari VM-A ke VM-B port 3000
> - Setup private network antar VM (Tailscale paling simple untuk home lab)

### VM-B (app host)

- Linux (Ubuntu 22.04+ / Debian 12+)
- Docker Engine ≥ 24.0 + Docker Compose plugin ≥ 2.20
- User non-root dalam group `docker`
- SSH dari laptop (key-based, tanpa password)
- Akses outbound ke internet (untuk pull image, Resend API)
- Private network interface yang bisa diakses VM-A

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker --version          # ≥ 24.0
docker compose version    # ≥ 2.20
```

### Layanan Eksternal

- **Cloudflare** — Tunnel + DNS + WAF (gratis)
- **Resend** — email lead notification ke sales (gratis 3000/bulan)
- **Cloudflare Turnstile** — captcha form `/demo` & `/kontak` (gratis)

---

## Setup VM-B

### 1. Setup deploy directory

```bash
sudo mkdir -p /opt/sekil-landingpage
sudo chown $USER:$USER /opt/sekil-landingpage
cd /opt/sekil-landingpage
git clone https://github.com/PT-DART-PRIHADITAMA-STUDIO/sekil.id-landingpage.git .
```

### 2. Setup env

```bash
cd /opt/sekil-landingpage
cp .env.production.example .env.production
chmod 600 .env.production
$EDITOR .env.production
```

Isi semua `CHANGE_ME`. Generate password Postgres yang kuat:

```bash
openssl rand -base64 32 | tr -d '/+=' | head -c 32
# Paste ke POSTGRES_PASSWORD dan kedua DATABASE_URL (harus konsisten)
```

Untuk 2-VM setup, set `BIND_ADDR` ke private IP VM-B:

```bash
# Di .env.production — agar port 3000 reachable dari VM-A via private network
BIND_ADDR=10.0.0.5   # ganti dengan actual private IP VM-B
```

Verifikasi tidak ada placeholder:

```bash
grep -c CHANGE_ME .env.production
# Expected: 0
```

---

## First Deploy

```bash
cd /opt/sekil-landingpage

# Build image lokal (~3-5 menit pertama kali)
docker compose -f docker-compose.production.yml --env-file .env.production build

# Bring up stack (migrate akan apply schema ke postgres)
docker compose -f docker-compose.production.yml --env-file .env.production up -d

# Tunggu 30 detik, cek status
docker compose -f docker-compose.production.yml ps
# Expected: landingpage (healthy), postgres (healthy), backup running
# migrate: exited (0) — normal, one-shot

# Smoke test local
curl -s http://localhost:3000/api/health
# Expected: {"status":"ok"}

# Smoke test via Cloudflare (setelah VM-A setup selesai)
curl -sI https://sekil.id
# Expected: HTTP/2 200, Strict-Transport-Security dari Cloudflare
```

Kalau ada service `unhealthy` atau `restarting`:

```bash
docker compose -f docker-compose.production.yml logs --tail=50 <service-name>
```

---

## Subsequent Deploys

### Cara A — GitHub Actions (otomatis, recommended)

Setiap push ke `main` trigger workflow yang build image → push GHCR → SSH deploy ke VM-B.

GitHub Secrets yang perlu di-set oleh Founder:

- `SSH_HOST` — IP atau hostname VM-B
- `SSH_USER` — username SSH ke VM-B
- `SSH_KEY` — private key untuk SSH

GitHub Variables (public, non-secret):

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, dll

Detail workflow: `.github/workflows/deploy-production.yml` (Tahap 5 plan).

### Cara B — Manual SSH

```bash
ssh user@vm-b
cd /opt/sekil-landingpage
git pull origin main
docker compose -f docker-compose.production.yml --env-file .env.production build landingpage
docker compose -f docker-compose.production.yml --env-file .env.production up -d landingpage
```

---

## Rollback

```bash
ssh user@vm-b
cd /opt/sekil-landingpage

git log --oneline -5
git checkout <PREV_SHA>

docker compose -f docker-compose.production.yml --env-file .env.production build landingpage
docker compose -f docker-compose.production.yml --env-file .env.production up -d landingpage

curl -sf https://sekil.id/api/health
```

---

## Backup & Restore

### Backup otomatis

Container `backup` jalankan `pg_dump -Fc -Z6` setiap hari jam 02:00 Asia/Jakarta. Retention: 7 daily, 4 weekly, 3 monthly.

```bash
ls -lh /opt/sekil-landingpage/backups/daily/
# Expected: sekil_landing-YYYYMMDD.sql.gz
```

### Manual backup

```bash
cd /opt/sekil-landingpage
docker compose -f docker-compose.production.yml --env-file .env.production exec postgres \
  pg_dump -U sekil_landing -Fc sekil_landing > "backups/manual-$(date +%Y%m%d-%H%M%S).dump"
```

### Restore

```bash
docker compose -f docker-compose.production.yml --env-file .env.production stop landingpage

docker compose -f docker-compose.production.yml --env-file .env.production exec -T postgres \
  pg_restore -U sekil_landing -d sekil_landing --clean --if-exists \
  < backups/daily/sekil_landing-YYYYMMDD.sql.gz

docker compose -f docker-compose.production.yml --env-file .env.production up -d landingpage
curl -sf https://sekil.id/api/health
```

> **Critical follow-up**: sync `./backups/` ke off-site storage (Backblaze B2) setelah launch. Lead data = potential customer. Home server lost = backup lost.

---

## Monitoring & Logs

```bash
# Live log
docker compose -f docker-compose.production.yml logs -f --tail=100 landingpage

# Resource usage
docker stats --no-stream

# Health check
curl -s http://localhost:3000/api/health

# Prune unused images (volumes aman, tidak terhapus)
docker system prune -af
```

---

## Troubleshooting

### Container landingpage restart-loop

```bash
docker compose -f docker-compose.production.yml logs --tail=100 landingpage
```

Kemungkinan: `DATABASE_URL` salah, postgres belum healthy, `BIND_ADDR` salah.

### Migration gagal (migrate container exit non-zero)

```bash
docker compose -f docker-compose.production.yml logs migrate
```

Pastikan `DATABASE_URL` gunakan hostname `postgres` (service name compose), bukan `localhost`.

### Port 3000 tidak reachable dari VM-A

```bash
# Di VM-B — cek binding
ss -tlnp | grep 3000
# Harus: <VM-B-private-ip>:3000 (bukan 127.0.0.1:3000)

grep BIND_ADDR .env.production
```

### Memory OOM kill

```bash
docker stats --no-stream
# Naikkan limit landingpage di compose dari 512M ke 768M
```

---

## Pre-launch Checklist

### Infrastructure

- [ ] VM-B: Docker installed, user dalam group docker
- [ ] VM-A: cloudflared berjalan (runbook terpisah)
- [ ] Private network VM-A ↔ VM-B OK; VM-B port 3000 reachable dari VM-A
- [ ] Firewall VM-B: port 3000 HANYA dari VM-A IP
- [ ] DNS `sekil.id` + `www.sekil.id` route ke tunnel di Cloudflare dashboard

### Cloudflare Dashboard

- [ ] SSL/TLS: **Full (strict)**
- [ ] Always Use HTTPS: **ON**
- [ ] HSTS: ON, max-age 31536000
- [ ] Bot Fight Mode: ON
- [ ] WAF Managed Ruleset: ON

### Secrets `.env.production`

- [ ] `chmod 600 .env.production`
- [ ] `POSTGRES_PASSWORD` kuat + match di `DATABASE_URL` (dua tempat)
- [ ] `BIND_ADDR` = private IP VM-B
- [ ] `RESEND_API_KEY` valid
- [ ] `TURNSTILE_*` production keys
- [ ] `grep -c CHANGE_ME .env.production` returns 0

### Smoke Tests

- [ ] `curl -s http://localhost:3000/api/health` → `{"status":"ok"}`
- [ ] `curl -sI https://sekil.id` → HTTP/2 200 dengan TLS
- [ ] Browser: homepage, `/solusi`, `/produk`, `/harga`, `/demo` load OK
- [ ] Form `/demo` submit → lead masuk DB, email ke sales inbox
- [ ] Turnstile captcha tampil di form
- [ ] CTA "Masuk" link ke `https://app.sekil.id`
- [ ] `robots.txt` + `sitemap.xml` accessible

### Backup

- [ ] Tunggu 24 jam, verify `backups/daily/` ada file
- [ ] Test restore di throwaway DB
- [ ] (Follow-up) Off-site sync ke Backblaze B2

### Operations

- [ ] UptimeRobot ping `https://sekil.id/api/health`
- [ ] Copy `.env.production` ke password manager
- [ ] Tim tahu cara baca logs, rollback, restore

---

## Estimasi Biaya

| Item | Biaya/bulan |
| --- | --- |
| Home server listrik (~15W, 24/7) | ~Rp 30k |
| Cloudflare (Tunnel + DNS + WAF) | Gratis |
| Resend (sampai 3000 email/bulan) | Gratis |
| Cloudflare Turnstile | Gratis |
| Domain `sekil.id` (pro-rata) | ~Rp 15k |
| **Total** | **~Rp 45k/bulan** |

---

## Referensi

- `docs/plans/v1-deployment.md` — planning artifact 7 fase
- `docker-compose.production.yml` — compose config
- `.env.production.example` — template secrets
- `Dockerfile` — multi-stage build
- `prisma/migrations/` — schema history
