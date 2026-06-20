/**
 * /institusi/metodologi — Buyer-facing technical methodology page.
 *
 * - robots: noindex (tidak masuk Google; hanya untuk mitra institusi)
 * - Menampilkan nama instrumen lengkap + sitasi akademik penuh + dimensi detail
 * - Ditujukan untuk sekolah, kampus, dan HR yang perlu verifikasi instrumen
 * - Ditautkan dari /metodologi via CTA "Detail Instrumen untuk Institusi"
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Lock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { InstrumentSection } from '@/components/methodology/InstrumentSection';
import { UnjaniTeam } from '@/components/methodology/UnjaniTeam';
import { ReferencesList } from '@/components/methodology/ReferencesList';
import { INSTRUMENTS, UNJANI_TEAM, REFERENCES } from '@/data/methodology';
import { getBuyerMethodologySchema } from '@/lib/seo/methodology-schema';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';

const PUBLISHED = '2026-05-16';

export const metadata: Metadata = {
  title: 'Spesifikasi Teknis Instrumen Asesmen | Sekil.id untuk Institusi',
  description:
    'Dokumentasi teknis 3 instrumen psikologi Sekil.id untuk mitra institusi: kerangka minat vokasional, preferensi kepribadian, dan inventori peran kerja. Sitasi akademik lengkap dan adaptasi Indonesia.',
  // noindex: halaman ini tidak boleh muncul di Google
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://sekil.id/institusi/metodologi' },
};

export default function InstitusiMetodologiPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Metodologi', url: '/metodologi' },
    { name: 'Detail Instrumen (Institusi)', url: '/institusi/metodologi' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={getBuyerMethodologySchema()} />

      <main id="main-content">
        {/* 1. Breadcrumb */}
        <div className="border-b-2 border-ink bg-paper">
          <Container>
            <nav aria-label="Breadcrumb" className="py-3">
              <ol className="flex flex-wrap items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                <li>
                  <Link href="/" className="transition-colors hover:text-blue-500">Beranda</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <Link href="/metodologi" className="transition-colors hover:text-blue-500">Metodologi</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <span className="text-ink" aria-current="page">Detail Instrumen</span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 2. Gated notice + Hero */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
              <div>
                {/* Gated badge */}
                <div className="mb-5 inline-flex items-center gap-2 border-2 border-ink bg-ink px-3 py-1.5">
                  <Lock className="h-3.5 w-3.5 text-paper" aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper">
                    Khusus Mitra Institusi
                  </span>
                </div>

                <p className="eyebrow mb-4">SPESIFIKASI TEKNIS · 3 INSTRUMEN TERVALIDASI</p>
                <h1 className="font-display text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.05] tracking-tight text-ink">
                  Dokumentasi Lengkap Instrumen Asesmen Sekil.id
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-700">
                  Halaman ini ditujukan untuk sekolah, perguruan tinggi, dan tim HR yang perlu
                  memverifikasi instrumen psikologi yang digunakan Sekil.id sebelum pengadaan.
                  Mencakup nama teknis, sitasi akademik penuh, dimensi, dan adaptasi Indonesia.
                </p>
                <div className="mt-8 border-2 border-ink bg-peach-300 p-5 shadow-sm">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                    Tim Akademik · review UNJANI dalam proses · {PUBLISHED}
                  </p>
                </div>
              </div>

              {/* Quick-nav */}
              <nav aria-label="Daftar Instrumen" className="border-2 border-ink shadow-md self-start">
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
                    <span>{inst.publicName}</span>
                  </a>
                ))}
              </nav>
            </div>
          </Container>
        </section>

        {/* 3. Intro */}
        <section className="border-b-2 border-ink bg-white py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5 leading-relaxed text-ash-700">
              <p>
                Sekil.id membangun platform asesmen di atas tiga instrumen psikologi yang telah
                mapan secara akademik: <strong className="text-ink">Kerangka Minat Vokasional</strong> untuk
                pemetaan minat karier enam dimensi, <strong className="text-ink">Kerangka Preferensi Kepribadian</strong> untuk
                pemahaman tipe psikologis berbasis teori Jung, dan{' '}
                <strong className="text-ink">Inventori Kebutuhan &amp; Peran Kerja</strong> untuk profil kebutuhan dan peran dalam konteks profesional.
              </p>
              <p>
                Ketiga instrumen sedang dalam proses adaptasi untuk konteks Indonesia bersama
                tim Fakultas Psikologi Universitas Jenderal Achmad Yani (UNJANI). Dokumentasi di halaman ini mencakup
                asal-usul akademik, sitasi primer, dimensi yang diukur, keterbatasan, dan detail
                adaptasi lokal — informasi yang relevan untuk proses due diligence institusi.
              </p>
              <p className="text-sm">
                <strong>Catatan keamanan:</strong> Nama instrumen dan kode tipe tidak ditampilkan
                kepada peserta dalam laporan individual untuk menjaga integritas hasil asesmen.
                Halaman ini khusus untuk verifikasi oleh mitra institusi dan tidak diindeks mesin
                pencari.
              </p>
            </div>
          </Container>
        </section>

        {/* 4. Full instrument sections (mode="buyer" = default, shows citations) */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <p className="eyebrow mb-8">SPESIFIKASI TEKNIS INSTRUMEN</p>
            <div className="space-y-8">
              {INSTRUMENTS.map((instrument, i) => (
                <InstrumentSection key={instrument.id} instrument={instrument} index={i} mode="public" showCitation />
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

        {/* 6. Full references */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <ReferencesList references={REFERENCES} />
          </Container>
        </section>

        {/* 7. CTA untuk institusi */}
        <section className="bg-paper py-16">
          <Container>
            <div className="border-2 border-ink p-10 shadow-md">
              <p className="eyebrow mb-4">LANGKAH SELANJUTNYA</p>
              <h2 className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink">
                Siap menggunakan asesmen tervalidasi untuk institusi Anda?
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-ash-700">
                Jadwalkan demo dengan tim kami. Kami menjelaskan paket yang sesuai, menunjukkan
                contoh laporan, dan membantu setup. Onboarding biasanya 1–3 hari kerja.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/demo">Jadwalkan Demo Institusi →</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/solusi">Lihat Solusi per Segmen</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
