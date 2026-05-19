# Plan: V1 Self-Hosted Deployment

> **Status**: Planning approved 2026-05-19 oleh Founder. Eksekusi mulai Tahap 0.
> **Eksekutor**: Sonnet (Claude Code).
> **Reviewer**: Founder (`dartstudio.team@gmail.com`).

Dokumen ini adalah **planning artifact**. Eksekusi berlangsung tahap demi tahap, tiap tahap = 1 GitHub Issue + 1 PR. Update status di bawah tiap tahap saat selesai.

---

## Konteks & Tujuan

Sekil.id landing page perlu di-deploy ke production self-hosted (home server) dengan stack yang:

1. **Reproducible** — team member bisa spin up environment yang sama tanpa friction
2. **Aman** — public attack surface hanya Cloudflare Tunnel, no port forward home router
3. **Operable** — backup otomatis, rollback jelas, logs accessible, healthcheck monitorable
4. **Forward-compatible** — bisa ditambah Caddy / multi-app routing nanti kalau emang butuh

## Keputusan Arsitektur (Locked-In)

| Topik | Keputusan | Rationale |
|---|---|---|
| Containerization | Docker Compose | Reproducibility, isolation, easy backup via volume |
| Reverse proxy (Caddy) | **❌ Skip** | Cloudflare edge sudah handle TLS/WAF/cache; security headers via `next.config.mjs`. Tambah nanti kalau perlu multi-app routing. |
| Topologi | **2-VM split** (VM-A cloudflared, VM-B app) | Separation of concerns: compromise di app container tidak langsung dapat akses cloudflared credentials |
| Cloudflared deployment | **Sesi terpisah** (tidak di scope plan ini) | Founder akan handle di sesi khusus — plan ini fokus app stack only |
| CI/CD | GitHub Actions → GHCR → SSH pull ke VM-B | Build di CI, server tidak perlu build (hemat resource & lebih cepat deploy) |
| Database | Postgres 16 (alpine) di compose stack | Form lead capture butuh persistence; volume-backed |
| Backup | `prodrigestivill/postgres-backup-local` (daily) + off-site sync ke Backblaze B2 | Lead data = high business value, butuh off-site sejak Day 1 |

### Arsitektur Target

```
              Internet (https://sekil.id)
                     |
                     v
            Cloudflare edge (TLS, WAF, cache)
                     |
                     | encrypted tunnel
                     v
      ┌──────────────────────────────────┐
      │ VM-A — cloudflared gateway       │  ← OUT OF SCOPE (sesi terpisah)
      │  systemd unit                    │
      │  ingress: <VM-B-private-ip>:3000 │
      └──────────────────────────────────┘
                     |
                     | private network (Tailscale / WireGuard / VPC)
                     v
      ┌──────────────────────────────────┐
      │ VM-B — docker compose host       │  ← SCOPE PLAN INI
      │  • landingpage:3000 (Next.js)    │
      │  • postgres:5432 (volume)        │
      │  • migrate (one-shot Prisma)     │
      │  • backup (daily pg_dump)        │
      └──────────────────────────────────┘
```

**Critical constraint untuk compose**: port binding landing page **TIDAK** boleh `0.0.0.0:3000:3000` (terexpose publik). Default ke `127.0.0.1:3000:3000`, override ke private-network-IP via env saat di-deploy ke VM-B.

---

## Tahapan Eksekusi

Tiap tahap mengikuti aturan repo:
- ✅ GitHub Issue dulu sebagai planning artifact (sebelum branch dibuat)
- ✅ Branch name: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, atau `docs/<scope>`
- ✅ Commit signed
- ❌ **JANGAN** tambahkan Co-Authored-By line
- ❌ **JANGAN** tambahkan "Generated with Claude Code" atau atribusi AI apapun

### Tahap 0 — Housekeeping ⏳ NEXT

**Issue title**: `chore: cleanup uncommitted state + relocate deploy.md`

**Scope**:
- Commit `package-lock.json` cleanup yang sudah ada (devOptional → dev pada Prisma deps, hapus `@react-spectrum/provider` orphan entry)
- Move `deploy.md` (root) → `docs/deployment.md`
- File ini (`docs/plans/v1-deployment.md`) sudah di-commit bareng PR ini

**Acceptance**:
- `git status` clean setelah merge
- `deploy.md` tidak lagi di root, ada di `docs/deployment.md` (akan di-revise heavy di Tahap 4)

