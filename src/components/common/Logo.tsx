import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek interconnected concentric circle emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full rounded-xl bg-[#142238] border border-[#242831] flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <circle cx="12" cy="12" r="8" stroke="#344B6B" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="4.5" stroke="#F5F6F8" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="#344B6B" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`font-display font-bold tracking-tight text-[#F5F6F8] ${textSizes[size]}`}>
          X<span className="text-[#A7AFBC]">Circle</span>
        </span>
      )}
    </div>
  );
};
