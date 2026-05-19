# Plan: V2 Sanity CMS Migration

> **Status**: Planning 2026-05-20. Eksekusi mulai Tahap 0.
> **Eksekutor**: Claude Code.
> **Reviewer**: Founder (`dartstudio.team@gmail.com`).

Dokumen ini adalah **planning artifact**. Eksekusi berlangsung tahap demi tahap.
Update status di bawah tiap tahap saat selesai.

---

## Konteks & Tujuan

Setelah migrasi Keystatic → Sanity selesai, masih ada dua masalah besar:

1. **Presentation tool "Unable to connect"** — Studio tidak bisa live-preview halaman
2. **Data hardcoded di kode** — banyak halaman yang isinya masih di TypeScript,
   bukan di Sanity Studio, sehingga Founder tidak bisa mengedit tanpa deploy ulang

Tujuan plan ini:
- Fix Presentation tool supaya editor bisa preview langsung dari Studio
- Pindahkan **semua** data yang perlu diedit oleh non-developer ke Sanity
- Setelah plan ini selesai: tidak ada lagi hardcoded content di halaman marketing

---

## Audit: Apa yang Masih Hardcoded

| Halaman / Komponen | Status | Schema Sanity |
|---|---|---|
| Navigation (header) | Hardcoded di `Header.tsx` | Schema `navigation` ada, belum di-seed |
| Site Settings | - | Schema `siteSettings` ada, belum di-seed |
| `/harga` hero, FAQ, ATC | Hardcoded default, CMS override tersedia | Schema `pricingPage` ada, belum di-seed |
| `/harga` products, tiers, bundles | Hardcoded default, CMS override tersedia | Field ada di `pricingPage`, belum di-seed |
| `/` homepage | **Fully hardcoded** — `PRODUCTS`, `STATS`, `FAQ_ITEMS` | Tidak ada schema |
| `/tentang` | **Fully hardcoded** — `PILLARS`, `TEAM`, `MILESTONES` | Tidak ada schema |
| `/produk` + `/produk/[slug]` | Hardcoded dari `src/data/products.ts` | Tidak ada schema |
| `/solusi` + `/solusi/[segment]` | Hardcoded dari `src/data/solutions.ts` | Tidak ada schema |
| Blog posts | ✅ Ada di Sanity | Schema `post` + `author` |
| Panduan | ✅ Ada di Sanity | Schema `panduan` |
| Kepribadian / Karier / Jurusan | ✅ Ada di Sanity | Schema programatik |

---

## Tahap 0 — Fix Presentation "Unable to connect" ⏳ NEXT

**Issue title**: `fix(cms): Sanity Presentation tool unable to connect`

### Root Cause

`sanity.config.ts` menggunakan:
```ts
origin: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
```

`NEXT_PUBLIC_SITE_URL` adalah variable yang di-bake saat **build time** (bukan runtime).
Kalau variable ini tidak di-set di Vercel saat deploy, Studio yang ter-build
punya `origin: 'http://localhost:3000'` — Presentation coba load preview dari
localhost, otomatis gagal di production.

### Fix (Founder action — tidak ada kode yang perlu diubah)

**Step 1 — Tambah env var di Vercel:**

Di Vercel Dashboard → Project → Settings → Environment Variables, tambah:

| Variable | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://sekil.id` | Production |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Preview + Development |
| `SANITY_API_READ_TOKEN` | `sk...` (dari Sanity Manage) | All |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `2p33r6a9` | All |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | All |
| `SANITY_REVALIDATE_SECRET` | (random string) | Production |

**Step 2 — Tambah CORS di Sanity Dashboard:**

