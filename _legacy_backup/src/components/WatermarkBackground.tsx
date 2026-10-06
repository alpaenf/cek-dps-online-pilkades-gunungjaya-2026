import React from 'react';
import { DEFAULT_WATERMARK, DEFAULT_BLACK_BANNER, DEFAULT_GLOSSY_BG } from '../data/logoPresets';

interface WatermarkBackgroundProps {
  watermarkSrc?: string;
  bannerSrc?: string;
  bgSrc?: string;
  opacity?: number;
  showRepeatingPattern?: boolean;
}

export const WatermarkBackground: React.FC<WatermarkBackgroundProps> = ({
  watermarkSrc = DEFAULT_WATERMARK,
  bannerSrc = DEFAULT_BLACK_BANNER,
  bgSrc = DEFAULT_GLOSSY_BG,
  opacity = 0.08,
  showRepeatingPattern = true
}) => {
  const activeImage = watermarkSrc || DEFAULT_WATERMARK;
  const activeBanner = bannerSrc || DEFAULT_BLACK_BANNER;
  const activeBg = bgSrc || DEFAULT_GLOSSY_BG;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Wallpaper Image (User's Official Graphic) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out"
        style={{ 
          backgroundImage: `url(${activeBg})`,
          filter: 'contrast(1.15) brightness(0.85)',
          opacity: 0.88
        }}
      />

      {/* 2. Glossy Obsidian Black Gradient Overlay (Ensures text is crisp & readable while retaining the image) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(3, 5, 8, 0.72) 0%, rgba(5, 9, 18, 0.55) 25%, rgba(4, 7, 14, 0.70) 60%, rgba(2, 3, 6, 0.94) 100%)'
        }}
      />

      {/* 3. Glossy Specular Glass Radial Light Reflections */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(245, 158, 11, 0.18) 0%, rgba(59, 130, 246, 0.10) 35%, transparent 70%)'
        }}
      />

      {/* 4. High-Gloss Specular Metallic Diagonal Light Ray (Mengkilap) */}
      <div 
        className="absolute -top-[35%] -left-[20%] w-[140%] h-[120%] opacity-20 rotate-12 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0) 70%)'
        }}
      />

      {/* 5. Second Soft Light Sheen on Lower Hemisphere */}
      <div 
        className="absolute -bottom-[20%] right-[-10%] w-[80%] h-[70%] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.2) 0%, rgba(30, 58, 138, 0.1) 40%, transparent 70%)'
        }}
      />

      {/* 6. Official Pilkades Panoramic Banner Watermark Accent */}
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none">
        <div
          className="w-full max-w-6xl h-44 sm:h-64 transition-opacity duration-700 ease-out"
          style={{
            opacity: Math.max(opacity * 1.5, 0.14),
            backgroundImage: `url(${activeBanner})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            filter: 'contrast(1.35) drop-shadow(0 0 35px rgba(234, 179, 8, 0.2))',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* 7. Center Emblem Seal Watermark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[320px] sm:w-[480px] md:w-[620px] lg:w-[720px] aspect-square transition-opacity duration-500 ease-out"
          style={{
            opacity: opacity * 0.7,
            backgroundImage: `url(${activeImage})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            filter: 'contrast(1.2) brightness(0.9)',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* 8. Secondary Floating Accents */}
      {showRepeatingPattern && (
        <>
          <div
            className="hidden xl:block absolute top-1/3 -left-20 w-80 h-80 transition-opacity duration-500"
            style={{
              opacity: opacity * 0.45,
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              mixBlendMode: 'screen'
            }}
          />
          <div
            className="hidden xl:block absolute bottom-1/4 -right-20 w-80 h-80 transition-opacity duration-500"
            style={{
              opacity: opacity * 0.45,
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              mixBlendMode: 'screen'
            }}
          />
        </>
      )}

      {/* 9. Glossy Vignette Border */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 140px rgba(0, 0, 0, 0.85)'
        }}
      />
    </div>
  );
};
