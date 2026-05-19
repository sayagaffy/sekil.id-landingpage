import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPricingFAQSchema } from '@/lib/seo/pricing-schema';
import { Container } from '@/components/layout/Container';
export interface PricingFaqItem {
  q: string
  a: string
}

interface PricingFAQProps {
  /** FAQ items from CMS — falls back to empty array if omitted */
  items: PricingFaqItem[];
}

export function PricingFAQ({ items }: PricingFAQProps) {
  const faqForSchema = items.map((item) => ({ q: item.q, a: item.a }));

  return (
    <section
      className="border-b-2 border-ink bg-white py-16"
      aria-labelledby="pricing-faq-heading"
    >
      <JsonLd data={getPricingFAQSchema(faqForSchema)} />

      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-4">FAQ HARGA</p>
          <h2
            id="pricing-faq-heading"
            className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
          >
            Pertanyaan tentang harga &amp; pembayaran
          </h2>

          <div className="mt-10 border-2 border-ink">
            <Accordion type="single" collapsible>
              {items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`pfaq-${i}`}
                  className={i < items.length - 1 ? 'border-b-2 border-ink' : ''}
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-display font-semibold text-ink hover:no-underline hover:bg-peach-300/30 data-[state=open]:bg-peach-300/30">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="border-t-2 border-ink bg-paper px-6 py-4 text-sm leading-relaxed text-ash-700">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  );
}
