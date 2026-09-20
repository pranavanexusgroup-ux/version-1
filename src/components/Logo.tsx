import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'icon-only';
}

const PranavaNexusCareLogo: React.FC<LogoProps> = ({
  className = 'w-[270px] h-auto shrink-0',
  variant = 'full',
}) => {
  const isLight = variant === 'light';

  return (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 15 500 430"
  className={className}
  fill="none"
  preserveAspectRatio="xMidYMid meet"
  style={{
  width: '90px',
  height: 'auto',
  minWidth: '90px',
  maxWidth: 'none',
  display: 'block',
}}
>
      <defs>
        {/* Gold Ring */}
        <linearGradient
          id="goldRingTop"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFEE80" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>

        {/* Blue Ring */}
        <linearGradient
          id="blueRingBottom"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#0047AB" />
        </linearGradient>

        {/* Medical Cross */}
        <linearGradient
          id="crossGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>

        {/* Head */}
        <linearGradient
          id="headGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#33D9FF" />
          <stop offset="100%" stopColor="#0055FF" />
        </linearGradient>

        {/* Human Wing */}
        <linearGradient
          id="leftWing"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#003399" />
        </linearGradient>

        {/* Leaf */}
        <linearGradient
          id="leafGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6EEB48" />
          <stop offset="100%" stopColor="#0E6B23" />
        </linearGradient>

        {/* Main Text */}
        <linearGradient
          id="darkSilverText"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor={isLight ? '#FFFFFF' : '#334155'}
          />
          <stop
            offset="100%"
            stopColor={isLight ? '#CBD5E1' : '#0F172A'}
          />
        </linearGradient>

        {/* Gold Text */}
        <linearGradient
          id="darkGoldText"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#9A7B0C" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#856508" />
        </linearGradient>
      </defs>

      {/* =========================
          EMBLEM ICON
      ========================= */}
      <g transform="translate(250, 150)">
        {/* Main Circle */}
        <circle
          cx="0"
          cy="0"
          r="132"
          fill={isLight ? '#0F172A' : '#FFFFFF'}
          stroke={isLight ? '#CBD5E1' : '#075985'}
          strokeWidth="4"
        />

        {/* Gold Top Ring */}
        <path
          d="M -115 0 A 115 115 0 0 1 115 0"
          stroke="url(#goldRingTop)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Blue Bottom Ring */}
        <path
          d="M 115 0 A 115 115 0 0 1 -115 0"
          stroke="url(#blueRingBottom)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Medical Cross */}
        <g transform="translate(0, -60)">
          <rect
            x="-7"
            y="-22"
            width="14"
            height="44"
            rx="3"
            fill="url(#crossGradient)"
          />

          <rect
            x="-22"
            y="-7"
            width="44"
            height="14"
            rx="3"
            fill="url(#crossGradient)"
          />
        </g>

        {/* Central Head */}
        <circle
          cx="0"
          cy="-20"
          r="12"
          fill="url(#headGradient)"
        />

        {/* Left Human Wing */}
        <path
          d="M -4 -8 C -25 -15 -52 -38 -65 -65 C -55 -40 -38 -18 -15 2 C -10 7 -5 18 0 38 C -3 22 -3 10 -4 -8 Z"
          fill="url(#leftWing)"
        />

        {/* Right Wing */}
        <path
          d="M 4 -8 C 25 -15 52 -38 65 -65 C 55 -38 35 -15 15 5 C 9 12 3 22 0 38 C 2 25 3 12 4 -8 Z"
          fill="url(#leftWing)"
          opacity="0.15"
        />

        {/* Green Leaf */}
        <path
          d="M 0 38 C 12 20 40 5 52 -25 C 38 -5 18 10 0 38 Z"
          fill="url(#leafGradient)"
        />

        {/* Leaf Highlight */}
        <path
          d="M 0 38 C 15 22 32 5 43 -14"
          stroke="#C8FFB0"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* =========================
          TYPOGRAPHY
      ========================= */}
      <g textAnchor="middle">

        {/* PRANAVA */}
        <text
          x="250"
          y="318"
          fontFamily="Times New Roman, Georgia, serif"
          fontSize="44"
          fontWeight="bold"
          letterSpacing="7"
          fill="url(#darkSilverText)"
          style={{
            filter:
              'drop-shadow(0px 1px 1px rgba(255,255,255,0.8))',
          }}
        >
          PRANAVA
        </text>

        {/* NEXUS */}
        <g transform="translate(250, 355)">
          <line
            x1="-155"
            y1="0"
            x2="-38"
            y2="0"
            stroke="url(#darkGoldText)"
            strokeWidth="2"
          />

          <text
            x="0"
            y="9"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="32"
            fontWeight="bold"
            letterSpacing="9"
            fill="url(#darkGoldText)"
          >
            NEXUS
          </text>

          <line
            x1="38"
            y1="0"
            x2="155"
            y2="0"
            stroke="url(#darkGoldText)"
            strokeWidth="2"
          />
        </g>

        {/* CARE */}
        <g transform="translate(250, 392)">
          <line
            x1="-115"
            y1="0"
            x2="-28"
            y2="0"
            stroke="#475569"
            strokeWidth="1.2"
          />

          <text
            x="0"
            y="6"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="18"
            fontWeight="600"
            letterSpacing="11"
            fill={isLight ? '#E2E8F0' : '#334155'}
          >
            CARE
          </text>

          <line
            x1="28"
            y1="0"
            x2="115"
            y2="0"
            stroke="#475569"
            strokeWidth="1.2"
          />
        </g>

        {/* TAGLINE */}
        <g transform="translate(250, 428)">
          <line
            x1="-165"
            y1="-4"
            x2="-95"
            y2="-4"
            stroke="#64748B"
            strokeWidth="1"
            opacity="0.8"
          />

          <text
            x="0"
            y="0"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="12.5"
            fontWeight="600"
            letterSpacing="1.5"
            fill={isLight ? '#CBD5E1' : '#475569'}
          >
            One Nexus. Endless Opportunities.
          </text>

          <line
            x1="95"
            y1="-4"
            x2="165"
            y2="-4"
            stroke="#64748B"
            strokeWidth="1"
            opacity="0.8"
          />
        </g>

      </g>
    </svg>
  );
};

export { PranavaNexusCareLogo as Logo };
export default PranavaNexusCareLogo;