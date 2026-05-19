/**
 * migrate-to-sanity.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * One-shot migration: imports existing MDX blog posts + authors from the
 * content/ directory into Sanity CMS.
 *
 * Prerequisites
 * ─────────────
 * 1. Create a Sanity API token with **Editor** (write) access:
 *    Sanity Manage → your project → API → Tokens → Add API token
 *    Set role: "Editor"
 *
 * 2. Export the token:
 *    set SANITY_API_WRITE_TOKEN=sk...yourtoken...
 *
 * 3. Run:
 *    node scripts/migrate-to-sanity.mjs
 *
 * The script is idempotent — running it twice creates duplicate docs. To
 * re-run safely, delete the documents in Sanity Studio first.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')

// ── Sanity client ──────────────────────────────────────────────────────────

const writeToken = process.env.SANITY_API_WRITE_TOKEN
if (!writeToken) {
  console.error(
    '❌  SANITY_API_WRITE_TOKEN is not set.\n' +
      '   Create an Editor token at https://sanity.io/manage and set it:\n' +
      '   set SANITY_API_WRITE_TOKEN=sk...',
  )
  process.exit(1)
}

const client = createClient({
  projectId: '2p33r6a9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: writeToken,
  useCdn: false,
})

// ── Frontmatter parser (no external dep) ──────────────────────────────────

/**
 * Minimal YAML frontmatter extractor.
 * Handles: strings, numbers, booleans, null, simple arrays, simple objects.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match) return { data: {}, content: raw }

  const [, yaml, content] = match

  // Very simple YAML → JS object parser (handles what we need)
  function parseValue(v) {
    const t = v.trim()
    if (t === 'null' || t === '~') return null
    if (t === 'true') return true
    if (t === 'false') return false
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t)
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      return t.slice(1, -1)
    }
    return t
  }

  function parseBlock(lines, baseIndent = 0) {
    const obj = {}
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      const indent = line.match(/^(\s*)/)[1].length
      if (indent < baseIndent) break

      const keyMatch = line.match(/^(\s*)(\w[\w\s-]*):\s*(.*)$/)
      if (!keyMatch) { i++; continue }

      const [, , key, rawVal] = keyMatch

      // Block scalar (|-) or array-style list
      if (rawVal === '' || rawVal === '|' || rawVal === '>') {
        // Peek ahead for array items or nested object
        const children = []
        i++
        while (i < lines.length) {
          const next = lines[i]
          const nextIndent = next.match(/^(\s*)/)[1].length
          if (nextIndent <= indent && next.trim() !== '') break
          children.push(next)
          i++
        }
        // Array of scalar
        if (children.every((l) => l.trim().startsWith('- '))) {
          obj[key] = children
            .map((l) => l.trim().slice(2).trim())
            .filter(Boolean)
            .map(parseValue)
        } else if (children.every((l) => l.match(/^\s+\w[\w\s-]*:\s*.+$/))) {
          // Nested object
          obj[key] = parseBlock(children, indent + 2)
        } else if (children.every((l) => l.match(/^\s{4,}(question|answer|q|a|label|value|sub|text|url|year):/))) {
          // Array of objects (FAQ / pillars / citations)
          const items = []
          let item = {}
          for (const l of children) {
            const m = l.match(/^\s*(question|answer|q|a|label|value|sub|text|url|year):\s*(.*)$/)
            if (m) item[m[1]] = parseValue(m[2])
          }
          if (Object.keys(item).length) items.push(item)
          obj[key] = items
        } else {
          obj[key] = children.map((l) => l.trim()).join('\n').trim() || null
        }
        continue
      }

      // Inline array: [a, b, c]
      if (rawVal.startsWith('[')) {
        try {
          obj[key] = JSON.parse(rawVal)
        } catch {
          obj[key] = rawVal
            .replace(/[\[\]]/g, '')
            .split(',')
            .map((s) => parseValue(s.trim()))
        }
        i++
        continue
      }

      obj[key] = parseValue(rawVal)
      i++
    }
    return obj
  }

  const data = parseBlock(yaml.split('\n'), 0)
  return { data, content }
}

// ── Markdown → Portable Text converter ────────────────────────────────────

let _blockCounter = 0
function blockKey(prefix = 'block') {
  return `${prefix}${(++_blockCounter).toString(36).padStart(4, '0')}`
}

/**
 * Parse inline markdown: bold, em, links, inline code → Portable Text spans.
 */
