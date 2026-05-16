import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Mail } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { getAboutPageSchema } from '@/lib/seo/about-schema';

export const metadata: Metadata = {
  title: 'Tentang Sekil.id — Joint Venture untuk Asesmen Psikologi Indonesia',
  description:
    'Sekil.id adalah JV Sekil.id × B One Corp dengan validasi akademik UNJANI. Tim, partner, dan misi memetakan potensi Indonesia.',
  alternates: { canonical: 'https://sekil.id/tentang' },
  openGraph: {
    title: 'Tentang Sekil.id — Joint Venture untuk Asesmen Psikologi Indonesia',
    description:
      'Sekil.id adalah JV Sekil.id × B One Corp dengan validasi akademik UNJANI. Tim, partner, dan misi memetakan potensi Indonesia.',
    url: 'https://sekil.id/tentang',
    type: 'website',
  },
};

const PILLARS = [
  {
    label: 'Akademik',
    partner: 'UNJANI',
    description:
      'Fakultas Psikologi UNJANI memvalidasi metodologi, item bank, dan content. Setiap instrumen dan konten programatik disetujui dosen psikologi tersertifikasi sebelum dipublikasikan.',
    accent: 'bg-peach-300',
  },
  {
    label: 'Teknologi',
    partner: 'Sekil.id',
    description:
      'AI-powered scoring dan narrative generation. Dibangun di atas Next.js dan AI stack modern. Dashboard analytics multi-tenant yang dapat dikelola institusi secara mandiri.',
    accent: 'bg-blue-500',
  },
  {
    label: 'Distribusi',
    partner: 'B One Corp',
    description:
      '10+ tahun pengalaman sertifikasi profesional di Indonesia. Sales force enterprise dan jaringan training partner di seluruh kepulauan — yang sudah terbukti dan dipercaya institusi.',
    accent: 'bg-navy-900',
  },
];

const TEAM = [
  {
    name: '[Founder Name]',
    role: 'Founder & CEO',
    bio: 'Memimpin visi dan strategi Sekil.id dari nol hingga launch.',
  },
  {
    name: '[CTO Name]',
    role: 'Co-Founder & CTO',
    bio: 'Bertanggung jawab atas arsitektur platform dan AI stack.',
  },
  {
    name: '[Head of Product Name]',
    role: 'Head of Product',
    bio: 'Merancang pengalaman asesmen yang berpusat pada pengguna.',
  },
  {
    name: '[B One Liaison]',
    role: 'B One Corp Partner',
    bio: 'Jembatan antara jaringan distribusi B One dan Sekil.id.',
  },
  {
    name: '[UNJANI Academic Lead]',
    role: 'Academic Lead, UNJANI',
    bio: 'Dosen Fakultas Psikologi UNJANI, pengawas validasi akademik semua instrumen.',
  },
  {
    name: '[Sales Lead]',
    role: 'Head of Sales',
    bio: 'Membangun pipeline institusional dari sekolah hingga korporasi.',
  },
];

const MILESTONES = [
  {
    period: '2024 Q4',
    event: 'JV Sekil.id × B One Corp signed',
    description: 'Perjanjian joint venture resmi ditandatangani antara Sekil.id dan B One Corp.',
  },
  {
    period: '2025 Q1',
    event: 'UNJANI onboard sebagai mitra akademik',
    description:
      'Fakultas Psikologi UNJANI resmi bergabung sebagai mitra validasi akademik instrumen.',
  },
  {
    period: '2025 Q3',
    event: 'Pilot dengan 3 design partner',
    description:
      'Pilot program bersama Yayasan Pengusaha Pendidikan Jabar, Muhammadiyah, dan Metranet.',
  },
  {
    period: '2026 Q2',
    event: 'Platform v1.0 live',
    description: 'sekil.id resmi diluncurkan ke publik dengan 5 produk asesmen tervalidasi.',
  },
];

