# Sekil.id Landing Page — Claude Design Handoff Prompts v1.0

**Companion to:** `01_Landingpage_Spec_v1.md`, `08_Design_System_Integration.md` (master design doc)
**Status:** Ready for execution
**Design source:** https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

---

## 0. Workflow Overview

Untuk setiap page kita pakai 3-step workflow yang sudah established di project (`08_Design_System_Integration.md`):

```
[Step 1] Refine page design di claude.ai/design
   └─ Selesaikan canvas page-nya, verify tokens, responsive

[Step 2] Export handoff bundle dari Claude Design
   └─ Get handoff command/URL

[Step 3] Paste ke Claude Code + tambahan context prompt
   └─ Build di sekil.id-landingpage repo
```

Dokumen ini fokus di **Step 3** — context prompt yang konsisten per page.

---

## 1. Foundation Setup (Run Once)

### 1.1 Initial Token Extraction

**Paste di Claude Code terminal di `sekil.id-landingpage` repo, sebelum build page apapun:**

```
Halo Claude.

Saya mau setup foundation design system untuk landing page Sekil.id.

Sumber design system:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Brand context Sekil.id (dari project knowledge & deck Metranet):
- Primary color: Navy/dark blue (terlihat di deck slide background)
- Accent color: Yellow bright (#FFD93D-ish)
- Secondary: Light blue
- Typography: Bold display untuk heading + clean sans untuk body
- Visual pattern: Dot pattern background utility
- Logo: Sekil.id dark/light variants

Tasks:
1. Fetch design tokens dari Claude Design URL di atas
2. Extract semua tokens:
   - Color palette (full scale 50-950)
   - Typography (font family, size scale, weight, line-height)
   - Spacing scale
   - Border radius, shadow tokens
   - Component variants

3. Generate output:
   - design/design-tokens.json (single source of truth)
   - src/styles/globals.css (CSS custom properties)
   - tailwind.config.ts (theme extension)
   - src/styles/themes.css (CSS variables per data-tenant)
   
4. Setup base components di src/components/ui/:
   - Button (variants: primary, secondary, ghost, outline, cta)
   - Card
   - Input
   - Badge
   - FAQ accordion
   - Container (max-w-7xl mx-auto wrapper)

5. Generate Storybook story per base component

Constraints:
- Next.js 14 App Router project
- Tailwind CSS + shadcn/ui foundation
- TypeScript strict
- Tokens harus konsisten dengan portal app (app.sekil.id) — same naming convention
- Mobile-first responsive

Setelah complete, show me:
- Token map (palette visible)
- Base component preview di Storybook
- Verification script (e.g., npm run build pass)

Mulai dengan token extraction.
```

---

## 2. Per-Page Prompts

Pattern dasar setiap prompt:
1. **Context**: page apa, fungsi-nya, audience
2. **Reference**: design URL + spec markdown
3. **Constraints**: SEO, accessibility, performance
4. **Output expectation**: file location, validation gate

### 2.1 Homepage (`/`)

