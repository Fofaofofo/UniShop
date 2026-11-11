'use client';
import { useTheme } from '@/lib/theme';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-2 text-slate-700 shadow-sm transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-amber-500/60 dark:hover:bg-slate-800 dark:hover:text-amber-400 ${className}`}
    >
      {!mounted ? (
        <span className="h-4 w-4" />
      ) : theme === 'dark' ? (
        // Ícone Sol (quando em Dark, para mudar para Light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Ícone Lua (quando em Light, para mudar para Dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}

