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

// ── Timeout helper ────────────────────────────────────────────────────────
// @sanity/client has no built-in timeout; Node.js HTTP will wait forever on
// a stalled connection. Wrap every API write with a 30-second race so the
// script fails fast on network issues rather than hanging silently.

const SANITY_TIMEOUT_MS = 30_000

function withTimeout(promise, ms, label) {
  let timer
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Sanity API timeout after ${ms}ms [${label}]`)),
        ms,
      )
    }),
  ]).finally(() => clearTimeout(timer))
}

// Authors whose .mdx files exist in content/authors/ but must NOT be seeded
// as active Sanity documents (e.g. placeholder reviewers before MoU is signed).
const SKIP_AUTHOR_SLUGS = new Set(['unjani-reviewer-placeholder'])

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

    if (SKIP_AUTHOR_SLUGS.has(slug)) {
      console.log(`⏭ Skipping author: ${slug} (placeholder — not for public byline until MoU complete)`)
      continue
    }

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
    console.log(`   Seeding author-${slug}...`)
    try {
      await withTimeout(client.createOrReplace(doc), SANITY_TIMEOUT_MS, `author-${slug}`)
      slugToId[slug] = doc._id
      console.log(`   ✓ Created/updated author doc: author-${slug}`)
    } catch (err) {
      console.error(`   ✗ Failed author-${slug}: ${err.message}`)
    }
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
    console.log(`   Seeding post-${slug}...`)
    try {
      await withTimeout(client.createOrReplace(doc), SANITY_TIMEOUT_MS, `post-${slug}`)
      console.log(`   ✓ Created/updated post doc: post-${slug}`)
    } catch (err) {
      console.error(`   ✗ Failed post-${slug}: ${err.message}`)
    }
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
      tagline: 'Temukan arah karier yang paling sesuai dengan profil minat vokasional Anda',
      description:
        'Tes minat karier menggunakan asesmen vokasional berbasis instrumen psikometri standar untuk siswa SMA dan mahasiswa. Dapatkan profil minat 6 dimensi dan rekomendasi karier yang sesuai dengan profil unik Anda dalam 15 menit.',
      longDescription:
        'Career Interest menggunakan kerangka minat vokasional yang telah divalidasi akademik selama 60+ tahun untuk memetakan preferensi karier Anda. Dalam 15 menit, Anda mendapatkan profil unik yang mencerminkan kombinasi minat vokasional Anda, beserta rekomendasi karier dan jurusan yang paling sesuai — disesuaikan untuk konteks pasar kerja Indonesia.',
      duration: '15 menit',
      price: 159000,
      targetPersonas: ['siswa-sma', 'mahasiswa'],
      instruments: ['holland'],
      outputs: [
        'Profil minat vokasional unik Anda dengan breakdown visual 6 dimensi',
        'Top 10 rekomendasi karier yang match dengan profil minat',
        'Rekomendasi 5 jurusan kuliah yang paling relevan',
        'Deskripsi lingkungan kerja yang paling cocok untuk profil vokasional Anda',
        'Narasi kepribadian karier yang dipersonalisasi (500+ kata)',
        'Laporan PDF 10+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan Career Interest Anda mencakup: breakdown visual enam dimensi minat dalam format spider chart, narasi kepribadian vokasional yang dipersonalisasi, tabel 10 karier yang paling match dengan tingkat kecocokan dan proyeksi pertumbuhan industri hingga 2030, serta rekomendasi 5 jurusan kuliah dengan alasan spesifik mengapa jurusan tersebut sesuai dengan profil Anda.',
      bundleSuggestions: ['psyai', 'path-finder-ai'],
      faq: [
        { _key: blockKey('faq'), q: 'Bagaimana tes ini mengidentifikasi minat karier saya?', a: 'Asesmen ini menggunakan kerangka minat vokasional enam-dimensi yang dikembangkan psikolog John L. Holland (1959) dan telah diteliti selama 60+ tahun. Enam dimensi — Realistic, Investigative, Artistic, Social, Enterprising, Conventional — mencerminkan tipe minat dan lingkungan kerja yang sesuai. Kombinasi dimensi tertinggi Anda menghasilkan profil unik yang memandu eksplorasi karier.' },
        { _key: blockKey('faq'), q: 'Berapa lama tes Career Interest berlangsung?', a: '15 menit. Tes terdiri dari serangkaian pertanyaan preferensi aktivitas yang ringkas dan dapat diselesaikan dalam satu sesi di laptop atau smartphone. Tidak ada jawaban benar atau salah — yang penting Anda menjawab jujur sesuai preferensi asli Anda.' },
        { _key: blockKey('faq'), q: 'Siapa yang paling cocok mengikuti tes ini?', a: 'Career Interest dirancang untuk siswa SMA kelas 10–12 yang sedang merencanakan pilihan jurusan kuliah, dan mahasiswa yang ingin memvalidasi arah karier mereka. Jika Anda sudah bekerja dan ingin pivot karier, PsyAI atau Leadership Styles Test mungkin lebih sesuai.' },
        { _key: blockKey('faq'), q: 'Apakah hasil tes bisa berubah seiring waktu?', a: 'Ya. Minat vokasional dapat berevolusi seiring pengalaman, pendidikan, dan perkembangan diri. Sebaiknya Anda re-take tes setiap 2–3 tahun atau setelah transisi besar (masuk kuliah, berganti bidang studi). Hasil tidak bersifat permanen — ini adalah snapshot minat Anda saat ini, bukan label seumur hidup.' },
        { _key: blockKey('faq'), q: 'Apakah laporan tersedia dalam Bahasa Indonesia?', a: 'Ya, seluruh laporan Career Interest ditulis dalam Bahasa Indonesia native — bukan terjemahan literal dari versi bahasa Inggris. Terminologi karier, referensi universitas, dan prospek gaji disesuaikan dengan konteks pasar kerja Indonesia.' },
      ],
      seoTitle: 'Tes Minat Karier | Career Interest Sekil.id',
      seoDescription:
        'Temukan minat karier Anda dengan asesmen vokasional berbasis instrumen psikometri standar. 15 menit, dapatkan profil minat dan rekomendasi karier & jurusan untuk konteks Indonesia.',
      primaryKeyword: 'tes minat karier',
    },
    {
      _id: 'product-psyai',
      order: 1,
      slug: 'psyai',
      name: 'PsyAI',
      nameDisplay: 'PsyAI — Profil Kepribadian Terintegrasi',
      tagline: 'Asesmen kepribadian terintegrasi: minat vokasional dan preferensi kepribadian dalam satu laporan AI',
      description:
        'PsyAI menggabungkan asesmen minat vokasional dan profil kepribadian dalam satu asesmen terintegrasi 25 menit. Dapatkan profil kepribadian komprehensif dengan narasi yang dipersonalisasi AI dan action plan pengembangan diri.',
      longDescription:
        'PsyAI adalah asesmen kepribadian paling komprehensif di Sekil.id. Dengan menggabungkan pemetaan minat vokasional dan preferensi kepribadian berbasis konstruk psikologis Jung, PsyAI menghasilkan satu profil kohesif yang menjelaskan bukan hanya apa yang Anda minati, tapi bagaimana cara Anda bekerja, berkomunikasi, dan berkembang. Narasi laporan dihasilkan AI berbasis template yang dirancang tim psikologi Sekil.id, dalam proses review bersama Fakultas Psikologi UNJANI.',
      duration: '25 menit',
      price: 229000,
      targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
      instruments: ['holland', 'mbti'],
      outputs: [
        'Profil minat vokasional 6 dimensi dengan breakdown visual',
        'Arketipe kepribadian karier Anda dari 16 profil yang tersedia',
        'Narasi kepribadian terintegrasi minat × kepribadian yang dipersonalisasi AI',
        'Matriks minat × kepribadian untuk pemetaan karier yang lebih presisi',
        'Action plan pengembangan diri berbasis profil (5 area prioritas)',
        'Panduan wawancara berbasis kepribadian untuk persiapan karier',
        'Laporan PDF 15+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan PsyAI menggabungkan minat vokasional dan profil kepribadian dalam satu narasi kohesif 20+ halaman. Anda mendapatkan: matriks kepribadian × minat yang menjelaskan mengapa profil Anda cenderung gravitate ke lingkungan kerja tertentu, action plan pengembangan diri berbasis profil, dan panduan karier dengan rekomendasi spesifik untuk konteks Indonesia.',
      bundleSuggestions: ['career-interest', 'leadership-styles-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa yang membedakan PsyAI dari tes kepribadian biasa?', a: 'PsyAI menggabungkan dua dimensi asesmen — pemetaan minat vokasional dan profil preferensi kepribadian — dalam satu laporan terintegrasi. Alih-alih dua hasil terpisah, Anda mendapat satu narasi kohesif yang menghubungkan minat, kepribadian, dan arah karier. AI berperan dalam narrative generation berbasis template yang dirancang tim psikologi Sekil.id, dalam proses review bersama UNJANI.' },
        { _key: blockKey('faq'), q: 'Apakah AI yang menginterpretasikan hasil kepribadian saya?', a: 'Tidak. AI menghasilkan narasi dari template yang dirancang tim psikolog. AI tidak membuat penilaian klinis atau diagnostik — ia hanya membantu personalisasi bahasa laporan berdasarkan profil Anda. Seluruh framework interpretasi dirancang oleh manusia: psikolog Sekil.id, dalam proses review bersama tim UNJANI.' },
        { _key: blockKey('faq'), q: 'Berapa lama proses tes hingga laporan tersedia?', a: '25 menit untuk tes, dan laporan tersedia langsung setelah tes selesai. Tidak ada waktu tunggu — sistem menghasilkan laporan secara otomatis. Laporan juga dikirimkan ke email Anda dalam format PDF.' },
        { _key: blockKey('faq'), q: 'Bisakah laporan PsyAI digunakan untuk proses seleksi karyawan?', a: 'Tidak disarankan untuk seleksi karyawan. PsyAI dirancang untuk pengembangan diri dan eksplorasi karier, bukan untuk tujuan seleksi atau penilaian kinerja. Menggunakan tes kepribadian untuk seleksi memiliki implikasi etika dan legal yang kompleks. Untuk konteks HR dan organisasi, konsultasikan dengan psikolog industri berlisensi.' },
        { _key: blockKey('faq'), q: 'Apa bedanya PsyAI dengan Career Interest?', a: 'Career Interest hanya mengukur minat vokasional dan berfokus pada pemetaan arah karier — cocok untuk yang sedang eksplorasi awal. PsyAI menggabungkan minat vokasional dan profil kepribadian, menghasilkan gambaran yang lebih holistik dengan narrative AI. Jika Anda sudah tahu bidang yang diminati dan ingin memahami kepribadian kerja secara lebih mendalam, PsyAI adalah pilihan yang tepat.' },
      ],
      seoTitle: 'Tes Kepribadian AI Terintegrasi | PsyAI Sekil.id',
      seoDescription:
        'PsyAI menggabungkan pemetaan minat vokasional dan profil kepribadian dalam satu asesmen terintegrasi. Dapatkan profil kepribadian komprehensif dan action plan karier dalam 25 menit.',
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
        'Path Finder AI membantu siswa SMA memilih jurusan kuliah berdasarkan profil minat vokasional dan preferensi kepribadian. Dapatkan rekomendasi 5 jurusan top match dengan prospek karier dan universitas Indonesia.',
      longDescription:
        'Path Finder AI dirancang khusus untuk siswa SMA yang menghadapi dilema pemilihan jurusan kuliah. Dengan menggabungkan profil minat vokasional dan preferensi kepribadian, Path Finder AI menyilangkan data tersebut dengan informasi jurusan, prospek karier, dan universitas Indonesia — menghasilkan rekomendasi yang personal dan berbasis data, bukan intuisi semata.',
      duration: '20 menit',
      price: 179000,
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
        'Laporan Path Finder AI mencakup: ranking 5 jurusan berdasarkan tingkat match dengan profil Anda, analisis satu-halaman per jurusan (prospek kerja, rata-rata gaji 5 tahun pertama, skill yang dibutuhkan, universitas terbaik Indonesia), serta panduan persiapan masuk dan rekomendasi kegiatan ekstrakurikuler yang mendukung karier di bidang tersebut.',
      bundleSuggestions: ['career-interest', 'psyai'],
      faq: [
        { _key: blockKey('faq'), q: 'Apakah rekomendasi jurusan Path Finder AI 100% akurat?', a: 'Tidak ada tes yang memberikan jaminan akurasi 100%. Path Finder AI memberikan rekomendasi berbasis profil minat vokasional dan kepribadian Anda, disilangkan dengan data pasar kerja dan struktur kurikulum universitas Indonesia. Hasil bersifat indikatif dan dirancang sebagai titik diskusi, bukan keputusan final. Kami merekomendasikan mendiskusikan hasilnya dengan guru BK atau konselor karier.' },
        { _key: blockKey('faq'), q: 'Dari mana data universitas dan jurusan diambil?', a: 'Data jurusan mengacu pada informasi publik Kemendikbudristek, akreditasi BAN-PT, dan LinkedIn Education Insights Indonesia 2025. Rekomendasi universitas bersifat umum berdasarkan reputasi program dan tidak merupakan endorsement atau kemitraan komersial dengan institusi manapun.' },
        { _key: blockKey('faq'), q: 'Path Finder AI cocok untuk siswa kelas berapa?', a: 'Paling optimal untuk siswa kelas 10 (sebelum penjurusan di beberapa sekolah) dan kelas 11-12 yang sedang dalam proses memilih program studi. Mahasiswa semester awal yang ragu dengan jurusan yang sudah dipilih juga dapat menggunakannya sebagai bahan refleksi.' },
        { _key: blockKey('faq'), q: 'Apakah Path Finder AI menggantikan konsultasi dengan konselor sekolah?', a: 'Tidak. Path Finder AI adalah alat bantu eksplorasi, bukan pengganti konsultasi profesional. Kami merekomendasikan menggunakan hasil tes sebagai bahan diskusi dengan guru BK, orang tua, atau konselor karier — bukan sebagai satu-satunya dasar keputusan.' },
        { _key: blockKey('faq'), q: 'Bagaimana cara mendapatkan laporan setelah tes?', a: 'Laporan tersedia langsung setelah tes selesai dalam format PDF yang bisa diunduh dan dibagikan. Laporan juga dikirimkan ke email yang Anda daftarkan. Tidak ada biaya tambahan untuk laporan — sudah termasuk dalam harga tes.' },
      ],
      seoTitle: 'Tes Pemilihan Jurusan Kuliah Berbasis AI | Path Finder AI Sekil.id',
      seoDescription:
        'Pilih jurusan kuliah dengan data, bukan tebakan. Path Finder AI menggunakan asesmen minat vokasional dan kepribadian untuk merekomendasikan 5 jurusan terbaik dengan prospek karier Indonesia.',
      primaryKeyword: 'tes pemilihan jurusan kuliah',
    },
    {
      _id: 'product-leadership-styles-test',
      order: 3,
      slug: 'leadership-styles-test',
      name: 'Leadership Styles Test',
      nameDisplay: 'Leadership Styles Test — Gaya Kepemimpinan',
      tagline: 'Identifikasi dan kembangkan gaya kepemimpinan Anda berbasis instrumen psikometri standar',
      description:
        'Leadership Styles Test menggunakan asesmen kebutuhan & peran kerja berbasis instrumen psikometri standar untuk mengidentifikasi 4 gaya kepemimpinan situasional Anda. Dapatkan profil kepemimpinan, matriks strength-blind spot, dan Individual Development Plan dalam 20 menit.',
      longDescription:
        'Leadership Styles Test dirancang untuk karyawan dan manajer yang ingin memahami dan mengembangkan gaya kepemimpinan mereka secara berbasis data. Menggunakan inventori kebutuhan & peran kerja yang merupakan standar industri untuk konteks profesional — tes ini mengidentifikasi gaya kepemimpinan dominan Anda dari 4 profil situasional, lengkap dengan matriks kekuatan, blind spot, dan rencana pengembangan yang dapat langsung diimplementasikan.',
      duration: '20 menit',
      price: 179000,
      targetPersonas: ['karyawan', 'manager'],
      instruments: ['papi'],
      outputs: [
        'Profil gaya kepemimpinan dominan dari 4 gaya situasional (Direktif, Coaching, Suportif, Delegatif)',
        'Skor 10 dimensi kebutuhan & peran kerja dalam spider chart',
        'Matriks kekuatan (strength) dan titik buta (blind spot) sebagai pemimpin',
        'Panduan konteks tim dan situasi di mana gaya Anda paling efektif',
        'Individual Development Plan (IDP) dengan 5 area pengembangan prioritas',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser:
        'Laporan Leadership Styles Test mencakup: profil gaya kepemimpinan dominan dari 4 gaya situasional, skor 10 dimensi profil kepemimpinan dalam spider chart, matriks kekuatan-blind spot dengan contoh situasi nyata, panduan "kapan menggunakan gaya mana" sesuai kematangan tim, dan Individual Development Plan (IDP) dengan 5 area pengembangan yang diprioritaskan.',
      bundleSuggestions: ['psyai', 'emotional-intelligence-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa saja 4 gaya kepemimpinan yang diukur dalam tes ini?', a: 'Leadership Styles Test mengidentifikasi 4 profil berdasarkan prinsip Situational Leadership: (1) Direktif — pemimpin yang memberikan arahan jelas dan terstruktur; (2) Coaching — pemimpin yang mengembangkan kapabilitas tim; (3) Suportif — pemimpin yang membangun kepercayaan dan motivasi tim; (4) Delegatif — pemimpin yang memberikan otonomi penuh kepada tim. Setiap gaya efektif dalam konteks dan tingkat kematangan tim yang berbeda.' },
        { _key: blockKey('faq'), q: 'Apakah tes ini cocok untuk semua level jabatan?', a: 'Tes ini paling relevan untuk supervisor, manajer lini pertama, manajer menengah, dan calon pemimpin (high-potential employee). Untuk fresh graduate atau individual contributor tanpa pengalaman memimpin tim, Career Interest atau PsyAI mungkin lebih sesuai sebagai langkah awal.' },
        { _key: blockKey('faq'), q: 'Apa dasar ilmiah tes kepemimpinan ini?', a: 'Leadership Styles Test menggunakan inventori kebutuhan & peran kerja yang diadaptasi untuk konteks kepemimpinan. Instrumen ini mengukur dimensi kepemimpinan, dominasi, dan orientasi hubungan yang relevan untuk efektivitas manajerial. Telah digunakan dalam konteks pengembangan manajerial selama 50+ tahun, dan dalam proses validasi bersama Fakultas Psikologi UNJANI untuk konteks Indonesia.' },
        { _key: blockKey('faq'), q: 'Bisakah hasilnya digunakan untuk program leadership development HRD?', a: 'Ya. Laporan Leadership Styles Test mencakup profil gaya kepemimpinan, matriks kekuatan-blind spot, dan IDP yang dapat langsung diintegrasikan ke dalam program People Development. Untuk penggunaan skala organisasi (20+ peserta), hubungi tim Sekil.id melalui halaman Demo untuk penawaran institusional.' },
        { _key: blockKey('faq'), q: 'Berapa lama berlakunya hasil tes kepemimpinan?', a: 'Tidak ada batas waktu formal untuk laporan. Namun gaya kepemimpinan dapat berkembang seiring pengalaman dan pembelajaran. Kami merekomendasikan re-assessment setiap 12–18 bulan, atau setelah transisi peran yang signifikan seperti promosi ke posisi baru.' },
      ],
      seoTitle: 'Tes Gaya Kepemimpinan | Leadership Styles Test Sekil.id',
      seoDescription:
        'Identifikasi gaya kepemimpinan Anda dengan asesmen berbasis instrumen psikometri standar. Leadership Styles Test menghasilkan profil 4 gaya situasional, matriks strength-blind spot, dan Individual Development Plan.',
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
        'EQ Test Sekil.id mengukur 4 dimensi kecerdasan emosional (EQ) menggunakan asesmen berbasis instrumen psikometri standar yang diadaptasi untuk konteks Indonesia. Dapatkan skor EQ, analisis per dimensi, dan development tips yang dapat langsung diterapkan dalam 20 menit.',
      longDescription:
        'Emotional Intelligence Test mengukur empat dimensi kecerdasan emosional yang paling kritis untuk kesuksesan profesional: Self-Awareness, Self-Regulation, Empathy, dan Social Skills. Menggunakan inventori kebutuhan & peran kerja yang diadaptasi untuk konteks Indonesia, dalam proses review bersama tim Fakultas Psikologi UNJANI, hasilnya mencakup skor per dimensi, analisis mendalam, dan rencana pengembangan EQ yang konkret dan dapat langsung diterapkan.',
      duration: '20 menit',
      price: 209000,
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
        'Laporan EQ Test mencakup: skor 4 dimensi EQ dalam skala 100 dengan visualisasi radar, profil EQ keseluruhan dengan perbandingan terhadap norma Indonesia, analisis mendalam per dimensi dengan contoh perilaku konkret, 12 development tips praktis (3 per dimensi) yang dapat mulai diterapkan, dan rencana pengembangan EQ 6 bulan yang terstruktur.',
      bundleSuggestions: ['leadership-styles-test', 'psyai'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa itu Emotional Intelligence (EQ) dan mengapa penting?', a: 'Emotional Intelligence (EQ) adalah kemampuan mengenali, memahami, dan mengelola emosi — baik emosi diri sendiri maupun orang lain. Riset menunjukkan EQ berkontribusi signifikan terhadap keberhasilan profesional, kualitas hubungan kerja, dan efektivitas kepemimpinan. EQ bukan bawaan lahir — ia dapat dipelajari dan dikembangkan dengan praktik yang konsisten.' },
        { _key: blockKey('faq'), q: 'Apa 4 dimensi EQ yang diukur dalam tes ini?', a: 'EQ Test Sekil.id mengukur: (1) Self-Awareness — kemampuan mengenali emosi dan dampaknya pada perilaku dan keputusan; (2) Self-Regulation — kemampuan mengelola emosi dan impuls dalam situasi tekanan; (3) Empathy — kemampuan memahami perspektif dan perasaan orang lain; (4) Social Skills — kemampuan membangun dan menjaga hubungan yang efektif, termasuk dalam konteks konflik dan negosiasi.' },
        { _key: blockKey('faq'), q: 'Apakah EQ saya bisa meningkat setelah tes?', a: 'Ya. Berbeda dengan IQ yang relatif stabil, EQ sangat responsif terhadap pembelajaran dan latihan. Laporan EQ Test Sekil.id menyertakan development tips spesifik per dimensi — rekomendasi praktis yang bisa Anda mulai terapkan segera. Peningkatan EQ yang terukur biasanya membutuhkan 3–6 bulan praktik yang konsisten.' },
        { _key: blockKey('faq'), q: 'Apakah EQ Test ini sudah divalidasi secara ilmiah?', a: 'EQ Test Sekil.id menggunakan asesmen tervalidasi akademik yang diadaptasi untuk mengukur dimensi kecerdasan emosional dalam konteks kerja. Adaptasi sedang dalam proses review bersama Fakultas Psikologi UNJANI. Instrumen bersifat deskriptif dan edukatif — bukan alat diagnostik klinis.' },
        { _key: blockKey('faq'), q: 'Apa bedanya EQ Test Sekil.id dengan tes EQ lain yang beredar online?', a: 'Sebagian besar tes EQ online tidak memiliki basis akademik yang jelas dan tidak disesuaikan untuk konteks Indonesia. EQ Test Sekil.id dibangun di atas instrumen yang digunakan dalam konteks profesional selama 50+ tahun, dalam proses adaptasi bersama psikolog UNJANI, dan menghasilkan laporan dalam Bahasa Indonesia native dengan rekomendasi yang relevan untuk lingkungan kerja Indonesia.' },
      ],
      seoTitle: 'Tes EQ Online Kecerdasan Emosional | Sekil.id',
      seoDescription:
        'Ukur 4 dimensi Emotional Intelligence (EQ) dengan tes berbasis instrumen psikometri standar. Dapatkan skor EQ, analisis mendalam, dan rencana pengembangan dalam 20 menit.',
      primaryKeyword: 'tes eq online',
    },
    {
      _id: 'product-self-discovery-ai',
      order: 5,
      slug: 'self-discovery-ai',
      name: 'Self DiscoveryAI',
      nameDisplay: 'Self DiscoveryAI — Kenali Dirimu',
      tagline: 'Peta diri komprehensif: siapa Anda, bagaimana Anda bekerja, apa yang paling bermakna bagi Anda',
      description: 'Self DiscoveryAI mengintegrasikan profil preferensi kepribadian dan inventori kebutuhan kerja untuk menghasilkan peta diri yang holistik. 20 menit untuk memahami kekuatan alami, kebutuhan, dan cara kerja terbaik Anda.',
      longDescription: 'Self DiscoveryAI dirancang untuk mereka yang ingin memahami dirinya lebih dalam sebelum membuat keputusan karier atau hidup yang signifikan. Dengan mengintegrasikan kerangka preferensi kepribadian dan inventori kebutuhan & peran kerja, Self DiscoveryAI menghasilkan peta diri holistik — mencakup bagaimana Anda memproses informasi, apa yang memotivasi Anda, dan lingkungan seperti apa yang membuat Anda tumbuh paling baik.',
      duration: '20 menit',
      price: 179000,
      targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
      instruments: ['mbti', 'papi'],
      outputs: [
        'Profil preferensi kepribadian dengan 4 dimensi utama',
        'Peta kebutuhan & peran kerja: apa yang memotivasi dan menguras energi Anda',
        'Narasi self-discovery dipersonalisasi AI dalam konteks kerja dan kehidupan',
        'Profil lingkungan kerja ideal berdasarkan kebutuhan dan preferensi',
        'Panduan pengembangan diri berbasis titik terkuat dan blind spot',
        'Laporan PDF 15+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser: 'Laporan Self DiscoveryAI mencakup: profil preferensi kepribadian 4 dimensi, peta kebutuhan & peran kerja dalam 10 dimensi, narasi self-discovery yang dipersonalisasi AI, dan panduan "cara kerja terbaik Anda".',
      bundleSuggestions: ['psyai', 'career-interest'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa bedanya Self DiscoveryAI dengan PsyAI?', a: 'PsyAI berfokus pada integrasi minat vokasional dan kepribadian untuk arah karier. Self DiscoveryAI lebih dalam pada self-understanding — siapa Anda, apa kebutuhan kerja Anda, dan bagaimana Anda berfungsi terbaik — tanpa terlalu fokus pada rekomendasi karier spesifik.' },
        { _key: blockKey('faq'), q: 'Siapa yang paling cocok mengikuti tes ini?', a: 'Self DiscoveryAI paling bermanfaat untuk mahasiswa di persimpangan pilihan karier, fresh graduate yang ingin memahami diri sebelum memulai karier, dan karyawan yang sedang dalam proses refleksi diri atau perubahan karier.' },
        { _key: blockKey('faq'), q: 'Berapa lama tes dan bagaimana cara mendapatkan laporan?', a: '20 menit untuk menyelesaikan tes. Laporan tersedia langsung setelah selesai dalam format PDF yang dapat diunduh dan dikirim ke email Anda.' },
      ],
      seoTitle: 'Self Discovery AI — Kenali Dirimu Lebih Dalam | Sekil.id',
      seoDescription: 'Self DiscoveryAI mengintegrasikan profil kepribadian dan inventori kebutuhan kerja untuk peta diri yang komprehensif. Kenali kekuatan, kebutuhan, dan cara kerja terbaik Anda dalam 20 menit.',
      primaryKeyword: 'tes self discovery',
    },
    {
      _id: 'product-goal-align-ai',
      order: 6,
      slug: 'goal-align-ai',
      name: 'Goal AlignAI',
      nameDisplay: 'Goal AlignAI — Selaraskan Tujuan Karier',
      tagline: 'Selaraskan ambisi karier dengan profil kebutuhan kerja dan motivasi asli Anda',
      description: 'Goal AlignAI membantu Anda menyusun tujuan karier yang benar-benar selaras dengan kebutuhan, motivasi, dan kekuatan kerja Anda — menghasilkan roadmap karier yang realistis dan menggerakkan semangat.',
      longDescription: 'Banyak orang menetapkan tujuan karier berdasarkan ekspektasi sosial atau tekanan lingkungan — bukan berdasarkan profil diri yang sesungguhnya. Goal AlignAI menggabungkan analisis inventori kebutuhan & peran kerja dengan eksplorasi tujuan karier untuk menghasilkan roadmap yang selaras dengan motivasi intrinsik Anda.',
      duration: '20 menit',
      price: 179000,
      targetPersonas: ['fresh-grad', 'karyawan', 'manager'],
      instruments: ['papi'],
      outputs: [
        'Profil kebutuhan & motivasi kerja: apa yang benar-benar menggerakkan Anda',
        'Analisis keselarasan antara tujuan karier dan profil kebutuhan Anda',
        'Roadmap karier 1–3 tahun yang selaras dengan profil motivasi',
        'Identifikasi hambatan internal dan strategi mengatasinya',
        'Panduan komunikasi tujuan karier ke atasan atau mentor',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser: 'Laporan Goal AlignAI mencakup: profil motivasi kerja dan kebutuhan karier Anda, analisis keselarasan tujuan versus profil, roadmap karier dengan milestone konkret, serta identifikasi hambatan internal yang perlu diatasi.',
      bundleSuggestions: ['self-discovery-ai', 'psyai'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa yang membedakan Goal AlignAI dari career coaching biasa?', a: 'Goal AlignAI berbasis data profil psikologis — bukan opini atau asumsi. Roadmap yang dihasilkan didasarkan pada inventori kebutuhan & peran kerja yang telah digunakan dalam konteks profesional selama 50+ tahun, sehingga lebih akurat mencerminkan motivasi asli Anda.' },
        { _key: blockKey('faq'), q: 'Siapa yang paling cocok mengikuti Goal AlignAI?', a: 'Fresh graduate yang akan memulai karier dan ingin arah yang jelas, karyawan yang merasa karier tidak selaras dengan motivasi aslinya, dan manajer yang ingin merekalkulasi tujuan karier jangka menengah.' },
        { _key: blockKey('faq'), q: 'Apakah hasilnya bisa digunakan dalam sesi mentoring?', a: 'Ya. Laporan Goal AlignAI dirancang sebagai bahan diskusi produktif dalam sesi mentoring, coaching karier, atau konsultasi HR.' },
      ],
      seoTitle: 'Goal AlignAI — Selaraskan Tujuan Karier dengan Profil Anda | Sekil.id',
      seoDescription: 'Goal AlignAI membantu menyusun roadmap karier yang selaras dengan motivasi dan kebutuhan kerja asli Anda. 20 menit untuk tujuan karier yang lebih bermakna dan realistis.',
      primaryKeyword: 'goal alignment karier',
    },
    {
      _id: 'product-goal-orientation-coaching',
      order: 7,
      slug: 'goal-orientation-coaching',
      name: 'Goal Orientation Coaching',
      nameDisplay: 'Goal Orientation Coaching — Coaching Karier Premium',
      tagline: 'Sesi coaching 1-on-1 dengan psikolog karier berbasis data profil Anda',
      description: 'Paket premium Goal Orientation Coaching menggabungkan asesmen profil kebutuhan kerja dengan sesi coaching intensif 1-on-1 bersama psikolog karier Sekil.id. Dapatkan action plan karier yang konkret dan didampingi profesional.',
      longDescription: 'Goal Orientation Coaching adalah layanan premium Sekil.id yang menggabungkan rigor asesmen psikologis dengan kedalaman coaching profesional. Sesi dimulai dengan asesmen inventori kebutuhan & peran kerja, dilanjutkan dengan sesi coaching 1-on-1 bersama psikolog karier. Hasilnya: action plan karier yang tidak hanya diinginkan, tapi dapat dicapai sesuai profil aktual Anda.',
      duration: '45 menit',
      price: 359000,
      targetPersonas: ['karyawan', 'manager'],
      instruments: ['papi'],
      outputs: [
        'Asesmen profil kebutuhan & peran kerja sebelum sesi coaching',
        'Sesi coaching 1-on-1 45 menit dengan psikolog karier Sekil.id',
        'Goal clarity framework: tujuan jangka pendek, menengah, dan panjang',
        'Identifikasi hambatan dan strategi eksekusi yang realistis',
        'Action plan tertulis 90 hari yang dapat langsung dimulai',
        'Ringkasan sesi dan catatan psikolog dalam format PDF',
      ],
      sampleReportTeaser: 'Setelah sesi Goal Orientation Coaching, Anda mendapatkan: ringkasan profil kebutuhan & peran kerja, goal clarity framework dengan milestone konkret, action plan 90 hari yang dipersonalisasi, dan catatan psikolog mengenai rekomendasi pengembangan lanjutan.',
      bundleSuggestions: ['goal-align-ai', 'professional-authenticity-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Bagaimana jadwal sesi coaching diatur?', a: 'Setelah pembelian, tim Sekil.id akan menghubungi Anda dalam 1 hari kerja untuk menjadwalkan sesi. Sesi dapat dilakukan via video call (Zoom/Google Meet).' },
        { _key: blockKey('faq'), q: 'Apakah psikolog yang akan coaching sudah bersertifikat?', a: 'Ya. Semua psikolog karier Sekil.id adalah psikolog berlisensi dengan keahlian di bidang psikologi industri dan karier.' },
        { _key: blockKey('faq'), q: 'Apakah ada sesi follow-up setelah coaching?', a: 'Paket dasar mencakup 1 sesi coaching. Follow-up session tersedia dengan pembelian terpisah.' },
      ],
      seoTitle: 'Goal Orientation Coaching — Coaching Karier dengan Psikolog | Sekil.id',
      seoDescription: 'Sesi coaching karier 1-on-1 dengan psikolog Sekil.id berbasis asesmen profil kebutuhan kerja. Dapatkan action plan 90 hari yang konkret bersama psikolog berlisensi.',
      primaryKeyword: 'coaching karier psikolog',
    },
    {
      _id: 'product-professional-authenticity-test',
      order: 8,
      slug: 'professional-authenticity-test',
      name: 'Professional Authenticity Test',
      nameDisplay: 'Professional Authenticity Test — Keaslian di Tempat Kerja',
      tagline: 'Ukur seberapa autentik Anda bekerja dan identifikasi kesenjangan antara diri asli dan peran profesional',
      description: 'Professional Authenticity Test mengukur keselarasan antara nilai-nilai diri, kebutuhan kerja, dan cara Anda berpresentasi di lingkungan profesional. Identifikasi "authenticity gap" yang mungkin menyebabkan kelelahan atau ketidakpuasan karier.',
      longDescription: 'Ketidakselarasan antara siapa Anda sebenarnya dan bagaimana Anda berperilaku di tempat kerja adalah sumber utama kelelahan dan ketidakpuasan karier jangka panjang. Professional Authenticity Test mengukur gap ini menggunakan inventori kebutuhan & peran kerja yang diadaptasi untuk konteks keaslian profesional.',
      duration: '20 menit',
      price: 179000,
      targetPersonas: ['fresh-grad', 'karyawan', 'manager'],
      instruments: ['papi'],
      outputs: [
        'Profil keaslian profesional: area di mana Anda paling dan paling kurang autentik',
        'Analisis authenticity gap antara nilai diri dan perilaku profesional',
        'Identifikasi pemicu ketidakautentikan: situasi, orang, atau konteks tertentu',
        'Strategi mempersempit authenticity gap dengan langkah konkret',
        'Panduan komunikasi yang lebih autentik di tempat kerja',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser: 'Laporan Professional Authenticity Test mencakup: skor keaslian per dimensi profesional, analisis authenticity gap antara nilai dan perilaku, identifikasi situasi pemicu, dan 5 strategi konkret untuk bekerja dengan lebih autentik.',
      bundleSuggestions: ['self-discovery-ai', 'goal-orientation-coaching'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa yang dimaksud dengan "authenticity gap"?', a: 'Authenticity gap adalah jarak antara siapa Anda sebenarnya (nilai, kebutuhan, preferensi kerja) dan bagaimana Anda berpresentasi di tempat kerja. Gap yang terlalu besar adalah sumber utama kelelahan dan ketidakpuasan karier kronis.' },
        { _key: blockKey('faq'), q: 'Apakah tes ini hanya untuk individu yang tidak autentik?', a: 'Tidak. Semua orang menyesuaikan diri di tempat kerja — itu normal. Tes ini mengukur seberapa besar penyesuaian tersebut dan apakah sudah melewati ambang yang berdampak negatif pada wellbeing dan performa.' },
        { _key: blockKey('faq'), q: 'Bagaimana hasil tes ini bisa membantu karier saya?', a: 'Dengan memahami di mana dan mengapa Anda tidak autentik, Anda bisa membuat keputusan yang lebih tepat: apakah perlu mengubah cara berkomunikasi, mencari peran yang lebih sesuai, atau mempertimbangkan perubahan lingkungan kerja.' },
      ],
      seoTitle: 'Professional Authenticity Test — Keaslian di Tempat Kerja | Sekil.id',
      seoDescription: 'Ukur keselarasan antara nilai diri dan perilaku profesional. Professional Authenticity Test mengidentifikasi authenticity gap dan memberikan strategi konkret untuk bekerja lebih autentik.',
      primaryKeyword: 'tes keaslian profesional',
    },
    {
      _id: 'product-job-burnout-test',
      order: 9,
      slug: 'job-burnout-test',
      name: 'Job Burnout Test',
      nameDisplay: 'Job Burnout Test — Deteksi Risiko Burnout',
      tagline: 'Deteksi dini risiko burnout dan susun strategi pemulihan berbasis data',
      description: 'Job Burnout Test mengukur tingkat kelelahan kerja di tiga dimensi: kelelahan emosional, depersonalisasi, dan efektivitas diri. Dapatkan profil risiko burnout yang akurat dan panduan pemulihan yang konkret dalam 15 menit.',
      longDescription: 'Burnout bukan sekadar kelelahan biasa — ia adalah kondisi psikologis yang berkembang bertahap dan berdampak serius pada kesehatan, produktivitas, dan hubungan kerja. Job Burnout Test menggunakan asesmen kebutuhan & peran kerja yang diadaptasi untuk mengukur tiga dimensi burnout paling kritis: kelelahan emosional, depersonalisasi, dan efektivitas diri.',
      duration: '15 menit',
      price: 209000,
      targetPersonas: ['karyawan', 'manager'],
      instruments: ['papi'],
      outputs: [
        'Skor 3 dimensi burnout: Kelelahan Emosional, Depersonalisasi, dan Efektivitas Diri',
        'Profil risiko burnout keseluruhan: rendah, sedang, atau tinggi',
        'Identifikasi dimensi burnout yang paling kritis saat ini',
        'Analisis penyebab potensial berdasarkan profil kebutuhan kerja',
        'Panduan pemulihan bertahap dengan 10 strategi berbasis evidence',
        'Laporan PDF 10+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser: 'Laporan Job Burnout Test mencakup: skor per dimensi burnout dengan interpretasi mendalam, profil risiko keseluruhan, identifikasi faktor penyebab, serta panduan pemulihan 30-60-90 hari.',
      bundleSuggestions: ['professional-authenticity-test', 'emotional-intelligence-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Apakah tes ini bisa mendiagnosis burnout secara klinis?', a: 'Tidak. Job Burnout Test adalah alat skrining dan self-assessment — bukan alat diagnostik klinis. Jika mengalami gejala burnout yang parah, sangat disarankan untuk berkonsultasi dengan psikolog atau dokter berlisensi.' },
        { _key: blockKey('faq'), q: 'Seberapa sering saya perlu mengulang tes ini?', a: 'Kami merekomendasikan melakukan Job Burnout Test setiap 6 bulan sebagai check-in rutin, atau segera jika ada perubahan signifikan dalam kondisi kerja atau kesehatan mental.' },
        { _key: blockKey('faq'), q: 'Apakah employer atau HRD bisa melihat hasil tes saya?', a: 'Tidak. Hasil tes hanya dapat diakses oleh peserta yang bersangkutan. Kami tidak berbagi data individual dengan employer, HR, atau pihak ketiga manapun tanpa persetujuan eksplisit peserta.' },
      ],
      seoTitle: 'Job Burnout Test — Deteksi Risiko Burnout Kerja | Sekil.id',
      seoDescription: 'Deteksi dini risiko burnout dengan asesmen berbasis instrumen psikometri standar. Job Burnout Test mengukur 3 dimensi burnout dan memberikan panduan pemulihan berbasis evidence dalam 15 menit.',
      primaryKeyword: 'tes burnout kerja',
    },
    {
      _id: 'product-personal-authenticity-test',
      order: 10,
      slug: 'personal-authenticity-test',
      name: 'Personal Authenticity Test',
      nameDisplay: 'Personal Authenticity Test — Keaslian Diri Sejati',
      tagline: 'Temukan dan ekspresikan versi diri yang paling autentik dalam kehidupan sehari-hari',
      description: 'Personal Authenticity Test mengukur keselarasan antara nilai-nilai inti, preferensi hidup, dan cara Anda menjalani keseharian. Untuk individu yang ingin hidup lebih bermakna dan selaras dengan siapa diri mereka sebenarnya.',
      longDescription: 'Keaslian diri bukan tentang sempurna atau tidak berubah — ini tentang menjalani hidup yang selaras dengan nilai dan preferensi terdalam Anda. Personal Authenticity Test mengintegrasikan kerangka preferensi kepribadian dengan inventori kebutuhan personal untuk menghasilkan profil keaslian yang menyeluruh.',
      duration: '20 menit',
      price: 209000,
      targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
      instruments: ['mbti', 'papi'],
      outputs: [
        'Profil nilai inti: apa yang paling penting bagi Anda dalam hidup dan hubungan',
        'Skor keaslian diri per domain: karier, hubungan, ekspresi diri, dan pilihan hidup',
        'Identifikasi area di mana Anda paling sering menekan atau menyembunyikan diri',
        'Analisis akar ketidakautentikan: ekspektasi sosial, rasa takut, atau kebiasaan',
        'Panduan hidup lebih autentik dengan langkah konkret dan bertahap',
        'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
      ],
      sampleReportTeaser: 'Laporan Personal Authenticity Test mencakup: profil nilai inti dan preferensi hidup, skor keaslian per domain kehidupan, analisis mendalam pola ketidakautentikan, serta panduan 5 langkah untuk mulai menjalani hidup yang lebih selaras dengan diri asli Anda.',
      bundleSuggestions: ['self-discovery-ai', 'job-burnout-test'],
      faq: [
        { _key: blockKey('faq'), q: 'Apa bedanya dengan Professional Authenticity Test?', a: 'Professional Authenticity Test berfokus pada konteks tempat kerja. Personal Authenticity Test lebih luas — mencakup seluruh domain kehidupan: karier, hubungan, ekspresi diri, dan pilihan hidup secara keseluruhan.' },
        { _key: blockKey('faq'), q: 'Apakah tes ini cocok untuk remaja atau siswa?', a: 'Tes ini paling optimal untuk usia 18 tahun ke atas. Untuk siswa SMA, Career Interest atau Path Finder AI mungkin lebih relevan sebagai titik awal eksplorasi diri.' },
        { _key: blockKey('faq'), q: 'Apakah hasil tes ini bisa berubah?', a: 'Ya. Nilai, preferensi, dan tingkat keaslian diri dapat berkembang seiring pengalaman dan pertumbuhan. Kami merekomendasikan re-assessment setiap 12–18 bulan, atau setelah transisi hidup yang signifikan.' },
      ],
      seoTitle: 'Personal Authenticity Test — Keaslian Diri Sejati | Sekil.id',
      seoDescription: 'Ukur keselarasan antara nilai inti dan cara hidup Anda sehari-hari. Personal Authenticity Test membantu Anda hidup lebih autentik dan bermakna dalam 20 menit.',
      primaryKeyword: 'tes keaslian diri',
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

  console.log('   ✓ 11 product documents seeded')
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
      'Sekil.id adalah joint venture Sekil.id × B One Corp untuk membawa asesmen psikologi berbasis standar ke setiap sekolah, kampus, dan perusahaan di Indonesia.',

    // Cerita Kami
    storyEyebrow: 'CERITA KAMI',
    storyHeading: 'Mengapa Sekil.id ada?',
    storyParagraphs: [
      'Setiap tahun, ratusan ribu siswa Indonesia memilih jurusan kuliah berdasarkan tekanan teman sebaya, ekspektasi orang tua, atau sekadar tren. Hasilnya: angka mismatch jurusan yang tinggi, mahasiswa yang tidak termotivasi, dan tenaga kerja yang tidak sesuai dengan potensi aslinya. Di sisi korporasi, keputusan rekrutmen dan pengembangan talent masih didominasi intuisi subjektif — bukan data yang dapat dipertanggungjawabkan.',
      'Asesmen psikologi impor yang ada sering kali mahal, tidak disesuaikan untuk konteks budaya Indonesia, dan laporan yang dihasilkan sulit dipahami tanpa pendampingan psikolog. Sekil.id hadir sebagai solusi: partnership antara Sekil.id dan B One Corp, menjalin kolaborasi akademik dengan Fakultas Psikologi Universitas Jenderal Achmad Yani (UNJANI) dalam proses validasi instrumen — menghasilkan asesmen psikologi yang terjangkau dan relevan untuk konteks Indonesia.',
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
        description: 'Metodologi, item bank, dan konten asesmen Sekil.id sedang dalam proses review bersama tim Fakultas Psikologi UNJANI. Proses ini mencakup relevansi konteks Indonesia dan standar psikometri.',
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
    // WHY: team member identities pending founder confirmation — seed empty so no placeholder
    // names reach the live UI. teamNote above explains this to visitors.
    team: [],

    // Milestones
    milestonesEyebrow: 'PERJALANAN',
    milestonesHeading: 'Milestone kami',
    milestones: [
      { _key: blockKey('ms'), _type: 'milestone', period: '2024 Q4', event: 'JV Sekil.id × B One Corp signed', description: 'Perjanjian joint venture resmi ditandatangani antara Sekil.id dan B One Corp.' },
      { _key: blockKey('ms'), _type: 'milestone', period: '2025 Q1', event: 'UNJANI onboard sebagai mitra akademik', description: 'Fakultas Psikologi UNJANI resmi bergabung sebagai mitra validasi akademik instrumen.' },
      { _key: blockKey('ms'), _type: 'milestone', period: '2025 Q3', event: 'Pilot dengan 3 design partner', description: 'Pilot program bersama Yayasan Pengusaha Pendidikan Jabar, Muhammadiyah, dan Metranet.' },
      { _key: blockKey('ms'), _type: 'milestone', period: '2026 Q2', event: 'Platform v1.0 live', description: 'sekil.id resmi diluncurkan ke publik dengan 5 produk asesmen.' },
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
      { _key: blockKey('meta'), val: '6+4', label: 'DIMENSI' },
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
        body: 'Memetakan 6 dimensi minat dan 4 preferensi kepribadian — menghasilkan kode minat 3-huruf dan 1 dari 16 tipe kepribadian.',
        meta: ['6+4 DIMENSI', 'EVIDENCE-LED'],
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
      { _key: blockKey('stat'), _type: 'stat', label: 'Mahasiswa', value: '967', unit: '', featured: false },
      { _key: blockKey('stat'), _type: 'stat', label: 'Dimensi diukur', value: '10', unit: '', featured: false },
    ],

    // CTA
    ctaEyebrow: 'MULAI HARI INI',
    ctaHeading: 'Temukan arah karier yang lebih jelas.',
    ctaSubheading:
      'Mulai dengan PsyAI. Hasil langsung tersambung ke Path Finder dan Goal Align — tanpa pengulangan, tanpa tebakan.',
    ctaCTAPrimary: { label: 'Mulai asesmen →', href: '/demo' },
    ctaCTASecondary: { label: 'Jadwalkan demo', href: '/demo' },

    // FAQ
    faqHeading: 'Pertanyaan yang sering diajukan.',
    faq: [
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Apa itu Sekil.id?', a: 'Sekil.id adalah platform asesmen psikologi dan pemetaan karier berbasis AI dalam proses validasi bersama Fakultas Psikologi UNJANI. Kami membantu sekolah, kampus, dan perusahaan memahami potensi individu secara ilmiah dan akurat.' },
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Berapa lama waktu asesmen?', a: 'Tergantung produk yang dipilih. Durasi bervariasi antara 15–25 menit per peserta. Hasil tersedia langsung setelah asesmen selesai.' },
      { _key: blockKey('faq'), _type: 'faqItem', q: 'Apakah hasil asesmen tervalidasi ilmiah?', a: 'Ya. Semua instrumen sedang dalam proses validasi bersama tim Fakultas Psikologi UNJANI menggunakan standar psikometri internasional. Ini bukan sekadar kuis — ini asesmen psikologi yang sesungguhnya.' },
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
        'Bantu siswa memilih jurusan kuliah dengan percaya diri — bukan tebakan. Asesmen minat karier berbasis instrumen psikometri standar dalam satu platform yang mudah dikelola tim BK.',
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
        { title: 'Laporan Profil Kelas', description: 'Dapatkan agregat profil minat per kelas: distribusi profil minat vokasional, dominansi preferensi kepribadian, dan tren karier yang diminati untuk perencanaan program sekolah.' },
      ],
      // career-interest, path-finder-ai, psyai
      recommendedProductIds: ['product-career-interest', 'product-path-finder-ai', 'product-psyai'],
      stats: [
        { value: '15 menit', label: 'Waktu pengerjaan per siswa' },
        { value: 'Rp 150k', label: 'Mulai dari per siswa' },
        { value: '3 instrumen', label: 'Validasi UNJANI dalam proses' },
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
        { value: 'Rp 150k–225k', label: 'Per mahasiswa' },
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
      seoDescription: 'Tingkatkan layanan pusat karier universitas dengan asesmen kepribadian berbasis instrumen psikometri standar. Dari orientasi mahasiswa baru hingga program magang berbasis data profil.',
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
        { value: 'Rp 35 juta', label: 'ATC Dashboard/tahun (opsional)' },
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
        { q: 'Apakah ada ATC Dashboard untuk memantau seluruh karyawan?', a: 'Ya. Kami menyediakan ATC (Assessment Tracking Center) Dashboard seharga Rp 35 juta/tahun — platform terintegrasi untuk memantau status asesmen, menganalisis distribusi profil, dan mengekspor data ke HRIS.' },
        { q: 'Bagaimana SLA dan dukungan teknis untuk enterprise?', a: 'Paket enterprise mencakup dedicated account manager, SLA 99.5% uptime, dan dukungan teknis prioritas. Kami juga menyediakan onboarding tatap muka untuk tim HR dan IT.' },
      ],
      showATCDashboard: true,
      seoTitle: 'Asesmen Psikologi Karyawan untuk Perusahaan & HRD | Solusi Sekil.id',
      seoDescription: 'Platform asesmen psikologi korporat: leadership development, EQ assessment, dan talent profiling berbasis standar psikometri. Integrasi HRIS dan ATC Dashboard tersedia.',
    },
    {
      _id: 'segment-untuk-yayasan',
      order: 3,
      slug: 'untuk-yayasan',
      name: 'Untuk Yayasan',
      eyebrow: 'SOLUSI · YAYASAN & LEMBAGA SOSIAL',
      headline: 'Asesmen karier bersubsidi untuk program sosial dan beasiswa',
      subheadline:
        'Bantu penerima manfaat yayasan Anda menemukan arah karier dengan asesmen berbasis instrumen psikometri standar — dengan harga institusional dan dukungan implementasi yang fleksibel.',
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
      'Platform asesmen psikologi & pemetaan karier dalam proses validasi bersama Fakultas Psikologi UNJANI. AI-powered, dipakai sekolah, kampus, dan perusahaan.',
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
      'Mulai dari Rp 159.000 per peserta untuk individu. Dapatkan diskon volume hingga 20% untuk pembelian institusional. Tidak ada biaya setup, tidak ada biaya tersembunyi.',
    heroPillars: [
      { _key: blockKey('pillar'), label: 'Harga mulai dari', value: 'Rp 159.000', sub: 'per peserta' },
      { _key: blockKey('pillar'), label: 'Diskon volume', value: 'Hingga 20%', sub: 'untuk 50.000+ seat' },
      { _key: blockKey('pillar'), label: 'Bundle hemat', value: '–15%', sub: 'paket multi-produk' },
    ],

    // Products & volume tiers
    products: [
      { _key: blockKey('prod'), slug: 'career-interest', name: 'Career Interest', duration: '15 menit', price: 159000 },
      { _key: blockKey('prod'), slug: 'psyai', name: 'PsyAI', duration: '25 menit', price: 229000 },
      { _key: blockKey('prod'), slug: 'path-finder-ai', name: 'Path Finder AI', duration: '20 menit', price: 179000 },
      { _key: blockKey('prod'), slug: 'leadership-styles-test', name: 'Leadership Styles Test', duration: '20 menit', price: 179000 },
      { _key: blockKey('prod'), slug: 'emotional-intelligence-test', name: 'Emotional Intelligence Test', duration: '20 menit', price: 209000 },
      { _key: blockKey('prod'), slug: 'self-discovery-ai', name: 'Self DiscoveryAI', duration: '20 menit', price: 179000 },
      { _key: blockKey('prod'), slug: 'goal-align-ai', name: 'Goal AlignAI', duration: '20 menit', price: 179000 },
      { _key: blockKey('prod'), slug: 'goal-orientation-coaching', name: 'Goal Orientation Coaching', duration: '45 menit', price: 359000 },
      { _key: blockKey('prod'), slug: 'professional-authenticity-test', name: 'Professional Authenticity Test', duration: '20 menit', price: 179000 },
      { _key: blockKey('prod'), slug: 'job-burnout-test', name: 'Job Burnout Test', duration: '15 menit', price: 209000 },
      { _key: blockKey('prod'), slug: 'personal-authenticity-test', name: 'Personal Authenticity Test', duration: '20 menit', price: 209000 },
    ],
    volumeTiers: [
      { _key: blockKey('tier'), minSeats: 0, discountRate: 0, label: '1–499' },
      { _key: blockKey('tier'), minSeats: 500, discountRate: 0.05, label: '500–1.999' },
      { _key: blockKey('tier'), minSeats: 2000, discountRate: 0.075, label: '2.000–9.999' },
      { _key: blockKey('tier'), minSeats: 10000, discountRate: 0.125, label: '10.000–49.999' },
      { _key: blockKey('tier'), minSeats: 50000, discountRate: 0.2, label: '50.000+' },
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
        bundlePrice: 289000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'wellbeing-kit',
        name: 'Wellbeing Kit',
        tagline: 'Deteksi burnout dan identifikasi gap keaslian di lingkungan profesional Anda',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-job-burnout-test' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-professional-authenticity-test' },
        ],
        bundlePrice: 339000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'self-awareness',
        name: 'Self Awareness',
        tagline: 'Kenali diri, tujuan, dan keaslian hidup dalam satu paket lengkap',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-self-discovery-ai' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-personal-authenticity-test' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-goal-align-ai' },
        ],
        bundlePrice: 489000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'comprehensive-personality',
        name: 'Comprehensive Personality',
        tagline: 'Profil kepribadian lengkap lintas tiga dimensi asesmen: minat, kepribadian, dan kebutuhan kerja',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-psyai' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-career-interest' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-emotional-intelligence-test' },
        ],
        bundlePrice: 509000,
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
        bundlePrice: 529000,
        comingSoon: false,
      },
      {
        _key: blockKey('bundle'),
        bundleId: 'professional-growth',
        name: 'Professional Growth',
        tagline: 'Profil kepribadian, keselarasan tujuan, dan coaching 1-on-1 dengan psikolog karier',
        products: [
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-psyai' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-goal-align-ai' },
          { _key: blockKey('ref'), _type: 'reference', _ref: 'product-goal-orientation-coaching' },
        ],
        bundlePrice: 659000,
        comingSoon: false,
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
      price: 'Rp 35 juta',
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
