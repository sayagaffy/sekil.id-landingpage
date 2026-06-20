import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, BadgeCheck, Handshake, GraduationCap, Shield, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { getBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { getContactPageSchema } from '@/lib/seo/contact-schema';

export const metadata: Metadata = {
  title: 'Kontak Sekil.id',
  description:
    'Hubungi Sekil.id untuk demo, partnership, akademik, atau pertanyaan data. Kantor pusat Bandung.',
  alternates: { canonical: 'https://sekil.id/kontak' },
  openGraph: {
    title: 'Kontak Sekil.id',
    description: 'Hubungi Sekil.id untuk demo, partnership, akademik, atau pertanyaan data.',
    url: 'https://sekil.id/kontak',
    type: 'website',
  },
};

const CONTACT_CARDS = [
  {
    icon: BadgeCheck,
    title: 'Demo & Sales',
    description: 'Pengen lihat platform-nya langsung?',
    email: 'sales@sekil.id',
    whatsapp: '+62-xxx-xxxx-xxxx',
    cta: { label: 'Jadwalkan Demo →', href: '/demo' },
    accent: 'bg-peach-300',
    textColor: 'text-ink',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description: 'Yayasan, korporasi, atau lembaga konsultan?',
    email: 'partnership@sekil.id',
    cta: null,
    accent: 'bg-blue-500',
    textColor: 'text-white',
  },
  {
    icon: GraduationCap,
    title: 'Akademik & UNJANI',
    description: 'Pertanyaan metodologi, riset, atau kolaborasi akademik?',
    email: 'academic@sekil.id',
    cta: null,
    accent: 'bg-navy-900',
    textColor: 'text-white',
  },
  {
    icon: Shield,
    title: 'Privacy & Data',
    description: 'Pertanyaan tentang data atau hak akses Anda?',
    email: 'privacy@sekil.id',
    cta: null,
    accent: 'bg-paper',
    textColor: 'text-ink',
  },
] as const;

const SOCIAL_LINKS = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/sekil-id' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/sekil.id' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@sekilid' },
  { icon: Twitter, label: 'X / Twitter', href: 'https://x.com/sekilid' },
];

export default function KontakPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Beranda', url: '/' },
    { name: 'Kontak', url: '/kontak' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={getContactPageSchema()} />

      <main id="main-content">
        {/* Breadcrumb */}
        <div className="border-b-2 border-ink bg-paper">
          <Container>
            <nav aria-label="Breadcrumb" className="py-3">
              <ol className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-700">
                <li>
                  <Link href="/" className="transition-colors hover:text-blue-500">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <span className="text-ink" aria-current="page">
                    Kontak
                  </span>
                </li>
              </ol>
            </nav>
          </Container>
        </div>

        {/* 1. Hero */}
        <section className="border-b-2 border-ink bg-paper py-16">
          <Container>
            <p className="eyebrow mb-4">KONTAK</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
              Hubungi Kami
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ash-700">
              Untuk demo, partnership, atau pertanyaan umum — pilih saluran yang paling relevan
              dengan kebutuhan Anda.
            </p>
          </Container>
        </section>

        {/* 2. Contact Cards */}
        <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="contact-cards-heading">
          <Container>
            <p className="eyebrow mb-4">PILIH KONTAK</p>
            <h2
              id="contact-cards-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Pilih Kontak yang Sesuai
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {CONTACT_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="flex flex-col border-2 border-ink">
                    <div className={`border-b-2 border-ink p-5 ${card.accent}`}>
                      <Icon
                        className={`h-6 w-6 ${card.textColor}`}
                        aria-hidden="true"
                      />
                      <p className={`mt-2 font-display text-xl font-bold ${card.textColor}`}>
                        {card.title}
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          card.accent === 'bg-peach-300' || card.accent === 'bg-paper'
                            ? 'text-ash-700'
                            : 'text-sky-100'
                        }`}
                      >
                        {card.description}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <a
                        href={`mailto:${card.email}`}
                        className="font-mono text-sm text-blue-500 hover:underline"
                      >
                        {card.email}
                      </a>
                      {'whatsapp' in card && card.whatsapp && (
                        <p className="font-mono text-sm text-ash-700">
                          WhatsApp: {card.whatsapp}
                        </p>
                      )}
                      {card.cta && (
                        <Button variant="default" size="sm" className="self-start mt-2" asChild>
                          <Link href={card.cta.href}>{card.cta.label}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* 3. Office */}
        <section className="border-b-2 border-ink bg-paper py-16" aria-labelledby="office-heading">
          <Container>
            <p className="eyebrow mb-4">KANTOR PUSAT</p>
            <h2
              id="office-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Temukan Kami
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-0 border-2 border-ink lg:grid-cols-2">
              {/* Address */}
              <div className="border-b-2 border-ink p-6 lg:border-b-0 lg:border-r-2">
                <address className="not-italic space-y-2">
                  <p className="font-display text-lg font-bold text-ink">Sekil.id</p>
                  <p className="text-ash-700">Bandung, Jawa Barat, Indonesia</p>
                </address>
                <div className="mt-6 space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                    Jam Operasional
                  </p>
                  <p className="text-sm text-ink">Senin–Jumat, 09:00–17:00 WIB</p>
                </div>
                <div className="mt-6 space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-700">
                    Email Umum
                  </p>
                  <a href="mailto:hello@sekil.id" className="text-sm text-blue-500 hover:underline">
                    hello@sekil.id
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="relative min-h-[280px] overflow-hidden border-2 border-ink">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.99780018065!2d107.5309815!3d-6.9174639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi kantor pusat Sekil.id di Bandung"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Social Media */}
        <section className="border-b-2 border-ink bg-white py-16" aria-labelledby="social-heading">
          <Container>
            <p className="eyebrow mb-4">SOSIAL MEDIA</p>
            <h2
              id="social-heading"
              className="font-display text-[clamp(24px,3vw,40px)] font-bold text-ink"
            >
              Ikuti Kami
            </h2>

            <div className="mt-8 flex flex-wrap gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-ink px-4 py-3 transition-colors hover:bg-ink hover:text-paper"
                  aria-label={`Ikuti kami di ${label}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em]">{label}</span>
                </a>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
