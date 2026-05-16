# Sekil.id Landing Page — Specification v1.0

**Document version:** 1.0
**Status:** Ready for engineering kickoff
**Repo:** https://github.com/PT-DART-PRIHADITAMA-STUDIO/sekil.id-landingpage
**Domain:** sekil.id (marketing) + app.sekil.id (product portal — separate repo)
**Timeline target:** 4 minggu untuk launch v1.0 (foundation), 8 minggu untuk full programmatic SEO

---

## 0. Strategic Frame (Locked Decisions)

| Keputusan | Pilihan |
|---|---|
| Primary goal | Hybrid: B2B lead-gen utama + B2C secondary funnel |
| Domain architecture | `sekil.id` marketing + `app.sekil.id` portal |
| Audience priority | B2B decision maker + siswa/mahasiswa + profesional korporat |
| Programmatic SEO scale | Modest: 50–100 pages |
| Content production | LLM generated + UNJANI sign-off per template |
| SEO tools budget | Free tier only (GSC, Ubersuggest free, manual) |

**Implication penting**: B2C funnel V1 berhenti di "free preview / contact / waitlist" — TIDAK transactional. Self-serve checkout = defer V1.5 (sesuai locked decision V1 spec product utama).

---

## 1. Audience & Funnel Mapping

### 1.1 Three Primary Personas

**Persona A — B2B Decision Maker (Primary revenue path)**
- Kepala sekolah SMA swasta, kepala HR korporat menengah, rektor PT, founder yayasan
- Pain: Bingung jurusan/karier siswanya, butuh tool credible untuk BK; HR butuh data objektif untuk talent dev
- Trigger search: "asesmen psikologi untuk sekolah", "psikotes online untuk perusahaan", "tes minat bakat siswa SMA"
- Conversion goal: **Demo request form** → handover ke B One sales force

**Persona B — End User Pendidikan (B2C top-of-funnel)**
- Siswa SMA kelas 11–12, mahasiswa semester 1–4, fresh graduate
- Pain: Bingung pilih jurusan, bingung pilih karier, butuh validasi minat
- Trigger search: "tes MBTI Indonesia", "tes minat jurusan kuliah", "kepribadian INTJ karier apa", "tes Holland code online gratis"
- Conversion goal: **Free preview / waitlist signup** → email list nurture → V1.5 self-serve OR refer ke sekolah/kampus

**Persona C — End User Korporat (B2C side funnel)**
- Karyawan menengah, profesional pengen self-development, job seeker
- Pain: Stuck karier, mau pivot, perlu validasi strength/style
- Trigger search: "tes kepemimpinan online", "emotional intelligence test bahasa Indonesia", "burnout test karyawan"
- Conversion goal: **Email signup** → nurture → eventual upsell ke korporat-nya (B2B referral loop)

### 1.2 Funnel Stages

```
ATTRACT          ENGAGE           CONVERT          NURTURE
─────────       ─────────        ─────────        ─────────
SEO/AEO/GEO →   Landing page →  CTA primary →    Email/WA drip →
Programmatic    Pillar content  (B2B demo or     Eventual deal/
SEO pages       Trust signals   B2C waitlist)    self-serve V1.5
```

**Two distinct CTA tracks**:
- Track 1 (B2B, primary): "Jadwalkan Demo Gratis" → form (5 field) → B One sales pickup dalam 24 jam
- Track 2 (B2C, secondary): "Daftar Tunggu Akses" → email + 1 field segment → mailing list

---

## 2. Information Architecture

### 2.1 Site Map (Foundation — Tier 1)

