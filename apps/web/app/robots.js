export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unishop-isptec.ao';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/landing', '/produtos/', '/login', '/registo'],
        disallow: ['/admin/', '/vendedor/', '/meus-pedidos/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/vendedor/', '/meus-pedidos/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

