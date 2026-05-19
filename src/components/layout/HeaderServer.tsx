/**
 * HeaderServer — async React Server Component.
 * Fetches the `navigation` singleton from Sanity and renders Header with
 * CMS-managed nav items and CTA copy.  Falls back to hardcoded defaults
 * (defined inside Header.tsx) when Sanity returns nothing.
 */
import { sanityFetch } from '@/lib/sanity/live';
import { NAVIGATION_QUERY } from '@/lib/sanity/queries';
import type { NavigationData } from '@/lib/sanity/types';
import { Header } from './Header';

export async function HeaderServer() {
  const { data } = await sanityFetch({ query: NAVIGATION_QUERY });
  const nav = data as NavigationData | null;

  return (
    <Header
      navItems={nav?.headerItems}
      ctaLabel={nav?.ctaLabel}
      ctaHref={nav?.ctaHref}
    />
  );
}
