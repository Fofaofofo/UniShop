import './globals.css';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'ISPTEC Marketplace',
  description: 'Compre, venda e alugue dentro do campus do ISPTEC: alimentação, material escolar e aluguer de equipamentos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${display.variable} ${body.variable} font-sans`}>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
