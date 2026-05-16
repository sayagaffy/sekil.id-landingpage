import { Container } from '@/components/layout/Container';

export function ClientLogos() {
  return (
    <section className="border-b-2 border-ink bg-white py-10">
      <Container>
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ash-700">
          Dipercaya oleh sekolah, universitas, dan perusahaan di Indonesia
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-50">
          {['UNJANI', 'BK Nasional', 'Kementerian Pendidikan', 'Mitra HR Indonesia', 'PT Nusantara Group'].map(
            (name) => (
              <span
                key={name}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700"
              >
                {name}
              </span>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
