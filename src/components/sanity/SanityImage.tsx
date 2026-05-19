import NextImage from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage as SanityImageType } from '@/lib/sanity/types'

interface SanityImageProps {
  image: SanityImageType
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  quality?: number
}

/**
 * Renders a Sanity image via Next.js Image with automatic
 * CDN URL building and hotspot-aware cropping.
 */
export function SanityImage({
  image,
  alt,
  width = 800,
  height = 450,
  fill = false,
  sizes = '(max-width: 768px) 100vw, 800px',
  priority = false,
  className,
  quality = 85,
}: SanityImageProps) {
  if (!image?.asset?._ref) return null

  const url = fill
    ? urlFor(image).fit('crop').auto('format').quality(quality).url()
    : urlFor(image).width(width).height(height).fit('crop').auto('format').quality(quality).url()

  const resolvedAlt = alt ?? image.alt ?? ''

  if (fill) {
    return (
      <NextImage
        src={url}
        alt={resolvedAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <NextImage
      src={url}
      alt={resolvedAlt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      quality={quality}
    />
  )
}
