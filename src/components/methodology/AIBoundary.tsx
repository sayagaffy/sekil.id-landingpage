import { Bot, User } from 'lucide-react';
import { DisclaimerBlock } from '@/components/seo/DisclaimerBlock';
import { AI_TASKS, HUMAN_TASKS } from '@/data/methodology';

export function AIBoundary() {
  return (
    <section aria-labelledby="ai-boundary-heading">
      <div className="mb-10">
        <p className="eyebrow mb-3">TRANSPARANSI SISTEM</p>
        <h2
          id="ai-boundary-heading"
          className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-ink"
        >
          Apa yang AI Kerjakan, Apa yang Manusia Kerjakan
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ash-700">
          Sekil.id berkomitmen pada transparansi penuh tentang peran teknologi dalam sistem asesmen.
          Berikut pembagian tanggung jawab yang jelas antara sistem AI dan tim manusia.
        </p>
      </div>

      <div className="grid grid-cols-1 border-2 border-ink shadow-md sm:grid-cols-2">
        {/* AI column */}
        <div className="border-b-2 border-ink sm:border-b-0 sm:border-r-2">
          <div className="flex items-center gap-3 border-b-2 border-ink bg-blue-500 px-6 py-4">
            <Bot className="h-5 w-5 text-paper" aria-hidden="true" />
            <h3 className="font-display font-bold text-paper">AI (Model Bahasa)</h3>
          </div>
          <ul className="divide-y-2 divide-ink">
            {AI_TASKS.map((task, i) => (
              <li key={i} className="flex gap-3 bg-paper px-6 py-4 text-sm text-ink/80">
                <span className="mt-0.5 shrink-0 font-mono text-blue-500" aria-hidden="true">
                  →
                </span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Human column */}
        <div>
          <div className="flex items-center gap-3 border-b-2 border-ink bg-peach-300 px-6 py-4">
            <User className="h-5 w-5 text-ink" aria-hidden="true" />
            <h3 className="font-display font-bold text-ink">Manusia (Tim Akademik &amp; Psikolog)</h3>
          </div>
          <ul className="divide-y-2 divide-ink">
            {HUMAN_TASKS.map((task, i) => (
              <li key={i} className="flex gap-3 bg-paper px-6 py-4 text-sm text-ink/80">
                <span className="mt-0.5 shrink-0 font-mono text-peach-600" aria-hidden="true">
                  →
                </span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <DisclaimerBlock
          variant="methodology"
          customText="AI bukan psikolog. Hasil asesmen Sekil.id bersifat deskriptif dan edukatif — AI hanya membantu proses scoring dan narasi berbasis template yang telah divalidasi. Untuk evaluasi mendalam (diagnostik, terapi, intervensi klinis), konsultasikan dengan psikolog atau psikiater berlisensi."
          className="rounded-none border-2 border-ink"
        />
      </div>
    </section>
  );
}
