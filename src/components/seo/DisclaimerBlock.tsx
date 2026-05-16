import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type DisclaimerVariant = 'methodology' | 'assessment' | 'career' | 'general';

const DISCLAIMER_TEXT: Record<DisclaimerVariant, string> = {
  methodology:
    'Metodologi asesmen ini telah divalidasi secara akademik oleh Fakultas Psikologi UNJANI. Hasil bersifat deskriptif dan edukatif — bukan diagnosis klinis. Untuk evaluasi mendalam, konsultasi dengan psikolog profesional.',
  assessment:
    'Hasil asesmen ini bersifat deskriptif, bukan diagnosis klinis. Hasil ini bukan pengganti konsultasi profesional dari psikolog atau konselor karier berlisensi. Gunakan sebagai panduan awal untuk eksplorasi diri.',
  career:
    'Rekomendasi karier bersifat indikatif berdasarkan profil minat dan kepribadian Anda. Keputusan karier yang baik mempertimbangkan banyak faktor di luar tes. Konsultasikan dengan konselor karier untuk panduan lebih komprehensif.',
  general:
    'Konten ini bersifat edukatif. Hasil bukan diagnosis klinis. Untuk evaluasi mendalam, konsultasi dengan psikolog profesional.',
};

interface DisclaimerBlockProps {
  variant?: DisclaimerVariant;
  className?: string;
  customText?: string;
}

export function DisclaimerBlock({
  variant = 'general',
  className,
  customText,
}: DisclaimerBlockProps) {
  return (
    <aside
      className={cn(
        'flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground',
        className
      )}
      role="note"
      aria-label="Disclaimer"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" aria-hidden="true" />
      <p>{customText ?? DISCLAIMER_TEXT[variant]}</p>
    </aside>
  );
}
