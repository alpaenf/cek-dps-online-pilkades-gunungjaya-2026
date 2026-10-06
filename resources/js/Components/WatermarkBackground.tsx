import React from 'react';

interface WatermarkBackgroundProps {
  watermarkSrc?: string;
  bannerSrc?: string;
  bgSrc?: string;
  opacity?: number;
}

export const WatermarkBackground: React.FC<WatermarkBackgroundProps> = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#F7F9FA]"
      aria-hidden="true"
    >
      {/* Subtle Duolingo Crisp Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
