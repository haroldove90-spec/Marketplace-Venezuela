import React from 'react';

interface PulsoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only' | 'symbol';
}

export const PulsoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer P-shaped Location Pin */}
      <path
        d="M38 108V28C38 12.536 50.536 0 66 0C81.464 0 94 12.536 94 28C94 43.464 81.464 56 66 56H48"
        stroke="#00D222"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner checkmark pointing down to map target */}
      <path
        d="M48 48L64 74L86 36"
        stroke="#00D222"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pin downward needle pointing to pulse */}
      <path
        d="M64 74V96"
        stroke="#00D222"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Radar pulse outer ring */}
      <ellipse
        cx="64"
        cy="118"
        rx="22"
        ry="9"
        stroke="#00D222"
        strokeWidth="7"
      />
      {/* Center GPS pulse core dot */}
      <circle
        cx="64"
        cy="118"
        r="5"
        fill="#00D222"
      />
    </svg>
  );
};

export const PulsoLogo: React.FC<PulsoLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full'
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 60
  };

  const textSizes = {
    sm: 'text-base tracking-wider',
    md: 'text-xl tracking-wide',
    lg: 'text-2xl tracking-wider',
    xl: 'text-3xl tracking-widest'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Pulso Icon with vibrant green badge or raw */}
      <div className="relative flex items-center justify-center shrink-0">
        <PulsoIcon size={iconSizes[size]} />
      </div>

      {/* Pulso Text with stylized O containing green center */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black text-[#0B132B] flex items-center leading-none ${textSizes[size]}`}>
            <span>PULS</span>
            <span className="relative inline-flex items-center justify-center">
              <span>O</span>
              <span className="absolute w-2 h-2 rounded-full bg-[#00D222]" />
            </span>
          </div>
          {size !== 'sm' && (
            <span className="text-[10px] font-bold text-[#00a81b] tracking-tight leading-none mt-0.5">
              Farmacias & Restaurantes
            </span>
          )}
        </div>
      )}
    </div>
  );
};