```
Build homepage Sekil.id di src/app/page.tsx.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw
  Fetch design ini, baca readme di handoff bundle, dan implement aspek homepage.

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.1 (Homepage section)
- @specs/02_SEO_AEO_GEO_Strategy.md section 4 (on-page SEO patterns)

Page goal: Hybrid B2B lead-gen primary + B2C secondary funnel.

Structure (urutan section):
1. Hero — H1: "Asesmen Psikologi & Pemetaan Karier untuk Indonesia"
   Subhead: "Validasi akademik UNJANI. Dipakai sekolah, kampus, dan perusahaan. AI-powered, hasil dalam 10 menit."
   Dual CTA:
   - Primary (B2B): "Jadwalkan Demo Gratis" → /demo
   - Secondary (B2C): "Coba Tes Gratis" → /produk
   Hero visual: placeholder image (akan diganti illustrasi dari deck)

2. Social proof bar — Logo strip placeholder (B One, UNJANI, Muhammadiyah, Metranet, Yayasan Pengusaha Pendidikan Jabar)
   Caption: "Dipercaya oleh institusi pendidikan & korporasi terkemuka"

3. Problem framing — 3 column card:
   - "Siswa Anda bingung pilih jurusan?"
   - "HR butuh data objektif untuk talent development?"
   - "Yayasan butuh dashboard monitoring asesmen lintas unit?"

4. Product showcase — 5 product card grid:
   - Career Interest (Rp 150,000)
   - PsyAI (Rp 195,000)
   - Path Finder AI (Rp 150,000)
   - Leadership Styles Test (Rp 150,000)
   - Emotional Intelligence Test (Rp 175,000)
   Each card: name, tagline, "Lihat detail →" → /produk/[slug]

5. Methodology credibility — 3 instrument card (Holland, MBTI, Papi) + badge "Validasi akademik UNJANI Fakultas Psikologi"
   "Pelajari metodologi" CTA → /metodologi

6. How it works — 4 step horizontal flow:
   Step 1: Onboarding tenant
   Step 2: Undang user via link/SSO
   Step 3: User isi asesmen (10-30 menit)
   Step 4: Laporan personal + dashboard aggregate

7. Segment selector — 4 large card:
   Sekolah | Perguruan Tinggi | Perusahaan | Yayasan
   Click → /solusi/[segment]

8. B One integration USP — Highlight: "Hasil asesmen → rekomendasi sertifikasi Certiport/Adobe/Microsoft via B One Corp"

9. Testimonial placeholder — 3 quote card (3 slot kosong dengan note "akan diisi pasca pilot")

10. Final CTA strip — Dual CTA repeat + 5 FAQ accordion teaser

11. Footer — Standard, link list, NAP (address physical Bandung), email, telp

SEO requirements (CRITICAL):
- <title>: "Asesmen Psikologi & Pemetaan Karier Indonesia | Sekil.id"
- <meta description>: max 155 char, contain "asesmen psikologi indonesia" + "tes karier ai"
- H1: tepat 1, di hero
- H2 per section
- JSON-LD: Organization + WebSite + FAQPage schema
- <html lang="id">
- Canonical URL set

Accessibility:
- Keyboard navigable
- Focus visible
- Image alt text descriptive
- ARIA labels untuk icon-only buttons
- Min contrast WCAG AA (4.5:1)

Performance:
- Hero image priority loading
- Other images lazy load
- No layout shift (specify w/h)
- Critical CSS inline

Output:
- src/app/page.tsx (Server Component)
- src/components/marketing/Hero.tsx
- src/components/marketing/SocialProof.tsx
- src/components/marketing/ProblemFraming.tsx
- src/components/marketing/ProductShowcase.tsx
- src/components/marketing/MethodologyCard.tsx
- src/components/marketing/HowItWorks.tsx
- src/components/marketing/SegmentSelector.tsx
- src/components/marketing/BOneIntegration.tsx
- src/components/marketing/TestimonialSlot.tsx
- src/components/marketing/FinalCTA.tsx
- src/components/layout/Footer.tsx
- src/components/seo/JsonLd.tsx
- src/lib/seo/homepage-schema.ts

Build the page, then:
1. Run `npm run build` to verify no errors
2. Take screenshot of result (desktop + mobile)
3. Compare side-by-side dengan design Claude Design — report any gap
4. Validate JSON-LD via schema.org validator (manual check)
```

### 2.2 Product Detail (`/produk/[slug]`)

