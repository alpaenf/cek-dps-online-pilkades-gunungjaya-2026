import defaultLogo from '../assets/images/logo_classic_transparent.png';
import emblemLogo from '../assets/images/logo_gunungjaya_emblem_1790176273103.jpg';
import modernLogo from '../assets/images/logo_gunungjaya_modern_1790176291329.jpg';
import logoPilkadesPng from '../assets/images/newlogopilkades.png';
import watermarkBg from '../assets/images/watermark_bg_1790261819824.jpg';
import mascotGlawu from '../assets/images/newmaskot.webp';
import mascotGlawuPng from '../assets/images/newmaskot.webp';
import mascotGlawuGuide from '../assets/images/newmaskot.webp';
import bannerDark from '../assets/images/banner_pilkades_dark_1790263339981.jpg';
import bgGlossyBlack from '../assets/images/bg_glossy_black_1790263356111.jpg';

export interface LogoPreset {
  id: string;
  name: string;
  description: string;
  src: string;
  badge: string;
}

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'transparent-emblem',
    name: 'Logo Resmi Transparan (Format PNG)',
    description: 'Logo segel resmi Pilkades Gunungjaya format PNG transparan tanpa background box, menyatu langsung dengan situs.',
    src: logoPilkadesPng,
    badge: 'Format PNG Transparan'
  },
  {
    id: 'official-emblem',
    name: 'Emblem Segel Lambang Emas',
    description: 'Lambang segel resmi bertema perisai padi kapas & siluet Gunung Slamet, gaya pemerintahan desa.',
    src: emblemLogo,
    badge: 'Rekomendasi'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimalis Pilkades',
    description: 'Gaya modern bersih dengan siluet perbukitan hijau, terbit matahari emas & kotak suara.',
    src: modernLogo,
    badge: 'Modern'
  },
  {
    id: 'classic-default',
    name: 'Logo Klasik Transparan Desa Gunungjaya',
    description: 'Logo Pilkades Desa Gunungjaya transparan berpadu elegan dengan latar gelap.',
    src: defaultLogo,
    badge: 'Klasik'
  }
];

export const DEFAULT_VILLAGE_LOGO = logoPilkadesPng;
export const DEFAULT_WATERMARK = watermarkBg;
export const DEFAULT_MASCOT_GLAWU = mascotGlawuPng;
export const DEFAULT_MASCOT_GLAWU_GUIDE = mascotGlawuGuide;
export const DEFAULT_BLACK_BANNER = bannerDark;
export const DEFAULT_GLOSSY_BG = bgGlossyBlack;
