# Sekil.id Landing Page — SEO / AEO / GEO Strategy v1.0

**Companion to:** `01_Landingpage_Spec_v1.md`
**Status:** Ready for execution
**Stack constraint:** Free SEO tools only (GSC, Ubersuggest free, manual)

---

## 0. Framing — Three Layers, Not Three Strategies

Many teams treat SEO, AEO, GEO as separate. Pada 2025–2026, they share 80% foundation:

- **SEO** (Search Engine Optimization) — ranking di Google traditional SERP
- **AEO** (Answer Engine Optimization) — surfaced di Perplexity, ChatGPT browse, Claude search, Gemini citations
- **GEO** (Generative Engine Optimization) — quoted di Google AI Overview / SGE generative answers

**Common foundation** (shared 80%):
1. Clear semantic structure (H1/H2/H3 hierarchy)
2. Schema.org markup
3. Factual statements yang quotable
4. Author bylines & credentials (E-E-A-T)
5. Fast loading + good UX
6. Topical authority via internal linking

**AEO/GEO specific layer (20%)**:
- Q&A blocks formatted untuk LLM scraping
- Single-source-of-truth fact statements (no fluff)
- Brand entity consistency (Wikipedia, Wikidata, structured data)
- "Quotability" — sentences that work standalone

---

## 1. Technical SEO Foundation (WAJIB, Week 1)

### 1.1 Indexability

**`robots.txt`** (`/public/robots.txt`):
```
User-agent: *
Allow: /

# Block staging & internal
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow LLM crawlers (AEO/GEO)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://sekil.id/sitemap.xml
Sitemap: https://sekil.id/sitemap-programmatic.xml
```

**Note**: Allowing `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` = explicit consent untuk LLM training data. Ini trade-off:
- **Pro**: konten kita tercitasi di ChatGPT/Claude/Perplexity → AEO win
- **Con**: konten kita jadi training data tanpa kontrol

Untuk Sekil.id positioning (kita MAU disebut sebagai authority), **allow** justified. Tapi tahu trade-offnya.

### 1.2 Sitemap Strategy

Pakai dua sitemap (split untuk monitoring):

**`sitemap.xml`** — foundation pages (auto-generated via `next-sitemap` lib):
- Home, about, methodology, pricing, product detail, solution, blog hub, guide hub

