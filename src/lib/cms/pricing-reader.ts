/**
 * Server-side reader for the pricingPage Keystatic singleton.
 * Falls back to hardcoded defaults if the CMS file does not exist.
 *
 * Usage (Server Component / route handler):
 *   import { getPricingPageData } from '@/lib/cms/pricing-reader'
 *   const data = await getPricingPageData()
 */

import { createReader } from '@keystatic/core/reader'
import config from '../../../keystatic.config'

// ---------------------------------------------------------------------------
// Public interfaces — used by page + components
// ---------------------------------------------------------------------------

export interface PricingHeroPillar {
  label: string
  value: string
  sub: string
}

export interface PricingFaqItem {
  q: string
  a: string
}

export interface PricingAtcDashboard {
  price: string
  priceUnit: string
  features: string[]
}

export interface PricingPageData {
  hero: {
    eyebrow: string
    heading: string
    subheading: string
    pillars: PricingHeroPillar[]
  }
  faq: PricingFaqItem[]
  atcDashboard: PricingAtcDashboard
  ctaHeading: string
  ctaSubheading: string
}

// ---------------------------------------------------------------------------
// Hardcoded defaults — shown when CMS file is missing or unreadable
// ---------------------------------------------------------------------------

const DEFAULTS: PricingPageData = {
  hero: {
    eyebrow: 'HARGA TRANSPARAN · DISKON VOLUME',
    heading: 'Harga yang sesuai dengan skala Anda',
    subheading:
      'Mulai dari Rp 150.000 per peserta untuk individu. Dapatkan diskon hingga 50% untuk pembelian institusional. Tidak ada biaya setup, tidak ada biaya tersembunyi.',
    pillars: [
      { label: 'Harga mulai dari', value: 'Rp 150.000', sub: 'per peserta' },
      { label: 'Diskon volume', value: 'Hingga 50%', sub: 'untuk 50.000+ seat' },
      { label: 'Bundle hemat', value: '–7% hingga –17%', sub: 'paket multi-produk' },
    ],
  },
  faq: [
    {
      q: 'Bagaimana sistem pembayaran untuk institusi?',
      a: 'Institusi dapat melakukan pembelian seat secara bulk via transfer bank (BCA, Mandiri, BNI) atau kartu kredit. Setelah pembayaran dikonfirmasi, seat akan aktif dan link tes dapat didistribusikan ke peserta. Untuk pembelian 500+ seat, tersedia opsi invoice dan pembayaran Net-30.',
    },
    {
      q: 'Apakah seat yang dibeli ada masa berlakunya?',
      a: 'Ya. Seat berlaku selama 12 bulan sejak tanggal pembelian. Seat yang belum digunakan tidak dapat di-refund setelah masa berlaku berakhir. Kami merekomendasikan membeli sesuai kebutuhan aktual dan melakukan top-up jika diperlukan.',
    },
    {
      q: 'Apakah diskon volume berlaku per produk atau per total peserta?',
      a: 'Diskon berlaku per-asesmen per-seat. Jika Anda membeli 1.000 seat untuk Career Interest dan 500 seat untuk PsyAI, masing-masing mendapatkan diskon berdasarkan jumlah seat produk tersebut.',
    },
    {
      q: 'Apakah ada uji coba gratis untuk institusi?',
      a: 'Kami menyediakan demo produk dan penjelasan metodologi untuk pengambil keputusan institusi — bukan akses tes gratis untuk peserta. Untuk pilot program dengan 50 seat atau lebih, hubungi tim kami untuk mendiskusikan kemungkinan harga pilot.',
    },
    {
      q: 'Bagaimana jika saya ingin produk yang berbeda untuk kelompok peserta yang berbeda?',
      a: 'Tidak ada masalah. Anda bisa membeli seat untuk beberapa produk secara bersamaan atau terpisah. Setiap pembelian produk dihitung diskon volumenya secara independen.',
    },
  ],
  atcDashboard: {
    price: 'Rp 30 juta',
    priceUnit: '/tahun',
    features: [
      'Pantau status asesmen seluruh karyawan dalam satu dashboard',
      'Analisis distribusi profil kepribadian dan EQ per departemen',
      'Ekspor data ke HRIS (CSV, JSON, Webhook)',
      'Laporan agregat untuk kebutuhan audit dan talent review',
      'Dedicated account manager dan SLA 99.5% uptime',
      'Integrasi SSO dan LDAP/Active Directory',
    ],
  },
  ctaHeading: 'Butuh penawaran khusus untuk institusi Anda?',
  ctaSubheading:
    'Tim sales Sekil.id siap membantu menyusun proposal yang sesuai dengan anggaran dan kebutuhan program Anda. Respons dalam 1 hari kerja.',
}

// ---------------------------------------------------------------------------
// Reader
// ---------------------------------------------------------------------------

export async function getPricingPageData(): Promise<PricingPageData> {
  try {
    const reader = createReader(process.cwd(), config)
    const raw = await reader.singletons.pricingPage.read()
    if (!raw) return DEFAULTS

    return {
      hero: {
        eyebrow: raw.hero.eyebrow ?? DEFAULTS.hero.eyebrow,
        heading: raw.hero.heading ?? DEFAULTS.hero.heading,
        subheading: raw.hero.subheading ?? DEFAULTS.hero.subheading,
        pillars: (raw.hero.pillars ?? []).map((p: { label: string | null; value: string | null; sub: string | null }) => ({
          label: p.label ?? '',
          value: p.value ?? '',
          sub: p.sub ?? '',
        })),
      },
      faq: (raw.faq ?? []).map((item: { q: string | null; a: string | null }) => ({
        q: item.q ?? '',
        a: item.a ?? '',
      })),
      atcDashboard: {
        price: raw.atcDashboard.price ?? DEFAULTS.atcDashboard.price,
        priceUnit: raw.atcDashboard.priceUnit ?? DEFAULTS.atcDashboard.priceUnit,
        features: (raw.atcDashboard.features ?? []).filter(
          (f: string | null): f is string => typeof f === 'string',
        ),
      },
      ctaHeading: raw.ctaHeading ?? DEFAULTS.ctaHeading,
      ctaSubheading: raw.ctaSubheading ?? DEFAULTS.ctaSubheading,
    }
  } catch {
    // CMS file not found or parse error — return defaults
    return DEFAULTS
  }
}