**File changes**:
- `package-lock.json` (modified, already)
- `deploy.md` → `docs/deployment.md` (rename)
- `docs/plans/v1-deployment.md` (new — file ini sendiri)

---

### Tahap 1 — Dockerization

**Issue title**: `feat(deploy): add Dockerfile + Next.js standalone build`

**Scope**:
- `Dockerfile` (multi-stage: deps → builder → runner, base `node:20-alpine`). Pattern: lihat draft di `docs/deployment.md` section "Dockerfile" (di-relokasi dari `deploy.md` di Tahap 0)
- `.dockerignore` — exclude `node_modules`, `.next`, `.env*`, `backups/`, `.git`, `docs/`, dll
- Patch `next.config.mjs`: tambah `output: 'standalone'` di paling atas `nextConfig` object
- Build args: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

**Acceptance**:
- `docker build -t sekil-landingpage:local .` sukses, image < 300MB
- `docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=... sekil-landingpage:local` jalan
- `curl http://localhost:3000` return 200 dengan HTML landing page

**Catatan**: Prisma client harus ter-generate di build stage. Verify pattern `prisma generate` jalan di stage `builder`.

---

### Tahap 2 — Prisma Migration Baseline

**Issue title**: `feat(db): generate Prisma migration baseline from schema`

**Scope**:
- Generate `prisma/migrations/<timestamp>_init/migration.sql` dari `schema.prisma` existing
- Generate via dev DB: `postgresql://sekil_super_admin:dev@localhost:5432/sekil_landing_dev` (PostgreSQL native, **bukan** Docker Compose port 5434)
- Verify `prisma migrate deploy` apply clean ke fresh DB

**Acceptance**:
- Folder `prisma/migrations/<ts>_init/` ter-commit
- `prisma migrate deploy` di throwaway DB sukses tanpa error
- `prisma migrate status` show "Database schema is up to date"

---

### Tahap 3 — Production Compose Stack

**Issue title**: `feat(deploy): production docker-compose stack (no Caddy)`

**Scope**:
- `docker-compose.production.yml` — 4 services:
  - `landingpage` (build dari Dockerfile, env_file `.env.production`, port `${BIND_ADDR:-127.0.0.1}:3000:3000`)
  - `postgres` (postgres:16-alpine, volume `landingpage-pg-data`, tuned config)
  - `migrate` (one-shot, `restart: "no"`, runs `npx prisma migrate deploy` saat compose up, depends on postgres healthy)
  - `backup` (`prodrigestivill/postgres-backup-local:16-alpine`, daily schedule, retention 7d/4w/3m, volume `./backups:/backups`)
- `.env.production.example` (template lengkap, comments per section)
- Update `.gitignore`: `.env.production`, `.env.staging`, `backups/`
- Tambah healthcheck endpoint: `src/app/api/health/route.ts` — simple `{ status: 'ok' }` return 200

**Acceptance**:
- `docker compose -f docker-compose.production.yml --env-file .env.production up -d` di laptop dev bring up all services
- `docker compose ps` show `landingpage (healthy)`, `postgres (healthy)`, `backup` running
- `curl http://localhost:3000/api/health` return `{"status":"ok"}`
- Form `/demo` submit insert row ke table `Lead` (verify via `docker compose exec postgres psql ...`)

**Catatan port binding**:
- Default `BIND_ADDR=127.0.0.1` (aman, hanya localhost reachable)
- Di VM-B production, set `BIND_ADDR=<VM-B-private-ip>` di `.env.production` supaya cloudflared dari VM-A bisa reach via private network

---

### Tahap 4 — Revisi `docs/deployment.md`

**Issue title**: `docs(deployment): rewrite for 2-VM topology + remove Caddy`

**Scope**:
- Hapus semua section Caddy dari `docs/deployment.md` (Caddyfile, troubleshooting Caddy, port 8081, dll)
- Tambah section "Network Topology" yang explain VM-A/VM-B split + private network requirement
- Update Cloudflare Tunnel config example: `service: http://<VM-B-private-ip>:3000` bukan `localhost:8081`
- Tambah pre-flight checklist untuk Founder sebelum deploy pertama (provisioning VM, secrets ready, dll)
- Tambah explicit pointer di section "Cloudflare Tunnel Setup": **link/placeholder ke doc/sesi terpisah** untuk cloudflared di VM-A
- Pastikan doc bisa dibaca cold oleh team member non-Founder tanpa context tambahan