```
Build product detail page template di src/app/produk/[slug]/page.tsx.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw
  Fetch design dan implement aspek product detail page.

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.2 (Product Detail)
- @specs/02_SEO_AEO_GEO_Strategy.md (Product schema)

Page goal: Product detail dengan B2B sales conversion (no transactional self-serve V1).

Routing: dynamic segment [slug] dengan 5 product V1 priority:
- career-interest, psyai, path-finder-ai, leadership-styles-test, emotional-intelligence-test

Data source: src/data/products.ts (TypeScript object dengan 5 product full data — name, description, required_assessments, target_segment, price, sample report PDF link, FAQ items, sering_dikombinasikan_dengan)

Static params via generateStaticParams for SSG.

Structure:
1. Breadcrumb — Home › Produk › [Product Name]

2. Hero — split layout:
   Left: H1 product name, 1-liner value prop, harga "Mulai Rp [price]/peserta", 
         CTA "Hubungi Sales untuk Penawaran" → /demo?product=[slug]
         Secondary CTA: "Lihat Sample Report" → modal/download
   Right: Product mockup image

3. "Untuk siapa" — persona match grid (siswa/mahasiswa/karyawan/manager) dengan icon

4. "Apa yang Anda dapat" — output sample preview (3 thumbnail PDF page)

5. Metodologi snippet — list instrument yang dipakai (Holland/MBTI/Papi) dengan link ke /metodologi

6. Sample report download — CTA "Download sample laporan (PDF, 1 halaman)" — gated minimal (cuma email field)

7. "Sering dikombinasikan dengan" — 2-3 product card horizontal scroll

8. FAQ section — 5 question accordion (data dari products.ts)

9. CTA repeat strip

10. Footer (shared)

SEO requirements:
- <title>: "[Product Name] — [Tagline] | Sekil.id"
- <meta description>: include primary keyword per product (lihat spec section 3.2)
- JSON-LD: Product schema + Offer + Breadcrumb + FAQPage
- Canonical URL

Accessibility:
- Tab order logical
- Modal trap focus
- Skip to content link

Output:
- src/app/produk/[slug]/page.tsx
- src/app/produk/page.tsx (hub page listing all 5)
- src/components/product/ProductHero.tsx
- src/components/product/PersonaMatch.tsx
- src/components/product/OutputPreview.tsx
- src/components/product/SampleReportDownload.tsx
- src/components/product/RelatedProducts.tsx
- src/components/product/FAQAccordion.tsx
- src/data/products.ts
- src/lib/seo/product-schema.ts

Build, then verify all 5 routes render correctly.
```

### 2.3 Solution Page (`/solusi/[segment]`)

```
Build solution page template di src/app/solusi/[segment]/page.tsx.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.3

Page goal: B2B segment-specific landing → demo request.

Routing: dynamic [segment] dengan 4 V1 priority:
- untuk-sekolah, untuk-perguruan-tinggi, untuk-perusahaan, untuk-yayasan

Data source: src/data/solutions.ts

Structure per segment:
1. Hero — H1 segment-specific (e.g., "Asesmen Minat Bakat untuk SMA — Bantu Siswa Anda Pilih Jurusan dengan Data")
   CTA: "Jadwalkan demo untuk sekolah Anda" → /demo?segment=[slug]

2. Pain points segment-specific — 3-4 challenge yang resonant untuk decision maker segment

3. "Bagaimana sekolah lain pakai Sekil.id" — scenario card (3 scenario realistik)

4. Recommended product bundle — 2-3 product card dengan badge "Recommended bundle"
   Misal sekolah: Career Interest + Path Finder AI

5. Pricing snapshot — "Mulai dari Rp 75.000/siswa dengan volume discount" + link ke /harga

6. ATC dashboard preview — kalau segment perlu (yayasan, perusahaan) tampilkan dashboard mockup

7. Logistics — timeline implementasi (kickoff → live: 2-4 minggu), support level

8. CTA section — demo form embed atau link

9. FAQ B2B-specific — 5 question per segment

10. Footer

SEO requirements:
- Per segment unique title/meta
- JSON-LD: Service schema + Organization + Breadcrumb

Output:
- src/app/solusi/[segment]/page.tsx
- src/app/solusi/page.tsx (hub)
- src/components/solution/SegmentHero.tsx
- src/components/solution/PainPoints.tsx
- src/components/solution/UsageScenario.tsx
- src/components/solution/RecommendedBundle.tsx
- src/components/solution/PricingSnapshot.tsx
- src/components/solution/ATCDashboardPreview.tsx
- src/data/solutions.ts

Build, verify all 4 routes.
```

### 2.4 Pricing Page (`/harga`)

