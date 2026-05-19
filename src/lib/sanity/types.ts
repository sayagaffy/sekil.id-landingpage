import type { PortableTextBlock } from '@portabletext/react'

// ── Image ────────────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

// ── SEO / AEO / GEO ─────────────────────────────────────────────────────────

export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonical?: string
  ogImage?: SanityImage
  robots?: 'index, follow' | 'noindex, follow' | 'noindex, nofollow'
}

export interface AeoFields {
  quotableSummary?: string
  faq?: { question: string; answer: string }[]
  citations?: { text: string; url?: string }[]
  entityTags?: string[]
}

export interface GeoFields {
  tldr?: string
  contentType?: 'guide' | 'article' | 'research' | 'tool' | 'faq'
  readingLevel?: 'general' | 'sma' | 'university' | 'professional'
  keyTakeaways?: string[]
}

// ── Author ───────────────────────────────────────────────────────────────────

export interface Author {
  _id: string
  name: string
  slug: string
  credential?: string
  role?: 'author' | 'reviewer' | 'editor'
  affiliation?: string
  photo?: SanityImage
  linkedin?: string
  orcid?: string
  isAcademicReviewer?: boolean
  bio?: PortableTextBlock[]
}

// ── Blog Post ────────────────────────────────────────────────────────────────

export interface PostSummary {
  _id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  modifiedAt?: string
  category: string
  tags?: string[]
  featured?: boolean
  coverImage?: SanityImage
  status?: string
  author?: Author
  authorCredential?: string
  reviewedBy?: { name: string; credential?: string } | null
}

export interface PostFull extends PostSummary {
  body?: PortableTextBlock[]
  seo?: SeoFields
  aeo?: AeoFields
  geo?: GeoFields
}

// ── Panduan ──────────────────────────────────────────────────────────────────

export interface PanduanSummary {
  _id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  tags?: string[]
  coverImage?: SanityImage
  author?: Author
}

export interface PanduanFull extends PanduanSummary {
  modifiedAt?: string
  authorCredential?: string
  reviewedBy?: { name: string; credential?: string } | null
  body?: PortableTextBlock[]
  seo?: SeoFields
  aeo?: AeoFields
  geo?: GeoFields
}

// ── Programmatic enrichment ──────────────────────────────────────────────────

export interface ProgrammaticPost {
  title: string
  description?: string
  publishedAt: string
  modifiedAt?: string
  author?: string
  authorCredential?: string
  reviewedBy?: string
  tags?: string[]
  body?: PortableTextBlock[]
  seo?: SeoFields
  aeo?: AeoFields
  geo?: GeoFields
}

// ── Pricing Page ─────────────────────────────────────────────────────────────

export interface PricingPillar {
  label: string
  value: string
  sub?: string
}

export interface PricingFaq {
  q: string
  a: string
}

export interface PricingProduct {
  slug: string
  name: string
  duration?: string
  price: number
}

export interface PricingVolumeTier {
  minSeats: number
  discountRate: number
  label?: string
}

export interface PricingBundle {
  bundleId?: string
  name: string
  tagline?: string
  productSlugs?: string[]
  bundlePrice: number
  comingSoon?: boolean
}

export interface PricingPageData {
  heroEyebrow?: string
  heroHeading?: string
  heroSubheading?: string
  heroPillars?: PricingPillar[]
  products?: PricingProduct[]
  volumeTiers?: PricingVolumeTier[]
  bundles?: PricingBundle[]
  faq?: PricingFaq[]
  atcDashboard?: {
    price: string
    priceUnit?: string
    features?: string[]
  }
  ctaHeading?: string
  ctaSubheading?: string
}

// ── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName?: string
  siteDescription?: string
  defaultOgImage?: SanityImage
  socialLinks?: {
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
  announcement?: {
    enabled: boolean
    message?: string
    linkLabel?: string
    linkHref?: string
    variant?: 'info' | 'warning' | 'success'
  }
}

// ── Navigation ───────────────────────────────────────────────────────────────

export interface NavSubItem {
  label: string
  href: string
  description?: string
}

export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
  children?: NavSubItem[]
}

export interface NavigationData {
  headerItems?: NavItem[]
  ctaLabel?: string
  ctaHref?: string
}
