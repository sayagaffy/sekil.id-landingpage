# Sekil.id Landing Page — Project Convention

## Overview
Marketing landing page untuk Sekil.id (JV Sekil.id × B One Corp).
- Production: https://sekil.id
- Portal app (separate repo): app.sekil.id

## Tech Stack
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- MDX untuk content
- Vercel deployment

## Conventions

### TypeScript
- Strict mode enabled
- No `any` allowed
- Explicit interface untuk component props
- Type imports separate (`import type { Foo } from ...`)

### File Naming
- Components: PascalCase (`ProductCard.tsx`)
- Utilities: kebab-case (`get-products.ts`)
- Pages: lowercase (`page.tsx`, `layout.tsx`)
- MDX: kebab-case slug

### Component Patterns
- Server Component default (App Router)
- Client Component hanya kalau perlu interactivity (`'use client'`)
- Page-specific component di folder yang sama dengan page
- Shared component di `src/components/{category}/`

### Styling
- Tailwind utility classes
- Custom values via CSS variables di `src/styles/globals.css`
- Design tokens di `design/design-tokens.json` (single source)
- DO NOT hardcode color/spacing — gunakan token

### SEO
- Setiap page WAJIB: title, description, canonical, JSON-LD schema
- Schema generator di `src/lib/seo/`
- Use Next.js Metadata API (`export const metadata`)

### Content
- Blog/guide content di `content/*.mdx`
- Programmatic content generated via script (lihat specs/03)
- Setiap MDX file ada frontmatter: title, description, publishedAt, modifiedAt, author

### Accessibility
- WCAG AA compliance
- Semantic HTML
- Keyboard navigable
- Alt text descriptive

### Performance
- Next.js Image untuk semua image
- Font subset + preload critical
- Lazy load below-fold
- Core Web Vitals green target

## Forbidden
- Hardcoded color hex / px value (use tokens)
- `any` type
- Inline event handler tanpa client component declaration
- External CSS file selain `globals.css` + `themes.css`
- `<img>` tag (use Next.js Image)
- `<a>` tag untuk internal link (use Next.js Link)

## Reference Docs
- specs/01_Landingpage_Spec_v1.md — full page spec
- specs/02_SEO_AEO_GEO_Strategy.md — SEO technical
- specs/03_Content_Production_Pipeline.md — content generation
- specs/04_Claude_Design_Handoff_Prompts.md — handoff prompts

## Workflow
1. Always read relevant spec doc sebelum start page
2. Pull latest design tokens dari Claude Design
3. Build dengan reuse existing component
4. Test mobile (375px) sebelum claim done
5. Run `npm run build` pass sebelum PR
6. Side-by-side compare dengan design canvas
