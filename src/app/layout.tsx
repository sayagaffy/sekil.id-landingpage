import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/legal/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sekil.id';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sekil.id — Asesmen Psikologi & Pemetaan Karier',
    template: '%s | Sekil.id',
  },
  description:
    'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI. AI-powered, hasil dalam 10 menit. Dipakai sekolah, kampus, dan perusahaan di Indonesia.',
  keywords: ['asesmen psikologi', 'pemetaan karier', 'tes minat karier', 'MBTI Indonesia'],
  authors: [{ name: 'Sekil.id', url: SITE_URL }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: 'Sekil.id',
    title: 'Sekil.id — Asesmen Psikologi & Pemetaan Karier',
    description:
      'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sekil.id' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sekil.id — Asesmen Psikologi & Pemetaan Karier',
    description:
      'Platform asesmen psikologi & pemetaan karier dengan validasi akademik UNJANI.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
        >
          Lewati ke konten utama
        </a>
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
