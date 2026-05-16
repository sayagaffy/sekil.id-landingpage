interface OutputListProps {
  outputs: string[];
}

export function OutputList({ outputs }: OutputListProps) {
  return (
    <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="outputs-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4">APA YANG ANDA DAPAT</p>
        <h2
          id="outputs-heading"
          className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
        >
          Isi laporan asesmen Anda
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {outputs.map((output, i) => (
            <div
              key={i}
              className="flex items-start gap-5 border-2 border-ink bg-paper p-5 shadow-sm transition-all duration-120 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-display text-4xl font-bold text-ink/15 leading-none shrink-0 w-10 text-right select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-ink/80 pt-1">{output}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