```
sekil.id/
├── /                                    # Home (B2B-first hero, B2C secondary)
├── /tentang                             # About (story, JV B One, UNJANI validation)
├── /produk/                             # Product hub
│   ├── /produk/career-interest          # 11 product detail pages (V1: 5 produk priority)
│   ├── /produk/psyai
│   ├── /produk/path-finder-ai
│   ├── /produk/leadership-styles-test
│   ├── /produk/emotional-intelligence-test
│   └── (V1.5: 6 produk tambahan)
├── /solusi/
│   ├── /solusi/untuk-sekolah            # B2B segment landing
│   ├── /solusi/untuk-perguruan-tinggi   # B2B segment landing
│   ├── /solusi/untuk-perusahaan         # B2B segment landing
│   └── /solusi/untuk-yayasan            # B2B segment landing
├── /harga                               # Pricing (B2B per-seat + ATC add-on context)
├── /metodologi                          # Academic credibility (Holland/MBTI/Papi + UNJANI)
├── /demo                                # Demo request form (B2B primary CTA)
├── /blog/                               # Content hub (YMYL credibility builder)
│   └── /blog/[slug]                     # Articles
├── /panduan/                            # Long-form guides (E-E-A-T)
│   └── /panduan/[slug]                  # e.g., "Cara memilih jurusan kuliah"
├── /kontak                              # Contact + alamat fisik (NAP for local SEO)
├── /privacy                             # Required for GDPR/UU PDP
├── /terms                               # Terms of service
└── /sitemap.xml + /robots.txt
```

### 2.2 Programmatic SEO Templates (Tier 2 — 50–100 pages)

Pakai existing data dari `career_paths` table (lihat 03A_Database_Schema_Complete.md) + product catalog.

**Template P1 — Karier × Tipe Kepribadian** (~30 pages)
```
/karier/[career-slug]
e.g., /karier/data-scientist
      /karier/marketing-analyst
      /karier/business-analyst
```
Setiap page render: deskripsi karier, Holland code match, MBTI types match, jurusan recommendation, B One certification path. Pulled dari `career_paths` table.

**Template P2 — Jurusan × Tipe Minat** (~25 pages)
```
/jurusan/[major-slug]
e.g., /jurusan/teknik-informatika
      /jurusan/psikologi
      /jurusan/manajemen
```
Setiap page render: deskripsi jurusan, profil minat ideal (Holland), prospek karier, link ke produk Path Finder AI.

**Template P3 — Tipe Kepribadian Hub** (~16 pages MBTI + 6 Holland = 22)
```
/kepribadian/[type]
e.g., /kepribadian/intj
      /kepribadian/holland-investigative
```
Setiap page: penjelasan tipe, karier match, jurusan match, link CTA tes.

**Template P4 — Use Case B2B Vertical** (~10 pages)
```
/untuk/[vertical]
e.g., /untuk/sma-swasta
      /untuk/sekolah-islam
      /untuk/perusahaan-manufaktur
      /untuk/startup-teknologi
```
Vertical-specific value prop, case study placeholder (akan diisi pasca pilot).

**Total Tier 2**: ~87 pages → fit dalam 50–100 target.

### 2.3 URL Convention

- All lowercase, kebab-case
- No trailing slash kecuali root
- Bahasa Indonesia di URL (lebih natural untuk audience lokal, juga SEO sinyal lokalisasi)
- Stable: URL tidak boleh berubah pasca-publish (kalau perlu, redirect 301)

---

## 3. Page-by-Page Wireframe Brief

Setiap section punya pattern: **Goal → Content → CTA → SEO target**.

### 3.1 Homepage (`/`)

**Above the fold (hero)**
- H1: "Asesmen Psikologi & Pemetaan Karier untuk Indonesia"
- Subhead: "Validasi akademik UNJANI. Dipakai sekolah, kampus, dan perusahaan. AI-powered, hasil dalam 10 menit."
- Dual CTA:
  - Primary (B2B): "Jadwalkan Demo Gratis" (button warna primary/biru deck)
  - Secondary (B2C): "Coba Tes Gratis" (button ghost/outline)
- Hero visual: pakai illustrasi dari deck Metranet (sudah ada asset)

**Section 2 — Social proof bar**
- Logo strip: B One Corp, UNJANI, Muhammadiyah (jika sudah signed), Metranet (jika signed), Yayasan Pengusaha Pendidikan Jabar
- Tagline: "Dipercaya oleh institusi pendidikan & korporasi terkemuka"

**Section 3 — Problem framing (B2B-first)**
- 3 column problem statement:
  1. "Siswa Anda bingung pilih jurusan?"
  2. "HR butuh data objektif untuk talent development?"
  3. "Yayasan butuh dashboard monitoring asesmen lintas unit?"

