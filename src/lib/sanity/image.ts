import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'

const imageBuilder = createImageUrlBuilder(client)

/**
 * Build a Sanity image URL with optional transforms.
 *
 * @example
 * urlFor(post.coverImage).width(800).height(450).fit('crop').url()
 */
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}
