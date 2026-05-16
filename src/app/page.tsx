import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Compass, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteSchema, getWebSiteSchema } from '@/lib/seo/site-schema';

export const metadata: Metadata = {
  title: 'Asesmen Psikologi & Pemetaan Karier untuk Indonesia | Sekil.id',
  description:
    'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI. AI-powered, hasil dalam 10 menit. Dipakai sekolah, kampus, dan perusahaan.',
  alternates: { canonical: '/' },
};

const PRODUCTS = [
  {
    tag: 'PSYAI',
    icon: Brain,
    title: 'Asesmen psikologi adaptif.',
    body: '18 dimensi kepribadian, minat, dan kekuatan. Dipetakan oleh AI dalam 12 menit.',
    meta: ['12 MIN', '18 DIMENSI', 'EVIDENCE-LED'],
    variant: 'default' as const,
    href: '/produk/psyai',
  },
  {
    tag: 'PATH FINDER AI',
    icon: Compass,
    title: 'Temukan jalur jurusan & profesi.',
    body: '248 jurusan dan 1,400+ profesi dipetakan ke profil minat & kekuatan Anda.',
    meta: ['248 JURUSAN', '1,400+ PROFESI'],
    variant: 'peach' as const,
    href: '/produk/path-finder-ai',
  },
  {
    tag: 'GOAL ALIGN AI',
    icon: Target,
    title: 'Selaraskan tujuan personal & karier.',
    body: 'Untuk profesional dan institusi yang ingin memantau perkembangan tim.',
    meta: ['BETA · v0.4'],
    variant: 'navy' as const,
    href: '/produk/goal-align-ai',
  },
];

const STATS = [
  { label: 'Siswa terverifikasi', value: '62,400', unit: '+' },
  { label: 'Sekolah mitra', value: '340', unit: '' },
  { label: 'Akurasi PsyAI', value: '94', unit: '%', featured: true },
  { label: 'Durasi rata-rata', value: '11', unit: ' min' },
];

