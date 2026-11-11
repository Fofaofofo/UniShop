'use client';
import { Guard, SubNav } from '@/components/ui';

export default function AdminLayout({ children }) {
  return (
    <Guard roles={['ADMIN']}>
      <SubNav links={[['/admin', 'Finanças e taxas'], ['/admin/pagamentos', 'Validar pagamentos'], ['/admin/produtos', 'Produtos e destaques'], ['/admin/institucional', 'Cursos, blocos e salas'], ['/admin/utilizadores', 'Utilizadores'], ['/admin/moderacao', 'Moderação']]} />
      {children}
    </Guard>
  );
}