**Section 4 — Product showcase (5 produk V1)**
- Grid 5 produk dengan card: nama, tagline, durasi, target segment, "Lihat detail →"
- Sort: Career Interest, PsyAI, Path Finder AI, Leadership Styles, Emotional Intelligence

**Section 5 — Methodology credibility**
- "Dibangun di atas 3 instrumen tervalidasi: Holland Code, MBTI-style typing, Papi Kostick"
- Card per instrumen + badge "Validasi akademik UNJANI Fakultas Psikologi"
- Link → /metodologi

**Section 6 — How it works**
- 4 step visual:
  1. Tenant onboarding (sekolah/perusahaan setup)
  2. User undang via link/SSO
  3. User isi asesmen (10–30 menit)
  4. Laporan personal + dashboard aggregate

**Section 7 — Segment selector**
- 4 large card: Sekolah / Perguruan Tinggi / Perusahaan / Yayasan
- Click → /solusi/[segment]

**Section 8 — Integration B One Corp**
- Showcase: "Hasil asesmen → rekomendasi sertifikasi Certiport/Adobe/Microsoft via B One"
- USP unik: "Bukan sekadar tes — kami petakan ke jalur sertifikasi yang relevan"

**Section 9 — Testimonial (placeholder pasca-pilot)**
- 3 quote card dari design partner (will populate setelah Muhammadiyah/Metranet pilot)

**Section 10 — Final CTA + FAQ teaser**
- Dual CTA repeat
- 5 FAQ accordion (link ke /panduan/faq)

**Section 11 — Footer**
- Standard: link list, social, alamat fisik, email, telp (NAP consistent untuk local SEO)

**SEO target keywords (home)**:
- Primary: "asesmen psikologi indonesia", "tes minat bakat online"
- Secondary: "platform psikotes sekolah", "tes karier ai"

---

### 3.2 Product Detail (`/produk/[product-slug]`)

Template untuk 5 produk V1 (kemudian 11 di V1.5).

**Pattern**:
1. Hero: nama produk + 1-liner value prop + harga retail + CTA "Hubungi Sales" / "Tanya Detail"
2. "Untuk siapa": persona match (siswa/mahasiswa/karyawan/manager)
3. "Apa yang Anda dapat": output sample report (mockup dari design partner)
4. Metodologi yang dipakai (link ke /metodologi)
5. Sample report download (PDF teaser, 1 page)
6. "Sering dikombinasikan dengan": link ke produk lain (bundle suggestion)
7. FAQ produk-specific (5 item)
8. CTA repeat

**SEO target per produk**:
- Career Interest: "tes minat karier", "career interest test indonesia"
- PsyAI: "tes kepribadian ai", "personality test indonesia"
- Path Finder AI: "tes pemilihan jurusan kuliah", "tes minat jurusan SMA"
- Leadership Styles Test: "tes gaya kepemimpinan", "leadership assessment indonesia"
- Emotional Intelligence Test: "tes EQ online", "emotional intelligence test indonesia"

---

### 3.3 Solution Pages (`/solusi/[segment]`)

4 segment landing — B2B-focused.

**Pattern untuk /solusi/untuk-sekolah** (template-able):

1. Hero: "Asesmen Minat Bakat untuk SMA — Bantu Siswa Anda Pilih Jurusan dengan Data"
2. Pain points segment-specific
3. "Bagaimana sekolah lain pakai Sekil.id" (case study/scenario)
4. Recommended product bundle (Career Interest + Path Finder AI)
5. Pricing snapshot ("Mulai dari Rp 75.000/siswa dengan volume discount")
6. ATC dashboard preview (kalau relevant — yayasan multi-sekolah pasti butuh)
7. Logistics: timeline implementasi, support
8. CTA: "Jadwalkan demo untuk sekolah Anda"
9. FAQ B2B-specific

**Variant per segment**:
- /solusi/untuk-sekolah → SMA, SMK fokus jurusan
- /solusi/untuk-perguruan-tinggi → mahasiswa career readiness
- /solusi/untuk-perusahaan → corporate talent dev
- /solusi/untuk-yayasan → multi-tenant hierarchy + ATC mandatory

---

### 3.4 Pricing (`/harga`)

