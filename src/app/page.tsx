import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Compass, Target, BarChart2, Zap, Star, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteSchema, getWebSiteSchema } from '@/lib/seo/site-schema';
import { sanityFetch } from '@/lib/sanity/live';
import type { HomePageData, HomePageStat } from '@/lib/sanity/types';
import { HOME_PAGE_QUERY } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Asesmen Psikologi & Pemetaan Karier untuk Indonesia | Sekil.id',
  description:
    'Platform asesmen psikologi & pemetaan karier dalam proses validasi bersama tim Fakultas Psikologi UNJANI. Untuk sekolah, kampus, dan perusahaan di Indonesia.',
  alternates: { canonical: '/' },
};

// ── Icon map for product cards ────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  brain: Brain,
  compass: Compass,
  target: Target,
  'bar-chart': BarChart2,
  zap: Zap,
  star: Star,
};

function getIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name]) ? ICON_MAP[name] : Brain;
}

// ── Hardcoded defaults (used when Sanity doc is empty / not yet published) ────

const DEFAULT_HERO = {
  eyebrow: 'SEKIL.ID · ASESMEN AI',
  heading: 'Pahami diri Anda.',
  headingAccent: 'Tanpa tebakan.',
  subheading:
    'Sekil.id memetakan minat, kekuatan, dan potensi Anda dengan tiga AI khusus — PsyAI, Path Finder AI, dan Goal Align AI. Hasil yang bisa Anda jelaskan ke orang tua, ke wali kelas, ke diri sendiri.',
  ctaPrimary: { label: 'Mulai asesmen →', href: '/demo' },
  ctaSecondary: { label: 'Lihat metodologi', href: '/metodologi' },
  meta: [
    { val: '967', label: 'MAHASISWA' },
    { val: 'v2.1', label: 'PSYAI' },
  ],
};

const DEFAULT_PRODUCTS = [
  {
    tag: 'PSYAI',
    iconName: 'brain',
    title: 'Asesmen psikologi adaptif.',
    body: 'Memetakan 6 dimensi minat dan 4 preferensi kepribadian — menghasilkan kode minat 3-huruf dan 1 dari 16 tipe kepribadian.',
    meta: ['6+4 DIMENSI', 'EVIDENCE-LED'],
    variant: 'default' as const,
    href: '/produk/psyai',
  },
  {
    tag: 'PATH FINDER AI',
    iconName: 'compass',
    title: 'Temukan jalur jurusan & profesi.',
    body: '248 jurusan dan 1,400+ profesi dipetakan ke profil minat & kekuatan Anda.',
    meta: ['248 JURUSAN', '1,400+ PROFESI'],
    variant: 'peach' as const,
    href: '/produk/path-finder-ai',
  },
  {
    tag: 'GOAL ALIGN AI',
    iconName: 'target',
    title: 'Selaraskan tujuan personal & karier.',
    body: 'Untuk profesional dan institusi yang ingin memantau perkembangan tim.',
    meta: ['BETA · v0.4'],
    variant: 'navy' as const,
    href: '/produk/goal-align-ai',
  },
];

const DEFAULT_STATS: HomePageStat[] = [
  { label: 'Mahasiswa', value: '967', unit: '' },
  { label: 'Dimensi diukur', value: '10', unit: '' },
];

const DEFAULT_CTA = {
  eyebrow: 'MULAI HARI INI',
  heading: 'Temukan arah karier yang lebih jelas.',
  subheading:
    'Mulai dengan PsyAI. Hasil langsung tersambung ke Path Finder dan Goal Align — tanpa pengulangan, tanpa tebakan.',
  ctaPrimary: { label: 'Mulai asesmen →', href: '/demo' },
  ctaSecondary: { label: 'Jadwalkan demo', href: '/demo' },
};

