import type { PortableTextComponents } from '@portabletext/react'
import { SanityImage } from './SanityImage'
import type { SanityImage as SanityImageType } from '@/lib/sanity/types'

// ── Types for custom block props ─────────────────────────────────────────────

interface ArticleImageValue {
  image: SanityImageType
  alt: string
  caption?: string
  credit?: string
}

interface PullQuoteValue {
  quote: string
  attribution?: string
}

interface ComparisonTableValue {
  headers: string[]
  rows: Array<{ cells: string[] }>
}

interface DisclaimerValue {
  type: 'psikologi' | 'karier' | 'pendidikan' | 'general'
  customText?: string
}

interface CalloutValue {
  calloutType: 'info' | 'tip' | 'warning' | 'important'
  title?: string
  content: unknown[]
}

interface CitationValue {
  text: string
  url?: string
  year?: string
}

// ── Disclaimer default texts ─────────────────────────────────────────────────

const DISCLAIMER_TEXTS: Record<string, string> = {
  psikologi:
    'Konten ini bersifat informatif dan tidak menggantikan konsultasi psikolog atau profesional kesehatan mental berlisensi.',
  karier:
    'Informasi karier ini bersifat umum. Kondisi pasar kerja dapat berbeda sesuai wilayah dan situasi individu.',
  pendidikan:
    'Persyaratan dan kurikulum pendidikan dapat berbeda antar institusi dan dapat berubah sewaktu-waktu.',
  general:
    'Konten ini bersifat informatif. Konsultasikan dengan profesional terkait sebelum mengambil keputusan penting.',
}

// ── Callout styles ───────────────────────────────────────────────────────────

const CALLOUT_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  info:      { bg: 'bg-blue-50',   border: 'border-blue-500',  icon: 'ℹ️' },
  tip:       { bg: 'bg-green-50',  border: 'border-green-500', icon: '💡' },
  warning:   { bg: 'bg-amber-50',  border: 'border-amber-500', icon: '⚠️' },
  important: { bg: 'bg-red-50',    border: 'border-red-500',   icon: '🚨' },
}

// ── Main components map ──────────────────────────────────────────────────────

export const portableTextComponents: PortableTextComponents = {
  // ── Block styles ──────────────────────────────────────────────────────────
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-ash-800">{children}</p>
    ),
    h2: ({ value, children }) => (
      <h2 id={value._key} className="mb-4 mt-8 font-display text-2xl font-bold text-ink">
        {children}
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3 id={value._key} className="mb-3 mt-6 font-display text-xl font-bold text-ink">
        {children}
      </h3>
    ),
    h4: ({ value, children }) => (
      <h4 id={value._key} className="mb-2 mt-4 font-display text-base font-bold text-ink">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-ash-700">
        {children}
      </blockquote>
    ),
  },

  // ── Lists ─────────────────────────────────────────────────────────────────
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-none space-y-2 pl-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-2 text-ash-800">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-ash-800">{children}</li>
    ),
  },

  // ── Marks ─────────────────────────────────────────────────────────────────
  marks: {
    strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-ash-100 px-1.5 py-0.5 font-mono text-[0.875em] text-ink">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <del>{children}</del>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#'
      const blank: boolean = value?.blank ?? false
      return (
        <a
          href={href}
          {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
        >
          {children}
        </a>
      )
    },
  },

  // ── Custom block types ────────────────────────────────────────────────────
  types: {
    articleImageBlock: ({ value }: { value: ArticleImageValue }) => (
      <figure className="my-8 border-2 border-ink">
        <div className="relative aspect-[16/9] w-full">
          <SanityImage
            image={value.image}
            alt={value.alt}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>
        {(value.caption || value.credit) && (
          <figcaption className="border-t-2 border-ink bg-paper px-4 py-2 font-mono text-[11px] text-ash-700">
            {value.caption}
            {value.caption && value.credit && ' · '}
            {value.credit && <span className="opacity-60">📷 {value.credit}</span>}
          </figcaption>
        )}
      </figure>
    ),

    pullQuoteBlock: ({ value }: { value: PullQuoteValue }) => (
      <aside className="my-8 border-l-4 border-blue-500 py-2 pl-6">
        <blockquote className="font-display text-xl font-medium leading-relaxed text-ink">
          &ldquo;{value.quote}&rdquo;
        </blockquote>
        {value.attribution && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
            — {value.attribution}
          </p>
        )}
      </aside>
    ),

    comparisonTableBlock: ({ value }: { value: ComparisonTableValue }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-2 border-ink text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {value.headers.map((h, i) => (
                <th key={i} className="border-r border-ink/20 px-4 py-2 text-left font-mono text-[11px] uppercase tracking-[0.1em] last:border-r-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-paper' : 'bg-ash-50'}>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="border-r border-t border-ink/20 px-4 py-2 last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),

    disclaimerBlock: ({ value }: { value: DisclaimerValue }) => (
      <div className="my-6 border-2 border-amber-400 bg-amber-50 p-4" role="note" aria-label="Disclaimer">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
          ⚠️ Disclaimer
        </p>
        <p className="mt-1 text-sm leading-relaxed text-amber-900">
          {value.customText || DISCLAIMER_TEXTS[value.type] || DISCLAIMER_TEXTS.general}
        </p>
      </div>
    ),

    calloutBlock: ({ value }: { value: CalloutValue }) => {
      const style = CALLOUT_STYLES[value.calloutType] ?? CALLOUT_STYLES.info
      return (
        <div className={`my-6 border-2 ${style.border} ${style.bg} p-4`} role="note">
          {value.title && (
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
              {style.icon} {value.title}
            </p>
          )}
          <div className="text-sm leading-relaxed text-ash-800">
            {/* Callout has its own nested portable text */}
            {value.content?.map((block, i) => {
              if (typeof block === 'object' && block !== null && 'children' in block) {
                const b = block as { children?: Array<{ text?: string }> }
                return (
                  <p key={i}>{b.children?.map((c) => c.text).join('') ?? ''}</p>
                )
              }
              return null
            })}
          </div>
        </div>
      )
    },

    citationBlock: ({ value }: { value: CitationValue }) => (
      <span className="mx-0.5 inline-flex items-center gap-1">
        {value.url ? (
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-blue-600 underline underline-offset-2"
          >
            [{value.text}{value.year ? `, ${value.year}` : ''}]
          </a>
        ) : (
          <span className="font-mono text-[10px] text-ash-600">
            [{value.text}{value.year ? `, ${value.year}` : ''}]
          </span>
        )}
      </span>
    ),
  },
}
