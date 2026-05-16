import type { Metadata } from 'next';
import { Brain, MapPin, GraduationCap } from 'lucide-react';
import { Hero } from '@/components/marketing/Hero';
import { FeatureCard } from '@/components/marketing/FeatureCard';
import { CTAStrip } from '@/components/marketing/CTAStrip';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/layout/Container';
import { getSiteSchema, getWebSiteSchema } from '@/lib/seo/site-schema';

export const metadata: Metadata = {
  title: 'Asesmen Psikologi & Pemetaan Karier untuk Indonesia | Sekil.id',
  description:
    'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI. AI-powered, hasil dalam 10 menit. Dipakai sekolah, kampus, dan perusahaan.',
  alternates: { canonical: '/' },
};

const FEATURES = [
  {
    icon: Brain,
    title: 'Validasi Akademik UNJANI',
    description:
      'Setiap instrumen asesmen divalidasi oleh Fakultas Psikologi Universitas Jenderal Achmad Yani (UNJANI) Bandung untuk memastikan akurasi dan reliabilitas ilmiah.',
  },
  {
    icon: MapPin,
    title: 'Pemetaan Karier Berbasis AI',
    description:
      'Algoritma AI mengintegrasikan hasil Holland Code, MBTI, dan Papi Kostick untuk menghasilkan rekomendasi karier yang personal dan kontekstual untuk pasar Indonesia.',
  },
  {
    icon: GraduationCap,
    title: 'Untuk Semua Segmen',
    description:
      'Dari siswa SMA yang memilih jurusan hingga perusahaan yang memetakan potensi karyawan — satu platform untuk semua kebutuhan asesmen psikologi.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Apa itu Sekil.id?',
    answer:
      'Sekil.id adalah platform asesmen psikologi dan pemetaan karier berbasis AI dengan validasi akademik dari Fakultas Psikologi UNJANI. Kami membantu sekolah, kampus, dan perusahaan memahami potensi individu secara ilmiah dan akurat.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk mengikuti asesmen?',
    answer:
      'Tergantung produk yang dipilih: Career Interest (15 menit), PsyAI (20 menit), Path Finder AI (15 menit). Hasil tersedia langsung setelah asesmen selesai.',
  },
  {
    question: 'Apakah hasil asesmen sudah tervalidasi secara ilmiah?',
    answer:
      'Ya. Semua instrumen asesmen Sekil.id divalidasi oleh Fakultas Psikologi UNJANI menggunakan standar psikometri internasional (validitas & reliabilitas). Ini bukan sekadar kuis online — ini asesmen psikologi yang sesungguhnya.',
  },
  {
    question: 'Bagaimana cara memulai untuk institusi (sekolah/kampus/perusahaan)?',
    answer:
      'Jadwalkan demo gratis dengan tim kami. Kami akan menjelaskan paket yang sesuai, menunjukkan contoh laporan, dan membantu setup untuk institusi Anda. Proses onboarding biasanya 1–3 hari kerja.',
  },
  {
    question: 'Apakah data peserta aman?',
    answer:
      'Data disimpan di server terenkripsi dengan standar keamanan tinggi. Kami mematuhi UU Perlindungan Data Pribadi (UU 27/2022). Data peserta tidak dibagikan ke pihak ketiga tanpa izin institusi.',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={getSiteSchema()} />
      <JsonLd data={getWebSiteSchema()} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />

      <main id="main-content">
        {/* Hero */}
        <Hero
          heading="Asesmen Psikologi & Pemetaan Karier untuk Indonesia"
          subheading="Validasi akademik UNJANI. Dipakai sekolah, kampus, dan perusahaan. AI-powered, hasil dalam 10 menit."
          primaryCta={{ label: 'Jadwalkan Demo Gratis', href: '/demo' }}
          secondaryCta={{ label: 'Lihat Produk', href: '/produk' }}
          background="dot-pattern"
        />

        {/* Features */}
        <section className="py-20" aria-labelledby="features-heading">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 id="features-heading" className="font-display text-3xl font-bold sm:text-4xl">
                Mengapa Memilih Sekil.id?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Satu-satunya platform asesmen psikologi di Indonesia dengan validasi akademik
                perguruan tinggi terakreditasi.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </Container>
        </section>

        {/* CTA strip */}
        <CTAStrip
          heading="Siap Mulai Asesmen?"
          subtext="Ribuan peserta dari sekolah, kampus, dan perusahaan sudah menggunakan Sekil.id."
        />

        {/* FAQ */}
        <section className="py-20" aria-labelledby="faq-heading">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2
                id="faq-heading"
                className="mb-8 font-display text-3xl font-bold text-center sm:text-4xl"
              >
                Pertanyaan yang Sering Diajukan
              </h2>
              <FAQAccordion items={FAQ_ITEMS} />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
