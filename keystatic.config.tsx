import { config, collection, singleton, fields } from '@keystatic/core'
import { block, wrapper } from '@keystatic/core/content-components'

// ---------------------------------------------------------------------------
// Shared SEO / AEO / GEO fields — spread into each content collection schema
// ---------------------------------------------------------------------------
const seoAeoGeoFields = {
  seo: fields.object(
    {
      metaTitle: fields.text({ label: 'Meta Title', description: '50–60 characters' }),
      metaDescription: fields.text({
        label: 'Meta Description',
        multiline: true,
        description: '150–160 characters',
      }),
      focusKeyword: fields.text({ label: 'Focus Keyword' }),
      canonical: fields.url({ label: 'Canonical URL', validation: { isRequired: false } }),
      ogImage: fields.image({
        label: 'OG Image',
        directory: 'public/images/og',
        publicPath: '/images/og',
        validation: { isRequired: false },
      }),
      robots: fields.select({
        label: 'Robots directive',
        options: [
          { label: 'index, follow', value: 'index, follow' },
          { label: 'noindex, follow', value: 'noindex, follow' },
          { label: 'noindex, nofollow', value: 'noindex, nofollow' },
        ],
        defaultValue: 'index, follow',
      }),
    },
    { label: 'SEO' },
  ),

  aeo: fields.object(
    {
      quotableSummary: fields.text({
        label: 'Quotable Summary',
        multiline: true,
        description: '1–2 sentence snippet for AI engines (Perplexity, ChatGPT)',
      }),
      faq: fields.array(
        fields.object(
          {
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          },
          { label: 'FAQ Item' },
        ),
        { label: 'FAQ', itemLabel: (props) => props.fields.question.value || 'FAQ Item' },
      ),
      citations: fields.array(
        fields.object(
          {
            text: fields.text({ label: 'Citation text' }),
            url: fields.url({ label: 'URL', validation: { isRequired: false } }),
          },
          { label: 'Citation' },
        ),
        { label: 'Citations', itemLabel: (props) => props.fields.text.value || 'Citation' },
      ),
      entityTags: fields.array(fields.text({ label: 'Tag' }), { label: 'Entity Tags' }),
    },
    { label: 'AEO (AI Engine Optimization)' },
  ),

  geo: fields.object(
    {
      tldr: fields.text({
        label: 'TL;DR',
        multiline: true,
        description: '2–3 sentence summary for Google AI Overview',
      }),
      contentType: fields.select({
        label: 'Content Type',
        options: [
          { label: 'Guide', value: 'guide' },
          { label: 'Article', value: 'article' },
          { label: 'Research', value: 'research' },
          { label: 'Tool', value: 'tool' },
          { label: 'FAQ', value: 'faq' },
        ],
        defaultValue: 'article',
      }),
      readingLevel: fields.select({
        label: 'Reading Level',
        options: [
          { label: 'General audience', value: 'general' },
          { label: 'High school (SMA)', value: 'sma' },
          { label: 'University', value: 'university' },
          { label: 'Professional', value: 'professional' },
        ],
        defaultValue: 'general',
      }),
      keyTakeaways: fields.array(fields.text({ label: 'Takeaway' }), { label: 'Key Takeaways' }),
    },
    { label: 'GEO (Generative Engine Optimization)' },
  ),
}

