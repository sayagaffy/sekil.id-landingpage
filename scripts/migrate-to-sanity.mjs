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

async function migratePricingPage() {
  const pricingFile = path.join(CONTENT_DIR, 'pages', 'pricing.yaml')
  if (!fs.existsSync(pricingFile)) {
    console.log('\n⚠️  No pricing.yaml found — skipping')
    return
  }

  const raw = fs.readFileSync(pricingFile, 'utf-8')
  // Simple YAML parse using our parser
  const { data } = parseFrontmatter(`---\n${raw}\n---\n`)

  const hero = data.hero || {}
  const faq = data.faq || []
  const atc = data.atcDashboard || {}

  const doc = {
    _id: 'pricingPage',
    _type: 'pricingPage',
    heroEyebrow: hero.eyebrow ?? null,
    heroHeading: hero.heading ?? 'Harga yang sesuai dengan skala Anda',
    heroSubheading: hero.subheading ?? null,
    heroPillars: (hero.pillars || []).map((p) => ({
      _key: blockKey('pillar'),
      label: p.label ?? '',
      value: p.value ?? '',
      sub: p.sub ?? '',
    })),
    faq: faq.map((item) => ({
      _key: blockKey('faq'),
      q: item.q ?? '',
      a: item.a ?? '',
    })),
    atcDashboard: atc.price
      ? {
          price: atc.price ?? '',
          priceUnit: atc.priceUnit ?? '',
          features: atc.features ?? [],
        }
      : null,
    ctaHeading: data.ctaHeading ?? null,
    ctaSubheading: data.ctaSubheading ?? null,
  }

  console.log(`\n📝 Pricing page (${faq.length} FAQ items)`)
  await client.createOrReplace(doc)
  console.log('   ✓ Created/updated pricingPage singleton')
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Sekil.id → Sanity Migration')
  console.log('   Project: 2p33r6a9 | Dataset: production\n')

  // 1. Authors
  console.log('─── AUTHORS ───────────────────────────────────────────────')
  const authorSlugToId = await migrateAuthors()
  console.log(`   Total: ${Object.keys(authorSlugToId).length} authors\n`)

  // 2. Blog posts
  console.log('─── BLOG POSTS ────────────────────────────────────────────')
  await migrateBlogPosts(authorSlugToId)

  // 3. Pricing page
  console.log('\n─── PRICING PAGE ──────────────────────────────────────────')
  await migratePricingPage()

  console.log('\n✅  Migration complete!')
  console.log('\nNext steps:')
  console.log('  1. Open Sanity Studio at /cms to review the migrated content')
  console.log('  2. Add cover images to posts if needed')
  console.log('  3. Verify author photos')
  console.log('  4. Set up the ISR webhook in Sanity dashboard:')
  console.log('     URL: https://sekil.id/api/revalidate')
  console.log('     Secret: (value of SANITY_REVALIDATE_SECRET env var)')
  console.log('  5. Add CORS origin in Sanity dashboard:')
  console.log('     https://sekil.id and http://localhost:3000 (with credentials)')
}

main().catch((err) => {
  console.error('\n❌  Migration failed:', err.message)
  process.exit(1)
})