**Acceptance**:
- Word "Caddy" tidak muncul lagi di `docs/deployment.md`
- Section "Cloudflare Tunnel Setup" punya pointer ke sesi terpisah
- Founder review approve doc readable untuk team

---

### Tahap 5 — CI/CD GitHub Actions

**Issue title**: `ci: deploy workflow to GHCR + SSH pull to VM-B`

**Scope**:
- `.github/workflows/deploy-production.yml`:
  - Trigger: push ke `main` (paths filter: ignore `**.md`, `docs/**`) + `workflow_dispatch`
  - Job 1 (build): checkout → setup buildx → login GHCR → build dengan build-args dari `vars.NEXT_PUBLIC_*` → push ke `ghcr.io/pt-dart-prihaditama-studio/sekil-landingpage:sha-<commit>` + `:latest`
  - Job 2 (deploy, depends on build): `appleboy/ssh-action@v1` ke VM-B → `cd /opt/sekil-landingpage && docker compose pull landingpage && docker compose up -d landingpage && docker compose run --rm migrate`
  - Job 3 (smoke test): curl `https://sekil.id/api/health` from runner, fail kalau != 200
- Dokumentasikan **GitHub Secrets yang Founder perlu set**: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `GHCR_TOKEN` (atau pakai `GITHUB_TOKEN` jika package permission cukup)
- Dokumentasikan **GitHub Variables**: semua `NEXT_PUBLIC_*` (public, bisa di Variables, bukan Secrets)

**Acceptance**:
- `workflow_dispatch` manual trigger sukses build + push image ke GHCR
- (Di VM-B yang sudah di-setup nanti) deploy step sukses pull + restart container
- Smoke test step return 200

**Catatan**: Tahap ini bisa di-merge sebelum VM-B di-provision — workflow akan fail di deploy step tapi build & push tetap jalan. Founder bisa test workflow_dispatch dengan deploy step di-skip (via `if: false` toggle) sampai VM-B ready.

---

### Tahap 6 — Off-site Backup

**Issue title**: `feat(ops): off-site backup sync to Backblaze B2 via rclone`

**Scope**:
- Tambah service `rclone-sync` di `docker-compose.production.yml` atau cron script di host
- Sync `./backups/daily/` → B2 bucket setiap hari
- Retention off-site: keep last 30 daily
- `.env.production.example` tambah: `B2_APPLICATION_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET_NAME`
- Dokumentasikan setup B2 account + bucket di `docs/deployment.md`

**Acceptance**:
- Manual trigger sync sukses, file backup muncul di B2 bucket
- Dry-run verify file rotation: pastikan keep policy 30 daily kerja

---

### Tahap 7 — Pre-launch Operasional (Founder action, no PR)

Setelah Tahap 0–6 merged dan VM-A + VM-B ready (cloudflared sesi terpisah selesai):

1. Provision VM-B, install Docker
2. Set GitHub Secrets/Variables
3. First deploy via `workflow_dispatch`
4. Apply pre-launch checklist di `docs/deployment.md`
5. Setup UptimeRobot ping `/api/health`
6. Smoke test end-to-end via browser dari device external
7. Share `https://sekil.id` ke first design partners

---

## Pending Items (Out of Scope)

⏸️ **Cloudflared di VM-A** — sesi terpisah. Founder akan handle dedicated. Saat sesi tersebut dimulai:
- Install cloudflared di VM-A
- Buat tunnel `sekil-landingpage`
- Ingress config: `hostname: sekil.id, service: http://<VM-B-private-ip>:3000`
- Setup private network antar VM (Tailscale paling simple, atau VPC kalau cloud)
- Firewall: VM-B `:3000` hanya accept dari VM-A IP
- DNS routing di Cloudflare dashboard
- Setelah selesai: update section "Cloudflare Tunnel Setup" di `docs/deployment.md` dengan link ke runbook tersebut

⏸️ **Staging environment** — V2 concern. V1 langsung production karena tidak ada user existing.

⏸️ **Multi-region failover** — V3+ concern. Single home-server VM-B cukup untuk V1 traffic (~5000 visits/bulan ekspektasi awal).

---

## Reference

- `docs/deployment.md` — operational runbook (relokasi dari root `deploy.md` di Tahap 0)
- `CLAUDE.md` (root + landing repo) — coding & convention rules
- Pattern referensi Dockerfile: `sekil.id-frontend/Dockerfile` (multi-stage Next.js standalone)
- Pattern referensi CI: `sekil.id-frontend/.github/workflows/` (kalau ada)