```
Build pricing page di src/app/harga/page.tsx.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.4
- @01_Product_Specification_v2.2.md (pricing data: section 4 pricing logic)

Page goal: Transparency + lead-gen, no self-serve checkout.

Important: TIDAK menampilkan subscription tier "Starter/Premium/Enterprise" dari deck Metranet 
(itu defer V1.5). V1 fokus per-seat pricing + ATC add-on.

Structure:
1. Hero — H1: "Harga Transparan & Skalabel"
   Subhead: "Bayar per peserta dengan volume discount. Untuk negotiation kustom, hubungi tim sales kami."

2. Per-seat pricing table — 11 product dengan retail price (5 V1 active + 6 V1.5 "Coming Soon")
   Columns: No, Produk, Harga Retail, Status (Available / Coming Soon)
   Source data: products.ts dari section 2.2

3. Volume discount visualizer (interactive client component):
   Input: jumlah seat (slider 100 - 50000)
   Output: discounted price per seat + total estimasi
   Tier visible: <500 (0%), 500-2000 (15%), 2000-5000 (25%), 5000-15000 (35%), 15000-50000 (45%), >50000 (50%)
   Sertakan disclaimer: "Estimasi awal. Final pricing via sales negotiation."

4. ATC Add-on highlight section — Rp 30 juta/tahun
   Feature list:
   - Dashboard analytics tenant
   - Comparative report
   - Multi-level hierarchy
   - Advanced audit log
   - Priority support
   - Custom branding tingkat lanjut

5. Bundle examples — 4 card:
   - Career Starter Pack (Career Interest + Path Finder AI) — Rp 250,000 (saving 17%)
   - Self Awareness Bundle (Self Discovery + Personal Authenticity) — Coming Soon V1.5
   - Corporate Leadership Pack (Leadership Styles + EQ Test + GOC) — Coming Soon V1.5 partial
   - Comprehensive Personality (PsyAI + Path Finder + Goal Align) — Rp 450,000 (saving 7%)

6. "Butuh negotiation kustom?" CTA — link ke /demo dengan pesan auto-fill "Saya tertarik diskusi pricing"

7. FAQ pricing — 5 question:
   - Apakah ada subscription model?
   - Refund policy?
   - Fair use rule (1 seat = 1 completion + 1 retake)?
   - Term kontrak (down payment, milestone)?
   - Data export & retention setelah kontrak berakhir?

8. Footer

SEO requirements:
- <title>: "Harga Asesmen Psikologi & Karier | Sekil.id"
- <meta description>: include "harga asesmen psikologi" + value prop pricing
- JSON-LD: Service schema dengan PriceSpecification

Accessibility:
- Pricing slider keyboard accessible (arrow keys)
- Pricing table semantic <table>

Output:
- src/app/harga/page.tsx
- src/components/pricing/PricingTable.tsx
- src/components/pricing/VolumeCalculator.tsx (client component, use client)
- src/components/pricing/ATCAddOn.tsx
- src/components/pricing/BundleExamples.tsx
- src/components/pricing/PricingFAQ.tsx
- src/lib/pricing/calculator.ts (pure logic, unit testable)

Build, verify calculator math correct di 6 tier.
```

### 2.5 Methodology Page (`/metodologi`)

```
Build methodology page di src/app/metodologi/page.tsx.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.5 (highest E-E-A-T priority)

Page goal: Credibility builder. YMYL signal. UNJANI authority showcase.

Critical: page ini paling penting untuk E-E-A-T. Akademik tone, citation lengkap, 
no marketing fluff.

Structure:
1. Hero — H1: "Dibangun di atas 3 instrumen tervalidasi"
   Author byline tepat di bawah H1: "Reviewed by [UNJANI Lecturer Name], M.Psi., Psikolog"
   datePublished + dateModified visible

2. Intro paragraph — 1-2 paragraf framing: kenapa metodologi matter, apa yang kita lakukan

3. Section per instrumen (3 section identical structure):
   a) Holland Code (RIASEC)
   b) MBTI-style Typing
   c) Papi Kostick
   
   Setiap section:
   - Sub-heading H2 nama instrumen
   - "Asal-usul akademik" — citation paper (Holland 1959, Myers-Briggs 1962, Papi original)
   - "Dimensi yang diukur" — visual diagram + list
   - "Limitations & boundary of use" — paragraf jujur (PENTING untuk credibility)
   - "Bagaimana Sekil.id mengadaptasi untuk konteks Indonesia"

4. Validasi UNJANI — section khusus:
   - Tim akademik UNJANI yang terlibat (foto + nama + jabatan + credential)
   - Role mereka di Sekil.id (review item, validation study, content sign-off)
   - Link ke whitepaper kalau ada (placeholder)

5. "AI vs Manusia di Sekil.id" — boundary clear:
   - Apa yang AI lakukan: scoring, narrative generation, data analysis
   - Apa yang manusia lakukan: methodology design, content review, edge case
   - Disclaimer kuat: "AI bukan psikolog. Hasil bukan diagnosis klinis."

6. References section — full citation list (akademik format)

7. Final CTA — soft: "Pelajari produk yang menerapkan metodologi ini" → /produk

8. Footer

SEO requirements (HIGH PRIORITY untuk YMYL):
- <title>: "Metodologi Asesmen: Holland Code, MBTI, Papi Kostick | Sekil.id"
- <meta description>: include "metodologi tes kepribadian" + "validasi akademik"
- JSON-LD: Article schema + author Person schema dengan UNJANI affiliation + citation array
- <html lang="id">

Output:
- src/app/metodologi/page.tsx
- src/components/methodology/InstrumentSection.tsx (reusable untuk Holland/MBTI/Papi)
- src/components/methodology/UnjaniTeam.tsx
- src/components/methodology/AIBoundary.tsx
- src/components/methodology/ReferencesList.tsx
- src/components/seo/AuthorByline.tsx
- src/data/methodology.ts (citation data + UNJANI team info)

Important: jangan stretch klaim. Tone harus akademik conservative. Mention 
limitation tiap instrument honestly.
```