**Pattern**:
1. Hero: "Transparan & Skalabel" + dual model toggle (Per Seat | Subscription teaser "Coming V1.5")
2. Per-seat pricing table — 11 produk + harga retail dari deck Metranet
3. Volume discount tier visualizer (interactive: input jumlah seat → preview discount)
4. ATC add-on highlight: Rp 30 juta/tahun + feature list (dashboard, comparative report, multi-level hierarchy)
5. Bundle examples (Career Starter Pack, Self Awareness Bundle, Corporate Leadership Pack, Comprehensive Personality)
6. "Kontak sales untuk negotiation" disclaimer dengan link form
7. FAQ pricing (refund policy, fair use, kontrak terms)

**Important**: TIDAK menampilkan "self-serve checkout" V1. CTA semua → form sales contact.

**SEO target**: "harga asesmen psikologi", "biaya psikotes sekolah"

---

### 3.5 Methodology (`/metodologi`)

**Pattern** — page paling penting untuk E-E-A-T (YMYL signal):
1. Hero: "Dibangun di atas 3 instrumen tervalidasi"
2. Section per instrumen (Holland, MBTI, Papi):
   - Asal-usul akademik (citation paper)
   - Dimensi yang diukur
   - Limitations (PENTING untuk credibility — bukan "ini magic")
3. "Validasi UNJANI Psikologi": foto/profil tim akademik, role mereka di Sekil.id
4. "Apa yang AI lakukan vs apa yang manusia interpretasi": jelaskan boundary
5. Disclaimer kuat: "Hasil bukan diagnosis klinis. Untuk evaluasi mendalam, konsultasi profesional."
6. Link ke published research/whitepaper (kalau ada — placeholder kalau belum)

**SEO target**: "metodologi tes kepribadian", "Holland code adalah", "papi kostick"

---

### 3.6 Demo Request (`/demo`)

**Single-purpose page** — B2B primary CTA.

**Form fields** (minimum, jangan overwhelming):
- Nama lengkap (required)
- Email institusional (required)
- Nomor WA (required, untuk B One sales follow-up)
- Nama institusi (required)
- Tipe institusi (dropdown: SMA / SMK / PT / Perusahaan / Yayasan / Lainnya)
- Perkiraan jumlah peserta (dropdown: <100 / 100–500 / 500–2000 / 2000+)
- Pesan (optional)

**Tech**:
- Submit → simpan ke DB (table `leads`) → email notification ke B One sales + founder
- Anti-spam: hCaptcha atau Cloudflare Turnstile (free tier)
- Thank-you page dengan ekspektasi: "Tim kami akan hubungi dalam 24 jam"

---

### 3.7 Blog (`/blog`)

**Pattern**:
- Hub page: list semua post, filter kategori (Karier / Jurusan / Self-Development / Korporat / Akademik)
- Article page: H1 + meta + author byline (UNJANI lecturer atau founder — penting untuk E-E-A-T) + body + related articles + CTA
- 1 post = 1 search intent specific
- Cadence target: 2 post/minggu, pasca-launch

**Initial 10 posts (priority untuk launch)**:
1. "Cara memilih jurusan kuliah berdasarkan minat & kepribadian"
2. "Holland Code: 6 tipe minat karier dan cara menentukan milikmu"
3. "MBTI: apa kelebihan & keterbatasan tes ini"
4. "Papi Kostick: alat asesmen yang dipakai HR profesional"
5. "5 tanda kamu salah jurusan (dan apa yang bisa dilakukan)"
6. "Burnout kerja: kenali tanda awal & langkah pertama"
7. "Career switching di usia 30: framework keputusan"
8. "Tes kepribadian untuk siswa SMA: kapan, kenapa, hasilnya untuk apa"
9. "HR analytics 101: apa yang asesmen kepribadian bisa dan tidak bisa kasih"
10. "Sertifikasi profesional × kepribadian: cara pilih jalur yang fit"

---

### 3.8 Guide / Long-form Pillar (`/panduan/[slug]`)

**Pattern**:
- 3000–5000 kata per pillar
- TOC sticky di sidebar (desktop)
- Internal link ke /blog dan /produk
- Schema markup: Article + FAQPage
- CTA mid-article + bottom