function parseInline(text) {
  if (!text) return []

  const spans = []
  // Tokenize inline patterns
  const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g
  let last = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > last) {
      spans.push({ _type: 'span', _key: blockKey('span'), text: text.slice(last, match.index), marks: [] })
    }

    if (match[1]) {
      // **bold**
      spans.push({ _type: 'span', _key: blockKey('span'), text: match[2], marks: ['strong'] })
    } else if (match[3]) {
      // *em*
      spans.push({ _type: 'span', _key: blockKey('span'), text: match[4], marks: ['em'] })
    } else if (match[5]) {
      // `code`
      spans.push({ _type: 'span', _key: blockKey('span'), text: match[6], marks: ['code'] })
    } else if (match[7]) {
      // [text](url)
      const markKey = blockKey('link')
      spans.push({
        _type: 'span',
        _key: blockKey('span'),
        text: match[8],
        marks: [markKey],
      })
      // markDefs need to be attached to the block — handled at block level
      spans._pendingLink = spans._pendingLink || []
      spans._pendingLink.push({ _key: markKey, _type: 'link', href: match[9] })
    }

    last = match.index + match[0].length
  }

  // Remaining text
  if (last < text.length) {
    spans.push({ _type: 'span', _key: blockKey('span'), text: text.slice(last), marks: [] })
  }

  return spans
}

/**
 * Convert markdown string to Portable Text block array.
 * Handles: headings, paragraphs, lists, blockquotes, hr.
 */
function markdownToPortableText(md) {
  if (!md || !md.trim()) return []

  const lines = md.split('\n')
  const blocks = []
  let i = 0

  function flushParagraph(text) {
    if (!text.trim()) return
    const spans = parseInline(text.trim())
    const markDefs = []
    if (spans._pendingLink) {
      markDefs.push(...spans._pendingLink)
      delete spans._pendingLink
    }
    blocks.push({
      _type: 'block',
      _key: blockKey(),
      style: 'normal',
      children: spans,
      markDefs,
    })
  }

  while (i < lines.length) {
    const line = lines[i]

    // Skip horizontal rules
    if (/^[-*_]{3,}\s*$/.test(line.trim())) { i++; continue }

    // Headings
    const h2 = line.match(/^## (.+)$/)
    const h3 = line.match(/^### (.+)$/)
    const h4 = line.match(/^#### (.+)$/)

    if (h2 || h3 || h4) {
      const level = h4 ? 'h4' : h3 ? 'h3' : 'h2'
      const text = (h4 || h3 || h2)[1]
      const spans = parseInline(text)
      blocks.push({
        _type: 'block',
        _key: blockKey(),
        style: level,
        children: spans,
        markDefs: spans._pendingLink || [],
      })
      if (spans._pendingLink) delete spans._pendingLink
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const text = line.slice(2)
      const spans = parseInline(text)
      blocks.push({
        _type: 'block',
        _key: blockKey(),
        style: 'blockquote',
        children: spans,
        markDefs: spans._pendingLink || [],
      })
      if (spans._pendingLink) delete spans._pendingLink
      i++
      continue
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      const items = []
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        const spans = parseInline(lines[i].slice(2).trim())
        items.push({
          _type: 'block',
          _key: blockKey(),
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: spans,
          markDefs: spans._pendingLink || [],
        })
        if (spans._pendingLink) delete spans._pendingLink
        i++
      }
      blocks.push(...items)
      continue
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const text = lines[i].replace(/^\d+\. /, '')
        const spans = parseInline(text)
        items.push({
          _type: 'block',
          _key: blockKey(),
          style: 'normal',
          listItem: 'number',
          level: 1,
          children: spans,
          markDefs: spans._pendingLink || [],
        })
        if (spans._pendingLink) delete spans._pendingLink
        i++
      }
      blocks.push(...items)
      continue
    }

    // Empty line — paragraph break
    if (line.trim() === '') { i++; continue }

    // Paragraph: collect consecutive non-empty, non-heading lines
    const paragraphLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].startsWith('#### ') &&
      !/^[-*_]{3,}\s*$/.test(lines[i].trim()) &&
      !/^[-*+] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith('> ')
    ) {
      paragraphLines.push(lines[i])
      i++
    }
    if (paragraphLines.length) {
      flushParagraph(paragraphLines.join(' '))
    }
  }

  return blocks
}

// ── Read content files ─────────────────────────────────────────────────────

