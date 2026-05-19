// WHY: APP_URL is env-driven so staging deploys can point to app-staging.sekil.id
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.sekil.id';

// WHY: centralise UTM param construction — all CTAs to app.sekil.id must be consistent
// so attribution data in analytics is clean and comparable.
export function buildAppUrl(
  path: string,
  campaign: string,
  source = 'sekil-landing',
  medium = 'cta',
): string {
  return `${APP_URL}${path}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
}