**Initial pillar guides (5 pages)**:
1. "Panduan lengkap memilih jurusan kuliah di Indonesia 2026"
2. "Panduan memilih karier untuk fresh graduate"
3. "Panduan HR untuk talent development di SMB"
4. "Panduan kepala sekolah: program BK berbasis data"
5. "Panduan yayasan pendidikan: monitoring siswa lintas unit"

---

### 3.9 Programmatic Pages (Tier 2)

Lihat detail di **`03_Content_Production_Pipeline.md`** — dokumen terpisah.

Brief: template-driven, LLM-generated dengan UNJANI sign-off, render via Next.js dynamic route + ISR (Incremental Static Regeneration). Source data dari `career_paths` table + `products` table + curated MBTI/Holland descriptions.

---

## 4. Design System Integration

**Source**: claude.ai/design via handoff command yang sudah disiapkan founder:
```
Fetch this design file, read its readme, and implement the relevant aspects of the design.
https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw
Implement: the designs in this project
```

**Brand asset existing** (dari deck Metranet):
- Logo Sekil.id (dark/light variants — sudah disebut di project knowledge)
- Color palette: navy primary `#0E2A56`-ish, yellow accent `#FFD93D`-ish, light blue secondary
- Typography: bold display + clean sans body (terlihat dari deck)
- Dot pattern background utility

**Component library**:
- shadcn/ui base (sama dengan portal app)
- Custom marketing components: Hero, FeatureGrid, ProductCard, TestimonialCard, PricingTable, FAQ, CTAStrip, Footer
- Build sequence detail di **`04_Claude_Design_Handoff_Prompts.md`**

**Important constraint**: marketing repo & portal repo punya **shared design tokens** (di-export dari Claude Design sebagai single source). Token sync via:
- Manual sync di V1 (acceptable, 1x setup)
- Future: published npm package `@sekil/design-tokens` (defer V2)

---

## 5. SEO/AEO/GEO Strategy Summary

Detail di **`02_SEO_AEO_GEO_Strategy.md`**. Highlight:

- **SEO**: technical SEO foundation (sitemap, schema.org, Core Web Vitals), keyword targeting per page, internal linking strategy
- **AEO** (Answer Engine Optimization untuk Perplexity/ChatGPT/Claude/Gemini): structured Q&A blocks, FAQ schema, clear factual statements, author bylines, citations
- **GEO** (Generative Engine Optimization untuk Google AI Overview, SGE): list/table/quotable format, semantic clarity, brand mention strategy

---

## 6. Tech Stack Decisions

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | Same as portal app, team familiarity, SSG/ISR optimal untuk SEO |
| Styling | Tailwind + shadcn/ui | Consistency dengan portal |
| Content | MDX untuk blog/guide, JSON+template untuk programmatic | MDX = author-friendly + React component embed; JSON = data-driven scale |
| CMS | None V1 (file-based) → Decap CMS V1.5 (free, git-based) | Avoid SaaS lock-in; UNJANI sign-off via PR review acceptable V1 |
| Hosting | Vercel (V1) → Cloudflare Pages (V2 kalau scale) | Lihat rekomendasi di section 7 |
| Analytics | GA4 + GSC + Plausible (privacy-friendly secondary) | GA4 untuk marketing, Plausible cleaner data |
| Forms | Next.js API route → DB (Postgres) + Resend email | No SaaS forms (Typeform/Formspree) — cost & data ownership |
| A/B test | None V1 → PostHog free V1.5 | Premature for V1 traffic |
| Schema markup | next-seo lib + custom JSON-LD | Standard |

---

## 7. Hosting Rekomendasi: Vercel (V1)

**Mengapa Vercel untuk V1**:
1. **Native Next.js 14 support** — ISR, edge functions, image optimization out-of-box
2. **Free tier sufficient untuk launch** — 100GB bandwidth, unlimited static pages
3. **Speed advantage**: edge CDN otomatis = TTFB rendah = Core Web Vitals score tinggi = ranking signal Google
4. **Preview deployment per PR** — UNJANI bisa review programmatic content via preview URL sebelum merge
5. **Zero ops** — founder + tim kecil tidak punya bandwidth untuk infra tuning