function readMdx(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(raw)
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Migration functions ────────────────────────────────────────────────────

async function migrateAuthors() {
  const authorDir = path.join(CONTENT_DIR, 'authors')
  if (!fs.existsSync(authorDir)) return {}

  const files = fs.readdirSync(authorDir).filter((f) => f.endsWith('.mdx'))
  const slugToId = {}

  for (const file of files) {
    const slug = file.replace('.mdx', '')
    const { data, content } = readMdx(path.join(authorDir, file))

    const doc = {
      _id: `author-${slug}`,
      _type: 'author',
      name: data.name ?? slug,
      slug: { _type: 'slug', current: slug },
      credential: data.credential ?? null,
      role: data.role ?? 'author',
      affiliation: data.affiliation ?? null,
      linkedin: data.linkedin ?? null,
      orcid: data.orcid ?? null,
      isAcademicReviewer: data.isAcademicReviewer ?? false,
      bio: markdownToPortableText(content),
    }

    console.log(`📝 Author: ${doc.name} (${slug})`)
    await client.createOrReplace(doc)
    slugToId[slug] = doc._id
    console.log(`   ✓ Created/updated author doc: author-${slug}`)
  }

  return slugToId
}

async function migrateBlogPosts(authorSlugToId) {
  const blogDir = path.join(CONTENT_DIR, 'blog')
  if (!fs.existsSync(blogDir)) return

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const slug = file.replace('.mdx', '')
    const { data, content } = readMdx(path.join(blogDir, file))

    const authorId = data.author ? authorSlugToId[data.author] : null

    const doc = {
      _id: `post-${slug}`,
      _type: 'post',
      title: data.title ?? slug,
      slug: { _type: 'slug', current: slug },
      description: data.description ?? '',
      status: data.status ?? 'published',
      publishedAt: data.publishedAt ?? new Date().toISOString().slice(0, 10),
      modifiedAt: data.modifiedAt ?? null,
      category: data.category ?? 'Panduan',
      tags: data.tags ?? [],
      featured: data.featured ?? false,
      authorCredential: data.authorCredential ?? null,
      body: markdownToPortableText(content),
      ...(authorId
        ? { author: { _type: 'reference', _ref: authorId } }
        : {}),
      // SEO
      ...(data.seo
        ? {
            seo: {
              metaTitle: data.seo.metaTitle ?? null,
              metaDescription: data.seo.metaDescription ?? null,
              focusKeyword: data.seo.focusKeyword ?? null,
              canonical: data.seo.canonical ?? null,
              robots: data.seo.robots ?? 'index, follow',
            },
          }
        : {}),
      // AEO
      ...(data.aeo
        ? {
            aeo: {
              quotableSummary: data.aeo.quotableSummary ?? null,
              faq: (data.aeo.faq ?? []).map((f) => ({
                _key: blockKey('faq'),
                question: f.question ?? '',
                answer: f.answer ?? '',
              })),
              citations: (data.aeo.citations ?? []).filter(Boolean).map((c) => ({
                _key: blockKey('cite'),
                text: typeof c === 'string' ? c : c.text ?? '',
                url: typeof c === 'string' ? null : c.url ?? null,
              })),
              entityTags: data.aeo.entityTags ?? [],
            },
          }
        : {}),
      // GEO
      ...(data.geo
        ? {
            geo: {
              tldr: data.geo.tldr ?? null,
              contentType: data.geo.contentType ?? null,
              readingLevel: data.geo.readingLevel ?? null,
              keyTakeaways: data.geo.keyTakeaways ?? [],
            },
          }
        : {}),
    }

    console.log(`\n📝 Post: ${doc.title}`)
    console.log(`   slug: ${slug}, category: ${doc.category}, body blocks: ${doc.body.length}`)
    await client.createOrReplace(doc)
    console.log(`   ✓ Created/updated post doc: post-${slug}`)
  }
}

// migratePricingPage: kept for backward compat — delegates to seedPricingPage below
// (pricing.yaml was removed when Keystatic was uninstalled; data now lives in code)

// ── Seed: Navigation singleton ────────────────────────────────────────────

async function seedNavigation() {
  const doc = {
    _id: 'navigation',
    _type: 'navigation',
    headerItems: [
      { _key: blockKey('nav'), label: 'Produk', href: '/produk', isExternal: false },
      { _key: blockKey('nav'), label: 'Solusi', href: '/solusi', isExternal: false },
      { _key: blockKey('nav'), label: 'Harga', href: '/harga', isExternal: false },
      { _key: blockKey('nav'), label: 'Metodologi', href: '/metodologi', isExternal: false },
      { _key: blockKey('nav'), label: 'Blog', href: '/blog', isExternal: false },
    ],
    ctaLabel: 'Mulai asesmen',
    ctaHref: '/demo',
  }

  console.log('\n📝 Navigation singleton')
  await client.createOrReplace(doc)
  console.log('   ✓ Created/updated navigation singleton')
}

