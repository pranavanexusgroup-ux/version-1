import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'icon-only';
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-12', variant = 'full' }) => {
  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 240 240" className="h-full w-auto" fill="none">
          <defs>
            <linearGradient id="icoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFDF73" />
              <stop offset="50%" stopColor="#F4C430" />
              <stop offset="100%" stopColor="#C59619" />
            </linearGradient>
            <linearGradient id="icoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="icoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="60%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#4D7C0F" />
            </linearGradient>
            <linearGradient id="icoRing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F4C430" />
              <stop offset="45%" stopColor="#EAB308" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          <g transform="translate(120, 120)">
            {/* Outer Ring */}
            <circle cx="0" cy="0" r="96" fill="none" stroke="url(#icoRing)" strokeWidth="8" />

            {/* Golden Medical Cross */}
            <g transform="translate(0, -68)">
              <rect x="-5" y="-14" width="10" height="28" rx="2" fill="url(#icoGold)" />
              <rect x="-14" y="-5" width="28" height="10" rx="2" fill="url(#icoGold)" />
            </g>

            {/* Blue Center Head */}
            <circle cx="0" cy="-26" r="15" fill="url(#icoBlue)" />

            {/* Reaching Figures */}
            <path d="M 0,-4 C -19,-15 -38,-36 -38,-60 C -38,-62 -33,-62 -29,-57 C -21,-41 -12,-27 -3,-15 C -10,9 -19,36 0,62 C -28,33 -19,-2 -13,-17 Z" fill="url(#icoBlue)" />
            <path d="M 0,-4 C 19,-15 38,-36 38,-60 C 38,-62 33,-62 29,-57 C 21,-41 12,-27 3,-15 C 10,9 19,36 0,62 C 28,33 19,-2 13,-17 Z" fill="url(#icoBlue)" opacity="0.9" />

            {/* Vitality Leaf */}
            <path d="M 3,0 C 16,10 35,26 37,48 C 37,57 28,64 17,64 C 9,64 3,55 2,45 C 0,29 2,14 3,0 Z" fill="url(#icoLeaf)" />
            <path d="M 3,4 Q 19,33 24,59" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Logo Emblem */}
      <div className="relative shrink-0 w-11 h-11 md:w-13 md:h-13">
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFDF73" />
              <stop offset="50%" stopColor="#F4C430" />
              <stop offset="100%" stopColor="#C59619" />
            </linearGradient>
            <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="logoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="60%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#4D7C0F" />
            </linearGradient>
            <linearGradient id="logoRing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F4C430" />
              <stop offset="45%" stopColor="#EAB308" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          <g transform="translate(120, 120)">
            <circle cx="0" cy="0" r="96" fill="none" stroke="url(#logoRing)" strokeWidth="8" />

            <g transform="translate(0, -68)">
              <rect x="-5" y="-14" width="10" height="28" rx="2" fill="url(#logoGold)" />
              <rect x="-14" y="-5" width="28" height="10" rx="2" fill="url(#logoGold)" />
            </g>

            <circle cx="0" cy="-26" r="15" fill="url(#logoBlue)" />

            <path d="M 0,-4 C -19,-15 -38,-36 -38,-60 C -38,-62 -33,-62 -29,-57 C -21,-41 -12,-27 -3,-15 C -10,9 -19,36 0,62 C -28,33 -19,-2 -13,-17 Z" fill="url(#logoBlue)" />
            <path d="M 0,-4 C 19,-15 38,-36 38,-60 C 38,-62 33,-62 29,-57 C 21,-41 12,-27 3,-15 C 10,9 19,36 0,62 C 28,33 19,-2 13,-17 Z" fill="url(#logoBlue)" opacity="0.9" />

            <path d="M 3,0 C 16,10 35,26 37,48 C 37,57 28,64 17,64 C 9,64 3,55 2,45 C 0,29 2,14 3,0 Z" fill="url(#logoLeaf)" />
            <path d="M 3,4 Q 19,33 24,59" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Brand Typography matching official artwork */}
      <div className="flex flex-col leading-none">
        <span className={`font-serif tracking-[0.14em] font-bold text-sm md:text-base uppercase ${isLight ? 'text-white' : 'text-[#334155]'}`}>
          PRANAVA
        </span>
        <div className="flex items-center gap-1 my-0.5">
          <span className="h-px w-2 bg-[#F4C430]"></span>
          <span className="font-serif font-bold text-[10px] md:text-xs text-[#D97706] tracking-[0.2em] uppercase">
            NEXUS
          </span>
          <span className="h-px w-2 bg-[#F4C430]"></span>
        </div>
        <span className="pl-5 text-[9px] md:text-[10px] font-extrabold text-[#0284C7] tracking-[0.38em] uppercase">
          CARE
        </span>
        <span className={`text-[8px] italic font-medium tracking-tight mt-0.5 hidden sm:inline ${isLight ? 'text-slate-300' : 'text-[#64748B]'}`}>
          One Nexus. Endless Opportunities.
        </span>
      </div>
    </div>
  );
};