const FAQ_ITEMS = [
  {
    q: 'Apa itu Sekil.id?',
    a: 'Sekil.id adalah platform asesmen psikologi dan pemetaan karier berbasis AI dengan validasi akademik dari Fakultas Psikologi UNJANI. Kami membantu sekolah, kampus, dan perusahaan memahami potensi individu secara ilmiah dan akurat.',
  },
  {
    q: 'Berapa lama waktu asesmen?',
    a: 'Tergantung produk yang dipilih: PsyAI (12 menit), Path Finder AI (15 menit), Goal Align AI (20 menit). Hasil tersedia langsung setelah asesmen selesai.',
  },
  {
    q: 'Apakah hasil asesmen tervalidasi ilmiah?',
    a: 'Ya. Semua instrumen divalidasi oleh Fakultas Psikologi UNJANI menggunakan standar psikometri internasional (validitas & reliabilitas). Ini bukan sekadar kuis — ini asesmen psikologi yang sesungguhnya.',
  },
  {
    q: 'Bagaimana cara mulai untuk institusi?',
    a: 'Jadwalkan demo gratis dengan tim kami. Kami menjelaskan paket yang sesuai, menunjukkan contoh laporan, dan membantu setup. Onboarding biasanya 1–3 hari kerja.',
  },
  {
    q: 'Apakah data peserta aman?',
    a: 'Data disimpan di server terenkripsi. Kami mematuhi UU Perlindungan Data Pribadi (UU 27/2022). Data peserta tidak dibagikan ke pihak ketiga tanpa izin institusi.',
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
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }}
      />

      <main id="main-content">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="grid-bg relative border-b-2 border-ink pb-24 pt-20">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-end gap-16 px-8 lg:grid-cols-[7fr_5fr]">
            {/* Left — copy */}
            <div>
              <p className="eyebrow mb-3">SEKIL.ID · ASESMEN AI</p>
              <h1 className="font-display text-[clamp(48px,7vw,96px)] font-bold leading-[0.92] tracking-[-0.04em] text-ink">
                Pahami diri Anda.{' '}
                <em className="not-italic text-blue-500">Tanpa tebakan.</em>
              </h1>
              <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.55] text-ash-700">
                Sekil.id memetakan minat, kekuatan, dan potensi Anda dengan tiga AI khusus —
                PsyAI, Path Finder AI, dan Goal Align AI. Hasil yang bisa Anda jelaskan ke orang
                tua, ke wali kelas, ke diri sendiri.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/demo">Mulai asesmen &rarr;</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/metodologi">Lihat metodologi</Link>
                </Button>
              </div>
              {/* Meta strip */}
              <div className="mt-12 flex flex-wrap gap-8 border-t-2 border-ink pt-6">
                {[
                  ['+62,000', 'SISWA'],
                  ['340', 'SEKOLAH'],
                  ['18', 'PROVINSI'],
                  ['v2.1', 'PSYAI'],
                ].map(([val, label]) => (
                  <div key={label} className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                    <span className="font-bold text-ink">{val}</span> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero art card */}
            <div className="hidden border-2 border-ink bg-peach-300 p-6 shadow-lg lg:flex lg:flex-col lg:justify-between"
              style={{ aspectRatio: '4/5' }}>
              <div className="flex items-start justify-between">
                <p className="eyebrow eyebrow-ink">PSYAI / SAMPEL</p>
                <span className="border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
                  LIVE
                </span>
              </div>
              <div className="flex justify-center py-8">
                <Image
                  src="/symbol-color.png"
                  alt="Sekil.id symbol"
                  width={140}
                  height={140}
                  className="h-36 w-auto"
                />
              </div>
              <div>
                <p className="font-display text-[28px] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
                  Andika &middot; INTJ-A
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                  STRATEGIST &middot; 87 / 100
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCT GRID ─────────────────────────────────────── */}
        <section className="border-b-2 border-ink py-24" aria-labelledby="produk-heading">
          <div className="mx-auto max-w-[1280px] px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow mb-3">TIGA AI · SATU PERJALANAN</p>
                <h2
                  id="produk-heading"
                  className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-ink"
                  style={{ maxWidth: '18ch' }}
                >
                  Setiap orang punya jalurnya sendiri.
                </h2>
              </div>
              <Button variant="ghost" asChild className="shrink-0">
                <Link href="/produk">Bandingkan produk &rarr;</Link>
              </Button>
            </div>

            <div className="grid gap-0 border-2 border-ink sm:grid-cols-3">
              {PRODUCTS.map((p, i) => {
                const Icon = p.icon;
                const isNavy = p.variant === 'navy';
                const isPeach = p.variant === 'peach';
                return (
                  <div
                    key={p.tag}
                    className={[
                      'flex flex-col border-b-2 border-ink p-0 sm:border-b-0',
                      i < 2 ? 'sm:border-r-2 sm:border-ink' : '',
                      isNavy ? 'bg-navy-900' : isPeach ? 'bg-peach-300' : 'bg-white',
                    ].join(' ')}
                  >
                    {/* Card header strip */}
                    <div
                      className={[
                        'flex items-center justify-between border-b-2 border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em]',
                        isNavy ? 'bg-blue-500 text-white' : 'bg-ink text-white',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={14} strokeWidth={2} />
                        {p.tag}
                      </span>
                      <span>0{i + 1}</span>
                    </div>
                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3
                        className={[
                          'font-display text-[26px] font-bold leading-[1.05] tracking-[-0.02em]',
                          isNavy ? 'text-white' : 'text-ink',
                        ].join(' ')}
                      >
                        {p.title}
                      </h3>
                      <p
                        className={[
                          'mt-2.5 text-[14px] leading-[1.55]',
                          isNavy ? 'text-sky-200' : 'text-ash-700',
                        ].join(' ')}
                      >
                        {p.body}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {p.meta.map((m) => (
                          <span
                            key={m}
                            className={[
                              'font-mono text-[10px] uppercase tracking-[0.1em]',
                              isNavy ? 'text-sky-200' : 'text-ash-500',
                            ].join(' ')}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button
                          variant={isNavy ? 'peach' : 'default'}
                          size="sm"
                          asChild
                        >
                          <Link href={p.href}>Pelajari &rarr;</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── STAT BAND ────────────────────────────────────────── */}
        <section className="border-b-2 border-ink bg-navy-900 py-24" aria-labelledby="stats-heading">
          <div className="mx-auto max-w-[1280px] px-8">
            <div className="mb-12">
              <p className="eyebrow eyebrow-peach mb-3">DALAM ANGKA · 2026</p>
              <h2
                id="stats-heading"
                className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-paper"
              >
                Hasil yang dapat dijelaskan.
                <br />
                Bukan tebakan.
              </h2>
            </div>

            <div className="grid grid-cols-2 border-2 border-paper md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={[
                    'p-8',
                    s.featured ? 'bg-peach-300' : '',
                    i < 3 ? 'border-r-2 border-r-paper' : '',
                    i < 2 ? 'border-b-2 border-b-paper md:border-b-0' : '',
                  ].join(' ')}
                >
                  <p
                    className={[
                      'font-mono text-[11px] uppercase tracking-[0.14em]',
                      s.featured ? 'eyebrow-peach text-peach-600' : 'text-peach-300',
                    ].join(' ')}
                  >
                    {s.label}
                  </p>
                  <p
                    className={[
                      'mt-2 font-display text-[48px] font-bold leading-[1] tracking-[-0.03em]',
                      s.featured ? 'text-ink' : 'text-paper',
                    ].join(' ')}
                  >
                    {s.value}
                    <span
                      className={[
                        'ml-1 text-[18px] font-semibold',
                        s.featured ? 'text-ash-700' : 'text-peach-300',
                      ].join(' ')}
                    >
                      {s.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ──────────────────────────────────────── */}
        <section className="border-b-2 border-ink py-24">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-8 lg:grid-cols-[5fr_7fr]">
            {/* Left — peach art square */}
            <div
              className="hidden border-2 border-ink bg-peach-300 shadow-lg lg:flex lg:flex-col lg:justify-between p-8"
              style={{ aspectRatio: '1/1' }}
            >
              <p className="eyebrow eyebrow-ink">12 MENIT · GRATIS</p>
              <div className="flex justify-center">
                <Image
                  src="/symbol-dark.png"
                  alt=""
                  width={80}
                  height={80}
                  className="h-20 w-auto"
                  aria-hidden="true"
                />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                STEP 1 OF 4
              </p>
            </div>

            {/* Right — copy + CTA */}
            <div>
              <p className="eyebrow mb-3">MULAI HARI INI</p>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-ink"
                style={{ maxWidth: '20ch' }}>
                12 menit untuk arah karier yang lebih jelas.
              </h2>
              <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.55] text-ash-700">
                Mulai dengan PsyAI. Hasil langsung tersambung ke Path Finder dan Goal Align —
                tanpa pengulangan, tanpa tebakan.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/demo">Mulai asesmen &rarr;</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">Jadwalkan demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="py-24" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1280px] px-8">
            <div className="mb-12">
              <p className="eyebrow mb-3">FAQ</p>
              <h2
                id="faq-heading"
                className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-[0.96] tracking-[-0.03em] text-ink"
              >
                Pertanyaan yang sering diajukan.
              </h2>
            </div>

            <div className="divide-y-2 divide-ink border-y-2 border-ink">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-5 font-display text-lg font-semibold text-ink hover:text-blue-500">
                    {item.q}
                    <span className="shrink-0 font-mono text-2xl font-light transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pb-6 text-[15px] leading-[1.65] text-ash-700">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-6">
              <Button variant="brand" asChild>
                <Link href="/demo">Jadwalkan demo gratis &rarr;</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/kontak">Ada pertanyaan lain?</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
