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
  transform: async (config, path) => {
    let priority = 0.7;
    if (path === '/') priority = 1.0;
    else if (['/produk', '/solusi', '/harga', '/metodologi'].includes(path))
      priority = 0.8;
    else if (path.startsWith('/blog/') || path.startsWith('/panduan/'))
      priority = 0.7;
    else if (
      path.startsWith('/kepribadian/') ||
      path.startsWith('/karier/') ||
      path.startsWith('/jurusan/')
    )
      priority = 0.5;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