Di [Sanity Manage](https://manage.sanity.io) → Project `2p33r6a9` → API → CORS Origins, tambah:

- `https://sekil.id` ✅ Allow credentials
- `https://sekil-id-landingpage.vercel.app` ✅ Allow credentials
- `http://localhost:3000` ✅ Allow credentials

**Step 3 — Redeploy:**

Push commit kosong atau trigger Vercel redeploy manual agar env vars baru ter-bake.

**Step 4 — Verify:**

1. Buka `/cms` di production
2. Klik Presentation
3. Navigasi ke `/harga` di preview panel
4. Harus muncul halaman dengan overlay "Edit" yang bisa diklik

**Acceptance:**
- Presentation tool load halaman preview (bukan error "Unable to connect")
- Clicking an editable field di preview membuka field yang sesuai di Studio

---

## Tahap 1 — Seed Data Singleton ke Sanity ⏳ SETELAH TAHAP 0

**Issue title**: `feat(cms): seed navigation, siteSettings, pricingPage to Sanity`

**Scope:**
- Update `scripts/migrate-to-sanity.mjs` — tambah fungsi:
  - `seedNavigation()` — seed header nav links dari `Header.tsx`
  - `seedSiteSettings()` — seed site name, description
  - `seedPricingPage()` — seed semua data default harga (products, tiers, bundles, FAQ, dll)
- Setelah seeding, Studio punya data contoh untuk semua singleton yang sudah ada

**Kenapa ini penting:**
Saat ini semua schema sudah ada di Sanity tapi kosong — editor yang buka Studio
tidak tahu cara menggunakannya karena tidak ada contoh data. Seeding membuat
Studio langsung usable untuk editing.

**File changes:**
- `scripts/migrate-to-sanity.mjs` — tambah 3 fungsi seed + panggil di `main()`

**Acceptance:**
- `node scripts/migrate-to-sanity.mjs` jalan tanpa error
- Di Studio `/cms`, singleton `Navigation`, `Site Settings`, `Pricing Page (/harga)`
  semuanya sudah berisi data yang match dengan yang tampil di halaman

---

## Tahap 2 — Homepage CMS

**Issue title**: `feat(cms): homepage content schema + Sanity integration`

**Scope:**

### Schema baru: `homePage` (singleton)

File: `sanity/schemas/documents/homePage.ts`

Fields:
```
group: hero
  - heroHeading: string (required)
  - heroSubheading: text
  - heroCTAPrimary: { label, href }
  - heroCTASecondary: { label, href }

group: products
  - productsHeading: string
  - products[]: { tag, title, body, meta[], variant, href }

group: stats
  - stats[]: { label, value, unit, featured? }

group: faq
  - faqHeading: string
  - faq[]: { q, a }

group: cta
  - ctaHeading: string
  - ctaSubheading: text
  - ctaCTAPrimary: { label, href }
```

### Page changes

`src/app/page.tsx`:
- Tambah `sanityFetch` call untuk `HOME_PAGE_QUERY`
- Fallback ke konstanta kode kalau Sanity kosong
- Tambah `stegaEncoded` attributes untuk Presentation overlays

**Acceptance:**
- Data homepage bisa diedit dari Studio → tampil di halaman tanpa deploy
- Presentation tool bisa highlight section yang sedang diedit

---

## Tahap 3 — Products CMS

**Issue title**: `feat(cms): product document type + /produk pages from Sanity`

**Scope:**

### Schema baru: `product` (document, multiple)

File: `sanity/schemas/documents/product.ts`

Fields:
```
- slug: slug (required, unique)
- name: string (required)
- nameDisplay: string
- tagline: string
- description: text
- longDescription: text
- duration: string
- price: number
- targetPersonas: array of string (checkbox options)
- instruments: array of string
- outputs: array of string
- sampleReportTeaser: text
- bundleSuggestions: array of string
- faq[]: { q, a }
- seo: { seoTitle, seoDescription, primaryKeyword }
```

### Page changes

- `src/app/produk/page.tsx` — fetch all products from Sanity
- `src/app/produk/[slug]/page.tsx` — fetch by slug from Sanity
- `src/lib/sanity/queries.ts` — tambah `ALL_PRODUCTS_QUERY`, `PRODUCT_BY_SLUG_QUERY`
- `src/data/products.ts` tetap ada sebagai fallback default

### Seed

Script `migrate-to-sanity.mjs` tambah `seedProducts()` — import semua 5 produk
dari `src/data/products.ts`.

**Acceptance:**
- Semua 5 produk muncul di Studio → dapat diedit
- `/produk/psyai` load data dari Sanity (verify via Network tab)
- Nambah produk baru dari Studio → langsung muncul di `/produk`

---

## Tahap 4 — Solutions CMS

**Issue title**: `feat(cms): solution segments schema + /solusi pages from Sanity`

**Scope:**

### Schema baru: `solutionSegment` (document, multiple)

File: `sanity/schemas/documents/solutionSegment.ts`

Fields:
```
- slug: slug (required)
- name: string
- eyebrow: string
- headline: string
- subheadline: text
- heroAccent: string (dropdown: peach/blue/navy/ink)
- problems[]: string
- useCases[]: { title, description }
- recommendedProducts[]: string
- stats[]: { value, label }
- testimonial?: { quote, author, role, institution }
- faq[]: { q, a }
- seo: { seoTitle, seoDescription }
- showATCDashboard: boolean
```

### Schema update: `pricingPage` (atau baru `bundlesConfig`)

Bundle definitions pindah ke solution segments atau tetap di `pricingPage`.
Decision: tetap di `pricingPage` karena bundles muncul di halaman harga.

### Page changes

- `src/app/solusi/page.tsx` — fetch all segments from Sanity
- `src/app/solusi/[segment]/page.tsx` — fetch by slug from Sanity
- `src/lib/sanity/queries.ts` — tambah `ALL_SEGMENTS_QUERY`, `SEGMENT_BY_SLUG_QUERY`

### Seed

`migrate-to-sanity.mjs` tambah `seedSolutionSegments()` — import 4 segments.

**Acceptance:**
- 4 segmen muncul di Studio → dapat diedit
- `/solusi/untuk-sekolah` load data dari Sanity
- Ubah headline segment dari Studio → tampil di halaman

---

## Tahap 5 — About Page CMS

**Issue title**: `feat(cms): about page schema + Sanity integration`

**Scope:**

### Schema baru: `aboutPage` (singleton)

File: `sanity/schemas/documents/aboutPage.ts`

Fields:
```
group: pillars
  - pillars[]: { label, partner, description, accentColor }

group: team
  - teamHeading: string
  - team[]: { name, role, bio, photoUrl? }

group: milestones
  - milestonesHeading: string
  - milestones[]: { year, event }

group: meta
  - seo: { seoTitle, seoDescription }
```

### Page changes

`src/app/tentang/page.tsx`:
- Tambah `sanityFetch` call untuk `ABOUT_PAGE_QUERY`
- Fallback ke konstanta kode

### Seed

`migrate-to-sanity.mjs` tambah `seedAboutPage()`.

**Acceptance:**
- Data tentang bisa diedit dari Studio → tampil di halaman
- Team members bisa ditambah/diubah tanpa deploy

---

## Tahap 6 — Connect Header Navigation ke Sanity

**Issue title**: `feat(cms): header navigation editable from Sanity`

**Scope:**

`src/components/layout/Header.tsx` saat ini client component dengan hardcoded `NAV_LINKS`.
Perlu diubah ke server component (atau split: server wrapper + client toggle).

### Approach

```
src/components/layout/
  Header.tsx           ← Keep as 'use client' (perlu useState untuk mobile menu)
  HeaderServer.tsx     ← New: server component, fetches nav from Sanity, renders Header
```

`HeaderServer.tsx`:
- `sanityFetch` query untuk `navigation` singleton
- Pass `navItems`, `ctaLabel`, `ctaHref` sebagai props ke `Header.tsx`
- `src/components/layout/SiteChrome.tsx` (atau `layout.tsx`) pakai `HeaderServer`

### Fallback

Kalau Sanity kosong, fallback ke `NAV_LINKS` konstanta.

**Acceptance:**
- Mengubah label nav item di Studio → langsung reflect di halaman (ISR revalidate)
- Presenter tool bisa highlight nav area

---

## Tahap 7 — Setup ISR Webhook + Sanity → Vercel Pipeline

**Issue title**: `docs(cms): setup Sanity webhook for ISR revalidation`

**Scope (Founder action, tidak ada kode baru):**

Webhook sudah ada di kode (`/api/revalidate`). Yang perlu di-setup:

**Di Sanity Manage → Project → API → Webhooks:**

```
Name: ISR Revalidation
URL: https://sekil.id/api/revalidate
Trigger on: Create, Update, Delete
Filter: (kosongkan = all documents)
Projection: { _type, slug }
HTTP method: POST
Secret: [isi dengan nilai SANITY_REVALIDATE_SECRET dari Vercel]
```

**Acceptance:**
- Edit post dari Studio → halaman blog revalidate dalam <30 detik
- Edit pricing dari Studio → `/harga` revalidate dalam <30 detik

---

## Urutan Eksekusi yang Disarankan

```
Tahap 0  (Founder: env vars + CORS)     ← HARI INI — blocking semua Studio work
Tahap 1  (Code: seed script)            ← Bisa paralel dengan Tahap 0
Tahap 2  (Code: homepage)               ← Setelah Tahap 1 selesai
Tahap 3  (Code: products)               ← Bisa paralel dengan Tahap 2
Tahap 4  (Code: solutions)              ← Bisa paralel dengan Tahap 2
Tahap 5  (Code: about)                  ← Setelah Tahap 2 pattern jelas
Tahap 6  (Code: header nav)             ← Last — paling kompleks (client split)
Tahap 7  (Founder: webhook setup)       ← Setelah Tahap 0 selesai
```

---

## Referensi

- `docs/plans/v1-deployment.md` — deployment plan (terpisah dari plan ini)
- `sanity/schemas/` — semua schema yang sudah ada
- `src/data/` — semua konstanta yang akan di-migrate
- `scripts/migrate-to-sanity.mjs` — seed script (akan di-update di Tahap 1)
- `CLAUDE.md` — coding rules
