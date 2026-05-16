import { BookOpen, AlertTriangle, Globe, Layers } from 'lucide-react';
import type { Instrument } from '@/data/methodology';

interface InstrumentSectionProps {
  instrument: Instrument;
  index: number;
}

export function InstrumentSection({ instrument, index }: InstrumentSectionProps) {
  return (
    <section
      id={instrument.id}
      className="border-2 border-ink shadow-md"
      aria-labelledby={`instrument-${instrument.id}-heading`}
    >
      {/* Peach header strip */}
      <div className="flex items-center gap-4 border-b-2 border-ink bg-peach-300 px-6 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
          INSTRUMEN 0{index + 1}
        </span>
        <h2
          id={`instrument-${instrument.id}-heading`}
          className="font-display text-xl font-bold text-ink"
        >
          {instrument.name}
        </h2>
      </div>

      <div className="divide-y-2 divide-ink">
        {/* Asal-usul Akademik */}
        <div className="bg-paper p-6">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
              Asal-usul Akademik
            </h3>
          </div>
          <p className="mb-4 leading-relaxed text-ink/80">{instrument.origin}</p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-sm italic text-ash-700">
            {instrument.citation}
          </blockquote>
        </div>

        {/* Dimensi yang Diukur */}
        <div className="bg-paper p-6">
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
              Dimensi yang Diukur
            </h3>
          </div>
          <ul className="space-y-2">
            {instrument.dimensions.map((dim, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/80">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 border-2 border-ink bg-peach-300"
                  aria-hidden="true"
                />
                <span>{dim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations & Boundary of Use */}
        <div className="bg-white p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-peach-600" aria-hidden="true" />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
              Limitations &amp; Boundary of Use
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-ink/80">{instrument.limitations}</p>
        </div>

        {/* Adaptasi Indonesia */}
        <div className="bg-paper p-6">
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
              Adaptasi Sekil.id untuk Konteks Indonesia
            </h3>
          </div>
          <ul className="space-y-2">
            {instrument.indonesiaAdaptation.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/80">
                <span className="shrink-0 font-mono text-blue-500" aria-hidden="true">
                  →
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
