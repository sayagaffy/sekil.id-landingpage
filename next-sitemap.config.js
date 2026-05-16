const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://sekil.id',
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
    // Exclude programmatic pages that don't have published MDX content
    // (those pages serve noindex placeholder templates)
    const PROGRAMMATIC_PREFIXES = ['/kepribadian/', '/karier/', '/jurusan/'];
    const isProgrammatic = PROGRAMMATIC_PREFIXES.some((prefix) => urlPath.startsWith(prefix));

    if (isProgrammatic) {
      const parts = urlPath.split('/').filter(Boolean);
      if (parts.length === 2) {
        const [type, slug] = parts;
        const mdxPath = path.join(process.cwd(), 'content', type, `${slug}.mdx`);
        if (!fs.existsSync(mdxPath)) {
          // No published MDX — exclude from sitemap (page is noindex placeholder)
          return null;
        }
      }
    }

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
