import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';

const FOOTER_COLS = [
  {
    title: 'Produk',
    links: [
      { href: '/produk/career-interest', label: 'Career Interest' },
      { href: '/produk/psyai', label: 'PsyAI' },
      { href: '/produk/path-finder-ai', label: 'Path Finder AI' },
      { href: '/produk/leadership-styles-test', label: 'Leadership Styles' },
      { href: '/produk/emotional-intelligence-test', label: 'EQ Test' },
    ],
  },
  {
    title: 'Solusi & Resources',
    links: [
      { href: '/solusi/sekolah', label: 'Untuk Sekolah' },
      { href: '/solusi/perguruan-tinggi', label: 'Untuk Kampus' },
      { href: '/solusi/perusahaan', label: 'Untuk Perusahaan' },
      { href: '/metodologi', label: 'Metodologi' },
      { href: '/blog', label: 'Blog' },
      { href: '/panduan', label: 'Panduan' },
    ],
  },
  {
    title: 'Legal & Sosial',
    links: [
      { href: '/privacy', label: 'Kebijakan Privasi' },
      { href: '/terms', label: 'Syarat & Ketentuan' },
      { href: '/kontak', label: 'Kontak' },
      { href: '/demo', label: 'Jadwalkan Demo' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-display text-xl font-bold text-primary">
              Sekil.id
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI.
              Didukung B One Corp.
            </p>
            <address className="not-italic text-xs text-muted-foreground">
              PT Dart Prihaditama Studio
              <br />
              Bandung, Jawa Barat, Indonesia
              <br />
              <a href="mailto:hello@sekil.id" className="hover:text-foreground">
                hello@sekil.id
              </a>
            </address>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PT Dart Prihaditama Studio. Hak cipta dilindungi.</p>
          <p>
            Dibuat dengan ❤ di Bandung &middot;{' '}
            <Link href="/privacy" className="hover:text-foreground">
              Privasi
            </Link>{' '}
            &middot;{' '}
            <Link href="/terms" className="hover:text-foreground">
              Ketentuan
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
