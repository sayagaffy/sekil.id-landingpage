import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Lock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AuthorByline } from '@/components/seo/AuthorByline';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { UnjaniTeam } from '@/components/methodology/UnjaniTeam';
import { AIBoundary } from '@/components/methodology/AIBoundary';
import { UNJANI_TEAM } from '@/data/methodology';
import { getMethodologyArticleSchema } from '@/lib/seo/methodology-schema';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';

const PUBLISHED = '2026-05-16';
const AUTHOR_NAME = 'Dr. [Placeholder UNJANI Lecturer Name], M.Psi., Psikolog';
const AUTHOR_AFFILIATION = 'Dosen Psikologi UNJANI · Reviewer Akademik Sekil.id';

export const metadata: Metadata = {
  title: 'Metodologi: Bagaimana Sekil.id Mengukur — dan Apa yang Tidak Kami Klaim | Sekil.id',
  description:
    'Cara Sekil.id mengukur minat, kepribadian, dan potensi: model riset puluhan tahun, dikalibrasi untuk Indonesia, dengan batasan yang kami nyatakan terbuka.',
  alternates: { canonical: 'https://sekil.id/metodologi' },
  openGraph: {
    title: 'Metodologi: Bagaimana Sekil.id Mengukur — dan Apa yang Tidak Kami Klaim | Sekil.id',
    description:
      'Cara Sekil.id mengukur minat, kepribadian, dan potensi: model riset puluhan tahun, dikalibrasi untuk Indonesia, dengan batasan yang kami nyatakan terbuka.',
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
            <div className="max-w-3xl">
              <p className="eyebrow mb-4">METODOLOGI</p>
              <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
                Dibangun di atas riset.{' '}
                <span className="text-blue-500">Bukan tebakan.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash-700">
                Asesmen Sekil.id memakai model pengukuran yang telah diteliti puluhan tahun di
                berbagai budaya dan profesi — dikalibrasi ulang untuk konteks Indonesia. Halaman
                ini menjelaskan cara kami mengukur, dan sama pentingnya: apa yang{' '}
                <strong className="text-ink">tidak</strong> kami klaim.
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
          </Container>
        </section>

        {/* 3. Pendekatan */}
        <section className="border-b-2 border-ink bg-white py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow mb-4">PENDEKATAN KAMI</p>
              <h2 className="font-display text-[clamp(22px,2.5vw,32px)] font-bold text-ink">
                Kenapa metodologi itu penting
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-ash-700">
                <p>
                  Sebuah kuis kepribadian yang beredar di media sosial bisa terasa akurat dalam
                  lima menit. Masalahnya, &ldquo;terasa akurat&rdquo; bukan ukuran apa pun. Yang
                  membedakan asesmen sungguhan dari kuis adalah apa yang terjadi di belakang
                  layar: dari mana pertanyaannya, bagaimana jawaban ditimbang, dan apakah hasilnya
                  konsisten kalau Anda mengerjakannya lagi.
                </p>
                <p>
                  Sekil.id tidak menciptakan teori kepribadian sendiri. Kami membangun di atas
                  model pengukuran yang sudah teruji secara akademik — beberapa di antaranya
                  diteliti dan dipakai konselor karier selama lebih dari enam dekade. Yang kami
                  tambahkan adalah kalibrasi untuk konteks Indonesia dan proses review yang membuat
                  hasilnya bisa dipertanggungjawabkan, bukan sekadar menarik.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Tiga lapis */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow mb-4">APA YANG KAMI UKUR</p>
              <h2 className="font-display text-[clamp(22px,2.5vw,32px)] font-bold text-ink">
                Tiga lapis yang kami ukur
              </h2>

              <div className="mt-10 border-2 border-ink shadow-md">
                {/* Lapis 1 */}
                <div className="border-b-2 border-ink">
                  <div className="border-b-2 border-ink bg-peach-300 px-6 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                      LAPIS 1
                    </p>
                    <p className="font-display font-bold text-ink">
                      Minat vokasional (enam dimensi)
                    </p>
                  </div>
                  <div className="bg-paper px-6 py-5">
                    <p className="leading-relaxed text-ash-700">
                      Ke mana energi dan ketertarikan Anda condong secara alami: pada hal praktis
                      dan teknis, pada analisis dan riset, pada ekspresi kreatif, pada membantu
                      orang, pada memimpin dan memengaruhi, atau pada keteraturan dan sistem. Model
                      enam-dimensi ini adalah salah satu kerangka pemetaan minat karier yang paling
                      banyak diteliti di dunia.
                    </p>
                  </div>
                </div>

                {/* Lapis 2 */}
                <div className="border-b-2 border-ink">
                  <div className="border-b-2 border-ink bg-blue-500 px-6 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70">
                      LAPIS 2
                    </p>
                    <p className="font-display font-bold text-paper">Preferensi kepribadian</p>
                  </div>
                  <div className="bg-paper px-6 py-5">
                    <p className="leading-relaxed text-ash-700">
                      Bagaimana Anda cenderung mengambil energi, menyerap informasi, mengambil
                      keputusan, dan menata hidup. Berakar pada teori tipe psikologis yang
                      dikembangkan sejak awal abad ke-20, kami gunakan untuk eksplorasi diri dan
                      pengembangan karier — bukan untuk seleksi atau diagnosis.
                    </p>
                  </div>
                </div>

                {/* Lapis 3 */}
                <div>
                  <div className="border-b-2 border-ink bg-navy-900 px-6 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70">
                      LAPIS 3
                    </p>
                    <p className="font-display font-bold text-paper">
                      Kebutuhan &amp; peran kerja
                    </p>
                  </div>
                  <div className="bg-paper px-6 py-5">
                    <p className="leading-relaxed text-ash-700">
                      Apa yang mendorong Anda di lingkungan kerja: kebutuhan akan pencapaian,
                      pengakuan, struktur, atau hubungan; dan peran yang Anda ambil secara alami
                      dalam tim. Lapis ini dirancang khusus untuk konteks profesional, bukan
                      kepribadian umum.
                    </p>
                  </div>
                </div>
              </div>

              {/* Soft institutional CTA */}
              <div className="mt-6 flex items-start gap-2.5 text-sm text-ash-700">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ash-400" aria-hidden="true" />
                <p>
                  Institusi yang membutuhkan rincian instrumen dan referensi akademik lengkap dapat{' '}
                  <Link
                    href="/institusi/metodologi"
                    className="font-medium text-blue-500 hover:underline"
                  >
                    memintanya di sini →
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Batas penggunaan */}
        <section className="border-b-2 border-ink bg-white py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow mb-4">KETERBATASAN</p>
              <h2 className="font-display text-[clamp(22px,2.5vw,32px)] font-bold text-ink">
                Batas penggunaan — yang jujur kami sampaikan
              </h2>

              <ul className="mt-8 space-y-6" role="list">
                <li className="flex gap-4">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-ash-700">
                    Hasil Sekil.id{' '}
                    <strong className="text-ink">bukan diagnosis</strong>. Kami tidak menilai
                    gangguan, kesehatan mental, atau kondisi klinis. Untuk itu, temui psikolog atau
                    psikiater berlisensi.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-ash-700">
                    Hasil{' '}
                    <strong className="text-ink">bukan label permanen</strong>. Minat dan preferensi
                    bergeser seiring pengalaman. Sebagian orang memperoleh profil yang sedikit
                    berbeda bila mengerjakan lagi setelah beberapa waktu — itu wajar, bukan
                    kesalahan sistem.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-ash-700">
                    Hasil{' '}
                    <strong className="text-ink">mengukur kecenderungan, bukan kemampuan</strong>.
                    Profil minat tidak mengukur kecerdasan, bakat teknis, atau jaminan sukses pada
                    bidang tertentu.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-ash-700">
                    Hasil paling berguna{' '}
                    <strong className="text-ink">sebagai bahan diskusi</strong> — dengan orang tua,
                    wali kelas, konselor, atau diri sendiri — bukan sebagai keputusan otomatis.
                  </p>
                </li>
              </ul>

              <p className="mt-8 border-l-4 border-blue-500 pl-5 text-sm leading-relaxed text-ash-700">
                Kami menampilkan batasan ini di depan karena asesmen yang jujur soal batasnya lebih
                layak dipercaya daripada yang menjanjikan kepastian.
              </p>
            </div>
          </Container>
        </section>

        {/* 6. AI vs Manusia */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <AIBoundary />
          </Container>
        </section>

        {/* 7. Validasi UNJANI (varian a — MoU ditandatangani) */}
        <section className="border-b-2 border-ink bg-white py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow mb-4">VALIDASI AKADEMIK</p>
              <h2 className="font-display text-[clamp(22px,2.5vw,32px)] font-bold text-ink">
                Divalidasi bersama Fakultas Psikologi UNJANI
              </h2>
              <p className="mt-6 leading-relaxed text-ash-700">
                Seluruh metodologi, item, dan konten asesmen kami direview oleh tim dosen aktif
                Fakultas Psikologi Universitas Jenderal Achmad Yani (UNJANI), Bandung. Review
                dilakukan berkala untuk menjaga relevansi dan standar akademik.
              </p>
            </div>
            <div className="mt-10">
              <UnjaniTeam members={UNJANI_TEAM} />
            </div>
          </Container>
        </section>

        {/* 8. CTA */}
        <section className="bg-paper py-16">
          <Container>
            <div className="border-2 border-ink p-10 text-center shadow-md">
              <p className="eyebrow mb-4">COBA SENDIRI</p>
              <h2 className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink">
                Coba sendiri
              </h2>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ash-700">
                Cara terbaik memahami metodologi ini adalah menjalaninya. Mulai dalam 12 menit —
                hasilnya bisa Anda jelaskan ke siapa pun.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/demo">Mulai asesmen →</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/institusi/metodologi">
                    Untuk institusi: minta rincian metodologi lengkap →
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
