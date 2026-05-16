import { Container } from '@/components/layout/Container';

export function PendingReviewBanner() {
  return (
    <div className="border-y-2 border-amber-500 bg-amber-50 py-3">
      <Container>
        <p className="font-mono text-[11px] text-amber-800">
          Konten ini sedang dalam review akademik oleh Tim Psikologi UNJANI. Informasi yang tersedia
          bersifat indikatif dan akan diperbarui setelah review selesai.
        </p>
      </Container>
    </div>
  );
}
