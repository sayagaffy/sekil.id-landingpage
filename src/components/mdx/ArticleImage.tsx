import Image from 'next/image'

interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
  credit?: string
}

export function ArticleImage({ src, alt, caption, credit }: ArticleImageProps) {
  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full border-2 border-ink shadow-[4px_4px_0px_0px_#0a1230]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {(caption || credit) && (
        <figcaption className="mt-2 border-l-2 border-peach-300 pl-3">
          {caption && (
            <span className="block text-sm leading-snug text-ash-700">{caption}</span>
          )}
          {credit && (
            <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ash-500">
              Foto: {credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