### 2.6 Demo Request (`/demo`)

```
Build demo request page di src/app/demo/page.tsx.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.6

Page goal: B2B primary conversion. Form submit → lead in DB + email to sales.

Structure:
1. Hero — H1: "Jadwalkan Demo Gratis Sekil.id"
   Subhead: "Tim kami akan hubungi Anda dalam 24 jam untuk diskusi kebutuhan institusi."

2. Form (single column, vertically stacked):
   - Nama lengkap (text, required)
   - Email institusional (email, required)
   - Nomor WhatsApp (tel, required, format Indonesia +62)
   - Nama institusi (text, required)
   - Tipe institusi (select, required): SMA / SMK / PT Negeri / PT Swasta / Perusahaan / Yayasan / Lainnya
   - Perkiraan jumlah peserta (select, required): <100 / 100-500 / 500-2000 / 2000-5000 / >5000
   - Produk yang menarik perhatian (multi-select, optional): 5 V1 product
   - Pesan tambahan (textarea, optional, max 500 char)
   - hCaptcha widget atau Cloudflare Turnstile
   - Submit button "Kirim Permintaan Demo"

3. Sidebar (desktop) / Below form (mobile):
   "Apa yang Anda dapat":
   - Personalized walkthrough 30 menit
   - Sample report sesuai segment Anda
   - Pricing kustom + volume discount
   - Trial setup untuk 10 user gratis

4. Trust signal: logo strip mini + "Dipercaya oleh [N] institusi"

5. Footer

Backend (API route):
- POST /api/demo-request
- Validate input server-side (zod)
- Save ke DB (Postgres) — table leads
- Send email notification ke sales@sekil.id (Resend or similar)
- Auto-reply ke submitter
- Anti-spam: check Captcha, rate limit IP, honeypot field
- Return success → redirect ke /demo/terimakasih

Thank-you page (/demo/terimakasih):
- Heading "Terima kasih, [nama]!"
- Ekspektasi: "Tim B One akan hubungi Anda via WhatsApp/email dalam 24 jam kerja."
- Sambil menunggu: link ke /produk, /metodologi, /blog

URL param support:
- /demo?product=psyai → pre-fill product checkbox
- /demo?segment=sekolah → pre-fill institution type
- UTM params logged

SEO requirements:
- noindex (kalau tidak mau ranking — demo page biasanya tidak target SEO)
- ATAU index dengan title "Demo Gratis Sekil.id — Hubungi Tim Sales"

Accessibility:
- Form labels associated (htmlFor)
- Error messages aria-describedby
- Required indicator visible + aria-required
- Submit button disabled state during pending
- Loading announcement aria-live

Output:
- src/app/demo/page.tsx
- src/app/demo/terimakasih/page.tsx
- src/app/api/demo-request/route.ts
- src/components/demo/DemoForm.tsx (client component)
- src/components/demo/SidebarBenefits.tsx
- src/lib/validation/demo-schema.ts (zod)
- src/lib/email/notifications.ts (Resend client)
- src/lib/db/leads.ts (Prisma or direct SQL)
- prisma/schema.prisma (kalau pakai Prisma) — table `leads`

Verify:
- Form submit success path (manual test)
- Validation error path
- Captcha integration works
- Email delivered
- DB row created
```

