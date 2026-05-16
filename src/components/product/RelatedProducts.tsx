import { PRODUCTS, ACCENT_SEQUENCE } from '@/data/products';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  slugs: string[];
  currentSlug: string;
}

export function RelatedProducts({ slugs, currentSlug }: RelatedProductsProps) {
  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section
      className="border-b-2 border-ink bg-white py-16"
      aria-labelledby="related-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">SERING DIKOMBINASIKAN DENGAN</p>
        <h2
          id="related-heading"
          className="font-display text-[clamp(22px,2.5vw,36px)] font-bold text-ink"
        >
          Produk yang sering diambil bersama
        </h2>

        <div className="mt-8 flex flex-col gap-3">
          {related.map((product) => {
            const idx = PRODUCTS.findIndex((p) => p.slug === product.slug);
            const accent = ACCENT_SEQUENCE[idx % ACCENT_SEQUENCE.length];
            return (
              <ProductCard
                key={product.slug}
                product={product}
                accentVariant={accent}
                compact
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