**`sitemap-programmatic.xml`** — programmatic pages:
- /karier/*, /jurusan/*, /kepribadian/*, /untuk/*

Generate via Next.js script post-build. Submit both ke Google Search Console + Bing Webmaster.

**Per-URL metadata**:
```xml
<url>
  <loc>https://sekil.id/produk/career-interest</loc>
  <lastmod>2026-05-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

Priority guide:
- Home: 1.0
- Pillar (produk, solusi, harga, metodologi): 0.8
- Blog/panduan: 0.7
- Programmatic: 0.5

### 1.3 Canonical URLs

Setiap page punya `<link rel="canonical" href="...">`. Critical untuk:
- Avoid duplicate dari `?utm_*` params
- Avoid `www` vs root duplicate
- Avoid trailing slash variants

Implementasi via Next.js `Metadata` API per page:
```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://sekil.id/produk/career-interest',
  },
}
```

### 1.4 Core Web Vitals Targets

Google ranking factor — must pass:

| Metric | Target | Strategy |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Next.js Image, font preload, hero image AVIF/WebP, edge CDN |
| INP (Interaction to Next Paint) | < 200ms | Minimal JS, lazy load below-fold, defer non-critical |
| CLS (Cumulative Layout Shift) | < 0.1 | Reserved space untuk image, font display swap dengan fallback yang sama width |
| TTFB (Time to First Byte) | < 600ms | Vercel edge CDN handles |

Tools (free): PageSpeed Insights, Vercel Analytics, Chrome DevTools Lighthouse, Search Console "Web Vitals" report.

### 1.5 Mobile-First

>70% traffic di Indonesia mobile. Build mobile-first:
- Responsive design (Tailwind breakpoints `sm: md: lg:`)
- Touch target min 44×44px
- No horizontal scroll
- Test di Chrome DevTools device emulator + 1x real device tiap PR

### 1.6 HTTPS & Security Headers

Vercel auto-provision HTTPS. Add security headers via `next.config.js`:
```js
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
  }]
}
```

---

## 2. Schema.org Markup (AEO + GEO Critical)

Schema markup = structured data yang dibaca Google AI Overview + LLM citations. WAJIB.

### 2.1 Site-wide Schema (Layout)

**`Organization`** di semua page (di root layout):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sekil.id",
  "url": "https://sekil.id",
  "logo": "https://sekil.id/logo.png",
  "description": "Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI",
  "foundingDate": "2025",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ID",
    "addressLocality": "Bandung",
    "addressRegion": "Jawa Barat"
  },
  "sameAs": [
    "https://www.linkedin.com/company/sekil-id",
    "https://www.instagram.com/sekil.id"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-xxx",
    "contactType": "sales",
    "email": "sales@sekil.id"
  }
}
```

### 2.2 Page-Type Specific Schema

**Homepage** — tambah `WebSite` + `SearchAction`:
```json
{
  "@type": "WebSite",
  "name": "Sekil.id",
  "url": "https://sekil.id",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://sekil.id/cari?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Product detail** (`/produk/career-interest`) — `Product` + `Offer`:
```json
{
  "@type": "Product",
  "name": "Career Interest",
  "description": "Asesmen minat karier berbasis Holland Code untuk siswa SMA & mahasiswa",
  "brand": { "@type": "Brand", "name": "Sekil.id" },
  "offers": {
    "@type": "Offer",
    "price": "150000",
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31"
  },
  "aggregateRating": {  // hanya jika ada review actual
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

**Methodology page** — `Article` + `ScholarlyArticle` references:
```json
{
  "@type": "Article",
  "headline": "Metodologi Sekil.id: Holland Code, MBTI, dan Papi Kostick",
  "author": {
    "@type": "Person",
    "name": "Dr. [Nama UNJANI Lecturer]",
    "jobTitle": "Dosen Psikologi UNJANI",
    "affiliation": { "@type": "Organization", "name": "Universitas Jenderal Achmad Yani" }
  },
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-16",
  "publisher": { "@type": "Organization", "name": "Sekil.id" },
  "citation": [
    { "@type": "ScholarlyArticle", "name": "Holland's Theory of Vocational Personalities", "author": "Holland, J. L.", "datePublished": "1997" }
  ]
}
```

**FAQ section** (di semua page yang punya FAQ) — `FAQPage`:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Berapa lama mengerjakan asesmen Career Interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Asesmen Career Interest membutuhkan waktu sekitar 10-15 menit untuk diselesaikan."
      }
    }
  ]
}
```

**Breadcrumb** (semua page kecuali home) — `BreadcrumbList`:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://sekil.id" },
    { "@type": "ListItem", "position": 2, "name": "Produk", "item": "https://sekil.id/produk" },
    { "@type": "ListItem", "position": 3, "name": "Career Interest", "item": "https://sekil.id/produk/career-interest" }
  ]
}
```

**Blog/guide post** — `BlogPosting` atau `Article` + author + `wordCount` + `articleSection`.

### 2.3 Implementation

Pakai library `next-seo` atau buat custom `<JsonLd>` component:
```tsx
// components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Tools validation (free): https://validator.schema.org, GSC "Enhancements" tab.

---

## 3. Keyword Strategy (Free Tools Only)

### 3.1 Workflow tanpa Ahrefs/Semrush

**Step 1 — Brainstorm seed keywords** (manual):
- Audience problem statements → keyword extraction
- Misal: "siswa SMA bingung jurusan" → keyword: "tes minat jurusan SMA", "cara pilih jurusan kuliah", "tes kepribadian untuk siswa"

**Step 2 — Expand pakai Google sendiri**:
- Google Autocomplete (mulai ketik, lihat suggestion)
- "People Also Ask" box di SERP
- Related searches di bottom SERP
- Google Trends untuk validasi volume relatif

**Step 3 — Ubersuggest free tier**:
- 3 search/hari free
- Pakai untuk validasi volume estimasi + difficulty score
- Focus: keyword dengan volume 500–5000/bulan + difficulty < 30

**Step 4 — Keyword clustering** (manual via Google Sheet):
- Group keyword by intent (informational / navigational / commercial / transactional)
- Assign 1 cluster = 1 page (avoid kanibal)

**Step 5 — Competitor SERP analysis** (manual):
- Search target keyword di Google incognito
- Note top 10 ranking, pelajari content depth + structure
- Identify content gap = opportunity

### 3.2 Initial Keyword Map (Foundation Pages)

| Page | Primary keyword | Secondary | Intent |
|---|---|---|---|
| / | asesmen psikologi indonesia | tes karier ai, platform psikotes | commercial |
| /produk/career-interest | tes minat karier | career interest test, tes minat kerja | informational + commercial |
| /produk/psyai | tes kepribadian ai | personality test indonesia, mbti ai | commercial |
| /produk/path-finder-ai | tes pemilihan jurusan kuliah | tes minat jurusan sma, tes jurusan online | commercial |
| /produk/leadership-styles-test | tes gaya kepemimpinan | leadership assessment indonesia | commercial |
| /produk/emotional-intelligence-test | tes eq online | emotional intelligence test indonesia | commercial |
| /solusi/untuk-sekolah | asesmen minat bakat sma | psikotes sekolah, tes karier siswa | commercial B2B |
| /solusi/untuk-perusahaan | asesmen karyawan online | psikotes perusahaan, talent assessment | commercial B2B |
| /metodologi | metodologi tes kepribadian | holland code adalah, papi kostick | informational |
| /harga | harga asesmen psikologi | biaya psikotes online | commercial |

### 3.3 Programmatic Keyword Map

**`/karier/[slug]`** — pakai pattern "[karier] cocok untuk siapa" / "cara jadi [karier]":
- "data scientist cocok untuk tipe kepribadian apa"
- "cara jadi marketing analyst"
- "karier business analyst di indonesia"

**`/jurusan/[slug]`** — pakai pattern "jurusan [X] cocok untuk siapa":
- "jurusan psikologi cocok untuk siapa"
- "jurusan teknik informatika untuk introvert"

**`/kepribadian/[type]`** — pakai pattern:
- "kepribadian INTJ karier"
- "tipe INTJ jurusan"
- "INTJ adalah"
- "Holland investigative karier"

---

## 4. On-Page SEO Patterns

### 4.1 Title Tag

Format: `[Primary Keyword] — [Value Prop] | Sekil.id`
- Max 60 char (otherwise truncated di SERP)
- Primary keyword di depan
- Brand di belakang

Examples:
- Home: `Asesmen Psikologi & Pemetaan Karier Indonesia | Sekil.id`
- Product: `Career Interest — Tes Minat Karier Berbasis Holland Code | Sekil.id`
- Blog: `Cara Memilih Jurusan Kuliah Berdasarkan Minat & Kepribadian | Sekil.id`

### 4.2 Meta Description

Format: 1–2 kalimat, contain primary + secondary keyword, ada CTA implisit.
- Max 155 char
- Action-oriented

Examples:
- Home: `Platform asesmen psikologi AI untuk sekolah, kampus, dan perusahaan di Indonesia. Validasi akademik UNJANI. Hasil dalam 10 menit. Jadwalkan demo.`
- Product Career Interest: `Tes minat karier berbasis Holland Code untuk siswa SMA & mahasiswa. Pelajari minat profesional Anda dalam 15 menit. Mulai dari Rp 150.000/peserta.`

### 4.3 H1 / H2 / H3 Hierarchy

**Aturan ketat**:
- Tepat 1 H1 per page (= primary keyword variant)
- H2 untuk section utama (3–7 per page)
- H3 untuk sub-section
- Jangan skip level (H1 → H3 langsung = bad)

### 4.4 Content Structure (Quotable Format — AEO/GEO)

LLM crawler suka content yang:
- **Klaim faktual di awal paragraf** (topic sentence pattern)
- **Numbered/bulleted list** untuk komparasi & step-by-step
- **Tabel** untuk perbandingan
- **Definitive statements** ("X adalah Y", bukan "mungkin X bisa dianggap Y")

Pattern untuk every content section:
```
[H2: Question or Topic]

[Lead sentence: direct factual answer dalam 1-2 kalimat]

[Elaboration paragraph]

[Optional: bulleted list of key points]

[Optional: tabel kalau ada komparasi]
```

Contoh untuk /produk/career-interest:
```markdown
## Apa itu Career Interest Test?

Career Interest adalah asesmen minat karier berbasis Holland Code (RIASEC) 
yang mengidentifikasi 6 tipe minat profesional Anda dalam 15 menit.

Asesmen ini dikembangkan dari teori John Holland (1997) yang membagi 
minat karier menjadi 6 dimensi:

- **Realistic** — pekerjaan praktis, teknik, outdoor
- **Investigative** — pekerjaan analitis, riset, sains
- **Artistic** — pekerjaan kreatif, ekspresif, mandiri
- **Social** — pekerjaan membantu orang, pendidikan, terapi
- **Enterprising** — pekerjaan persuasi, kepemimpinan, bisnis
- **Conventional** — pekerjaan terstruktur, data, administrasi

Hasil tes berupa profil 3-letter Holland code (misal: ISE atau RIA) 
yang menunjukkan dominasi minat Anda.
```

### 4.5 Internal Linking

**Aturan**:
- Setiap page link ke minimum 3 page lain (within site)
- Anchor text descriptive (bukan "klik di sini")
- Hub-spoke pattern: `/metodologi` jadi hub → /produk/* sebagai spoke (linked back)
- Pillar page → cluster page bi-directional

**Template internal link block** (bottom of every content page):
```html
<aside>
  <h3>Pelajari lebih lanjut</h3>
  <ul>
    <li><a href="/metodologi">Metodologi: Holland, MBTI, Papi Kostick</a></li>
    <li><a href="/produk/path-finder-ai">Path Finder AI untuk pemilihan jurusan</a></li>
    <li><a href="/blog/cara-memilih-jurusan-kuliah">Panduan memilih jurusan kuliah</a></li>
  </ul>
</aside>
```

### 4.6 Image SEO

- File name descriptive: `holland-code-riasec-diagram.svg` (bukan `IMG_1234.png`)
- `alt` text descriptive: `alt="Diagram Holland Code RIASEC dengan 6 dimensi minat karier"`
- WebP/AVIF format (Next.js Image otomatis)
- Lazy load below-fold (Next.js Image default)
- Specify `width` + `height` (prevent CLS)

### 4.7 URL Best Practices

- Lowercase, hyphen (bukan underscore)
- Pendek tapi descriptive
- Hindari stop word (tapi OK kalau natural)
- Stable: 301 redirect kalau perlu ganti

---

## 5. AEO — Answer Engine Optimization

**Target engines**: Perplexity, ChatGPT (with browsing), Claude (with search), Gemini, You.com.

### 5.1 Content Format untuk Citation

LLM cite content yang:
- **Standalone sentence**: makna lengkap tanpa konteks paragraf sebelumnya
- **Atribusi jelas**: "Menurut [source], ..." atau "[Fact] (Sekil.id metodologi)"
- **Specific & numerical** kalau memungkinkan: "15 menit" lebih quotable dari "cepat"

### 5.2 Q&A Block Pattern (HIGH PRIORITY)

Tambahkan section "Pertanyaan Umum" di setiap pillar page dengan **FAQPage schema**.

Format Q+A:
```markdown
## Pertanyaan Umum

### Apa itu Holland Code?

Holland Code adalah teori minat karier yang dikembangkan oleh psikolog 
John L. Holland pada 1959 yang mengelompokkan minat profesional menjadi 
6 dimensi: Realistic, Investigative, Artistic, Social, Enterprising, 
dan Conventional (RIASEC).

### Berapa akurat tes Holland Code?

Studi meta-analisis Nauta (2010) menunjukkan Holland Code memiliki 
validitas konkuren yang baik dengan kepuasan dan kinerja karier, dengan 
keterbatasan pada konteks budaya non-Barat yang perlu dikalibrasi lokal.

### Apakah Sekil.id Career Interest sama dengan Holland Code asli?

Sekil.id Career Interest menggunakan instrumen berbasis Holland Code 
yang dikalibrasi untuk konteks Indonesia oleh tim Psikologi UNJANI, 
dengan output 3-letter code dan rekomendasi karier yang dipetakan 
ke pasar tenaga kerja Indonesia.
```

**Pattern checklist**:
- Pertanyaan = bahasa natural user (sesuai search query)
- Jawaban pertama 1-2 kalimat = full answer (LLM ambil bagian ini)
- Detail tambahan di paragraf berikut
- Citation kalau klaim akademik

### 5.3 Entity Consistency (Brand Mention)

LLM bangun "knowledge graph" tentang entitas. Sekil.id harus konsisten di semua mention:

**Canonical brand description** (pakai di setiap "About" section, footer, meta description):
> "Sekil.id adalah platform asesmen psikologi dan pemetaan karier dengan validasi akademik UNJANI. Beroperasi sebagai joint venture Sekil.id × B One Corp untuk melayani pendidikan dan korporasi di Indonesia."

**Use exact same wording** di:
- Homepage about section
- /tentang
- Footer
- Schema.org `Organization.description`
- LinkedIn, Instagram, Twitter bio

### 5.4 External Citation Building (Authority)

Untuk LLM consider Sekil.id "authority", butuh **external mention** dengan brand entity:
- **Wikipedia**: defer (tidak feasible untuk startup baru)
- **Wikidata entry**: feasible — create entry untuk Sekil.id sebagai organization
- **Press release / media coverage**: target 3 media tier (DetikEdu, Kompas Pendidikan, Tempo) untuk launch announcement
- **Guest post / contributor**: UNJANI lecturer write di Medium / academic blogs dengan Sekil.id attribution
- **LinkedIn company page**: aktif posting (LinkedIn high-trust source untuk Google + LLM)
- **Trustpilot / G2** (defer V2 — butuh review actual user)

### 5.5 `llms.txt` File (Emerging Standard)

Beberapa LLM crawler mulai baca `/llms.txt` file untuk site overview:

**`/public/llms.txt`**:
```markdown
# Sekil.id

> Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI. 
> Joint venture Sekil.id × B One Corp untuk pendidikan & korporasi di Indonesia.

## Produk Utama
- [Career Interest](https://sekil.id/produk/career-interest): Tes minat karier Holland Code, 15 menit, Rp 150.000/peserta
- [PsyAI](https://sekil.id/produk/psyai): Tes kepribadian terintegrasi MBTI + Holland, Rp 195.000
- [Path Finder AI](https://sekil.id/produk/path-finder-ai): Rekomendasi jurusan kuliah, Rp 150.000
- [Leadership Styles Test](https://sekil.id/produk/leadership-styles-test): Asesmen gaya kepemimpinan Papi Kostick, Rp 150.000
- [Emotional Intelligence Test](https://sekil.id/produk/emotional-intelligence-test): Tes EQ, Rp 175.000

## Metodologi
Asesmen Sekil.id dibangun di atas 3 instrumen tervalidasi:
- Holland Code (RIASEC) — minat karier
- MBTI-style typing — dimensi kepribadian
- Papi Kostick — gaya kerja

Validasi akademik oleh Fakultas Psikologi UNJANI.

## Audience
- Sekolah Menengah Atas (SMA/SMK)
- Perguruan Tinggi (PT)  
- Perusahaan & Korporasi
- Yayasan pendidikan multi-unit

## Kontak
Email: hello@sekil.id
Website: https://sekil.id
```

Optional `/llms-full.txt` untuk LLM yang minta deeper context.

---

## 6. GEO — Generative Engine Optimization (Google AI Overview)

Google AI Overview (SGE) cite content yang:

### 6.1 Direct Answer Format

Google AI prefer content yang langsung jawab pertanyaan tanpa "warm-up paragraph".

**Bad pattern**:
> "Sebelum membahas Holland Code, mari kita pahami dulu sejarah teori minat karier. Pada akhir 1950an, psikolog Amerika mulai meneliti..."

**Good pattern**:
> "Holland Code adalah teori minat karier yang dikembangkan psikolog John L. Holland pada 1959, mengelompokkan minat menjadi 6 dimensi RIASEC. Teori ini..."

### 6.2 Comparative & List Format

Google AI Overview suka highlight:
- Numbered list dengan step
- Komparasi tabel
- "Top N" structure
- Definition box (pendek + jelas)

Pattern untuk product/comparison page:
```markdown
## Perbedaan Career Interest vs PsyAI

| Aspek | Career Interest | PsyAI |
|---|---|---|
| Instrumen | Holland Code | Holland + MBTI |
| Durasi | 15 menit | 25 menit |
| Output | 3-letter RIASEC + rekomendasi karier | RIASEC + 16-type MBTI + comprehensive profile |
| Cocok untuk | Siswa SMA, mahasiswa | Mahasiswa lanjut, profesional |
| Harga | Rp 150.000 | Rp 195.000 |
```

### 6.3 Source Authority Signals

Google AI Overview prioritize source yang:
- Author byline dengan credential
- Date published + last updated
- Citation (academic papers)
- HTTPS + clean URL
- Schema markup lengkap

**Author bio template** (di setiap blog/guide page bottom):
```markdown
---
**Tentang Penulis**

[Foto] **Dr. [Nama], M.Psi., Psikolog**  
Dosen Fakultas Psikologi UNJANI. Reviewer akademik Sekil.id untuk metodologi 
asesmen. Spesialisasi: psikologi industri & organisasi.

[LinkedIn] [Email] [ORCID kalau ada]
```

---

## 7. Local SEO (Indonesia-Specific)

### 7.1 NAP Consistency

NAP = Name, Address, Phone. Harus konsisten di:
- Footer setiap page
- /kontak page
- Schema.org Organization
- Google Business Profile (set up — free)
- Social media bio

### 7.2 Google Business Profile

Setup GBP untuk:
- Bandung office (jika ada)
- Service: "Layanan asesmen psikologi & pemetaan karier"
- Category: "Karier konsultan" + "Pendidikan profesional"
- Photo: kantor, tim, logo
- Posts: weekly update (review, blog, event)

### 7.3 Bahasa Indonesia Optimization

- `<html lang="id">` di setiap page
- Konten Bahasa Indonesia natural (bukan translate Google dari English)
- Local idiom & istilah (gunakan "perguruan tinggi" bukan "universitas" kalau audience lebih luas, "psikotes" sering dicari)

### 7.4 Indonesia-Specific Search Behavior

- **WhatsApp di CTA**: orang Indonesia lebih nyaman chat daripada email — add "Chat WhatsApp" CTA di hero
- **Mobile-first betul**: prioritas thumb-zone CTA
- **Pricing dalam IDR** (jangan USD)
- **Testimonial form**: foto + jabatan + institusi (high trust signal di Indonesia)

---

## 8. Content Velocity & Update Cadence

### 8.1 Publishing Cadence (Post-Launch)

| Content type | Cadence | Volume target month 3 | Volume target month 6 |
|---|---|---|---|
| Blog post | 2/minggu | 24 | 50 |
| Pillar guide | 1/bulan | 3 | 6 |
| Programmatic karier | 5/minggu | 60 | (cap di ~80) |
| Programmatic jurusan | 5/minggu | 25 | (cap di ~30) |
| Update existing | 1/minggu | 12 | 24 |

### 8.2 Content Refresh Strategy

Google AI Overview & Perplexity prioritize **recent content**. Strategy:
- Update `dateModified` setiap revisi minor (perbaikan typo, fakta)
- Major refresh per quarter: cek top 20 page, identifikasi yang ranking drop, refresh content
- Republish dengan new date + intro: "Updated [date] dengan data terbaru..."

### 8.3 Decay Monitoring

Setiap bulan via GSC:
- Lihat top 20 query, cek CTR drop
- Page yang impressions tinggi tapi CTR <3% → revise title/meta
- Page yang impressions drop > 30% MoM → content audit

---

## 9. Off-Page SEO (Authority Building)

Free strategy (no paid links):

### 9.1 Earn Backlinks via:
- **Content yang shareable**: data study, original research (UNJANI bisa publish survey kepribadian mahasiswa Indonesia → backlink magnet)
- **Guest post**: kontributor di DailySocial, Kompas, Hipwee Karier
- **HARO (Help A Reporter Out) Indonesia equivalent**: Qoala Insight, Selasar
- **Directory submission**: psikologi.org, asosiasi HR Indonesia
- **Partnership content**: co-publish whitepaper dengan UNJANI, share to UNJANI website

### 9.2 Social Signal
- LinkedIn (B2B audience): weekly post + thought leadership
- Instagram (B2C audience): infographic + carousel
- TikTok (defer V2 — high effort)
- YouTube (defer V2 — high effort, tapi high-impact untuk YMYL)

### 9.3 PR Strategy untuk Launch
- Press release ke 5 media tier
- Founder interview di podcast (cari podcast pendidikan/karier Indonesia)
- Speaker engagement: konferensi pendidikan, HR

---

## 10. Measurement & Reporting

### 10.1 Weekly Dashboard (GSC + GA4)

| Metric | Source | Target Week 4 | Target Month 3 | Target Month 6 |
|---|---|---|---|---|
| Indexed pages | GSC | 30+ | 80+ | 120+ |
| Organic impressions | GSC | 1,000 | 20,000 | 100,000 |
| Organic clicks | GSC | 50 | 1,000 | 5,000 |
| Avg CTR | GSC | 3% | 4% | 5% |
| Avg position top keywords | GSC | <50 | <20 | <10 |
| Demo form submits | GA4 | 5 | 30 | 100 |
| Waitlist signups | GA4 | 50 | 500 | 2000 |

### 10.2 Monthly Review

- Top 10 ranking keyword
- New keyword opportunities (impressions tapi belum optimize)
- Content gap (competitor rank, kita belum)
- Technical issues (404, slow page, indexing issue)
- Schema markup errors

### 10.3 Quarterly Strategic Review

- Cluster analysis (which topic cluster grow most)
- Persona funnel performance (B2B vs B2C signal)
- Content ROI: rank x traffic x conversion per content piece
- Update content roadmap

---

## 11. Anti-Patterns to Avoid

1. **Keyword stuffing**: "tes kepribadian, tes kepribadian online, tes kepribadian gratis" — sounds spam, hurt UX & ranking
2. **Thin programmatic content**: <500 word page = Google penalty risk. Setiap page minimum 800 kata unique
3. **Duplicate H1 antar page**: kanibal SERP
4. **Auto-generated meta description**: write manual untuk top 30 page, programmatic untuk sisanya tapi tetap unique
5. **Footer link bloat**: jangan 50 link di footer dengan kata kunci stuffing
6. **Hidden text** atau **white-on-white**: instant Google penalty
7. **Cloaking** (different content untuk crawler vs user): instant penalty
8. **Spam guest post / link farm**: defer SEMUA "guest post offer" yang tidak relevant
9. **Click-bait title**: ranking turun karena bounce rate naik
10. **No mobile testing**: Indonesia mobile-heavy, mobile-broken = ranking dead

---

## 12. 90-Day Execution Plan

### Days 1–30: Foundation
- Week 1: tech setup (Vercel, GSC, GA4, schema basics, sitemap)
- Week 2-3: foundation pages live (home, produk, solusi, metodologi, harga, demo)
- Week 4: 5 blog posts + 2 pillar guides + schema validation

### Days 31–60: Programmatic Tier 1
- Week 5-6: /kepribadian/* (22 pages — MBTI + Holland)
- Week 7-8: /karier/* (start 15 pages priority)

### Days 61–90: Programmatic Tier 2 + Optimization
- Week 9-10: /karier/* (15 remaining) + /jurusan/* (start 15)
- Week 11-12: optimize: GSC review, internal link audit, schema refinement, A/B test top 3 page

### Days 90+: Sustain
- 2 blog/minggu cadence
- 1 programmatic/minggu (cap reached)
- Monthly content refresh
- Quarterly strategic review

---

**End of SEO/AEO/GEO Strategy v1.0.**