import { type Metadata } from 'next';
import { CheckCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { DemoForm } from '@/components/demo/DemoForm';

export const metadata: Metadata = {
  title: 'Jadwalkan Demo Gratis — Sekil.id',
  description:
    'Lihat langsung bagaimana Sekil.id membantu institusi Anda menjalankan asesmen psikologi dan pemetaan karier. Konsultasi gratis, tanpa komitmen.',
  robots: { index: false, follow: true },
};

const BENEFITS = [
  'Walkthrough produk 1:1 bersama tim Sekil.id',
  'Konsultasi kebutuhan institusi Anda secara gratis',
  'Lihat hasil laporan asesmen contoh secara langsung',
  'Diskusi integrasi dengan sistem akademik existing',
  'Penawaran harga transparan, tanpa biaya tersembunyi',
];

export default function DemoPage() {
  return (
    <main>
      <section className="bg-primary py-16 text-white">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-accent-400">
              Gratis · Tanpa Komitmen
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Jadwalkan Demo Gratis Sekil.id
            </h1>
            <p className="mt-4 text-lg text-primary-200">
              Isi form berikut dan tim kami akan menghubungi Anda dalam{' '}
              <strong className="text-white">24 jam kerja</strong> untuk menjadwalkan sesi demo
              produk sesuai kebutuhan institusi Anda.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Formulir Permintaan Demo
                </h2>
                <DemoForm />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="rounded-xl bg-primary/5 p-6">
                <h3 className="mb-4 font-semibold text-primary">Yang Anda Dapatkan</h3>
                <ul className="space-y-3">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex gap-3 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border p-6">
                <h3 className="mb-2 font-semibold text-foreground">Butuh respon cepat?</h3>
                <p className="text-sm text-muted-foreground">
                  Hubungi langsung via WhatsApp Business kami untuk pertanyaan mendesak.
                </p>
                <a
                  href="https://wa.me/628xxx"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat via WhatsApp →
                </a>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Dipercaya oleh:</p>
                <p className="mt-1">
                  Institusi pendidikan dan korporasi di seluruh Indonesia menggunakan Sekil.id
                  untuk asesmen psikologi berbasis ilmu pengetahuan.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}
