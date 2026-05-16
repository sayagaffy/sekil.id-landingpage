import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { InstrumentKey } from '@/data/products';

interface InstrumentMeta {
  name: string;
  description: string;
  headerClass: string;
  textClass: string;
}

const INSTRUMENT_META: Record<InstrumentKey, InstrumentMeta> = {
  holland: {
    name: 'Holland Code (RIASEC)',
    description:
      'Dikembangkan psikolog John L. Holland (1959). Kerangka pemetaan minat vokasional yang paling banyak digunakan dan diteliti secara akademik selama 60+ tahun. Mengidentifikasi 6 dimensi minat yang mencerminkan lingkungan kerja yang sesuai.',
    headerClass: 'bg-peach-300 text-ink',
    textClass: 'text-ink',
  },
  mbti: {
    name: 'MBTI-style Typing',
    description:
      'Berbasis teori tipe psikologis Carl Jung (1921), dioperasionalkan Myers & Briggs (1962). Menghasilkan 16 tipe kepribadian dari kombinasi 4 dikotomi preferensi. Digunakan sebagai alat eksplorasi diri, bukan label permanen.',
    headerClass: 'bg-blue-500 text-paper',
    textClass: 'text-ink',
  },
  papi: {
    name: 'Papi Kostick',
    description:
      'Personality and Preference Inventory oleh Max Kostick (1960an). Dirancang khusus untuk konteks kerja profesional — mengukur kebutuhan (needs) dan peran (roles) yang mendorong perilaku individu dalam lingkungan kerja.',
    headerClass: 'bg-navy-900 text-paper',
    textClass: 'text-ink',
  },
};

interface MethodologySnippetProps {
  instruments: InstrumentKey[];
}

export function MethodologySnippet({ instruments }: MethodologySnippetProps) {
  return (
    <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="methodology-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">METODOLOGI</p>
        <h2
          id="methodology-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Instrumen yang Digunakan
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ash-700">
          Asesmen ini dibangun di atas instrumen psikologi yang telah tervalidasi akademik — bukan
          kuis kepribadian populer. Seluruh instrumen dikalibrasi untuk konteks Indonesia oleh tim
          Fakultas Psikologi UNJANI.
        </p>

        <div
          className={`mt-10 grid grid-cols-1 gap-0 border-2 border-ink shadow-md ${instruments.length > 1 ? 'sm:grid-cols-2' : ''}`}
        >
          {instruments.map((key, i) => {
            const meta = INSTRUMENT_META[key];
            return (
              <div
                key={key}
                className={[
                  'flex flex-col',
                  i < instruments.length - 1 ? 'border-b-2 border-ink sm:border-b-0 sm:border-r-2' : '',
                ].join(' ')}
              >
                <div className={`border-b-2 border-ink px-5 py-3 ${meta.headerClass}`}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
                    INSTRUMEN
                  </p>
                  <p className="font-display font-bold">{meta.name}</p>
                </div>
                <div className="flex-1 bg-paper p-5">
                  <p className={`text-sm leading-relaxed ${meta.textClass} opacity-80`}>
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <p className="text-sm text-ash-700">
            Reviewed by{' '}
            <span className="font-medium text-ink">Fakultas Psikologi UNJANI</span>
          </p>
          <span className="text-ash-300">·</span>
          <Link
            href="/metodologi"
            className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline"
          >
            Baca detail metodologi lengkap
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
