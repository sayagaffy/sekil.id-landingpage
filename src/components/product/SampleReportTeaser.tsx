import { FileText, Download } from 'lucide-react';

interface SampleReportTeaserProps {
  teaser: string;
  productName: string;
}

export function SampleReportTeaser({ teaser, productName }: SampleReportTeaserProps) {
  return (
    <section
      id="sample-report"
      className="border-b-2 border-ink bg-paper py-16"
      aria-labelledby="sample-report-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">SAMPLE REPORT</p>
        <h2
          id="sample-report-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Isi Laporan {productName}
        </h2>

        <div className="mt-10 border-2 border-ink bg-navy-900 shadow-lg">
          {/* Header bar */}
          <div className="flex items-center gap-3 border-b-2 border-ink px-6 py-4">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 border border-ink/30 bg-peach-300" />
              <div className="h-3 w-3 border border-ink/30 bg-white/20" />
              <div className="h-3 w-3 border border-ink/30 bg-white/20" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
              {productName} — Laporan Asesmen
            </span>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start gap-4">
              <FileText
                className="mt-1 h-8 w-8 shrink-0 text-peach-300"
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-peach-300 mb-3">
                  Yang akan ada di laporan Anda
                </p>
                <p className="leading-relaxed text-sky-200">{teaser}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 border-t border-ink/30 pt-6">
              <button
                type="button"
                className="flex items-center gap-2 border-2 border-peach-300 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-peach-300 transition-all duration-120 hover:bg-peach-300 hover:text-ink cursor-not-allowed opacity-60"
                disabled
                aria-label="Sample PDF belum tersedia, akan hadir segera"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Sample PDF
                <span className="ml-2 text-[9px] opacity-60">(Segera hadir)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
