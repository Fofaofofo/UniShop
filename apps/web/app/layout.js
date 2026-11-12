import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://unishop-isptec.ao';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'UniShop ISPTEC | O Marketplace Oficial do Campus Universitário',
    template: '%s | UniShop ISPTEC',
  },
  description:
    'UniShop é o marketplace oficial do ISPTEC (Instituto Superior Politécnico de Tecnologias e Ciências) em Luanda, Angola. Compre, venda e alugue materiais escolares, jalecos, calculadoras científicas, livros e serviços com total segurança entre estudantes no campus.',
  keywords: [
    // Termos Principais
    'ISPTEC',
    'UniShop',
    'UniShop ISPTEC',
    'Unishop',
    'Instituto Superior Politécnico de Tecnologias e Ciências',
    'ISPTEC Luanda',
    'ISPTEC Angola',
    // Marketplace & Compras
    'marketplace ISPTEC',
    'campus marketplace ISPTEC',
    'comprar e vender no ISPTEC',
    'loja virtual dos estudantes do ISPTEC',
    'produtos acadêmicos ISPTEC',
    // Aluguer e Materiais Essenciais
    'aluguer de jalecos ISPTEC',
    'aluguer de materiais ISPTEC',
    'calculadoras científicas ISPTEC',
    'calculadoras casio ISPTEC',
    'livros didáticos ISPTEC',
    'sebentas e manuais de engenharia ISPTEC',
    'material escolar campus ISPTEC',
    // Cursos & Comunidade
    'Engenharia Informática ISPTEC',
    'Engenharia de Petróleos ISPTEC',
    'Engenharia Mecânica ISPTEC',
    'Engenharia Química ISPTEC',
    'Engenharia Civil ISPTEC',
    'Gestão e Economia ISPTEC',
    'estudantes universitários ISPTEC',
    'comunidade acadêmica ISPTEC',
    // Localização & Âmbito
    'Talatona ISPTEC',
    'Luanda Sul ISPTEC',
    'universidade em Luanda',
    'marketplace universitário Angola',
  ],
  authors: [
    { name: 'ISPTEC - Instituto Superior Politécnico de Tecnologias e Ciências', url: 'https://isptec.co.ao' },
    { name: 'UniShop' },
  ],
  creator: 'UniShop ISPTEC',
  publisher: 'ISPTEC',
  category: 'Marketplace Acadêmico e Universitário',
  classification: 'Educação, Comércio Acadêmico, Comunidade Universitária',
  applicationName: 'UniShop ISPTEC',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'pt-AO': '/',
      'pt': '/',
    },
  },
  openGraph: {
    title: 'UniShop ISPTEC | O Marketplace Oficial do Campus Universitário',
    description:
      'Plataforma oficial da comunidade acadêmica do ISPTEC. Compre, venda e alugue calculadoras científicas, jalecos, livros e produtos no campus com segurança.',
    url: SITE_URL,
    siteName: 'UniShop ISPTEC',
    locale: 'pt_AO',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'UniShop ISPTEC Campus Marketplace - Logotipo Oficial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniShop ISPTEC | O Marketplace Oficial do Campus',
    description:
      'Compre, venda e alugue materiais acadêmicos, jalecos e livros com segurança na comunidade do ISPTEC em Luanda, Angola.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://xdnitkjjinejmnhtdbcf.supabase.co/storage/v1/object/public/marketplace/img_sistema/logo.png', sizes: 'any' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  // Dados estruturados Schema.org para o Google Search (Rich Snippets, Sitelinks Searchbox e Knowledge Graph)
  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UniShop ISPTEC',
    alternateName: ['UniShop', 'ISPTEC Marketplace', 'Unishop ISPTEC'],
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/#catalogo?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'ISPTEC - Instituto Superior Politécnico de Tecnologias e Ciências',
    alternateName: ['ISPTEC', 'UniShop ISPTEC'],
    url: 'https://isptec.co.ao',
    logo: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Talatona',
      addressRegion: 'Luanda',
      addressCountry: 'AO',
    },
    sameAs: [
      'https://isptec.co.ao',
      'https://www.facebook.com/isptecluanda/',
      'https://www.linkedin.com/school/isptec/',
    ],
  };

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data para Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />

        {/* Script inline: Modo Light como padrão */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('unishop_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-paper font-sans text-ink antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-8 lg:px-8">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
