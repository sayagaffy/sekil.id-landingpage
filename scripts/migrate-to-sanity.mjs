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

// ── Seed: Product documents ───────────────────────────────────────────────

async function seedProducts() {
  const products = [
    {
      _id: 'product-career-interest',
      order: 0,
      slug: 'career-interest',
      name: 'Career Interest',
      nameDisplay: 'Career Interest — Peta Minat Karier',
      tagline: 'Petakan minat karier dengan Holland Code RIASEC',
      description:
        'Tes minat karier menggunakan Holland Code (RIASEC) untuk siswa SMA dan mahasiswa. Dapatkan 3-letter Holland Code dan rekomendasi karier yang sesuai dengan profil minat Anda dalam 15 menit.',
      longDescription:
        'Career Interest menggunakan kerangka Holland Code (RIASEC) yang telah divalidasi akademik selama 60+ tahun untuk memetakan minat vokasional Anda. Dalam 15 menit, Anda mendapatkan 3-letter code yang mencerminkan kombinasi unik minat Anda, beserta rekomendasi karier dan jurusan yang paling sesuai dengan profil tersebut — semuanya dikalibrasi untuk konteks pasar kerja Indonesia menggunakan data LinkedIn 2025.',
      duration: '15 menit',
      price: 150000,
      targetPersonas: ['siswa-sma', 'mahasiswa'],
      instruments: ['holland'],
      outputs: [
        '3-letter Holland Code (RIASEC) unik Anda dengan breakdown persentase 6 dimensi',
        'Top 10 rekomendasi karier yang match dengan profil minat',
        'Rekomendasi 5 jurusan kuliah yang paling relevan',
        'Deskripsi lingkungan kerja yang paling cocok untuk tipe kepribadian vokasional Anda',
        'Narasi kepribadian karier yang dipersonalisasi (500+ kata)',
        'Laporan PDF 10+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan Career Interest Anda mencakup: breakdown visual enam dimensi RIASEC dalam format spider chart, narasi kepribadian vokasional yang dipersonalisasi, tabel 10 karier yang paling match dengan tingkat kecocokan dan proyeksi pertumbuhan industri hingga 2030, serta rekomendasi 5 jurusan kuliah dengan alasan spesifik mengapa jurusan tersebut sesuai dengan profil Anda.',
      bundleSuggestions: ['psyai', 'path-finder-ai'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa itu Holland Code (RIASEC)?', a: 'Holland Code adalah kerangka pemetaan minat vokasional yang dikembangkan psikolog John L. Holland (1959). Enam dimensi RIASEC — Realistic, Investigative, Artistic, Social, Enterprising, Conventional — mencerminkan tipe minat dan lingkungan kerja yang sesuai. Kombinasi 3 dimensi tertinggi Anda menjadi "code" unik yang memandu eksplorasi karier.' },
        { _key: blockKey('faq'), q: 'Berapa lama tes Career Interest berlangsung?', a: '15 menit. Tes terdiri dari serangkaian pertanyaan preferensi aktivitas yang ringkas dan dapat diselesaikan dalam satu sesi di laptop atau smartphone. Tidak ada jawaban benar atau salah — yang penting Anda menjawab jujur sesuai preferensi asli Anda.' },
        { _key: blockKey('faq'), q: 'Siapa yang paling cocok mengikuti tes ini?', a: 'Career Interest dirancang untuk siswa SMA kelas 10–12 yang sedang merencanakan pilihan jurusan kuliah, dan mahasiswa yang ingin memvalidasi arah karier mereka.' },
        { _key: blockKey('faq'), q: 'Apakah hasil Holland Code bisa berubah seiring waktu?', a: 'Ya. Minat vokasional dapat berevolusi seiring pengalaman, pendidikan, dan perkembangan diri. Sebaiknya Anda re-take tes setiap 2–3 tahun atau setelah transisi besar.' },
        { _key: blockKey('faq'), q: 'Apakah laporan tersedia dalam Bahasa Indonesia?', a: 'Ya, seluruh laporan Career Interest ditulis dalam Bahasa Indonesia native — bukan terjemahan literal dari versi bahasa Inggris.' },
      ],
      seoTitle: 'Tes Minat Karier Holland Code RIASEC | Career Interest Sekil.id',
      seoDescription: 'Temukan minat karier Anda dengan tes Holland Code RIASEC yang tervalidasi akademik. 15 menit, dapatkan rekomendasi karier dan jurusan untuk konteks Indonesia.',
      primaryKeyword: 'tes minat karier',
    },
    {
      _id: 'product-psyai',
      order: 1,
      slug: 'psyai',
      name: 'PsyAI',
      nameDisplay: 'PsyAI — Profil Kepribadian Terintegrasi',
      tagline: 'Asesmen kepribadian terintegrasi Holland Code dan MBTI dengan narrative AI',
      description:
        'PsyAI menggabungkan Holland Code dan MBTI dalam satu asesmen kepribadian terintegrasi 25 menit. Dapatkan profil kepribadian komprehensif dengan narasi yang dipersonalisasi AI dan action plan pengembangan diri.',
      longDescription:
        'PsyAI adalah asesmen kepribadian paling komprehensif di Sekil.id. Dengan menggabungkan Holland Code (minat vokasional) dan MBTI-style typing (preferensi kepribadian), PsyAI menghasilkan satu profil kohesif yang menjelaskan bukan hanya apa yang Anda minati, tapi bagaimana cara Anda bekerja, berkomunikasi, dan berkembang.',
      duration: '25 menit',
      price: 195000,
      targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
      instruments: ['holland', 'mbti'],
      outputs: [
        'Profil Holland Code (RIASEC) 3-letter code dengan breakdown 6 dimensi',
        'Tipe MBTI-style Anda (salah satu dari 16 tipe kepribadian)',
        'Narasi kepribadian terintegrasi Holland × MBTI yang dipersonalisasi AI',
        'Matriks minat × kepribadian untuk pemetaan karier yang lebih presisi',
        'Action plan pengembangan diri berbasis profil (5 area prioritas)',
        'Panduan wawancara berbasis kepribadian untuk persiapan karier',
        'Laporan PDF 15+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan PsyAI menggabungkan Holland Code dan MBTI dalam satu narasi kohesif 20+ halaman. Anda mendapatkan: matriks kepribadian × minat yang menjelaskan mengapa kombinasi tipe MBTI dan code Holland Anda cenderung gravitate ke lingkungan kerja tertentu, action plan pengembangan diri berbasis profil, dan panduan karier dengan rekomendasi spesifik untuk konteks Indonesia.',
      bundleSuggestions: ['career-interest', 'leadership-styles-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa yang membedakan PsyAI dari tes kepribadian biasa?', a: 'PsyAI menggabungkan dua instrumen — Holland Code untuk minat vokasional dan MBTI-style typing untuk preferensi kepribadian — dalam satu laporan terintegrasi.' },
        { _key: blockKey('faq'), q: 'Apakah AI yang menginterpretasikan hasil kepribadian saya?', a: 'Tidak. AI menghasilkan narasi dari template yang dirancang dan divalidasi oleh tim psikolog. AI tidak membuat penilaian klinis atau diagnostik.' },
        { _key: blockKey('faq'), q: 'Berapa lama proses tes hingga laporan tersedia?', a: '25 menit untuk tes, dan laporan tersedia langsung setelah tes selesai.' },
        { _key: blockKey('faq'), q: 'Bisakah laporan PsyAI digunakan untuk proses seleksi karyawan?', a: 'Tidak disarankan untuk seleksi karyawan. PsyAI dirancang untuk pengembangan diri dan eksplorasi karier, bukan untuk tujuan seleksi.' },
        { _key: blockKey('faq'), q: 'Apa bedanya PsyAI dengan Career Interest?', a: 'Career Interest hanya menggunakan Holland Code dan berfokus pada pemetaan minat vokasional. PsyAI menggabungkan Holland Code + MBTI dan menghasilkan profil kepribadian yang lebih holistik.' },
      ],
      seoTitle: 'Tes Kepribadian AI Terintegrasi Holland dan MBTI | PsyAI Sekil.id',
      seoDescription: 'PsyAI menggabungkan Holland Code dan MBTI dalam satu asesmen kepribadian terintegrasi. Dapatkan profil kepribadian komprehensif dan action plan karier dalam 25 menit.',
      primaryKeyword: 'tes kepribadian ai',
    },
    {
      _id: 'product-path-finder-ai',
      order: 2,
      slug: 'path-finder-ai',
      name: 'Path Finder AI',
      nameDisplay: 'Path Finder AI — Pilih Jurusan Kuliah',
      tagline: 'Pilih jurusan kuliah dengan data, bukan tebakan',
      description:
        'Path Finder AI membantu siswa SMA memilih jurusan kuliah berdasarkan profil minat Holland Code dan kepribadian MBTI. Dapatkan rekomendasi 5 jurusan top match dengan prospek karier dan universitas Indonesia.',
      longDescription:
        'Path Finder AI dirancang khusus untuk siswa SMA yang menghadapi dilema pemilihan jurusan kuliah. Dengan menggabungkan profil minat Holland Code dan preferensi kepribadian MBTI-style, Path Finder AI menyilangkan data tersebut dengan informasi jurusan, prospek karier, dan universitas Indonesia — menghasilkan rekomendasi yang personal dan berbasis data.',
      duration: '20 menit',
      price: 150000,
      targetPersonas: ['siswa-sma'],
      instruments: ['holland', 'mbti'],
      outputs: [
        'Top 5 jurusan kuliah yang paling match dengan profil minat dan kepribadian Anda',
        'Analisis kesesuaian per jurusan: mengapa jurusan ini fit dengan profil Anda',
        'Prospek karier dan median gaji untuk setiap jurusan yang direkomendasikan',
        'Rekomendasi universitas Indonesia yang memiliki program tersebut (negeri & swasta)',
        'Tip persiapan masuk jurusan dan kegiatan pendukung karier',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan Path Finder AI mencakup: ranking 5 jurusan berdasarkan tingkat match dengan profil Anda, analisis satu-halaman per jurusan, serta panduan persiapan masuk dan rekomendasi kegiatan ekstrakurikuler yang mendukung karier di bidang tersebut.',
      bundleSuggestions: ['career-interest', 'psyai'],
      faq: [
        { _key: blockKey('faq'), q: 'Apakah rekomendasi jurusan Path Finder AI 100% akurat?', a: 'Tidak ada tes yang memberikan jaminan akurasi 100%. Hasil bersifat indikatif dan dirancang sebagai titik diskusi, bukan keputusan final.' },
        { _key: blockKey('faq'), q: 'Dari mana data universitas dan jurusan diambil?', a: 'Data jurusan mengacu pada informasi publik Kemendikbudristek, akreditasi BAN-PT, dan LinkedIn Education Insights Indonesia 2025.' },
        { _key: blockKey('faq'), q: 'Path Finder AI cocok untuk siswa kelas berapa?', a: 'Paling optimal untuk siswa kelas 10 (sebelum penjurusan) dan kelas 11-12 yang sedang dalam proses memilih program studi.' },
        { _key: blockKey('faq'), q: 'Apakah Path Finder AI menggantikan konsultasi dengan konselor sekolah?', a: 'Tidak. Path Finder AI adalah alat bantu eksplorasi, bukan pengganti konsultasi profesional.' },
        { _key: blockKey('faq'), q: 'Bagaimana cara mendapatkan laporan setelah tes?', a: 'Laporan tersedia langsung setelah tes selesai dalam format PDF yang bisa diunduh dan dibagikan.' },
      ],
      seoTitle: 'Tes Pemilihan Jurusan Kuliah Berbasis AI | Path Finder AI Sekil.id',
      seoDescription: 'Pilih jurusan kuliah dengan data, bukan tebakan. Path Finder AI menggunakan Holland Code dan MBTI untuk merekomendasikan 5 jurusan terbaik dengan prospek karier Indonesia.',
      primaryKeyword: 'tes pemilihan jurusan kuliah',
    },
    {
      _id: 'product-leadership-styles-test',
      order: 3,
      slug: 'leadership-styles-test',
      name: 'Leadership Styles Test',
      nameDisplay: 'Leadership Styles Test — Gaya Kepemimpinan',
      tagline: 'Identifikasi dan kembangkan gaya kepemimpinan dengan Papi Kostick',
      description:
        'Leadership Styles Test menggunakan Papi Kostick untuk mengidentifikasi 4 gaya kepemimpinan situasional Anda. Dapatkan profil kepemimpinan, matriks strength-blind spot, dan Individual Development Plan dalam 20 menit.',
      longDescription:
        'Leadership Styles Test dirancang untuk karyawan dan manajer yang ingin memahami dan mengembangkan gaya kepemimpinan mereka secara berbasis data. Menggunakan Papi Kostick — instrumen standar industri untuk konteks kerja profesional.',
      duration: '20 menit',
      price: 150000,
      targetPersonas: ['karyawan', 'manager'],
      instruments: ['papi'],
      outputs: [
        'Profil gaya kepemimpinan dominan dari 4 gaya situasional (Direktif, Coaching, Suportif, Delegatif)',
        'Skor 10 dimensi Papi Kostick yang relevan untuk kepemimpinan dalam spider chart',
        'Matriks kekuatan (strength) dan titik buta (blind spot) sebagai pemimpin',
        'Panduan konteks tim dan situasi di mana gaya Anda paling efektif',
        'Individual Development Plan (IDP) dengan 5 area pengembangan prioritas',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan Leadership Styles Test mencakup: profil gaya kepemimpinan dominan dari 4 gaya situasional, skor 10 dimensi Papi Kostick dalam spider chart, matriks kekuatan-blind spot, dan Individual Development Plan (IDP) dengan 5 area pengembangan yang diprioritaskan.',
      bundleSuggestions: ['psyai', 'emotional-intelligence-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa saja 4 gaya kepemimpinan yang diukur?', a: 'Leadership Styles Test mengidentifikasi 4 profil: (1) Direktif, (2) Coaching, (3) Suportif, (4) Delegatif. Setiap gaya efektif dalam konteks dan tingkat kematangan tim yang berbeda.' },
        { _key: blockKey('faq'), q: 'Apakah tes ini cocok untuk semua level jabatan?', a: 'Paling relevan untuk supervisor, manajer lini pertama, manajer menengah, dan calon pemimpin (high-potential employee).' },
        { _key: blockKey('faq'), q: 'Instrumen psikologi apa yang digunakan?', a: 'Leadership Styles Test menggunakan Papi Kostick yang diadaptasi untuk konteks kepemimpinan.' },
        { _key: blockKey('faq'), q: 'Bisakah hasilnya digunakan untuk program leadership development HRD?', a: 'Ya. Laporan mencakup profil gaya kepemimpinan, matriks kekuatan-blind spot, dan IDP yang dapat langsung diintegrasikan ke dalam program People Development.' },
        { _key: blockKey('faq'), q: 'Berapa lama berlakunya hasil tes kepemimpinan?', a: 'Tidak ada batas waktu formal. Kami merekomendasikan re-assessment setiap 12–18 bulan, atau setelah transisi peran yang signifikan.' },
      ],
      seoTitle: 'Tes Gaya Kepemimpinan Papi Kostick | Leadership Styles Test Sekil.id',
      seoDescription: 'Identifikasi gaya kepemimpinan Anda dengan Papi Kostick. Leadership Styles Test menghasilkan profil 4 gaya situasional, matriks strength-blind spot, dan Individual Development Plan.',
      primaryKeyword: 'tes gaya kepemimpinan',
    },
    {
      _id: 'product-emotional-intelligence-test',
      order: 4,
      slug: 'emotional-intelligence-test',
      name: 'Emotional Intelligence Test',
      nameDisplay: 'EQ Test — Kecerdasan Emosional',
      tagline: 'Ukur dan kembangkan Emotional Intelligence untuk karier dan kehidupan',
      description:
        'EQ Test Sekil.id mengukur 4 dimensi kecerdasan emosional (EQ) menggunakan Papi Kostick yang diadaptasi. Dapatkan skor EQ, analisis per dimensi, dan development tips yang dapat langsung diterapkan dalam 20 menit.',
      longDescription:
        'Emotional Intelligence Test mengukur empat dimensi kecerdasan emosional yang paling kritis untuk kesuksesan profesional: Self-Awareness, Self-Regulation, Empathy, dan Social Skills.',
      duration: '20 menit',
      price: 175000,
      targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
      instruments: ['papi'],
      outputs: [
        'Skor 4 dimensi EQ: Self-Awareness, Self-Regulation, Empathy, Social Skills (skala 100)',
        'Profil EQ keseluruhan dengan perbandingan terhadap norma responden Indonesia',
        'Analisis mendalam per dimensi dengan contoh perilaku konkret',
        'Identifikasi dimensi EQ terkuat dan yang paling perlu dikembangkan',
        '12 development tips praktis (3 per dimensi) yang dapat langsung diterapkan',
        'Rencana pengembangan EQ 6 bulan yang terstruktur',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan EQ Test mencakup: skor 4 dimensi EQ dalam skala 100 dengan visualisasi radar, profil EQ keseluruhan dengan perbandingan terhadap norma Indonesia, analisis mendalam per dimensi, 12 development tips praktis, dan rencana pengembangan EQ 6 bulan.',
      bundleSuggestions: ['leadership-styles-test', 'psyai'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa itu Emotional Intelligence (EQ) dan mengapa penting?', a: 'Emotional Intelligence (EQ) adalah kemampuan mengenali, memahami, dan mengelola emosi — baik emosi diri sendiri maupun orang lain. Riset menunjukkan EQ berkontribusi signifikan terhadap keberhasilan profesional.' },
        { _key: blockKey('faq'), q: 'Apa 4 dimensi EQ yang diukur?', a: 'EQ Test mengukur: (1) Self-Awareness, (2) Self-Regulation, (3) Empathy, (4) Social Skills.' },
        { _key: blockKey('faq'), q: 'Apakah EQ saya bisa meningkat setelah tes?', a: 'Ya. Berbeda dengan IQ yang relatif stabil, EQ sangat responsif terhadap pembelajaran dan latihan. Peningkatan EQ yang terukur biasanya membutuhkan 3–6 bulan praktik yang konsisten.' },
        { _key: blockKey('faq'), q: 'Apakah instrumen EQ Test ini sudah divalidasi?', a: 'EQ Test Sekil.id menggunakan Papi Kostick yang diadaptasi untuk mengukur dimensi-dimensi kecerdasan emosional dalam konteks kerja. Adaptasi dilakukan oleh tim Fakultas Psikologi UNJANI.' },
        { _key: blockKey('faq'), q: 'Apa bedanya EQ Test Sekil.id dengan tes EQ lain yang beredar online?', a: 'EQ Test Sekil.id dibangun di atas Papi Kostick yang digunakan dalam konteks profesional selama 50+ tahun, diadaptasi oleh psikolog UNJANI, dan menghasilkan laporan dalam Bahasa Indonesia native.' },
      ],
      seoTitle: 'Tes EQ Online Kecerdasan Emosional Tervalidasi | Sekil.id',
      seoDescription: 'Ukur 4 dimensi Emotional Intelligence (EQ) dengan tes tervalidasi Papi Kostick. Dapatkan skor EQ, analisis mendalam, dan rencana pengembangan dalam 20 menit.',
      primaryKeyword: 'tes eq online',
    },
  ]

  for (const p of products) {
    const doc = {
      _id: p._id,
      _type: 'product',
      order: p.order,
      slug: { _type: 'slug', current: p.slug },
      name: p.name,
      nameDisplay: p.nameDisplay,
      tagline: p.tagline,
      description: p.description,
      longDescription: p.longDescription,
      duration: p.duration,
      price: p.price,
      targetPersonas: p.targetPersonas,
      instruments: p.instruments,
      outputs: p.outputs,
      sampleReportTeaser: p.sampleReportTeaser,
      bundleSuggestions: p.bundleSuggestions,
      faq: p.faq,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      primaryKeyword: p.primaryKeyword,
    }
    console.log(`   • ${p.order}. ${p.name} (${p.slug})`)
    await client.createOrReplace(doc)
  }

  console.log('   ✓ 5 product documents seeded')
}

// ── Seed: About Page singleton ────────────────────────────────────────────

async function seedAboutPage() {
  const doc = {
    _id: 'aboutPage',
    _type: 'aboutPage',

    // Hero
    heroEyebrow: 'TENTANG SEKIL.ID',
    heroHeading: 'Memetakan Potensi Indonesia dengan Sains, Bukan Tebakan',
    heroSubheading:
      'Sekil.id adalah joint venture Sekil.id × B One Corp untuk membawa asesmen psikologi tervalidasi ke setiap sekolah, kampus, dan perusahaan di Indonesia.',

    // Cerita Kami
    storyEyebrow: 'CERITA KAMI',
    storyHeading: 'Mengapa Sekil.id ada?',
    storyParagraphs: [
      'Setiap tahun, ratusan ribu siswa Indonesia memilih jurusan kuliah berdasarkan tekanan teman sebaya, ekspektasi orang tua, atau sekadar tren. Hasilnya: angka mismatch jurusan yang tinggi, mahasiswa yang tidak termotivasi, dan tenaga kerja yang tidak sesuai dengan potensi aslinya. Di sisi korporasi, keputusan rekrutmen dan pengembangan talent masih didominasi intuisi subjektif — bukan data yang dapat dipertanggungjawabkan.',
      'Asesmen psikologi impor yang ada sering kali mahal, tidak dikalibrasi untuk konteks budaya Indonesia, dan laporan yang dihasilkan sulit dipahami tanpa pendampingan psikolog. Sekil.id hadir sebagai solusi: partnership antara Sekil.id dan B One Corp, didukung validasi akademik dari Fakultas Psikologi Universitas Jenderal Achmad Yani (UNJANI) — menghasilkan asesmen psikologi tervalidasi, terjangkau, dan relevan untuk konteks Indonesia.',
      'Visi kami adalah mendemokratisasi asesmen psikologi: menjadikan keputusan karier dan pengembangan talent berbasis data yang akurat dan dapat diakses oleh siapa pun — mulai dari siswa di sekolah negeri hingga manajer di perusahaan multinasional. Bukan tebakan. Bukan intuisi. Sains.',
    ],

    // Tiga Pilar
    pillarsEyebrow: 'TIGA PILAR SEKIL.ID',
    pillarsHeading: 'Dibangun di atas tiga fondasi',
    pillars: [
      {
        _key: blockKey('pillar'),
        _type: 'pillar',
        label: 'Akademik',
        partner: 'UNJANI',
        description: 'Fakultas Psikologi UNJANI memvalidasi metodologi, item bank, dan content. Setiap instrumen dan konten programatik disetujui dosen psikologi tersertifikasi sebelum dipublikasikan.',
        accentColor: 'peach',
      },
      {
        _key: blockKey('pillar'),
        _type: 'pillar',
        label: 'Teknologi',
        partner: 'Sekil.id',
        description: 'AI-powered scoring dan narrative generation. Dibangun di atas Next.js dan AI stack modern. Dashboard analytics multi-tenant yang dapat dikelola institusi secara mandiri.',
        accentColor: 'blue',
      },
      {
        _key: blockKey('pillar'),
        _type: 'pillar',
        label: 'Distribusi',
        partner: 'B One Corp',
        description: '10+ tahun pengalaman sertifikasi profesional di Indonesia. Sales force enterprise dan jaringan training partner di seluruh kepulauan — yang sudah terbukti dan dipercaya institusi.',
        accentColor: 'navy',
      },
    ],

    // Tim
    teamEyebrow: 'TIM',
    teamHeading: 'Tim Inti',
    teamNote: 'Profil lengkap tim akan dipublikasikan bertahap setelah masing-masing anggota menyetujui penggunaan informasi.',
    team: [
      { _key: blockKey('team'), _type: 'teamMember', name: '[Founder Name]', role: 'Founder & CEO', bio: 'Memimpin visi dan strategi Sekil.id dari nol hingga launch.' },
      { _key: blockKey('team'), _type: 'teamMember', name: '[CTO Name]', role: 'Co-Founder & CTO', bio: 'Bertanggung jawab atas arsitektur platform dan AI stack.' },
      { _key: blockKey('team'), _type: 'teamMember', name: '[Head of Product Name]', role: 'Head of Product', bio: 'Merancang pengalaman asesmen yang berpusat pada pengguna.' },
      { _key: blockKey('team'), _type: 'teamMember', name: '[B One Liaison]', role: 'B One Corp Partner', bio: 'Jembatan antara jaringan distribusi B One dan Sekil.id.' },
      { _key: blockKey('team'), _type: 'teamMember', name: '[UNJANI Academic Lead]', role: 'Academic Lead, UNJANI', bio: 'Dosen Fakultas Psikologi UNJANI, pengawas validasi akademik semua instrumen.' },
      { _key: blockKey('team'), _type: 'teamMember', name: '[Sales Lead]', role: 'Head of Sales', bio: 'Membangun pipeline institusional dari sekolah hingga korporasi.' },
    ],

    // Milestones
    milestonesEyebrow: 'PERJALANAN',
    milestonesHeading: 'Milestone kami',
    milestones: [
      { _key: blockKey('ms'), _type: 'milestone', period: '2024 Q4', event: 'JV Sekil.id × B One Corp signed', description: 'Perjanjian joint venture resmi ditandatangani antara Sekil.id dan B One Corp.' },
      { _key: blockKey('ms'), _type: 'milestone', period: '2025 Q1', event: 'UNJANI onboard sebagai mitra akademik', description: 'Fakultas Psikologi UNJANI resmi bergabung sebagai mitra validasi akademik instrumen.' },
      { _key: blockKey('ms'), _type: 'milestone', period: '2025 Q3', event: 'Pilot dengan 3 design partner', description: 'Pilot program bersama Yayasan Pengusaha Pendidikan Jabar, Muhammadiyah, dan Metranet.' },
      { _key: blockKey('ms'), _type: 'milestone', period: '2026 Q2', event: 'Platform v1.0 live', description: 'sekil.id resmi diluncurkan ke publik dengan 5 produk asesmen tervalidasi.' },
    ],

    // CTA
    ctaHeading: 'Mau diskusi langsung dengan tim?',
    ctaSubheading: 'Kami terbuka untuk kemitraan baru, kolaborasi akademik, dan pertanyaan dari media. Respons dalam 1 hari kerja.',
    ctaCTAPrimary: { label: 'Jadwalkan Demo →', href: '/demo' },
    ctaCTASecondary: { label: 'Kontak Lain', href: '/kontak' },
  }

  console.log('\n📝 About Page singleton')
  await client.createOrReplace(doc)
  console.log('   ✓ Created/updated aboutPage singleton')
}

// ── Seed: Home Page singleton ─────────────────────────────────────────────

async function seedHomePage() {
  const doc = {
    _id: 'homePage',
    _type: 'homePage',

    // Hero
    heroEyebrow: 'SEKIL.ID · ASESMEN AI',
    heroHeading: 'Pahami diri Anda.',
    heroHeadingAccent: 'Tanpa tebakan.',
    heroSubheading:
      'Sekil.id memetakan minat, kekuatan, dan potensi Anda dengan tiga AI khusus — PsyAI, Path Finder AI, dan Goal Align AI. Hasil yang bisa Anda jelaskan ke orang tua, ke wali kelas, ke diri sendiri.',
    heroCTAPrimary: { label: 'Mulai asesmen →', href: '/demo' },
    heroCTASecondary: { label: 'Lihat metodologi', href: '/metodologi' },
    heroMeta: [
      { _key: blockKey('meta'), val: '+62,000', label: 'SISWA' },
      { _key: blockKey('meta'), val: '340', label: 'SEKOLAH' },
      { _key: blockKey('meta'), val: '18', label: 'PROVINSI' },
      { _key: blockKey('meta'), val: 'v2.1', label: 'PSYAI' },
    ],

    // Products
    productsEyebrow: 'TIGA AI · SATU PERJALANAN',
    productsHeading: 'Setiap orang punya jalurnya sendiri.',
    products: [
      {
        _key: blockKey('prod'),
        _type: 'productCard',
        tag: 'PSYAI',
        iconName: 'brain',
        title: 'Asesmen psikologi adaptif.',
        body: '18 dimensi kepribadian, minat, dan kekuatan. Dipetakan oleh AI dalam 12 menit.',
        meta: ['12 MIN', '18 DIMENSI', 'EVIDENCE-LED'],
        variant: 'default',
        href: '/produk/psyai',
      },
      {
        _key: blockKey('prod'),
        _type: 'productCard',
        tag: 'PATH FINDER AI',
        iconName: 'compass',
        title: 'Temukan jalur jurusan & profesi.',
        body: '248 jurusan dan 1,400+ profesi dipetakan ke profil minat & kekuatan Anda.',
        meta: ['248 JURUSAN', '1,400+ PROFESI'],
        variant: 'peach',
        href: '/produk/path-finder-ai',
      },
      {
        _key: blockKey('prod'),
        _type: 'productCard',
        tag: 'GOAL ALIGN AI',
        iconName: 'target',
        title: 'Selaraskan tujuan personal & karier.',
        body: 'Untuk profesional dan institusi yang ingin memantau perkembangan tim.',
        meta: ['BETA · v0.4'],
        variant: 'navy',
        href: '/produk/goal-align-ai',
      },
    ],

    // Stats
    statsEyebrow: 'DALAM ANGKA · 2026',
    statsHeading: 'Hasil yang dapat dijelaskan.\nBukan tebakan.',
    stats: [
      { _key: blockKey('stat'), _type: 'stat', label: 'Siswa terverifikasi', value: '62,400', unit: '+', featured: false },
      { _key: blockKey('stat'), _type: 'stat', label: 'Sekolah mitra', value: '340', unit: '', featured: false },
      { _key: blockKey('stat'), _type: 'stat', label: 'Akurasi PsyAI', value: '94', unit: '%', featured: true },
      { _key: blockKey('stat'), _type: 'stat', label: 'Durasi rata-rata', value: '11', unit: ' min', featured: false },
    ],

    // CTA
    ctaEyebrow: 'MULAI HARI INI',
    ctaHeading: '12 menit untuk arah karier yang lebih jelas.',
    ctaSubheading:
      'Mulai dengan PsyAI. Hasil langsung tersambung ke Path Finder dan Goal Align — tanpa pengulangan, tanpa tebakan.',
    ctaCTAPrimary: { label: 'Mulai asesmen →', href: '/demo' },
    ctaCTASecondary: { label: 'Jadwalkan demo', href: '/demo' },

    // FAQ
    faqHeading: 'Pertanyaan yang sering diajukan.',
    faq: [
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Apa itu Sekil.id?', a: 'Sekil.id adalah platform asesmen psikologi dan pemetaan karier berbasis AI dengan validasi akademik dari Fakultas Psikologi UNJANI. Kami membantu sekolah, kampus, dan perusahaan memahami potensi individu secara ilmiah dan akurat.' },
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Berapa lama waktu asesmen?', a: 'Tergantung produk yang dipilih: PsyAI (12 menit), Path Finder AI (15 menit), Goal Align AI (20 menit). Hasil tersedia langsung setelah asesmen selesai.' },
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Apakah hasil asesmen tervalidasi ilmiah?', a: 'Ya. Semua instrumen divalidasi oleh Fakultas Psikologi UNJANI menggunakan standar psikometri internasional (validitas & reliabilitas). Ini bukan sekadar kuis — ini asesmen psikologi yang sesungguhnya.' },
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Bagaimana cara mulai untuk institusi?', a: 'Jadwalkan demo gratis dengan tim kami. Kami menjelaskan paket yang sesuai, menunjukkan contoh laporan, dan membantu setup. Onboarding biasanya 1–3 hari kerja.' },
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Apakah data peserta aman?', a: 'Data disimpan di server terenkripsi. Kami mematuhi UU Perlindungan Data Pribadi (UU 27/2022). Data peserta tidak dibagikan ke pihak ketiga tanpa izin institusi.' },
    ],
  }

  console.log('\n📝 Home Page singleton')
  await client.createOrReplace(doc)
  console.log('   ✓ Created/updated homePage singleton')
}

// ── Seed: Solution Segments ───────────────────────────────────────────────

async function seedSolutionSegments() {
  const segments = [
    {
      _id: 'segment-untuk-sekolah',
      order: 0,
      slug: 'untuk-sekolah',
      name: 'Untuk Sekolah',
      eyebrow: 'SOLUSI · SEKOLAH & SMA',
      headline: 'Bimbingan karier berbasis data untuk siswa SMA',
      subheadline:
        'Bantu siswa memilih jurusan kuliah dengan percaya diri — bukan tebakan. Asesmen minat karier tervalidasi akademik dalam satu platform yang mudah dikelola tim BK.',
      heroAccent: 'peach',
      problems: [
        'Siswa memilih jurusan berdasarkan tekanan teman sebaya atau orang tua, bukan minat asli mereka',
        'Guru BK kelebihan beban — 1 guru untuk ratusan siswa — tidak ada waktu untuk konseling individual yang bermakna',
        'Tidak ada data objektif untuk mendukung rekomendasi karier: semua berbasis kesan dan wawancara singkat',
        'Banyak siswa baru menyadari jurusan yang dipilih tidak sesuai minat setelah masuk kuliah',
      ],
      useCases: [
        { title: 'Bimbingan Konseling Massal', description: 'Jalankan asesmen minat karier untuk seluruh siswa kelas 10–12 sekaligus. Guru BK mendapat ringkasan profil per kelas tanpa harus membaca laporan satu per satu.' },
        { title: 'Pra-UTBK & Pilihan Prodi', description: 'Bantu siswa kelas 12 yang sedang menyusun pilihan prodi SNBP/SNBT dengan data minat yang objektif. Kurangi risiko salah pilih prodi.' },
        { title: 'Program Kemandirian Belajar', description: 'Integrasikan asesmen ke dalam program kemandirian belajar atau ekstrakurikuler BK. Laporan PDF mandiri langsung diterima siswa — tanpa sesi tambahan dari guru.' },
        { title: 'Laporan Profil Kelas', description: 'Dapatkan agregat profil minat per kelas: distribusi Holland Code, dominansi tipe MBTI, dan tren karier yang diminati untuk perencanaan program sekolah.' },
      ],
      // career-interest, path-finder-ai, psyai
      recommendedProductIds: ['product-career-interest', 'product-path-finder-ai', 'product-psyai'],
      stats: [
        { value: '15 menit', label: 'Waktu pengerjaan per siswa' },
        { value: 'Rp 150k', label: 'Mulai dari per siswa' },
        { value: '3 instrumen', label: 'Tervalidasi akademik UNJANI' },
        { value: 'PDF instan', label: 'Laporan diterima siswa langsung' },
      ],
      testimonial: {
        quote: 'Sebelumnya saya harus mewawancarai 200+ siswa satu per satu. Sekarang saya sudah punya data objektif sebelum sesi konseling — waktu diskusi jadi jauh lebih produktif.',
        author: 'Ibu Ratna',
        role: 'Guru BK',
        institution: 'SMAN 3 Bandung',
      },
      faq: [
        { q: 'Berapa minimum jumlah siswa untuk paket institusional?', a: 'Tidak ada minimum. Anda bisa mulai dari 1 siswa dengan harga reguler. Diskon volume mulai berlaku dari 500 seat ke atas — semakin banyak, semakin hemat hingga 50% untuk 50.000+ seat.' },
        { q: 'Apakah guru BK mendapat dashboard terpisah untuk memantau siswa?', a: 'Ya. Paket institusional mencakup akses ke dashboard guru BK yang menampilkan status asesmen dan distribusi hasil per kelas. Hubungi tim Sekil.id untuk demo dashboard.' },
        { q: 'Bagaimana cara siswa mengakses tes?', a: 'Setelah institusi melakukan pembelian, siswa menerima link tes unik melalui email. Tes dapat dikerjakan dari laptop atau smartphone — tidak memerlukan instalasi aplikasi.' },
        { q: 'Apakah ada pelatihan untuk guru BK?', a: 'Kami menyediakan webinar onboarding gratis untuk koordinator BK dan panduan interpretasi laporan. Untuk paket 1.000+ seat, kami bisa menjadwalkan pelatihan tatap muka.' },
      ],
      showATCDashboard: false,
      seoTitle: 'Asesmen Karier Massal untuk Sekolah & SMA | Solusi Sekil.id',
      seoDescription: 'Bantu siswa SMA memilih jurusan kuliah berdasarkan data minat karier. Platform asesmen massal untuk guru BK dengan dashboard sekolah dan laporan individual otomatis.',
    },
    {
      _id: 'segment-untuk-perguruan-tinggi',
      order: 1,
      slug: 'untuk-perguruan-tinggi',
      name: 'Untuk Perguruan Tinggi',
      eyebrow: 'SOLUSI · UNIVERSITAS & POLITEKNIK',
      headline: 'Asesmen karier mahasiswa yang memperkuat layanan kemahasiswaan',
      subheadline:
        'Dari orientasi mahasiswa baru hingga persiapan wisuda: satu platform asesmen terintegrasi yang membantu pusat karier memberikan bimbingan berbasis data.',
      heroAccent: 'blue',
      problems: [
        'Pusat karier tidak memiliki data kepribadian mahasiswa yang cukup untuk memberikan bimbingan yang tepat sasaran',
        'Mahasiswa tidak tahu kekuatan dan arah karier mereka — berakhir melamar pekerjaan secara membabi buta',
        'Tidak ada instrumen standar yang konsisten digunakan di seluruh angkatan dan program studi',
        'Data asesmen tersebar di berbagai sistem atau bahkan tidak terdokumentasi secara digital',
      ],
      useCases: [
        { title: 'Orientasi Mahasiswa Baru', description: 'Jadikan asesmen kepribadian bagian dari PKKMB atau orientasi jurusan. Mahasiswa baru langsung memiliki peta awal kekuatan dan minat mereka sejak hari pertama.' },
        { title: 'Program Magang & Karier', description: 'Integrasikan asesmen ke dalam program magang: mahasiswa menyertakan profil kepribadian dalam berkas lamaran, membantu mitra industri mencocokkan posisi yang sesuai.' },
        { title: 'Konseling Pusat Karier', description: 'Konselor pusat karier dapat membaca laporan asesmen sebelum sesi tatap muka — menghemat waktu dan membuat diskusi lebih substansial dan terarah.' },
        { title: 'Tracer Study Berbasis Data', description: 'Korelasikan profil kepribadian alumni dengan jalur karier mereka untuk memperkuat program tracer study dan narasi employability program studi.' },
      ],
      // psyai, career-interest, emotional-intelligence-test
      recommendedProductIds: ['product-psyai', 'product-career-interest', 'product-emotional-intelligence-test'],
      stats: [
        { value: '25 menit', label: 'Waktu asesmen terlengkap' },
        { value: 'Rp 150k–195k', label: 'Per mahasiswa' },
        { value: 'API-ready', label: 'Integrasi SIAKAD tersedia' },
        { value: 'BAN-PT', label: 'Mendukung poin akreditasi kemahasiswaan' },
      ],
      testimonial: {
        quote: 'Pusat karier kami akhirnya punya data yang bisa dibicarakan dengan mahasiswa, bukan hanya kesan subjektif. Program magang kami jadi lebih tepat sasaran setelah mengintegrasikan Sekil.id.',
        author: 'Dr. Hendra',
        role: 'Kepala Pusat Karier',
        institution: 'Universitas Swasta Nasional Jakarta',
      },
      faq: [
        { q: 'Apakah Sekil.id bisa diintegrasikan dengan sistem SIAKAD kampus?', a: 'Ya. Kami menyediakan API dan Webhook untuk integrasi dengan sistem informasi akademik. Mahasiswa bisa masuk menggunakan SSO institusi. Hubungi tim teknis kami untuk dokumentasi API.' },
        { q: 'Apakah laporan bisa diakses ulang oleh mahasiswa setelah lulus?', a: 'Laporan tersimpan dalam akun mahasiswa dan dapat diakses kapanpun. Institusi dapat mengatur retensi data sesuai kebijakan masing-masing.' },
        { q: 'Apakah asesmen ini bisa digunakan sebagai kredit mata kuliah pengembangan diri?', a: 'Bergantung pada kebijakan program studi masing-masing. Laporan asesmen dapat dijadikan portofolio pengembangan diri. Beberapa universitas mitra telah mengintegrasikan ini ke dalam kurikulum mata kuliah soft skills.' },
        { q: 'Bagaimana privasi data mahasiswa dikelola?', a: 'Data mahasiswa disimpan di server Indonesia dengan enkripsi at-rest dan in-transit. Institusi tetap menjadi controller data. Kami mematuhi UU PDP Indonesia dan menyediakan DPA untuk perguruan tinggi.' },
      ],
      showATCDashboard: false,
      seoTitle: 'Platform Asesmen Karier Mahasiswa untuk Universitas | Solusi Sekil.id',
      seoDescription: 'Tingkatkan layanan pusat karier universitas dengan asesmen kepribadian tervalidasi. Dari orientasi mahasiswa baru hingga program magang berbasis data profil.',
    },
    {
      _id: 'segment-untuk-perusahaan',
      order: 2,
      slug: 'untuk-perusahaan',
      name: 'Untuk Perusahaan',
      eyebrow: 'SOLUSI · KORPORAT & HR',
      headline: 'Asesmen psikologi karyawan yang dapat dipercaya HRD',
      subheadline:
        'Dari rekrutmen hingga pengembangan kepemimpinan: data kepribadian dan kecerdasan emosional yang akurat untuk keputusan talent management yang lebih baik.',
      heroAccent: 'navy',
      problems: [
        'Keputusan rekrutmen dan promosi masih terlalu bergantung pada intuisi — bukan data yang dapat dipertanggungjawabkan',
        'Biaya mismatch budaya dan jabatan sangat tinggi: rekrutmen ulang menghabiskan 50–200% gaji tahunan posisi tersebut',
        'Program leadership development tidak efisien karena tidak berbasis profil aktual peserta',
        'HR tidak punya benchmark kepribadian dan EQ yang konsisten lintas departemen dan angkatan',
      ],
      useCases: [
        { title: 'Pre-Employment Assessment', description: 'Tambahkan profil kepribadian dan EQ ke dalam proses seleksi sebagai data pendukung keputusan — bukan pengganti wawancara, tapi filter berbasis data yang dapat dipertanggungjawabkan.' },
        { title: 'Leadership Development Program', description: 'Gunakan Leadership Styles Test dan EQ Test sebagai baseline untuk program pengembangan manajer. IDP berbasis profil aktual, bukan asumsi trainer.' },
        { title: 'Team Profiling & Building', description: 'Petakan profil kepribadian seluruh tim untuk memahami komposisi, dinamika, dan potensi blind spot kolektif. Berguna sebelum merger tim atau restrukturisasi.' },
        { title: 'Talent Review & Succession', description: 'Sertakan data asesmen dalam proses talent review tahunan. Identifikasi high-potential berdasarkan kombinasi kinerja dan profil kepemimpinan.' },
      ],
      // leadership-styles-test, emotional-intelligence-test, psyai
      recommendedProductIds: ['product-leadership-styles-test', 'product-emotional-intelligence-test', 'product-psyai'],
      stats: [
        { value: '20 menit', label: 'Per sesi asesmen karyawan' },
        { value: 'ISO 27001', label: 'Standar keamanan data' },
        { value: 'Rp 30 juta', label: 'ATC Dashboard/tahun (opsional)' },
        { value: 'HRIS API', label: 'Integrasi sistem HR tersedia' },
      ],
      testimonial: {
        quote: 'Kami menggunakan Sekil.id untuk pre-employment screening di level manajerial. Data EQ dan leadership profile membantu tim HR punya talking point yang objektif dalam panel wawancara.',
        author: 'Budi Santoso',
        role: 'Head of Talent Acquisition',
        institution: 'Perusahaan Manufaktur Nasional',
      },
      faq: [
        { q: 'Apakah asesmen ini bisa digunakan sebagai satu-satunya alat seleksi karyawan?', a: 'Tidak kami rekomendasikan. Asesmen Sekil.id adalah data pendukung — bukan pengganti wawancara, uji kompetensi teknis, atau keputusan manusia. Gunakan sebagai satu lapisan dari proses seleksi yang komprehensif.' },
        { q: 'Apakah kandidat bisa memalsukan hasil asesmen?', a: 'Instrumen kami menggunakan teknik forced-choice dan consistency check untuk mendeteksi social desirability bias. Kami merekomendasikan komunikasikan kepada kandidat bahwa tes ini untuk pengembangan — hasilnya akan lebih jujur.' },
        { q: 'Apakah ada ATC Dashboard untuk memantau seluruh karyawan?', a: 'Ya. Kami menyediakan ATC (Assessment Tracking Center) Dashboard seharga Rp 30 juta/tahun — platform terintegrasi untuk memantau status asesmen, menganalisis distribusi profil, dan mengekspor data ke HRIS.' },
        { q: 'Bagaimana SLA dan dukungan teknis untuk enterprise?', a: 'Paket enterprise mencakup dedicated account manager, SLA 99.5% uptime, dan dukungan teknis prioritas. Kami juga menyediakan onboarding tatap muka untuk tim HR dan IT.' },
      ],
      showATCDashboard: true,
      seoTitle: 'Asesmen Psikologi Karyawan untuk Perusahaan & HRD | Solusi Sekil.id',
      seoDescription: 'Platform asesmen psikologi korporat: leadership development, EQ assessment, dan talent profiling tervalidasi akademik. Integrasi HRIS dan ATC Dashboard tersedia.',
    },
    {
      _id: 'segment-untuk-yayasan',
      order: 3,
      slug: 'untuk-yayasan',
      name: 'Untuk Yayasan',
      eyebrow: 'SOLUSI · YAYASAN & LEMBAGA SOSIAL',
      headline: 'Asesmen karier bersubsidi untuk program sosial dan beasiswa',
      subheadline:
        'Bantu penerima manfaat yayasan Anda menemukan arah karier dengan asesmen tervalidasi akademik — dengan harga institusional dan dukungan implementasi yang fleksibel.',
      heroAccent: 'ink',
      problems: [
        'Penerima beasiswa atau program pemberdayaan sering tidak memiliki akses ke bimbingan karier yang berkualitas',
        'Yayasan sulit mengukur dampak program pengembangan SDM secara objektif dan terstandar',
        'Asesmen karier berkualitas biasanya terlalu mahal untuk diskalakan di program sosial dengan anggaran terbatas',
        'Tidak ada cara yang mudah untuk mendokumentasikan profil penerima manfaat secara sistematis',
      ],
      useCases: [
        { title: 'Program Beasiswa & Pendampingan', description: 'Jadikan asesmen karier bagian dari onboarding penerima beasiswa. Data profil membantu mentor mengarahkan pendampingan yang lebih personal dan tepat sasaran.' },
        { title: 'Program Pemberdayaan Perempuan', description: 'Gunakan EQ Test dan Career Interest untuk pemetaan potensi peserta program pemberdayaan. Data mendukung pelaporan dampak kepada donatur dan pemerintah.' },
        { title: 'Pelatihan & Bootcamp Karier', description: 'Integrasikan asesmen ke dalam bootcamp atau pelatihan vokasional. Peserta mendapat profil diri yang memperkuat self-awareness dan motivasi belajar.' },
        { title: 'Monitoring & Evaluasi Dampak', description: 'Gunakan data agregat asesmen untuk laporan M&E kepada donatur dan stakeholder. Profil sebelum-sesudah program memberikan narasi dampak yang terukur.' },
      ],
      // career-interest, emotional-intelligence-test, path-finder-ai
      recommendedProductIds: ['product-career-interest', 'product-emotional-intelligence-test', 'product-path-finder-ai'],
      stats: [
        { value: 'Rp 150k', label: 'Mulai dari per penerima manfaat' },
        { value: 'Diskon NGO', label: 'Tersedia untuk yayasan terverifikasi' },
        { value: 'PDF & API', label: 'Fleksibel untuk berbagai sistem' },
        { value: 'M&E ready', label: 'Data siap untuk laporan dampak' },
      ],
      testimonial: {
        quote: 'Program beasiswa kami sekarang punya data profil untuk 300+ penerima. Mentor bisa langsung menyesuaikan pendampingan berdasarkan profil minat — bukan hanya nilai akademik.',
        author: 'Dewi Kusuma',
        role: 'Program Director',
        institution: 'Yayasan Pendidikan Nusantara',
      },
      faq: [
        { q: 'Apakah ada diskon khusus untuk yayasan atau NGO?', a: 'Ya. Kami menyediakan harga khusus untuk yayasan terdaftar dan lembaga sosial non-profit yang terverifikasi. Diskon NGO berada di atas diskon volume reguler. Hubungi tim Sekil.id dengan menyertakan akta yayasan atau dokumen legalitas.' },
        { q: 'Apakah asesmen bisa dijalankan di daerah dengan koneksi internet terbatas?', a: 'Saat ini asesmen memerlukan koneksi internet untuk mengerjakan tes dan menerima laporan. Namun laporan PDF bisa diunduh dan disimpan offline setelah selesai. Kami sedang mengembangkan mode offline untuk pilot di daerah 3T.' },
        { q: 'Apakah Sekil.id menyediakan fasilitator untuk program?', a: 'Untuk program dengan 500+ penerima manfaat, kami dapat mengirimkan tim fasilitator untuk sesi onboarding dan interpretasi hasil. Hubungi tim kami untuk mendiskusikan kebutuhan spesifik program Anda.' },
        { q: 'Bagaimana data penerima manfaat dilindungi?', a: 'Data tersimpan di server aman dengan enkripsi penuh. Yayasan sebagai controller data memiliki kendali penuh atas akses dan retensi. Kami mematuhi UU PDP Indonesia dan menyediakan DPA untuk lembaga yang membutuhkan.' },
      ],
      showATCDashboard: true,
      seoTitle: 'Asesmen Karier untuk Yayasan & Lembaga Sosial | Solusi Sekil.id',
      seoDescription: 'Platform asesmen karier bersubsidi untuk yayasan, NGO, dan program beasiswa. Harga institusional, dukungan M&E, dan data profil penerima manfaat yang terstandar.',
    },
  ]

  for (const seg of segments) {
    const doc = {
      _id: seg._id,
      _type: 'solutionSegment',
      order: seg.order,
      slug: { _type: 'slug', current: seg.slug },
      name: seg.name,
      eyebrow: seg.eyebrow,
      headline: seg.headline,
      subheadline: seg.subheadline,
      heroAccent: seg.heroAccent,
      problems: seg.problems,
      useCases: seg.useCases.map((u) => ({
        _key: blockKey('uc'),
        _type: 'useCase',
        title: u.title,
        description: u.description,
      })),
      recommendedProducts: seg.recommendedProductIds.map((ref) => ({
        _key: blockKey('ref'),
        _type: 'reference',
        _ref: ref,
      })),
      stats: seg.stats.map((s) => ({ _key: blockKey('stat'), _type: 'stat', value: s.value, label: s.label })),
      testimonial: seg.testimonial,
      faq: seg.faq.map((f) => ({ _key: blockKey('faq'), _type: 'faqItem', q: f.q, a: f.a })),
      showATCDashboard: seg.showATCDashboard,
      seoTitle: seg.seoTitle,
      seoDescription: seg.seoDescription,
    }
    console.log(`   • ${seg.order}. ${seg.name} (${seg.slug})`)
    await client.createOrReplace(doc)
  }

  console.log('   ✓ 4 solution segment documents seeded')
}

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

    // Bundles — products use Sanity document references (-> product-{slug})
    bundles: [
      {
        _key: blockKey('bundle'),
        bundleId: 'career-starter',
        name: 'Career Starter',
        tagline: 'Eksplorasi awal minat karier dan pilihan jurusan kuliah',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-career-interest' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-path-finder-ai' },
        ],
        bundlePrice: 250000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'corporate-leadership',
        name: 'Corporate Leadership',
        tagline: 'Kepemimpinan dan kecerdasan emosional untuk manajer dan HR',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-leadership-styles-test' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-emotional-intelligence-test' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-psyai' },
        ],
        bundlePrice: 470000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'comprehensive-personality',
        name: 'Comprehensive Personality',
        tagline: 'Profil kepribadian lengkap lintas instrumen Holland, MBTI, dan Papi',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-psyai' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-career-interest' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-emotional-intelligence-test' },
        ],
        bundlePrice: 450000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'self-awareness',
        name: 'Self Awareness',
        tagline: 'Kenali diri lebih dalam dengan 4 instrumen terintegrasi',
        products: [],
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

  // 3. Products (must run before pricingPage + solutionSegments — both use references)
  console.log('\n─── PRODUCTS ──────────────────────────────────────────────')
  await seedProducts()

  // 4. Solution segments (must run after products — recommendedProducts use references)
  console.log('\n─── SOLUTION SEGMENTS ─────────────────────────────────────')
  await seedSolutionSegments()

  // 5. Singletons: about, home page, navigation, site settings, pricing page
  console.log('\n─── SINGLETONS ────────────────────────────────────────────')
  await seedAboutPage()
  await seedHomePage()
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
