import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPricingFAQSchema } from '@/lib/seo/pricing-schema';
import { Container } from '@/components/layout/Container';

const PRICING_FAQ = [
  {
    q: 'Bagaimana sistem pembayaran untuk institusi?',
    a: 'Institusi dapat melakukan pembelian seat secara bulk via transfer bank (BCA, Mandiri, BNI) atau kartu kredit. Setelah pembayaran dikonfirmasi, seat akan aktif dan link tes dapat didistribusikan ke peserta. Untuk pembelian 500+ seat, tersedia opsi invoice dan pembayaran Net-30.',
  },
  {
    q: 'Apakah seat yang dibeli ada masa berlakunya?',
    a: 'Ya. Seat berlaku selama 12 bulan sejak tanggal pembelian. Seat yang belum digunakan tidak dapat di-refund setelah masa berlaku berakhir. Kami merekomendasikan membeli sesuai kebutuhan aktual dan melakukan top-up jika diperlukan.',
  },
  {
    q: 'Apakah diskon volume berlaku per produk atau per total peserta?',
    a: 'Diskon berlaku per-asesmen per-seat. Jika Anda membeli 1.000 seat untuk Career Interest dan 500 seat untuk PsyAI, masing-masing mendapatkan diskon berdasarkan jumlah seat produk tersebut — 25% untuk Career Interest (2.000 tier) dan 15% untuk PsyAI (500 tier).',
  },
  {
    q: 'Apakah ada uji coba gratis untuk institusi?',
    a: 'Kami menyediakan demo produk dan penjelasan metodologi untuk pengambil keputusan institusi — bukan akses tes gratis untuk peserta. Untuk pilot program dengan 50 seat atau lebih, hubungi tim kami untuk mendiskusikan kemungkinan harga pilot.',
  },
  {
    q: 'Bagaimana jika saya ingin produk yang berbeda untuk kelompok peserta yang berbeda?',
    a: 'Tidak ada masalah. Anda bisa membeli seat untuk beberapa produk secara bersamaan atau terpisah. Setiap pembelian produk dihitung diskon volumenya secara independen. Dashboard institusi memungkinkan Anda mengatur akses per-produk per-kelompok peserta.',
  },
];

export function PricingFAQ() {
  return (
    <section
      className="border-b-2 border-ink bg-white py-16"
      aria-labelledby="pricing-faq-heading"
    >
      <JsonLd data={getPricingFAQSchema(PRICING_FAQ)} />

      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-4">FAQ HARGA</p>
          <h2
            id="pricing-faq-heading"
            className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
          >
            Pertanyaan tentang harga & pembayaran
          </h2>

          <div className="mt-10 border-2 border-ink">
            <Accordion type="single" collapsible>
              {PRICING_FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`pfaq-${i}`}
                  className={i < PRICING_FAQ.length - 1 ? 'border-b-2 border-ink' : ''}
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
