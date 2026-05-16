interface CitationProps {
  text: string
  url?: string
  year?: string
}

export function Citation({ text, url, year }: CitationProps) {
  const content = year ? `${text} (${year})` : text
  if (url) {
    return (
      <cite className="inline-flex items-baseline gap-1 not-italic">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-blue-600 underline underline-offset-2 hover:text-ink"
        >
          [{content}]
        </a>
      </cite>
    )
  }
  return (
    <cite className="font-mono text-[11px] text-ash-600 not-italic">[{content}]</cite>
  )
}
