'use client';
import Link from 'next/link';

export const LOGO_SUPABASE_URL = 'https://xdnitkjjinejmnhtdbcf.supabase.co/storage/v1/object/public/marketplace/img_sistema/logo.png';
export const LOGO_LOCAL_URL = '/logo.png';

export default function Logo({ size = 'md', href = '/', showText = true, className = '', link = true }) {
  const sizeMap = {
    sm: { img: 'h-7 w-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { img: 'h-9 w-9', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { img: 'h-12 w-12', text: 'text-3xl', badge: 'text-xs px-2.5 py-0.5' },
    xl: { img: 'h-16 w-16', text: 'text-4xl', badge: 'text-xs px-3 py-1' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_LOCAL_URL}
        onError={(e) => {
          if (e.currentTarget.src !== LOGO_SUPABASE_URL) {
            e.currentTarget.src = LOGO_SUPABASE_URL;
          }
        }}
        alt="UniShop Logotipo"
        className={`${currentSize.img} object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105`}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`brand-nautilus tracking-wide text-slate-900 dark:text-white ${currentSize.text} font-normal`}>
            UniShop
          </span>
          <span className="-mt-1 text-[9px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
            ISPTEC
          </span>
        </div>
      )}
    </div>
  );

  if (!link) return content;

  return (
    <Link href={href} className="group inline-flex items-center">
      {content}
    </Link>
  );
}

