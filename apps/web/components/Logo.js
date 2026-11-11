'use client';
import Link from 'next/link';

export const LOGO_LIGHT_URL = '/logo.png';
export const LOGO_DARK_URL = '/logobranco.png';
export const LOGO_LIGHT_FALLBACK =
  'https://xdnitkjjinejmnhtdbcf.supabase.co/storage/v1/object/public/marketplace/img_sistema/logo.png';
export const LOGO_DARK_FALLBACK =
  'https://xdnitkjjinejmnhtdbcf.supabase.co/storage/v1/object/public/marketplace/img_sistema/logobranco.png';

export default function Logo({
  size = 'md',
  href = '/',
  variant = 'auto',
  className = '',
  link = true,
}) {
  const sizeMap = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-10 sm:h-12 w-auto',
    lg: 'h-14 sm:h-16 w-auto',
    xl: 'h-20 sm:h-24 w-auto',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {variant === 'white' ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={LOGO_DARK_URL}
          onError={(e) => {
            if (e.currentTarget.src !== LOGO_DARK_FALLBACK) {
              e.currentTarget.src = LOGO_DARK_FALLBACK;
            }
          }}
          alt="UniShop Campus Marketplace"
          className={`${currentSize} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105`}
        />
      ) : variant === 'color' ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={LOGO_LIGHT_URL}
          onError={(e) => {
            if (e.currentTarget.src !== LOGO_LIGHT_FALLBACK) {
              e.currentTarget.src = LOGO_LIGHT_FALLBACK;
            }
          }}
          alt="UniShop Campus Marketplace"
          className={`${currentSize} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105`}
        />
      ) : (
        /* Modo Automático: Light usa logo.png e Dark usa logobranco.png */
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_LIGHT_URL}
            onError={(e) => {
              if (e.currentTarget.src !== LOGO_LIGHT_FALLBACK) {
                e.currentTarget.src = LOGO_LIGHT_FALLBACK;
              }
            }}
            alt="UniShop Campus Marketplace"
            className={`${currentSize} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105 block dark:hidden`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_DARK_URL}
            onError={(e) => {
              if (e.currentTarget.src !== LOGO_DARK_FALLBACK) {
                e.currentTarget.src = LOGO_DARK_FALLBACK;
              }
            }}
            alt="UniShop Campus Marketplace"
            className={`${currentSize} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105 hidden dark:block`}
          />
        </>
      )}
    </div>
  );

  if (!link) return content;

  return (
    <Link href={href} className="group inline-flex items-center" aria-label="UniShop - Página inicial">
      {content}
    </Link>
  );
}