const DEFAULT_FAQ = [
  {
    q: 'Apa itu Sekil.id?',
    a: 'Sekil.id adalah platform asesmen psikologi dan pemetaan karier berbasis AI dengan validasi akademik dari Fakultas Psikologi UNJANI. Kami membantu sekolah, kampus, dan perusahaan memahami potensi individu secara ilmiah dan akurat.',
  },
  {
    q: 'Berapa lama waktu asesmen?',
    a: 'Tergantung produk yang dipilih. Durasi bervariasi antara 25–60 menit per siswa. Hasil tersedia langsung setelah asesmen selesai.',
  },
  {
    q: 'Apakah hasil asesmen tervalidasi ilmiah?',
    a: 'Ya. Semua instrumen sedang dalam proses validasi bersama tim Fakultas Psikologi UNJANI menggunakan standar psikometri internasional. Ini bukan sekadar kuis — ini asesmen psikologi yang sesungguhnya.',
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

export default async function HomePage() {
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY });
  const cms = data as HomePageData | null;

  // ── Merge CMS + defaults ───────────────────────────────────────────────────

  const hero = {
    eyebrow: cms?.heroEyebrow ?? DEFAULT_HERO.eyebrow,
    heading: cms?.heroHeading ?? DEFAULT_HERO.heading,
    headingAccent: cms?.heroHeadingAccent ?? DEFAULT_HERO.headingAccent,
    subheading: cms?.heroSubheading ?? DEFAULT_HERO.subheading,
    ctaPrimary: {
      label: cms?.heroCTAPrimary?.label ?? DEFAULT_HERO.ctaPrimary.label,
      href: cms?.heroCTAPrimary?.href ?? DEFAULT_HERO.ctaPrimary.href,
    },
    ctaSecondary: {
      label: cms?.heroCTASecondary?.label ?? DEFAULT_HERO.ctaSecondary.label,
      href: cms?.heroCTASecondary?.href ?? DEFAULT_HERO.ctaSecondary.href,
    },
    meta:
      cms?.heroMeta && cms.heroMeta.length > 0 ? cms.heroMeta : DEFAULT_HERO.meta,
  };

  const productsEyebrow = cms?.productsEyebrow ?? 'TIGA AI · SATU PERJALANAN';
  const productsHeading = cms?.productsHeading ?? 'Setiap orang punya jalurnya sendiri.';
  const products =
    cms?.products && cms.products.length > 0
      ? cms.products.map((p) => ({
          tag: p.tag,
          iconName: p.iconName ?? 'brain',
          title: p.title,
          body: p.body ?? '',
          meta: p.meta ?? [],
          variant: (p.variant ?? 'default') as 'default' | 'peach' | 'navy',
          href: p.href ?? '/produk',
        }))
      : DEFAULT_PRODUCTS;

  const statsEyebrow = cms?.statsEyebrow ?? 'DALAM ANGKA · 2026';
  const statsHeading = cms?.statsHeading ?? 'Hasil yang dapat dijelaskan.\nBukan tebakan.';
  const stats =
    cms?.stats && cms.stats.length > 0 ? cms.stats : DEFAULT_STATS;

  const cta = {
    eyebrow: cms?.ctaEyebrow ?? DEFAULT_CTA.eyebrow,
    heading: cms?.ctaHeading ?? DEFAULT_CTA.heading,
    subheading: cms?.ctaSubheading ?? DEFAULT_CTA.subheading,
    ctaPrimary: {
      label: cms?.ctaCTAPrimary?.label ?? DEFAULT_CTA.ctaPrimary.label,
      href: cms?.ctaCTAPrimary?.href ?? DEFAULT_CTA.ctaPrimary.href,
    },
    ctaSecondary: {
      label: cms?.ctaCTASecondary?.label ?? DEFAULT_CTA.ctaSecondary.label,
      href: cms?.ctaCTASecondary?.href ?? DEFAULT_CTA.ctaSecondary.href,
    },
  };

  const faqHeading = cms?.faqHeading ?? 'Pertanyaan yang sering diajukan.';
  const faqItems =
    cms?.faq && cms.faq.length > 0 ? cms.faq : DEFAULT_FAQ;

  // Split stats heading on \n for the <br /> rendering
  const statsHeadingParts = statsHeading.split('\n');

  return (
    <>
      <JsonLd data={getSiteSchema()} />
      <JsonLd data={getWebSiteSchema()} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq) => ({
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
              <p className="eyebrow mb-3">{hero.eyebrow}</p>
              <h1 className="font-display text-[clamp(48px,7vw,96px)] font-bold leading-[0.92] tracking-[-0.04em] text-ink">
                {hero.heading}{' '}
                <em className="not-italic text-blue-500">{hero.headingAccent}</em>
              </h1>
              <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.55] text-ash-700">
                {hero.subheading}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={hero.ctaSecondary.href}>{hero.ctaSecondary.label}</Link>
                </Button>
              </div>
              {/* Meta strip */}
              <div className="mt-12 flex flex-wrap gap-8 border-t-2 border-ink pt-6">
                {hero.meta.map(({ val, label }) => (
                  <div
                    key={label}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700"
                  >
                    <span className="font-bold text-ink">{val}</span> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero art card */}
            <div
              className="hidden border-2 border-ink bg-peach-300 p-6 shadow-lg lg:flex lg:flex-col lg:justify-between"
              style={{ aspectRatio: '4/5' }}
            >
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
                  Andika &middot; Sang Strategis
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                  87 / 100
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTNER STRIP ────────────────────────────────────── */}
        <section className="border-b-2 border-ink bg-paper py-8" aria-label="Mitra dan akademik">
          <div className="mx-auto max-w-[1280px] px-8">
            <p className="eyebrow mb-6">DIBANGUN BERSAMA · MITRA &amp; AKADEMIK</p>
            <div className="grid grid-cols-1 border-2 border-ink sm:grid-cols-3">
              {[
                {
                  src: '/logos/logo-b-one-corp-full-3.png',
                  alt: 'B One Corp — PT. Satu Visi Indocreative',
                  width: 180,
                  height: 52,
                },
                {
                  src: '/logos/dartstudio-logo.png',
                  alt: 'Dartstudio',
                  width: 160,
                  height: 40,
                },
                {
                  src: '/logos/logoprdc.png',
                  alt: 'PRDC — Psychological Research & Development Center, Fakultas Psikologi UNJANI',
                  width: 180,
                  height: 52,
                },
              ].map((logo, i, arr) => (
                <div
                  key={logo.src}
                  className={[
                    'group flex items-center justify-center bg-white px-8 py-6',
                    i < arr.length - 1 ? 'border-b-2 border-ink sm:border-b-0 sm:border-r-2' : '',
                  ].join(' ')}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="h-10 w-auto grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT GRID ─────────────────────────────────────── */}
        <section className="border-b-2 border-ink py-24" aria-labelledby="produk-heading">
          <div className="mx-auto max-w-[1280px] px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow mb-3">{productsEyebrow}</p>
                <h2
                  id="produk-heading"
                  className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-ink"
                  style={{ maxWidth: '18ch' }}
                >
                  {productsHeading}
                </h2>
              </div>
              <Button variant="ghost" asChild className="shrink-0">
                <Link href="/produk">Bandingkan produk &rarr;</Link>
              </Button>
            </div>

            <div className="grid gap-0 border-2 border-ink sm:grid-cols-3">
              {products.map((p, i) => {
                const Icon = getIcon(p.iconName);
                const isNavy = p.variant === 'navy';
                const isPeach = p.variant === 'peach';
                return (
                  <div
                    key={p.tag}
                    className={[
                      'flex flex-col border-b-2 border-ink p-0 sm:border-b-0',
                      i < products.length - 1 ? 'sm:border-r-2 sm:border-ink' : '',
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
                        <Button variant={isNavy ? 'peach' : 'default'} size="sm" asChild>
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
        <section
          className="border-b-2 border-ink bg-navy-900 py-24"
          aria-labelledby="stats-heading"
        >
          <div className="mx-auto max-w-[1280px] px-8">
            <div className="mb-12">
              <p className="eyebrow eyebrow-peach mb-3">{statsEyebrow}</p>
              <h2
                id="stats-heading"
                className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-paper"
              >
                {statsHeadingParts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < statsHeadingParts.length - 1 && <br />}
                  </span>
                ))}
              </h2>
            </div>

            <div className="grid grid-cols-2 border-2 border-paper md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={[
                    'p-8',
                    s.featured ? 'bg-peach-300' : '',
                    i < stats.length - 1 ? 'border-r-2 border-r-paper' : '',
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
              <p className="eyebrow eyebrow-ink">GRATIS</p>
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
              <p className="eyebrow mb-3">{cta.eyebrow}</p>
              <h2
                className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-ink"
                style={{ maxWidth: '20ch' }}
              >
                {cta.heading}
              </h2>
              <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.55] text-ash-700">
                {cta.subheading}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href={cta.ctaPrimary.href}>{cta.ctaPrimary.label}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={cta.ctaSecondary.href}>{cta.ctaSecondary.label}</Link>
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
                {faqHeading}
              </h2>
            </div>

            <div className="divide-y-2 divide-ink border-y-2 border-ink">
              {faqItems.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-5 font-display text-lg font-semibold text-ink hover:text-blue-500">
                    {item.q}
                    <span className="shrink-0 font-mono text-2xl font-light transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pb-6 text-[15px] leading-[1.65] text-ash-700">{item.a}</div>
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
