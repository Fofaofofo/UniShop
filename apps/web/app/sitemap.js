export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://unishop-isptec.ao';
  const apiOrigin = process.env.API_ORIGIN || 'http://localhost:4000';

  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/landing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/registo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Buscar produtos ativos para indexação dinâmica profunda no Google
  let productRoutes = [];
  try {
    const res = await fetch(`${apiOrigin}/public/produtos`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        productRoutes = data.items.map((p) => ({
          url: `${baseUrl}/produtos/${p.id}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        }));
      }
    }
  } catch {
    // Fallback gracioso se a API estiver indisponível no build estático
  }

  return [...staticRoutes, ...productRoutes];
}

