export default function manifest() {
  return {
    name: 'UniShop ISPTEC - Marketplace Universitário',
    short_name: 'UniShop ISPTEC',
    description:
      'O marketplace oficial da comunidade acadêmica do ISPTEC em Luanda, Angola. Compre, venda e alugue com segurança.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#F59E0B',
    categories: ['education', 'shopping', 'lifestyle'],
    lang: 'pt-AO',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}

