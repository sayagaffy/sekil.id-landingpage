import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * ISR revalidation webhook — called by Sanity when content is published.
 *
 * Setup:
 * 1. Sanity dashboard → API → Webhooks → Create
 * 2. URL: https://sekil.id/api/revalidate
 * 3. Dataset: production
 * 4. Trigger on: create, update, delete
 * 5. HTTP method: POST
 * 6. Secret: value of SANITY_REVALIDATE_SECRET env var
 *
 * The webhook fires immediately when an editor publishes content.
 * Pages update in seconds, no manual redeploy needed.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current?: string }
      personalitySlug?: string
      careerSlug?: string
      majorSlug?: string
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'No _type in body' }, { status: 400 })
    }

    const { _type, slug } = body

    // Revalidate based on document type
    switch (_type) {
      case 'post':
        revalidateTag('post')
        revalidatePath('/blog')
        if (slug?.current) revalidatePath(`/blog/${slug.current}`)
        break

      case 'panduan':
        revalidateTag('panduan')
        revalidatePath('/panduan')
        if (slug?.current) revalidatePath(`/panduan/${slug.current}`)
        break

      case 'personalityPost':
        revalidateTag('personalityPost')
        if (body.personalitySlug) revalidatePath(`/kepribadian/${body.personalitySlug}`)
        break

      case 'careerPost':
        revalidateTag('careerPost')
        if (body.careerSlug) revalidatePath(`/karier/${body.careerSlug}`)
        break

      case 'majorPost':
        revalidateTag('majorPost')
        if (body.majorSlug) revalidatePath(`/jurusan/${body.majorSlug}`)
        break

      case 'author':
        revalidateTag('author')
        revalidatePath('/penulis')
        if (slug?.current) revalidatePath(`/penulis/${slug.current}`)
        // Author changes might affect blog posts too
        revalidatePath('/blog')
        break

      case 'pricingPage':
        revalidatePath('/harga')
        break

      case 'siteSettings':
      case 'navigation':
        // Site-wide changes → revalidate everything
        revalidatePath('/', 'layout')
        break

      default:
        revalidatePath('/')
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      type: _type,
      slug: slug?.current,
      now: Date.now(),
    })
  } catch (err: unknown) {
    console.error('Revalidate error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
