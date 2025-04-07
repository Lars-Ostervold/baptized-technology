/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://baptizedtechnology.com',
  generateRobotsTxt: false, // We already created a custom one
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/api/*', '/admin/*', '/auth/*', '/auth-test/*'],
  additionalPaths: async (config) => {
    const result = [
      // Main pages with higher priority
      {
        loc: '/',
        priority: 1.0,
        changefreq: 'daily',
      },
      {
        loc: '/chatbots',
        priority: 0.9,
        changefreq: 'daily',
      },
      // Specific chatbot URLs with high priority
      {
        loc: '/chatbots/bibleproject',
        priority: 0.9,
        changefreq: 'daily',
      },
      {
        loc: '/chatbots/johnMarkComer',
        priority: 0.8,
        changefreq: 'daily',
      },
      {
        loc: '/chatbots/timKeller',
        priority: 0.8,
        changefreq: 'daily',
      },
      // SEO-optimized keyword URLs
      {
        loc: '/christian-ai',
        priority: 0.8,
        changefreq: 'daily',
      },
      {
        loc: '/bible-ai',
        priority: 0.8,
        changefreq: 'daily',
      },
      {
        loc: '/christian-chatbot',
        priority: 0.8,
        changefreq: 'daily',
      },
      {
        loc: '/bibleproject-ai',
        priority: 0.8,
        changefreq: 'daily',
      },
      {
        loc: '/bible-project-ai',
        priority: 0.8,
        changefreq: 'daily',
      },
    ];

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/admin/*', '/auth/*', '/auth-test/*'],
      },
    ],
    additionalSitemaps: [
      'https://baptizedtechnology.com/sitemap.xml',
    ],
  },
} 