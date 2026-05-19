/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // IMPORTANT: NEXT_PUBLIC_SITE_URL must be set to https://sekil.id in Vercel
  // production env vars. Never set it to the vercel.app preview URL.
  // If not set, falls back to the canonical production URL.
  siteUrl: (() => {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    // Reject Vercel preview URLs — they must never appear in production sitemap
    if (url && !url.includes('vercel.app') && !url.includes('localhost')) return url;
    return 'https://sekil.id';
  })(),
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/api/*', '/admin/*', '/demo/terimakasih'],
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/admin/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    additionalSitemaps: ['https://sekil.id/sitemap-programmatic.xml'],
  },
  transform: async (config, urlPath) => {
    // Programmatic pages (/kepribadian/, /karier/, /jurusan/) are served from
    // Sanity (personalityPost, careerPost, majorPost). All published pages are
    // indexed — no MDX file check needed (MDX system was removed).
    const PROGRAMMATIC_PREFIXES = ['/kepribadian/', '/karier/', '/jurusan/'];
    const isProgrammatic = PROGRAMMATIC_PREFIXES.some((prefix) => urlPath.startsWith(prefix));

    let priority = 0.7;
    if (urlPath === '/') priority = 1.0;
    else if (['/produk', '/solusi', '/harga', '/metodologi'].includes(urlPath))
      priority = 0.8;
    else if (urlPath.startsWith('/blog/') || urlPath.startsWith('/panduan/'))
      priority = 0.7;
    else if (isProgrammatic)
      priority = 0.5;

    return {
      loc: urlPath,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
