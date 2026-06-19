import Link from 'next/link';
import Image from 'next/image';

const FOOTER_COLS = [
  {
    title: 'Produk',
    links: [
      { href: '/produk/career-interest', label: 'Career Interest' },
      { href: '/produk/psyai', label: 'PsyAI' },
      { href: '/produk/self-discovery-ai', label: 'Self DiscoveryAI' },
      { href: '/produk/path-finder-ai', label: 'Path Finder AI' },
      { href: '/produk/goal-align-ai', label: 'Goal AlignAI' },
      { href: '/produk/goal-orientation-coaching', label: 'Goal Orientation Coaching' },
      { href: '/produk/leadership-styles-test', label: 'Leadership Styles Test' },
      { href: '/produk/professional-authenticity-test', label: 'Professional Authenticity Test' },
      { href: '/produk/job-burnout-test', label: 'Job Burnout Test' },
      { href: '/produk/emotional-intelligence-test', label: 'Emotional Intelligence Test' },
      { href: '/produk/personal-authenticity-test', label: 'Personal Authenticity Test' },
    ],
  },
  {
    title: 'Untuk',
    links: [
      { href: '/solusi/untuk-sekolah', label: 'Sekolah & SMA' },
      { href: '/solusi/untuk-perguruan-tinggi', label: 'Universitas' },
      { href: '/solusi/untuk-perusahaan', label: 'Perusahaan & HR' },
      { href: '/solusi/untuk-yayasan', label: 'Yayasan & NGO' },
    ],
  },
  {
    title: 'Sekil.id',
    links: [
      { href: '/metodologi', label: 'Metodologi' },
      { href: '/blog', label: 'Blog' },
      { href: '/kontak', label: 'Kontak' },
      { href: '/privacy', label: 'Kebijakan Privasi' },
      { href: '/terms', label: 'Syarat & Ketentuan' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-0 border-t-2 border-ink bg-navy-900 text-paper">
      <div className="mx-auto max-w-[1280px] px-8">
        {/* Top grid */}
        <div className="grid gap-12 py-16 md:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link href="/">
              <Image
                src="/logo-light.png"
                alt="Sekil.id"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-sky-200">
              Platform pengembangan diri & penilaian karier berbasis AI. Didukung B One Corp.
            </p>
            <address className="not-italic font-mono text-xs uppercase tracking-widest text-ash-500">
              PT Dart Prihaditama Studio
              <br />
              Bandung, Indonesia
              <br />
              <a href="mailto:hello@sekil.id" className="hover:text-peach-300">
                hello@sekil.id
              </a>
            </address>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-peach-300">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-display text-sm text-paper transition-colors hover:text-peach-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/20 py-6 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ash-500">
            &copy; {new Date().getFullYear()} PT Dart Prihaditama Studio
          </p>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ash-500">
            <Link href="/privacy" className="hover:text-paper">Privasi</Link>
            <Link href="/terms" className="hover:text-paper">Ketentuan</Link>
            <Link href="/kontak" className="hover:text-paper">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
