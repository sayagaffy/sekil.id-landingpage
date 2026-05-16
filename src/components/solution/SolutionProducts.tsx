import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS, ACCENT_SEQUENCE } from '@/data/products';

interface SolutionProductsProps {
  productSlugs: string[];
}

export function SolutionProducts({ productSlugs }: SolutionProductsProps) {
  const products = productSlugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (products.length === 0) return null;

  return (
    <section
      className="border-b-2 border-ink bg-paper py-16"
      aria-labelledby="solution-products-heading"
    >
      <Container>
        <p className="eyebrow mb-4">ASESMEN YANG DIREKOMENDASIKAN</p>
        <h2
          id="solution-products-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Produk yang paling relevan
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash-700">
          Pilih satu atau kombinasikan beberapa asesmen sesuai kebutuhan program Anda.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const idx = PRODUCTS.findIndex((p) => p.slug === product.slug);
            const accent = ACCENT_SEQUENCE[idx % ACCENT_SEQUENCE.length];
            return (
              <ProductCard key={product.slug} product={product} accentVariant={accent} />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
