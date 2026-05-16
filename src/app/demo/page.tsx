import { type Metadata } from 'next';
import { CheckCircle } from 'lucide-react';
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
      {/* Hero */}
      <section className="border-b-2 border-ink bg-navy-900 py-16 text-paper">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-peach mb-3">GRATIS · TANPA KOMITMEN</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[0.94] tracking-[-0.03em] text-paper">
              Jadwalkan Demo Gratis Sekil.id
            </h1>
            <p className="mt-4 max-w-[48ch] text-[17px] leading-[1.55] text-sky-200">
              Isi form berikut dan tim kami akan menghubungi Anda dalam{' '}
              <strong className="text-paper">24 jam kerja</strong> untuk menjadwalkan sesi demo
              produk sesuai kebutuhan institusi Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="border-2 border-ink bg-white p-6 shadow-md sm:p-8">
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-500">
                  FORMULIR PERMINTAAN DEMO
                </p>
                <h2 className="mb-6 font-display text-2xl font-bold text-ink">
                  Ceritakan kebutuhan institusi Anda
                </h2>
                <DemoForm />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="border-2 border-ink bg-peach-300 p-6 shadow-sm">
                <h3 className="mb-4 font-display font-bold text-ink">Yang Anda Dapatkan</h3>
                <ul className="space-y-3">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-ash-900">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-ink bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-display font-bold text-ink">Butuh respon cepat?</h3>
                <p className="text-sm text-ash-700">
                  Hubungi langsung via WhatsApp Business kami untuk pertanyaan mendesak.
                </p>
                <a
                  href="https://wa.me/628xxx"
                  className="mt-3 inline-flex items-center gap-1 font-display text-sm font-semibold text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat via WhatsApp &rarr;
                </a>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 text-sm text-ash-700">
                <p className="font-semibold text-ink">Dipercaya oleh 340+ institusi</p>
                <p className="mt-1">
                  Sekolah, universitas, dan korporasi di seluruh Indonesia menggunakan Sekil.id.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