### 2.7 Blog Page (`/blog` + `/blog/[slug]`)

```
Build blog hub + article template.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Reference spec:
- @specs/01_Landingpage_Spec_v1.md section 3.7
- @specs/02_SEO_AEO_GEO_Strategy.md (Article schema, author byline)

Page goal: SEO authority builder via long-form content.

Content source: MDX files di `content/blog/*.mdx` dengan frontmatter:
- title, slug, description, publishedAt, modifiedAt, author, reviewedBy (optional), 
  category, tags, coverImage, featured (boolean)

Routing:
- /blog → hub with list + filter category
- /blog/[slug] → article page

Hub page structure:
1. Hero — H1: "Blog Sekil.id", subhead 1-liner
2. Featured post — hero card kalau ada featured
3. Filter pills — category: Karier / Jurusan / Self-Development / Korporat / Akademik / Semua
4. Article grid — card per post (cover image, category badge, title, excerpt, author, date, read time)
5. Pagination atau infinite scroll
6. Newsletter signup CTA mid-page
7. Footer

Article page structure:
1. Breadcrumb — Home › Blog › [Category] › [Title]
2. Hero — cover image + category badge + H1 + meta (author byline, date, read time)
3. TOC sticky sidebar (desktop only) — auto-generate dari H2
4. Article body — MDX content
5. Author bio block — bottom of article
6. Related articles — 3 card
7. Newsletter signup
8. Footer

MDX features:
- Custom components: Callout, FAQ, ImageWithCaption, CTAStrip
- Syntax highlighting kalau ada code block (rare untuk konten ini)
- Auto-anchor heading

SEO requirements:
- <title>: "[Article Title] | Sekil.id Blog"
- <meta description>: dari frontmatter
- JSON-LD: BlogPosting + Person (author) + Organization (publisher) + BreadcrumbList
- Open Graph + Twitter Card tags
- Canonical URL
- <article> semantic
- Reading time calculation
- Word count in schema

Accessibility:
- Skip to content
- TOC keyboard navigable
- Reading order logical

Output:
- src/app/blog/page.tsx
- src/app/blog/[slug]/page.tsx
- src/components/blog/PostCard.tsx
- src/components/blog/CategoryFilter.tsx
- src/components/blog/ArticleHeader.tsx
- src/components/blog/TOC.tsx
- src/components/blog/AuthorBio.tsx
- src/components/blog/RelatedArticles.tsx
- src/components/blog/NewsletterSignup.tsx
- src/components/mdx/Callout.tsx (custom MDX component)
- src/lib/mdx/index.ts (MDX loader)
- src/lib/seo/article-schema.ts

Content seed (Week 3):
Create 5 initial MDX file di content/blog/:
1. cara-memilih-jurusan-kuliah-berdasarkan-minat-kepribadian.mdx
2. holland-code-6-tipe-minat-karier.mdx
3. mbti-kelebihan-dan-keterbatasan.mdx
4. tanda-salah-jurusan-dan-apa-yang-bisa-dilakukan.mdx
5. tes-kepribadian-untuk-siswa-sma.mdx

(LLM generate content draft, UNJANI review sebelum publish — sesuai pipeline spec doc 03)
```

### 2.8 Programmatic Page Templates

```
Build programmatic page templates.

Reference:
- @specs/01_Landingpage_Spec_v1.md section 2.2 (programmatic SEO templates)
- @specs/03_Content_Production_Pipeline.md (full pipeline detail)

Tasks:
1. Build dynamic route handlers:
   - src/app/kepribadian/[type]/page.tsx — render dari MDX di content/kepribadian/[type].mdx
   - src/app/karier/[slug]/page.tsx — render dari MDX di content/karier/[slug].mdx
   - src/app/jurusan/[slug]/page.tsx — render dari MDX di content/jurusan/[slug].mdx
   - src/app/untuk/[vertical]/page.tsx — render dari MDX di content/untuk/[vertical].mdx

2. Use generateStaticParams untuk SSG semua route saat build time

3. Setiap route share layout dengan ContentArticle template (same as blog article):
   - Breadcrumb
   - H1 from MDX frontmatter
   - Author byline + reviewedBy (UNJANI lecturer)
   - TOC sidebar
   - Article body MDX
   - Disclaimer block (otomatis di-inject untuk YMYL pages)
   - Related content section (related personality / career / major)
   - CTA strip (link ke produk relevant)

4. Specific layout adjustment per template:
   - /kepribadian: tambah "Tipe Kepribadian Lain" carousel di bottom
   - /karier: tambah salary chart component
   - /jurusan: tambah university list component
   - /untuk: tambah testimonial component + demo CTA

5. Schema markup per template:
   - /kepribadian: Article + FAQPage
   - /karier: Article + FAQPage + Occupation (kalau bisa)
   - /jurusan: Article + FAQPage + EducationalOccupationalProgram
   - /untuk: Service + Organization

6. Sitemap generation:
   - src/app/sitemap-programmatic.xml/route.ts — generate dari list of MDX files

Build, verify:
- Build success dengan all programmatic routes
- All routes return 200
- Schema valid
- Indexable (no noindex accidentally)

Note: content MDX file akan di-generate via pipeline spec doc 03. 
Build template-nya dulu, content ikut belakangan.

Output:
- src/app/kepribadian/[type]/page.tsx
- src/app/karier/[slug]/page.tsx
- src/app/jurusan/[slug]/page.tsx
- src/app/untuk/[vertical]/page.tsx
- src/components/programmatic/ContentArticle.tsx (shared layout)
- src/components/programmatic/RelatedPersonalities.tsx
- src/components/programmatic/SalaryChart.tsx
- src/components/programmatic/UniversityList.tsx
- src/components/seo/DisclaimerBlock.tsx (auto-inject untuk YMYL)
- src/app/sitemap-programmatic.xml/route.ts
```

### 2.9 Misc Pages (About, Contact, Privacy, Terms)

```
Build remaining foundation pages.

Reference design:
- Claude Design URL: https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw

Pages to build:

1. /tentang (About)
   - Hero: "Tentang Sekil.id"
   - Story: JV Sekil.id × B One Corp + UNJANI
   - Mission & vision
   - Team — founder + B One leadership + UNJANI advisors (foto + bio)
   - Timeline milestone
   - CTA: contact

2. /kontak (Contact)
   - Hero: "Hubungi Kami"
   - Contact methods grid: email, WhatsApp, telp, alamat
   - Embedded map (Google Maps iframe — Bandung office)
   - Working hours
   - Contact form (light version, redirect serius ke /demo)
   - Footer

3. /privacy (Privacy Policy)
   - MDX static content
   - WAJIB sebelum launch (compliance UU PDP)
   - Sections: data collected, purpose, retention, sharing, user rights, contact

4. /terms (Terms of Service)
   - MDX static content
   - Sections: usage terms, IP, disclaimer, liability, governing law (Indonesia)

5. /404 (Not Found custom page)
   - "Halaman tidak ditemukan"
   - Suggestion: link ke beranda, produk populer, blog

Output:
- src/app/tentang/page.tsx
- src/app/kontak/page.tsx
- src/app/privacy/page.tsx (MDX import)
- src/app/terms/page.tsx (MDX import)
- src/app/not-found.tsx
- content/legal/privacy.mdx (draft template, lawyer review pending)
- content/legal/terms.mdx (draft template)

Build, verify all routes accessible.
```

---

## 3. Cross-Cutting Concerns Prompts

### 3.1 Performance Audit (Pre-Launch)

```
Audit performance dan optimize untuk Core Web Vitals.

Tasks:
1. Run Lighthouse audit untuk semua foundation page
2. Identify issues yang affect:
   - LCP (Largest Contentful Paint)
   - INP (Interaction to Next Paint)
   - CLS (Cumulative Layout Shift)
   - TBT (Total Blocking Time)

3. Implement optimizations:
   - Next.js Image untuk semua image (priority + sizes)
   - Font subset + preload critical
   - Lazy load below-fold component
   - Defer non-critical script
   - Code split route
   - Bundle size audit (next-bundle-analyzer)

4. Target: all metric green di mobile + desktop

Output:
- Optimization report (before/after metric)
- next.config.js updates
- Component-level changes
```

### 3.2 Accessibility Audit (Pre-Launch)

```
Audit WCAG AA compliance untuk semua foundation page.

Tasks:
1. Automated audit: axe-core, Lighthouse a11y
2. Manual audit per page:
   - Keyboard navigation flow
   - Screen reader (NVDA / VoiceOver)
   - Color contrast (Stark plugin)
   - Focus visible
   - Form labels
   - Heading hierarchy
   - Skip to content
   - Alt text

3. Fix issues, prioritize:
   - Critical (block use): missing form label, no skip link, contrast fail
   - High: focus invisible, no alt
   - Medium: aria improvement
   - Low: nice-to-have

Output:
- Accessibility report per page
- Fix commit
- Re-test verification
```

### 3.3 Schema Markup Validation

```
Validate semua JSON-LD schema markup.

Tasks:
1. Per page yang punya schema:
   - Run https://validator.schema.org untuk validate JSON-LD
   - Run Google Rich Results Test untuk applicable types
   - Verify expected schema types present (Organization, Product, Article, FAQPage, BreadcrumbList)

2. Fix issues:
   - Missing required property
   - Wrong type
   - Invalid value format

3. Document schema map (per page → schema types):
   - design/seo/schema-map.md

Output:
- Schema map doc
- Validation script di CI (rejecting PR kalau schema invalid)
```

---

## 4. Iteration Prompts (Post-Launch)

### 4.1 GSC Issue Resolution

```
Resolve Google Search Console issues.

Context:
- GSC reports [N] indexing issue / coverage issue / Core Web Vitals issue
- Issue detail (paste): [...]

Tasks:
1. Diagnose root cause
2. Implement fix
3. Verify via GSC URL inspection tool
4. Submit re-index request

Output:
- Diagnosis explanation
- Fix commit
- Re-index status
```

### 4.2 Conversion Optimization

```
Optimize conversion rate untuk [page name].

Context:
- Current metric: [bounce, CTR, conversion %]
- Hypothesis: [...]

Tasks:
1. Setup A/B test variant (kalau infrastructure ready) atau iterate hypothesis
2. Verify analytic tracking accurate
3. Iterate copy / layout / CTA

Output:
- Variant implementation
- Tracking event setup
- Documentation hypothesis & metric to watch
```

---

## 5. Quick Reference Card

| Page | Spec section | Prompt section here | Priority |
|---|---|---|---|
| / (home) | 3.1 | 2.1 | Week 2 |
| /produk/[slug] | 3.2 | 2.2 | Week 3 |
| /solusi/[segment] | 3.3 | 2.3 | Week 3 |
| /harga | 3.4 | 2.4 | Week 2 |
| /metodologi | 3.5 | 2.5 | Week 2 |
| /demo | 3.6 | 2.6 | Week 2 |
| /blog | 3.7 | 2.7 | Week 3 |
| /panduan/[slug] | 3.8 | 2.7 (same pattern) | Week 3 |
| /kepribadian/[type] | 2.2 | 2.8 | Week 5-6 |
| /karier/[slug] | 2.2 | 2.8 | Week 7-8 |
| /jurusan/[slug] | 2.2 | 2.8 | Week 9-10 |
| /untuk/[vertical] | 2.2 | 2.8 | Week 9-10 |
| /tentang, /kontak, /privacy, /terms | — | 2.9 | Week 1-2 |

---

## 6. Critical Reminders untuk Setiap Prompt

Always include di setiap page-build prompt:

1. **Design tokens consistency**: refer ke `design/design-tokens.json`, jangan hardcode value
2. **REUSE existing component**: check `src/components/ui/` dulu sebelum buat baru
3. **TypeScript strict**: no `any`, explicit type interfaces
4. **Mobile-first**: test viewport 375px sebelum claim done
5. **Accessibility**: WCAG AA compliance per page
6. **SEO**: title + meta + canonical + schema markup mandatory
7. **Bahasa Indonesia natural**: hindari translate dari English literal
8. **Performance**: Next.js Image, lazy load below-fold, no heavy carousel
9. **Side-by-side compare**: screenshot vs Claude Design canvas after build
10. **Validation gate**: `npm run build` pass + `npm run lint` clean sebelum PR

---

**End of Handoff Prompts v1.0.**