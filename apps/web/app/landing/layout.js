export const metadata = {
  title: 'Conheça o UniShop ISPTEC | Apresentação e Valores da Comunidade',
  description:
    'Descubra o UniShop, o marketplace oficial do campus do ISPTEC em Luanda, Angola. Aluguer seguro com identificação por matrícula, negociação direta via WhatsApp e ambiente acadêmico confiável.',
  keywords: [
    'UniShop ISPTEC',
    'apresentação UniShop',
    'como funciona o UniShop',
    'marketplace universitário ISPTEC',
    'aluguer de jalecos ISPTEC',
    'estudantes ISPTEC Luanda',
  ],
  alternates: {
    canonical: '/landing',
  },
  openGraph: {
    title: 'Conheça o UniShop ISPTEC | Apresentação e Valores',
    description:
      'Descubra a plataforma oficial do ISPTEC para comprar, vender e alugar materiais acadêmicos com segurança dentro do campus.',
    url: '/landing',
  },
};

export default function LandingLayout({ children }) {
  return children;
}

