/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://baptizedtechnology.com',
  generateRobotsTxt: false, // We already created a custom one
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/api/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
} 