// ── Seed: Site Settings singleton ─────────────────────────────────────────

async function seedSiteSettings() {
  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Sekil.id',
    siteDescription:
      'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI. AI-powered, hasil dalam 10 menit. Dipakai sekolah, kampus, dan perusahaan.',
    socialLinks: {
      instagram: 'https://instagram.com/sekil.id',
      linkedin: 'https://linkedin.com/company/sekil-id',
    },
    announcement: {
      enabled: false,
      message: '',
      linkLabel: '',
      linkHref: '',
      variant: 'info',
    },
  }

  console.log('\n📝 Site Settings singleton')
  await client.createOrReplace(doc)
  console.log('   ✓ Created/updated siteSettings singleton')
}

// ── Seed: Pricing Page singleton (full data) ──────────────────────────────

async function seedPricingPage() {
  const doc = {
    _id: 'pricingPage',
    _type: 'pricingPage',

    // Hero
    heroEyebrow: 'HARGA TRANSPARAN · DISKON VOLUME',
    heroHeading: 'Harga yang sesuai dengan skala Anda',
    heroSubheading:
      'Mulai dari Rp 150.000 per peserta untuk individu. Dapatkan diskon hingga 50% untuk pembelian institusional. Tidak ada biaya setup, tidak ada biaya tersembunyi.',
    heroPillars: [
      { _key: blockKey('pillar'), label: 'Harga mulai dari', value: 'Rp 150.000', sub: 'per peserta' },
      { _key: blockKey('pillar'), label: 'Diskon volume', value: 'Hingga 50%', sub: 'untuk 50.000+ seat' },
      { _key: blockKey('pillar'), label: 'Bundle hemat', value: '–7% hingga –17%', sub: 'paket multi-produk' },
    ],

    // Products & volume tiers
    products: [
      { _key: blockKey('prod'), slug: 'career-interest', name: 'Career Interest', duration: '15 menit', price: 150000 },
      { _key: blockKey('prod'), slug: 'psyai', name: 'PsyAI', duration: '25 menit', price: 195000 },
      { _key: blockKey('prod'), slug: 'path-finder-ai', name: 'Path Finder AI', duration: '20 menit', price: 150000 },
      { _key: blockKey('prod'), slug: 'leadership-styles-test', name: 'Leadership Styles Test', duration: '20 menit', price: 150000 },
      { _key: blockKey('prod'), slug: 'emotional-intelligence-test', name: 'Emotional Intelligence Test', duration: '20 menit', price: 175000 },
    ],
    volumeTiers: [
      { _key: blockKey('tier'), minSeats: 0, discountRate: 0, label: '1–499' },
      { _key: blockKey('tier'), minSeats: 500, discountRate: 0.15, label: '500–1.999' },
      { _key: blockKey('tier'), minSeats: 2000, discountRate: 0.25, label: '2.000–9.999' },
      { _key: blockKey('tier'), minSeats: 10000, discountRate: 0.35, label: '10.000–49.999' },
      { _key: blockKey('tier'), minSeats: 50000, discountRate: 0.5, label: '50.000+' },
    ],

    // Bundles
    bundles: [
      {
        _key: blockKey('bundle'),
        bundleId: 'career-starter',
        name: 'Career Starter',
        tagline: 'Eksplorasi awal minat karier dan pilihan jurusan kuliah',
        productSlugs: ['career-interest', 'path-finder-ai'],
        bundlePrice: 250000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'corporate-leadership',
        name: 'Corporate Leadership',
        tagline: 'Kepemimpinan dan kecerdasan emosional untuk manajer dan HR',
        productSlugs: ['leadership-styles-test', 'emotional-intelligence-test', 'psyai'],
        bundlePrice: 470000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'comprehensive-personality',
        name: 'Comprehensive Personality',
        tagline: 'Profil kepribadian lengkap lintas instrumen Holland, MBTI, dan Papi',
        productSlugs: ['psyai', 'career-interest', 'emotional-intelligence-test'],
        bundlePrice: 450000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'self-awareness',
        name: 'Self Awareness',
        tagline: 'Kenali diri lebih dalam dengan 4 instrumen terintegrasi',
        productSlugs: [],
        bundlePrice: 0,
        comingSoon: true,
      },
    ],

    // FAQ
    faq: [
      {
        _key: blockKey('faq'),
        q: 'Bagaimana sistem pembayaran untuk institusi?',
        a: 'Institusi dapat melakukan pembelian seat secara bulk via transfer bank (BCA, Mandiri, BNI) atau kartu kredit. Setelah pembayaran dikonfirmasi, seat akan aktif dan link tes dapat didistribusikan ke peserta. Untuk pembelian 500+ seat, tersedia opsi invoice dan pembayaran Net-30.',
      },
      {
        _key: blockKey('faq'),
        q: 'Apakah seat yang dibeli ada masa berlakunya?',
        a: 'Ya. Seat berlaku selama 12 bulan sejak tanggal pembelian. Seat yang belum digunakan tidak dapat di-refund setelah masa berlaku berakhir. Kami merekomendasikan membeli sesuai kebutuhan aktual dan melakukan top-up jika diperlukan.',
      },
      {
        _key: blockKey('faq'),
        q: 'Apakah diskon volume berlaku per produk atau per total peserta?',
        a: 'Diskon berlaku per-asesmen per-seat. Jika Anda membeli 1.000 seat untuk Career Interest dan 500 seat untuk PsyAI, masing-masing mendapatkan diskon berdasarkan jumlah seat produk tersebut.',
      },
      {
        _key: blockKey('faq'),
        q: 'Apakah ada uji coba gratis untuk institusi?',
        a: 'Kami menyediakan demo produk dan penjelasan metodologi untuk pengambil keputusan institusi — bukan akses tes gratis untuk peserta. Untuk pilot program dengan 50 seat atau lebih, hubungi tim kami untuk mendiskusikan kemungkinan harga pilot.',
      },
      {
        _key: blockKey('faq'),
        q: 'Bagaimana jika saya ingin produk yang berbeda untuk kelompok peserta yang berbeda?',
        a: 'Tidak ada masalah. Anda bisa membeli seat untuk beberapa produk secara bersamaan atau terpisah. Setiap pembelian produk dihitung diskon volumenya secara independen.',
      },
    ],

    // ATC Dashboard add-on
    atcDashboard: {
      price: 'Rp 30 juta',
      priceUnit: '/tahun',
      features: [
        'Pantau status asesmen seluruh karyawan dalam satu dashboard',
        'Analisis distribusi profil kepribadian dan EQ per departemen',
        'Ekspor data ke HRIS (CSV, JSON, Webhook)',
        'Laporan agregat untuk kebutuhan audit dan talent review',
        'Dedicated account manager dan SLA 99.5% uptime',
        'Integrasi SSO dan LDAP/Active Directory',
      ],
    },

    // CTA
    ctaHeading: 'Siap memulai?',
    ctaSubheading:
      'Jadwalkan demo 30 menit dan lihat bagaimana Sekil.id membantu institusi Anda.',
  }

  console.log('\n📝 Pricing page (seeded from code defaults)')
  await client.createOrReplace(doc)
  console.log('   ✓ Created/updated pricingPage singleton')
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Sekil.id → Sanity Migration & Seed')
  console.log('   Project: 2p33r6a9 | Dataset: production\n')

  // 1. Authors
  console.log('─── AUTHORS ───────────────────────────────────────────────')
  const authorSlugToId = await migrateAuthors()
  console.log(`   Total: ${Object.keys(authorSlugToId).length} authors\n`)

  // 2. Blog posts
  console.log('─── BLOG POSTS ────────────────────────────────────────────')
  await migrateBlogPosts(authorSlugToId)

  // 3. Singletons: navigation, site settings, pricing page
  console.log('\n─── SINGLETONS ────────────────────────────────────────────')
  await seedNavigation()
  await seedSiteSettings()
  await seedPricingPage()

  console.log('\n✅  Migration & seed complete!')
  console.log('\nNext steps:')
  console.log('  1. Open Sanity Studio at /cms to review all seeded content')
  console.log('  2. Add cover images to posts if needed')
  console.log('  3. Set up the ISR webhook in Sanity dashboard:')
  console.log('     URL: https://sekil.id/api/revalidate')
  console.log('     Secret: (value of SANITY_REVALIDATE_SECRET env var)')
  console.log('  4. Add CORS origins in Sanity dashboard:')
  console.log('     https://sekil.id and http://localhost:3000 (with credentials)')
  console.log('  5. Set NEXT_PUBLIC_SITE_URL=https://sekil.id in Vercel env vars')
  console.log('     then redeploy to fix Presentation tool "Unable to connect"')
}

main().catch((err) => {
  console.error('\n❌  Migration failed:', err.message)
  process.exit(1)
})