**Kapan migrate ke Cloudflare Pages**:
- Bandwidth > 100GB/bulan (Vercel Pro $20/dev/bulan kalau exceed)
- Programmatic page > 1000 (cost calculation flip)
- Butuh Cloudflare Workers untuk edge logic (geo-routing, A/B test)

**Mengapa BUKAN Hostinger / Oracle Cloud**:
- Hostinger: shared hosting, SSR Next.js terbatas, CDN edge inferior
- Oracle Cloud: ya cost-efficient untuk backend Go portal, **tapi** marketing static site overkill di sana. Resource ops berbeda dari portal — better split concerns.

**Mengapa BUKAN GitHub Pages**:
- Tidak support Next.js SSR/ISR (hanya static)
- Tidak ada serverless function untuk form submit

**Domain DNS**:
- `sekil.id` A/CNAME → Vercel
- `app.sekil.id` A/CNAME → Oracle Cloud (Go backend) — terpisah
- `www.sekil.id` 301 redirect → `sekil.id` (canonicalize ke root)

---

## 8. Analytics & Measurement

### 8.1 KPIs

**B2B funnel**:
- Demo request rate (form submit / unique visitor) — target 0.5–1.5% V1
- Demo → qualified meeting rate (B One handover) — target 60%+
- Meeting → deal close rate — tracked di CRM B One

**B2C funnel**:
- Waitlist signup rate — target 2–4% V1
- Email open rate — target 25%+
- Email → eventual conversion (V1.5) — tracked

**SEO**:
- Organic traffic growth — target 30%+ MoM dalam 6 bulan pertama
- Indexed pages — target 90%+ submitted via sitemap
- Top 10 ranking untuk 20 keyword target di bulan 6
- Branded vs non-branded traffic split

### 8.2 Tracking Plan

| Event | Trigger | Property |
|---|---|---|
| `page_view` | All page loads | page_path, referrer, utm_* |
| `demo_form_started` | First field focused di /demo | — |
| `demo_form_submitted` | Submit success | institution_type, seat_estimate |
| `waitlist_submitted` | Submit di hero/CTA strip | segment |
| `cta_clicked` | Click CTA button | location, cta_text |
| `pricing_calculator_used` | Volume slider moved | calculated_price |
| `product_card_clicked` | Click di product grid | product_slug |
| `blog_scroll_depth` | 25/50/75/100% scroll | post_slug, depth |

### 8.3 Tooling

- **Google Analytics 4** — main analytics, free
- **Google Search Console** — SEO tracking, free, **WAJIB setup hari 1**
- **Plausible self-hosted** — privacy-friendly secondary (optional V1)
- **Sentry free tier** — error tracking
- **Vercel Analytics** — Web Vitals tracking, free tier

---

## 9. Compliance & Legal

### 9.1 UU PDP (Indonesia data protection)

- Privacy policy page WAJIB sebelum launch
- Cookie consent banner (untuk GA4 tracking) — pakai library `cookieconsent` atau custom
- Data subject rights: contact form untuk delete request
- Data retention disclosure (form submissions: kept 12 bulan)

### 9.2 YMYL Safeguards

Asesmen psikologi = mental health adjacent = YMYL (Your Money Your Life) di Google's eyes. Implications:
- **E-E-A-T critical**: author bio (UNJANI lecturer credential), citation, transparent methodology
- **Disclaimer di every assessment-related content**: "Bukan diagnosis klinis"
- **Crisis support link** kalau content touch burnout/mental health: hotline Halo Kemenkes 1500-567, atau Into The Light Indonesia
- **No "diagnostic claims"** di copy ("kamu autis" / "kamu depresi" — NEVER)

### 9.3 Academic Citation Policy

Untuk credibility & legal safety:
- Setiap claim metodologi → citation paper akademik
- UNJANI lecturer di-credit sebagai reviewer di content yang mereka sign-off
- Pasca-pilot: publish 1 whitepaper dengan UNJANI sebagai authority asset

---

## 10. Build Sequence (4 Minggu V1)

### Week 1: Foundation
- [ ] Bootstrap repo (Next.js 14, Tailwind, shadcn/ui, MDX support, sitemap lib)
- [ ] Setup Vercel deployment + custom domain
- [ ] Fetch design tokens via Claude Design handoff
- [ ] Build base components: Layout, Header, Footer, Button, Card, FAQ accordion
- [ ] Setup GA4 + GSC + Sentry
- [ ] Implement i18n boilerplate (default `id-ID`, future-proof untuk English)