// ---------------------------------------------------------------------------
// Reusable MDX block components shared by blog / panduan / programmatic
// ---------------------------------------------------------------------------
const articleMdxComponents = {
  ArticleImage: block({
    label: 'Article Image',
    schema: {
      src: fields.image({
        label: 'Image',
        directory: 'public/images/blog',
        publicPath: '/images/blog',
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: 'Alt text', validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption', validation: { isRequired: false } }),
      credit: fields.text({ label: 'Photo credit', validation: { isRequired: false } }),
    },
  }),

  PullQuote: block({
    label: 'Pull Quote',
    schema: {
      quote: fields.text({ label: 'Quote', multiline: true, validation: { isRequired: true } }),
      attribution: fields.text({ label: 'Attribution', validation: { isRequired: false } }),
    },
  }),

  ComparisonTable: block({
    label: 'Comparison Table',
    schema: {
      headers: fields.array(fields.text({ label: 'Column header' }), { label: 'Column headers' }),
      rows: fields.array(
        fields.object(
          {
            cells: fields.array(fields.text({ label: 'Cell' }), { label: 'Cells' }),
          },
          { label: 'Row' },
        ),
        { label: 'Rows' },
      ),
    },
  }),

  DisclaimerBlock: block({
    label: 'Disclaimer Block (YMYL)',
    schema: {
      type: fields.select({
        label: 'Disclaimer type',
        options: [
          { label: 'Psychological assessment', value: 'psikologi' },
          { label: 'Career guidance', value: 'karier' },
          { label: 'Educational guidance', value: 'pendidikan' },
          { label: 'General', value: 'general' },
        ],
        defaultValue: 'psikologi',
      }),
      customText: fields.text({
        label: 'Custom text (optional)',
        multiline: true,
        validation: { isRequired: false },
      }),
    },
  }),

  Callout: wrapper({
    label: 'Callout',
    schema: {
      type: fields.select({
        label: 'Callout type',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Tip', value: 'tip' },
          { label: 'Important', value: 'important' },
        ],
        defaultValue: 'info',
      }),
      title: fields.text({ label: 'Title', validation: { isRequired: false } }),
    },
  }),

  Citation: block({
    label: 'Inline Citation',
    schema: {
      text: fields.text({ label: 'Citation text', validation: { isRequired: true } }),
      url: fields.url({ label: 'URL', validation: { isRequired: false } }),
      year: fields.text({ label: 'Year', validation: { isRequired: false } }),
    },
  }),
}

// ---------------------------------------------------------------------------
// Keystatic config — storage auto-detects local (dev) vs GitHub (production)
// ---------------------------------------------------------------------------
export default config({
  // process.env.NODE_ENV is the only env var reliably available in the
  // client bundle (Next.js inlines it at build time). KEYSTATIC_GITHUB_CLIENT_ID
  // is server-only (no NEXT_PUBLIC_ prefix) so it resolves to undefined on the
  // client → config would always fall back to 'local', breaking GitHub mode.
  storage: process.env.NODE_ENV === 'production'
    ? {
        kind: 'github',
        repo: { owner: 'sayagaffy', name: 'sekil.id-landingpage' },
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Sekil.id CMS' },
    navigation: {
      Content: ['blogPosts', 'panduan'],
      'Programmatic SEO': ['personalityTypes', 'careers', 'majors'],
      People: ['authors'],
      Halaman: ['pricingPage'],
      Settings: ['siteSettings', 'navigation'],
    },
  },

  collections: {
    // -------------------------------------------------------------------------
    // Authors (Part B)
    // -------------------------------------------------------------------------
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'content/authors/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.text({ label: 'Full name', validation: { isRequired: true } }),
        credential: fields.text({
          label: 'Credential / title',
          validation: { isRequired: false },
        }),
        role: fields.select({
          label: 'Role',
          options: [
            { label: 'Content author', value: 'author' },
            { label: 'Academic reviewer', value: 'reviewer' },
            { label: 'Editor', value: 'editor' },
          ],
          defaultValue: 'author',
        }),
        affiliation: fields.text({
          label: 'Institution / affiliation',
          validation: { isRequired: false },
        }),
        photo: fields.image({
          label: 'Profile photo',
          directory: 'public/images/authors',
          publicPath: '/images/authors',
          validation: { isRequired: false },
        }),
        linkedin: fields.url({ label: 'LinkedIn URL', validation: { isRequired: false } }),
        orcid: fields.text({ label: 'ORCID', validation: { isRequired: false } }),
        isAcademicReviewer: fields.checkbox({ label: 'Is academic reviewer?' }),
        bio: fields.mdx({ label: 'Bio' }),
      },
    }),

    // -------------------------------------------------------------------------
    // Blog Posts (Part C)
    // -------------------------------------------------------------------------
    blogPosts: collection({
      label: 'Blog Posts',

      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
          validation: { isRequired: true },
        }),
        publishedAt: fields.date({ label: 'Published at', validation: { isRequired: true } }),
        modifiedAt: fields.date({ label: 'Modified at', validation: { isRequired: true } }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
          validation: { isRequired: true },
        }),
        authorCredential: fields.text({
          label: 'Author credential',
          validation: { isRequired: false },
        }),
        reviewedBy: fields.relationship({
          label: 'Reviewed by',
          collection: 'authors',
          validation: { isRequired: false },
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'In Review', value: 'review' },
            { label: 'Approved', value: 'approved' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Jurusan', value: 'Jurusan' },
            { label: 'Karier', value: 'Karier' },
            { label: 'Psikologi', value: 'Psikologi' },
            { label: 'Kepribadian', value: 'Kepribadian' },
            { label: 'Panduan', value: 'Panduan' },
          ],
          defaultValue: 'Panduan',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        featured: fields.checkbox({ label: 'Featured post?' }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/blog',
          publicPath: '/images/blog',
          validation: { isRequired: false },
        }),
        ...seoAeoGeoFields,
        body: fields.mdx({
          label: 'Body',
          components: articleMdxComponents,
        }),
      },
    }),

    // -------------------------------------------------------------------------
    // Personality Types — programmatic SEO (Part D)
    // -------------------------------------------------------------------------
    personalityTypes: collection({
      label: 'Personality Types',

      slugField: 'title',
      path: 'content/kepribadian/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedAt: fields.date({ label: 'Published at', validation: { isRequired: true } }),
        modifiedAt: fields.date({ label: 'Modified at', validation: { isRequired: true } }),
        author: fields.text({ label: 'Author', validation: { isRequired: true } }),
        authorCredential: fields.text({
          label: 'Author credential',
          validation: { isRequired: false },
        }),
        reviewedBy: fields.text({ label: 'Reviewed by', validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        ...seoAeoGeoFields,
        body: fields.mdx({
          label: 'Body',
          components: articleMdxComponents,
        }),
      },
    }),

    // -------------------------------------------------------------------------
    // Careers — programmatic SEO (Part D)
    // -------------------------------------------------------------------------
    careers: collection({
      label: 'Careers',

      slugField: 'title',
      path: 'content/karier/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedAt: fields.date({ label: 'Published at', validation: { isRequired: true } }),
        modifiedAt: fields.date({ label: 'Modified at', validation: { isRequired: true } }),
        author: fields.text({ label: 'Author', validation: { isRequired: true } }),
        authorCredential: fields.text({
          label: 'Author credential',
          validation: { isRequired: false },
        }),
        reviewedBy: fields.text({ label: 'Reviewed by', validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        ...seoAeoGeoFields,
        body: fields.mdx({
          label: 'Body',
          components: articleMdxComponents,
        }),
      },
    }),

    // -------------------------------------------------------------------------
    // Majors (Jurusan) — programmatic SEO (Part D)
    // -------------------------------------------------------------------------
    majors: collection({
      label: 'Majors (Jurusan)',

      slugField: 'title',
      path: 'content/jurusan/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedAt: fields.date({ label: 'Published at', validation: { isRequired: true } }),
        modifiedAt: fields.date({ label: 'Modified at', validation: { isRequired: true } }),
        author: fields.text({ label: 'Author', validation: { isRequired: true } }),
        authorCredential: fields.text({
          label: 'Author credential',
          validation: { isRequired: false },
        }),
        reviewedBy: fields.text({ label: 'Reviewed by', validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        ...seoAeoGeoFields,
        body: fields.mdx({
          label: 'Body',
          components: articleMdxComponents,
        }),
      },
    }),

    // -------------------------------------------------------------------------
    // Panduan (Guides) (Part D)
    // -------------------------------------------------------------------------
    panduan: collection({
      label: 'Panduan (Guides)',

      slugField: 'title',
      path: 'content/panduan/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
          validation: { isRequired: true },
        }),
        publishedAt: fields.date({ label: 'Published at', validation: { isRequired: true } }),
        modifiedAt: fields.date({ label: 'Modified at', validation: { isRequired: true } }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
          validation: { isRequired: true },
        }),
        authorCredential: fields.text({
          label: 'Author credential',
          validation: { isRequired: false },
        }),
        reviewedBy: fields.relationship({
          label: 'Reviewed by',
          collection: 'authors',
          validation: { isRequired: false },
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'In Review', value: 'review' },
            { label: 'Approved', value: 'approved' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/panduan',
          publicPath: '/images/panduan',
          validation: { isRequired: false },
        }),
        ...seoAeoGeoFields,
        body: fields.mdx({
          label: 'Body',
          components: articleMdxComponents,
        }),
      },
    }),
  },

  singletons: {
    // -------------------------------------------------------------------------
    // Site Settings (Part E)
    // -------------------------------------------------------------------------
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Site name', validation: { isRequired: true } }),
        siteDescription: fields.text({ label: 'Site description', multiline: true }),
        defaultOgImage: fields.image({
          label: 'Default OG Image',
          directory: 'public/images/og',
          publicPath: '/images/og',
          validation: { isRequired: false },
        }),
        socialLinks: fields.object(
          {
            twitter: fields.url({ label: 'Twitter / X', validation: { isRequired: false } }),
            instagram: fields.url({ label: 'Instagram', validation: { isRequired: false } }),
            linkedin: fields.url({ label: 'LinkedIn', validation: { isRequired: false } }),
            youtube: fields.url({ label: 'YouTube', validation: { isRequired: false } }),
          },
          { label: 'Social Links' },
        ),
      },
    }),

    // -------------------------------------------------------------------------
    // Pricing Page — /harga (editable hero, FAQ, ATC, CTA)
    // -------------------------------------------------------------------------
    pricingPage: singleton({
      label: 'Pricing Page (/harga)',
      path: 'content/pages/pricing',
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow label' }),
            heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
            subheading: fields.text({ label: 'Subheading', multiline: true }),
            pillars: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Label', validation: { isRequired: true } }),
                  value: fields.text({ label: 'Value', validation: { isRequired: true } }),
                  sub: fields.text({ label: 'Sub-label' }),
                },
                { label: 'Pillar stat' },
              ),
              {
                label: 'Key stats (max 3)',
                itemLabel: (props) => props.fields.value.value || 'Stat',
              },
            ),
          },
          { label: 'Hero section' },
        ),

        faq: fields.array(
          fields.object(
            {
              q: fields.text({ label: 'Question', validation: { isRequired: true } }),
              a: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
            },
            { label: 'FAQ item' },
          ),
          {
            label: 'Pricing FAQ',
            itemLabel: (props) => props.fields.q.value || 'FAQ item',
          },
        ),

        atcDashboard: fields.object(
          {
            price: fields.text({ label: 'Price (e.g. "Rp 30 juta")', validation: { isRequired: true } }),
            priceUnit: fields.text({ label: 'Price unit (e.g. "/tahun")' }),
            features: fields.array(fields.text({ label: 'Feature' }), {
              label: 'Feature list',
              itemLabel: (props) => props.value || 'Feature',
            }),
          },
          { label: 'ATC Dashboard add-on' },
        ),

        ctaHeading: fields.text({ label: 'Bottom CTA heading' }),
        ctaSubheading: fields.text({ label: 'Bottom CTA subheading', multiline: true }),
      },
    }),

    // -------------------------------------------------------------------------
    // Navigation (Part E)
    // -------------------------------------------------------------------------
    navigation: singleton({
      label: 'Navigation',
      path: 'content/settings/navigation',
      schema: {
        headerItems: fields.array(
          fields.object(
            {
              label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              href: fields.text({ label: 'URL path', validation: { isRequired: true } }),
              isExternal: fields.checkbox({ label: 'External link?' }),
              children: fields.array(
                fields.object(
                  {
                    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
                    href: fields.text({ label: 'URL path', validation: { isRequired: true } }),
                  },
                  { label: 'Sub-item' },
                ),
                { label: 'Dropdown items' },
              ),
            },
            { label: 'Nav item' },
          ),
          {
            label: 'Header navigation items',
            itemLabel: (props) => props.fields.label.value || 'Nav item',
          },
        ),
      },
    }),
  },
})
