// WHY: APP_URL is env-driven so staging deploys can point to app-staging.sekil.id
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.sekil.id';
