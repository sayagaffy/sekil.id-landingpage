interface PullQuoteProps {
  quote: string
  attribution?: string
}

export function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <aside className="my-8 border-2 border-ink bg-peach-300/30 p-6 shadow-[4px_4px_0px_0px_#0a1230]">
      <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
        KUTIPAN
      </p>
      <blockquote className="font-display text-xl font-bold leading-snug text-ink">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
          — {attribution}
        </p>
      )}
    </aside>
  )
}
