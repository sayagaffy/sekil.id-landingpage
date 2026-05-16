import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AuthorByline } from '@/components/seo/AuthorByline';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { InstrumentSection } from '@/components/methodology/InstrumentSection';
import { UnjaniTeam } from '@/components/methodology/UnjaniTeam';
import { AIBoundary } from '@/components/methodology/AIBoundary';
import { ReferencesList } from '@/components/methodology/ReferencesList';
import { INSTRUMENTS, UNJANI_TEAM, REFERENCES } from '@/data/methodology';
import { getMethodologyArticleSchema } from '@/lib/seo/methodology-schema';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';

const PUBLISHED = '2026-05-16';
const AUTHOR_NAME = 'Dr. [Placeholder UNJANI Lecturer Name], M.Psi., Psikolog';
const AUTHOR_AFFILIATION = 'Dosen Psikologi UNJANI · Reviewer Akademik Sekil.id';

export const metadata: Metadata = {
  title: 'Metodologi Asesmen: Holland Code, MBTI, Papi Kostick | Sekil.id',
  description:
    'Sekil.id dibangun di atas 3 instrumen psikologi tervalidasi: Holland Code, MBTI, Papi Kostick. Divalidasi akademik oleh Fakultas Psikologi UNJANI.',
  alternates: { canonical: 'https://sekil.id/metodologi' },
  openGraph: {
    title: 'Metodologi Asesmen: Holland Code, MBTI, Papi Kostick | Sekil.id',
    description:
      'Sekil.id dibangun di atas 3 instrumen psikologi tervalidasi: Holland Code, MBTI, Papi Kostick. Divalidasi akademik oleh Fakultas Psikologi UNJANI.',
    url: 'https://sekil.id/metodologi',
    type: 'article',
  },
};

export default function MetodologiPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Metodologi', url: '/metodologi' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={getMethodologyArticleSchema()} />

      <main id="main-content">
        {/* 1. Breadcrumb */}
        <div className="border-b-2 border-ink bg-paper">
          <Container>
            <nav aria-label="Breadcrumb" className="py-3">
              <ol className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                <li>
                  <Link href="/" className="transition-colors hover:text-blue-500">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <span className="text-ink" aria-current="page">
                    Metodologi
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 2. Hero */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
              <div>
                <p className="eyebrow mb-4">METODOLOGI · 3 INSTRUMEN TERVALIDASI</p>
                <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
                  Dibangun di Atas 3 Instrumen Tervalidasi
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-700">
                  Asesmen Sekil.id menggunakan instrumen psikologi yang sudah teruji secara akademik
                  selama puluhan tahun, divalidasi ulang untuk konteks Indonesia oleh tim Fakultas
                  Psikologi UNJANI.
                </p>
                <div className="mt-8 border-2 border-ink bg-peach-300 p-5 shadow-sm">
                  <AuthorByline
                    name={AUTHOR_NAME}
                    affiliation={AUTHOR_AFFILIATION}
                    publishedAt={PUBLISHED}
                    modifiedAt={PUBLISHED}
                  />
                </div>
              </div>

              {/* Quick-nav to instrument sections */}
              <nav
                aria-label="Daftar Instrumen"
                className="border-2 border-ink shadow-md self-start"
              >
                <div className="border-b-2 border-ink bg-ink px-5 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/70">
                    Instrumen yang Digunakan
                  </p>
                </div>
                {INSTRUMENTS.map((inst, i) => (
                  <a
                    key={inst.id}
                    href={`#${inst.id}`}
                    className={[
                      'flex items-center gap-3 px-5 py-4 text-sm font-medium text-ink transition-colors duration-120 hover:bg-ink hover:text-paper',
                      i < INSTRUMENTS.length - 1 ? 'border-b-2 border-ink' : '',
                    ].join(' ')}
                  >
                    <span className="font-mono text-[10px] text-ash-700">0{i + 1}</span>
                    <span>{inst.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </Container>
        </section>

        {/* 3. Intro paragraph */}
        <section className="border-b-2 border-ink bg-white py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow mb-4">PENDEKATAN KAMI</p>
              <div className="space-y-5 leading-relaxed text-ash-700">
                <p>
                  Metodologi yang kokoh adalah fondasi kepercayaan dalam asesmen psikologi. Tidak
                  seperti kuis kepribadian populer yang sering beredar di media sosial, instrumen
                  psikologi yang digunakan Sekil.id memiliki basis riset akademik yang panjang —
                  beberapa di antaranya telah diuji selama lebih dari 60 tahun di berbagai konteks
                  budaya dan profesi.
                </p>
                <p>
                  Sekil.id tidak menciptakan instrumen baru. Kami memilih untuk membangun di atas
                  instrumen yang sudah tervalidasi secara akademik: Holland Code (RIASEC) untuk
                  pemetaan minat vokasional, MBTI-style typing untuk pemahaman preferensi
                  kepribadian, dan Papi Kostick untuk profil kebutuhan dan peran kerja. Ketiga
                  instrumen ini dipilih karena kedalaman evidensnya, relevansinya untuk konteks
                  karier, dan kemampuannya menghasilkan insight yang dapat ditindaklanjuti.
                </p>
                <p>
                  Peran AI dalam sistem kami bersifat teknis, bukan interpretif. AI menangani
                  scoring jawaban berdasarkan algoritma yang dirancang oleh tim metodologi, serta
                  menghasilkan narasi dari template yang telah divalidasi secara akademik. AI tidak
                  melakukan interpretasi diagnostik, tidak membuat penilaian klinis, dan tidak
                  menggantikan peran psikolog atau konselor berlisensi. Keputusan tentang metodologi,
                  item development, dan content review sepenuhnya berada di tangan manusia —
                  khususnya tim Fakultas Psikologi UNJANI.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Three instrument sections */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <p className="eyebrow mb-8">INSTRUMEN PSIKOLOGI TERVALIDASI</p>
            <div className="space-y-8">
              {INSTRUMENTS.map((instrument, i) => (
                <InstrumentSection key={instrument.id} instrument={instrument} index={i} />
              ))}
            </div>
          </Container>
        </section>

        {/* 5. UNJANI team */}
        <section className="border-b-2 border-ink bg-white py-16">
          <Container>
            <UnjaniTeam members={UNJANI_TEAM} />
          </Container>
        </section>

        {/* 6. AI vs Manusia */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <AIBoundary />
          </Container>
        </section>

        {/* 7. References */}
        <section className="border-b-2 border-ink bg-white py-16">
          <Container>
            <ReferencesList references={REFERENCES} />
          </Container>
        </section>

        {/* 8. Soft educational CTA */}
        <section className="bg-paper py-16">
          <Container>
            <div className="border-2 border-ink p-10 text-center shadow-md">
              <p className="eyebrow mb-4">EKSPLORASI LEBIH LANJUT</p>
              <h2 className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink">
                Pelajari produk yang menerapkan metodologi ini
              </h2>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ash-700">
                Lihat bagaimana Holland Code, MBTI, dan Papi Kostick diimplementasikan dalam
                produk-produk asesmen Sekil.id — dari pemetaan karier hingga profiling tim
                organisasi.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/produk">Lihat Produk Asesmen →</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">Coba Demo Gratis</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