export default function TentangPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Tentang', url: '/tentang' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={getAboutPageSchema()} />

      <main id="main-content">
        {/* Breadcrumb */}
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
                    Tentang
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 1. Hero */}
        <section className="border-b-2 border-ink bg-paper py-20">
          <Container>
            <p className="eyebrow mb-4">TENTANG SEKIL.ID</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              Memetakan Potensi Indonesia dengan Sains, Bukan Tebakan
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-700">
              Sekil.id adalah joint venture Sekil.id × B One Corp untuk membawa asesmen psikologi
              tervalidasi ke setiap sekolah, kampus, dan perusahaan di Indonesia.
            </p>
          </Container>
        </section>

        {/* 2. Cerita Kami */}
        <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="story-heading">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow mb-4">CERITA KAMI</p>
                <h2
                  id="story-heading"
                  className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
                >
                  Mengapa Sekil.id ada?
                </h2>
              </div>
              <div className="space-y-5 text-ash-700 lg:pt-16">
                <p className="leading-relaxed">
                  Setiap tahun, ratusan ribu siswa Indonesia memilih jurusan kuliah berdasarkan
                  tekanan teman sebaya, ekspektasi orang tua, atau sekadar tren. Hasilnya: angka
                  mismatch jurusan yang tinggi, mahasiswa yang tidak termotivasi, dan tenaga kerja
                  yang tidak sesuai dengan potensi aslinya. Di sisi korporasi, keputusan rekrutmen
                  dan pengembangan talent masih didominasi intuisi subjektif — bukan data yang dapat
                  dipertanggungjawabkan.
                </p>
                <p className="leading-relaxed">
                  Asesmen psikologi impor yang ada sering kali mahal, tidak dikalibrasi untuk
                  konteks budaya Indonesia, dan laporan yang dihasilkan sulit dipahami tanpa
                  pendampingan psikolog. Sekil.id hadir sebagai solusi: partnership antara
                  Sekil.id dan B One Corp, didukung validasi akademik dari Fakultas Psikologi
                  Universitas Jenderal Achmad Yani (UNJANI) — menghasilkan asesmen psikologi
                  tervalidasi, terjangkau, dan relevan untuk konteks Indonesia.
                </p>
                <p className="leading-relaxed">
                  Visi kami adalah mendemokratisasi asesmen psikologi: menjadikan keputusan karier
                  dan pengembangan talent berbasis data yang akurat dan dapat diakses oleh siapa
                  pun — mulai dari siswa di sekolah negeri hingga manajer di perusahaan multinasional.
                  Bukan tebakan. Bukan intuisi. Sains.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Tiga Pilar */}
        <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="pillars-heading">
          <Container>
            <p className="eyebrow mb-4">TIGA PILAR SEKIL.ID</p>
            <h2
              id="pillars-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Dibangun di atas tiga fondasi
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-0 border-2 border-ink md:grid-cols-3">
              {PILLARS.map((pillar, i) => (
                <div
                  key={i}
                  className="flex flex-col border-b-2 border-ink md:border-b-0 md:[&:not(:last-child)]:border-r-2"
                >
                  <div className={`border-b-2 border-ink p-5 ${pillar.accent}`}>
                    <p
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                        pillar.accent === 'bg-peach-300' ? 'text-ink' : 'text-white'
                      }`}
                    >
                      {pillar.label}
                    </p>
                    <p
                      className={`mt-1 font-display text-xl font-bold ${
                        pillar.accent === 'bg-peach-300' ? 'text-ink' : 'text-white'
                      }`}
                    >
                      {pillar.partner}
                    </p>
                  </div>
                  <div className="flex-1 p-5">
                    <p className="text-sm leading-relaxed text-ash-700">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 4. Tim */}
        <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="team-heading">
          <Container>
            <p className="eyebrow mb-4">TIM</p>
            <h2
              id="team-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Tim Inti
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash-700">
              Profil lengkap tim akan dipublikasikan bertahap setelah masing-masing anggota
              menyetujui penggunaan informasi.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((member, i) => (
                <div key={i} className="border-2 border-ink">
                  {/* Avatar placeholder */}
                  <div className="flex h-40 items-center justify-center border-b-2 border-ink bg-ash-300/30">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                      Foto menyusul
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-display font-bold text-ink">{member.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
                      {member.role}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ash-700">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-ash-700">
              Bergabung dengan tim kami?{' '}
              <a
                href="mailto:careers@sekil.id"
                className="inline-flex items-center gap-1 text-blue-500 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                careers@sekil.id
              </a>
            </p>
          </Container>
        </section>

        {/* 5. Milestone Timeline */}
        <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="timeline-heading">
          <Container>
            <p className="eyebrow mb-4">PERJALANAN</p>
            <h2
              id="timeline-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Milestone kami
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-0 border-2 border-ink md:grid-cols-4">
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  className="relative border-b-2 border-ink p-5 md:border-b-0 md:[&:not(:last-child)]:border-r-2"
                >
                  <div className="mb-3 inline-block border-2 border-ink bg-blue-500 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    {m.period}
                  </div>
                  <p className="font-display font-bold text-ink">{m.event}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ash-700">{m.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 6. Partner & Klien */}
        <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="partners-heading">
          <Container>
            <p className="eyebrow mb-4">PARTNER & KLIEN</p>
            <h2
              id="partners-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Dipercaya Oleh
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-20 items-center justify-center border-2 border-dashed border-ash-300"
                  aria-hidden="true"
                >
                  <span className="font-mono text-[10px] text-ash-300">Logo</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] text-ash-700">
              Logo akan dipublikasikan setelah agreement penggunaan brand dikonfirmasi
              masing-masing partner.
            </p>
          </Container>
        </section>

        {/* 7. CTA */}
        <section className="bg-navy-900 py-14">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-paper">
                  Mau diskusi langsung dengan tim?
                </h2>
                <p className="mt-2 max-w-lg leading-relaxed text-sky-200">
                  Kami terbuka untuk kemitraan baru, kolaborasi akademik, dan pertanyaan dari
                  media. Respons dalam 1 hari kerja.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button variant="peach" size="lg" asChild>
                  <Link href="/demo">Jadwalkan Demo →</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-paper text-paper hover:bg-paper hover:text-ink"
                  asChild
                >
                  <Link href="/kontak">Kontak Lain</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
