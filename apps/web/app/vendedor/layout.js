'use client';
import { Guard, SubNav } from '@/components/ui';

export default function VendedorLayout({ children }) {
  return (
    <Guard roles={['VENDEDOR']}>
      <SubNav links={[['/vendedor', 'Início'], ['/vendedor/produtos', 'Produtos e alugueres'], ['/vendedor/produtos/novo', 'Cadastrar produto'], ['/vendedor/pedidos', 'Pedidos e clientes'], ['/vendedor/financeiro', 'Mensalidades']]} />
      {children}
    </Guard>
  );
}
