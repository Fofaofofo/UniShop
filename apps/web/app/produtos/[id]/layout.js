const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://unishop-isptec.ao';
const API_ORIGIN = process.env.API_ORIGIN || 'http://localhost:4000';

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`${API_ORIGIN}/public/produtos/${id}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const p = await res.json();
      const title = `${p.titulo} | UniShop ISPTEC`;
      const desc =
        p.descricao && p.descricao.length > 10
          ? `${p.descricao.slice(0, 150)}… Disponível no campus do ISPTEC (Luanda).`
          : `Artigo disponível no UniShop ISPTEC por ${p.preco} Kz no campus universitário.`;

      return {
        title,
        description: desc,
        openGraph: {
          title,
          description: desc,
          url: `${SITE_URL}/produtos/${id}`,
          siteName: 'UniShop ISPTEC',
          locale: 'pt_AO',
          type: 'article',
          images: p.imagemUrl
            ? [{ url: p.imagemUrl, alt: p.titulo }]
            : [{ url: '/logo.png', alt: 'UniShop ISPTEC' }],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description: desc,
          images: p.imagemUrl ? [p.imagemUrl] : ['/logo.png'],
        },
      };
    }
  } catch {}

  return {
    title: 'Artigo no Campus | UniShop ISPTEC',
    description:
      'Explore este produto na plataforma oficial de compra e aluguer do ISPTEC em Luanda.',
  };
}

export default async function ProdutoLayout({ children, params }) {
  const { id } = params;
  let jsonLd = null;

  try {
    const res = await fetch(`${API_ORIGIN}/public/produtos/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const p = await res.json();
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.titulo,
        image: p.imagemUrl ? [p.imagemUrl] : [`${SITE_URL}/logo.png`],
        description: p.descricao || p.titulo,
        sku: `ISPTEC-${p.id}`,
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/produtos/${p.id}`,
          priceCurrency: 'AOA',
          price: p.preco,
          itemCondition: 'https://schema.org/UsedCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Person',
            name: p.vendedor?.nomeCompleto || 'Estudante ISPTEC',
          },
        },
        ...(p.totalAvaliacoes > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: p.media || 5,
                reviewCount: p.totalAvaliacoes || 1,
              },
            }
          : {}),
      };
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}