### Week 2: Foundation pages
- [ ] / (home)
- [ ] /tentang
- [ ] /metodologi
- [ ] /harga
- [ ] /demo + form backend (API route + DB + email)
- [ ] /kontak
- [ ] /privacy + /terms

### Week 3: Product & Solution pages
- [ ] /produk hub + 5 product detail
- [ ] /solusi 4 segment pages
- [ ] /blog hub + 5 initial post (MDX)
- [ ] /panduan hub + 2 initial pillar (MDX)

### Week 4: Programmatic foundation + polish
- [ ] /kepribadian/[type] (16 MBTI + 6 Holland = 22 pages)
- [ ] Schema.org markup all pages (Article, FAQPage, BreadcrumbList, Organization)
- [ ] Sitemap.xml + robots.txt
- [ ] Performance audit (Core Web Vitals all green)
- [ ] Accessibility audit (WCAG AA)
- [ ] Pre-launch QA: cross-browser, mobile, link check

### Week 5–8 (post-launch): Programmatic Tier 2
- [ ] /karier/[slug] (~30 pages) — LLM generated, UNJANI sign-off
- [ ] /jurusan/[slug] (~25 pages) — LLM generated, UNJANI sign-off
- [ ] /untuk/[vertical] (~10 pages) — LLM generated, founder sign-off (less risky, no academic claim)
- [ ] Blog cadence kick-off (2 post/minggu)

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM hallucination di programmatic content → factual error tentang karier/jurusan | High | High | Strict template + data lookup, UNJANI sign-off per template (bukan per page, per template variant), human spot-check sample 10% |
| Google penalize thin programmatic content | Medium | High | Minimum 800 kata per page, unique value (not just data dump), internal linking, slow rollout (10 page/minggu monitoring impressions) |
| YMYL content tanpa author bio → low E-E-A-T | High | Medium | Every content piece byline UNJANI lecturer atau founder dengan credential visible |
| Slow Core Web Vitals → ranking drop | Medium | High | Next.js Image, font subsetting, no heavy carousels, Vercel edge CDN |
| Form spam → noise di sales pipeline | High | Low | hCaptcha + rate limiting + email verification |
| Sales force B One tidak refer ke landing (kanibal direct sales) | Medium | Medium | Sales kit yang positioning landing sebagai "asset untuk close deal" bukan replace sales; trackable UTM link per sales rep |
| Konflik positioning B2B vs B2C di copy → confusing | Medium | Medium | Strict pattern: B2B framing primer di hero/solusi, B2C secondary di blog/programmatic. Tidak campur di section yang sama. |
| UNJANI bottleneck di sign-off → programmatic delay | High | Medium | Sign-off per template (1x effort), bukan per page. Anggaran 1 minggu turnaround per template variant. |

---

## 12. Open Questions (Untuk Diskusi Lanjut)

1. **Logo & brand asset Sekil.id** — apakah final atau masih bisa di-refresh? Affect design system token.
2. **UNJANI commitment timeline untuk content review** — perlu diskusi langsung agar bottleneck terhindar.
3. **B One sales team buy-in** — apakah mereka setuju landing page ada di funnel mereka? Perlu align expectation.
4. **Foto/asset partner** — Muhammadiyah, Metranet, Yayasan Pengusaha Pendidikan Jabar logo: ada permission untuk display di homepage? (Jika belum kontrak signed, jangan display dulu.)
5. **Programmatic content language**: 100% Indonesia V1, atau prepare English content slot untuk V2?
6. **Founder & UNJANI author photo + bio** — untuk E-E-A-T setup hari pertama.

---

**End of Spec v1.0.**

Companion documents:
- `02_SEO_AEO_GEO_Strategy.md` — technical SEO checklist & content strategy
- `03_Content_Production_Pipeline.md` — programmatic SEO data model & LLM workflow
- `04_Claude_Design_Handoff_Prompts.md` — page-by-page handoff prompts
- `05_Repo_Setup_Guide.md` — bootstrap `sekil.id-landingpage` repo