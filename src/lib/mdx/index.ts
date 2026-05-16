import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const AUTHORS_DIR = path.join(process.cwd(), 'content', 'authors')

// ---------------------------------------------------------------------------
// Author types
// ---------------------------------------------------------------------------

export interface AuthorMeta {
  slug: string
  name: string
  credential?: string
  role?: string
  affiliation?: string
  isAcademicReviewer?: boolean
}

// ---------------------------------------------------------------------------
// SEO / AEO / GEO types (mirrors keystatic.config.tsx schema)
// ---------------------------------------------------------------------------

export interface PostFaq {
  question: string
  answer: string
}

export interface PostSeo {
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonical?: string | null
  robots?: string
}

export interface PostAeo {
  quotableSummary?: string
  faq?: PostFaq[]
  citations?: { text: string; url?: string }[]
  entityTags?: string[]
}

export interface PostGeo {
  tldr?: string
  contentType?: string
  readingLevel?: string
  keyTakeaways?: string[]
}

// ---------------------------------------------------------------------------
// PostMeta
// ---------------------------------------------------------------------------

export interface PostMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
  modifiedAt: string
  /** Author slug (from frontmatter relationship reference, e.g. "tim-sekil-id") */
  authorSlug: string
  /** Resolved display name */
  author: string
  authorCredential?: string
  /** Reviewer slug, if present */
  reviewedBySlug?: string
  /** Resolved reviewer display name */
  reviewedBy?: string
  reviewedByCredential?: string
  status?: string
  category: string
  tags: string[]
  featured?: boolean
  coverImage?: string | null
  readingTime: string
  seo?: PostSeo
  aeo?: PostAeo
  geo?: PostGeo
}

// ---------------------------------------------------------------------------
// Author resolution
// ---------------------------------------------------------------------------

function resolveAuthor(slugOrName: string): AuthorMeta {
  const filePath = path.join(AUTHORS_DIR, `${slugOrName}.mdx`)
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    return {
      slug: slugOrName,
      name: data.name ?? slugOrName,
      credential: data.credential,
      role: data.role,
      affiliation: data.affiliation,
      isAcademicReviewer: data.isAcademicReviewer ?? false,
    }
  }
  // Fallback: treat value as a display name (legacy pre-migration posts)
  return { slug: slugOrName, name: slugOrName }
}

// ---------------------------------------------------------------------------
// Core parser
// ---------------------------------------------------------------------------

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

function parseFrontmatter(slug: string): { meta: PostMeta; content: string } | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  // Filter unpublished posts in production
  const status: string = data.status ?? 'published'
  if (IS_PRODUCTION && status !== 'published') return null

  const authorRef: string = data.author ?? 'tim-sekil-id'
  const authorData = resolveAuthor(authorRef)

  const reviewedByRef: string | undefined = data.reviewedBy
  const reviewerData = reviewedByRef ? resolveAuthor(reviewedByRef) : undefined

  const meta: PostMeta = {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    publishedAt: data.publishedAt ?? '',
    modifiedAt: data.modifiedAt ?? data.publishedAt ?? '',
    authorSlug: authorRef,
    author: authorData.name,
    authorCredential: data.authorCredential ?? authorData.credential,
    reviewedBySlug: reviewedByRef,
    reviewedBy: reviewerData?.name,
    reviewedByCredential: reviewerData?.credential,
    status,
    category: data.category ?? 'Umum',
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    coverImage: data.coverImage ?? null,
    readingTime: `${Math.ceil(stats.minutes)} menit baca`,
    seo: data.seo ?? undefined,
    aeo: data.aeo
      ? {
          quotableSummary: data.aeo.quotableSummary,
          faq: data.aeo.faq ?? [],
          citations: data.aeo.citations ?? [],
          entityTags: data.aeo.entityTags ?? [],
        }
      : undefined,
    geo: data.geo
      ? {
          tldr: data.geo.tldr,
          contentType: data.geo.contentType,
          readingLevel: data.geo.readingLevel,
          keyTakeaways: data.geo.keyTakeaways ?? [],
        }
      : undefined,
  }

  return { meta, content }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      return parseFrontmatter(slug)?.meta ?? null
    })
    .filter((m): m is PostMeta => m !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  return parseFrontmatter(slug)
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  if (IS_PRODUCTION) {
    return files
      .map((f) => f.replace(/\.mdx$/, ''))
      .filter((slug) => parseFrontmatter(slug) !== null)
  }

  return files.map((f) => f.replace(/\.mdx$/, ''))
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit)
}
