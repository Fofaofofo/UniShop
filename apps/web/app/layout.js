import './globals.css';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'UniShop | Compre, venda e alugue',
  description: 'Descubra produtos, venda artigos e encontre alugueres na comunidade académica.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${display.variable} ${body.variable} font-sans`}>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pb-8 lg:px-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
