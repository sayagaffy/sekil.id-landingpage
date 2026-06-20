import { type Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Permintaan Demo Diterima',
  description: 'Terima kasih! Tim Sekil.id akan menghubungi Anda dalam 24 jam kerja.',
  robots: { index: false, follow: false },
};

export default function TerimakasihPage() {
  return (
    <main className="flex min-h-[70vh] items-center py-16">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-peach-200">
              <CheckCircle className="h-10 w-10 text-peach-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Permintaan Demo Diterima!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tim Sekil.id akan menghubungi Anda via{' '}
            <strong className="text-foreground">WhatsApp atau email dalam 24 jam kerja</strong>{' '}
            untuk diskusi kebutuhan dan penjadwalan walkthrough produk.
          </p>

          <div className="mt-8 rounded-xl bg-primary/5 p-6 text-left">
            <h2 className="mb-3 font-semibold text-primary">Sambil menunggu, pelajari:</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produk" className="text-primary hover:underline">
                  → Katalog lengkap produk asesmen Sekil.id
                </Link>
              </li>
              <li>
                <Link href="/metodologi" className="text-primary hover:underline">
                  → Metodologi & validasi akademik bersama UNJANI
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-primary hover:underline">
                  → Blog insight karier & psikologi terapan
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-blue-500 text-white hover:bg-blue-600 font-semibold">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/produk">Lihat Produk</Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
