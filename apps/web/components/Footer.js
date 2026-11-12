'use client';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-20 border-t border-slate-200 bg-white/60 text-slate-600 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-400"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Rodapé Institucional UniShop ISPTEC
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Coluna 1: Marca & Autoridade Institucional */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              O marketplace oficial dos estudantes e da comunidade acadêmica do{' '}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">
                ISPTEC (Instituto Superior Politécnico de Tecnologias e Ciências)
              </strong>
              . Compre, venda e alugue materiais escolares, jalecos, livros e calculadoras com segurança dentro do campus.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              <p>Luanda Sul, Talatona · Luanda, Angola</p>
              <p>Plataforma Acadêmica Verificada</p>
            </div>
          </div>

          {/* Coluna 2: Categoria de Produtos & Serviços */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Categorias Acadêmicas
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#catalogo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Livros, Sebentas e Manuais ISPTEC
                </Link>
              </li>
              <li>
                <Link href="/#catalogo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Aluguer de Jalecos de Laboratório
                </Link>
              </li>
              <li>
                <Link href="/#catalogo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Calculadoras Científicas e Gráficas
                </Link>
              </li>
              <li>
                <Link href="/#catalogo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Material de Desenho e Arquitetura
                </Link>
              </li>
              <li>
                <Link href="/#catalogo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Lanches e Cantina no Campus
                </Link>
              </li>
              <li>
                <Link href="/#catalogo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Serviços Acadêmicos e Explicações
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Comunidade dos Cursos ISPTEC */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Cursos do ISPTEC
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-500 dark:text-slate-400">Engenharia Informática</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Engenharia de Petróleos</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Engenharia Mecânica e Química</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Engenharia Eletrotécnica</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Gestão e Economia</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Geociências e Construção Civil</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Segurança, Transparência & Links Úteis */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Acesso e Confiança
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/landing" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Apresentação e Valores UniShop
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Acesso com Matrícula Acadêmica
                </Link>
              </li>
              <li>
                <Link href="/registo" className="transition hover:text-amber-500 dark:hover:text-amber-400">
                  Criar Conta de Estudante ou Vendedor
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Identificação Auditada por Matrícula
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior com Copyright e Metatags */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>
            © {currentYear} UniShop ISPTEC. Todos os direitos reservados. Plataforma acadêmica do Instituto Superior Politécnico de Tecnologias e Ciências.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Campus Luanda Sul</span>
            <span>•</span>
            <span>Talatona, Angola</span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Campus Marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

