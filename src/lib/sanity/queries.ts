import { defineQuery } from 'next-sanity'

// ── Shared projection fragments ─────────────────────────────────────────────

const SEO_FRAGMENT = `
  seo {
    metaTitle,
    metaDescription,
    focusKeyword,
    canonical,
    ogImage,
    robots,
  }
`

const AEO_FRAGMENT = `
  aeo {
    quotableSummary,
    faq[] { question, answer },
    citations[] { text, url },
    entityTags,
  }
`

const GEO_FRAGMENT = `
  geo {
    tldr,
    contentType,
    readingLevel,
    keyTakeaways,
  }
`

const AUTHOR_FRAGMENT = `
  author-> {
    _id,
    name,
    "slug": slug.current,
    credential,
    role,
    affiliation,
    photo,
    linkedin,
    orcid,
    isAcademicReviewer,
    bio,
  }
`

// ── Blog Posts ──────────────────────────────────────────────────────────────

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    modifiedAt,
    category,
    tags,
    featured,
    coverImage,
    status,
    ${AUTHOR_FRAGMENT},
    authorCredential,
    reviewedBy-> { name, credential },
  }
`)

export const FEATURED_POST_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && featured == true && publishedAt <= now()]
  | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    tags,
    coverImage,
    ${AUTHOR_FRAGMENT},
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    modifiedAt,
    category,
    tags,
    featured,
    coverImage,
    status,
    ${AUTHOR_FRAGMENT},
    authorCredential,
    reviewedBy-> { name, credential },
    body,
    ${SEO_FRAGMENT},
    ${AEO_FRAGMENT},
    ${GEO_FRAGMENT},
  }
`)

export const ALL_POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && publishedAt <= now() && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && publishedAt <= now() && category == $category]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    tags,
    coverImage,
    ${AUTHOR_FRAGMENT},
  }
`)

export const POSTS_BY_TAG_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && publishedAt <= now() && $tag in tags]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    tags,
    coverImage,
    ${AUTHOR_FRAGMENT},
  }
`)

export const RELATED_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && publishedAt <= now()
    && slug.current != $currentSlug && category == $category]
  | order(publishedAt desc)[0...$limit] {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    tags,
    coverImage,
    ${AUTHOR_FRAGMENT},
  }
`)

// ── Authors ─────────────────────────────────────────────────────────────────

export const ALL_AUTHORS_QUERY = defineQuery(`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    credential,
    role,
    affiliation,
    photo,
    linkedin,
    orcid,
    isAcademicReviewer,
  }
`)

export const AUTHOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    credential,
    role,
    affiliation,
    photo,
    linkedin,
    orcid,
    isAcademicReviewer,
    bio,
  }
`)

export const AUTHOR_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && publishedAt <= now()
    && author._ref == $authorId]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    coverImage,
  }
`)

export const ALL_AUTHOR_SLUGS_QUERY = defineQuery(`
  *[_type == "author" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ── Panduan ─────────────────────────────────────────────────────────────────

export const ALL_PANDUAN_QUERY = defineQuery(`
  *[_type == "panduan" && status == "published" && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    tags,
    coverImage,
    ${AUTHOR_FRAGMENT},
  }
`)

export const PANDUAN_BY_SLUG_QUERY = defineQuery(`
  *[_type == "panduan" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    modifiedAt,
    tags,
    coverImage,
    ${AUTHOR_FRAGMENT},
    authorCredential,
    reviewedBy-> { name, credential },
    body,
    ${SEO_FRAGMENT},
    ${AEO_FRAGMENT},
    ${GEO_FRAGMENT},
  }
`)

// ── Programmatic enrichment ─────────────────────────────────────────────────

export const PERSONALITY_POST_QUERY = defineQuery(`
  *[_type == "personalityPost" && personalitySlug == $slug][0] {
    title,
    personalitySlug,
    description,
    publishedAt,
    modifiedAt,
    author,
    authorCredential,
    reviewedBy,
    tags,
    body,
    ${SEO_FRAGMENT},
    ${AEO_FRAGMENT},
    ${GEO_FRAGMENT},
  }
`)

export const CAREER_POST_QUERY = defineQuery(`
  *[_type == "careerPost" && careerSlug == $slug][0] {
    title,
    careerSlug,
    description,
    publishedAt,
    modifiedAt,
    author,
    authorCredential,
    reviewedBy,
    tags,
    body,
    ${SEO_FRAGMENT},
    ${AEO_FRAGMENT},
    ${GEO_FRAGMENT},
  }
`)

export const MAJOR_POST_QUERY = defineQuery(`
  *[_type == "majorPost" && majorSlug == $slug][0] {
    title,
    majorSlug,
    description,
    publishedAt,
    modifiedAt,
    author,
    authorCredential,
    reviewedBy,
    tags,
    body,
    ${SEO_FRAGMENT},
    ${AEO_FRAGMENT},
    ${GEO_FRAGMENT},
  }
`)

// ── Singletons ──────────────────────────────────────────────────────────────

export const PRICING_PAGE_QUERY = defineQuery(`
  *[_type == "pricingPage" && _id == "pricingPage"][0] {
    heroEyebrow,
    heroHeading,
    heroSubheading,
    heroPillars[] { label, value, sub },
    faq[] { q, a },
    atcDashboard { price, priceUnit, features },
    ctaHeading,
    ctaSubheading,
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteName,
    siteDescription,
    defaultOgImage,
    socialLinks,
    announcement,
  }
`)

export const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation" && _id == "navigation"][0] {
    headerItems[] {
      label,
      href,
      isExternal,
      children[] { label, href, description },
    },
    ctaLabel,
    ctaHref,
  }
`)
