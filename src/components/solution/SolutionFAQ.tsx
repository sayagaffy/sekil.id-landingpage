import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSolutionFAQSchema } from '@/lib/seo/solution-schema';
import { Container } from '@/components/layout/Container';

interface SolutionFAQProps {
  faq: { q: string; a: string }[];
}

export function SolutionFAQ({ faq }: SolutionFAQProps) {
  return (
    <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="sol-faq-heading">
      <JsonLd data={getSolutionFAQSchema(faq)} />

      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-4">FAQ</p>
          <h2
            id="sol-faq-heading"
            className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
          >
            Pertanyaan yang sering ditanya
          </h2>

          <div className="mt-10 border-2 border-ink">
            <Accordion type="single" collapsible>
              {faq.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`sol-faq-${i}`}
                  className={i < faq.length - 1 ? 'border-b-2 border-ink' : ''}
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-display font-semibold text-ink hover:no-underline hover:bg-peach-300/30 data-[state=open]:bg-peach-300/30">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="border-t-2 border-ink bg-white px-6 py-4 text-sm leading-relaxed text-ash-700">
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
