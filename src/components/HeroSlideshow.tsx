import React, { useEffect } from 'react';
import { useSlideshow } from '../hooks/useSlideshow';
import { useImagePreloader } from '../hooks/useImagePreloader';
const ASSET_BASE = import.meta.env.BASE_URL;
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  CheckCircle2,
  Zap,
  WifiOff
} from 'lucide-react';

export interface SlideItem {
  id: number;
  image: string;
  webp: string;
  title: string;
  subtitle: string;
  tag: string;
  location: string;
  description: string;
}

const PATIENT_COORDINATION_SLIDES: SlideItem[] = [
  {
    id: 1,
    image: `${ASSET_BASE}assets/images/patient-coordination-hero.jpg`,
    webp: `${ASSET_BASE}assets/images/patient-coordination-hero.webp`,
    title: 'Specialist Consultation & Hospital Liaison',
    subtitle: 'Pre-Travel Medical Dossier Review',
    tag: 'Clinical Records & Appointment Coordination',
    location: 'Super-Specialty Hospital Suite, Kolkata',
    description: 'Patient care manager coordinating treatment plan with specialist doctor and supportive family members.'
  },
  {
    id: 2,
    image: `${ASSET_BASE}assets/images/patient-escort-airport.jpg`,
    webp: `${ASSET_BASE}assets/images/patient-escort-airport.webp`,
    title: 'International Arrival & Attendant Escort',
    subtitle: 'FRRO & Airport Reception Protocol',
    tag: 'Airport Transit & Luggage Assistance',
    location: 'Netaji Subhash Chandra Bose Int. Airport (CCU)',
    description: 'Empathetic liaison welcoming international medical guests with tailored wheelchair assistance and immediate transfer.'
  },
  {
    id: 3,
    image: `${ASSET_BASE}assets/images/doctor-patient-consult.jpg`,
    webp: `${ASSET_BASE}assets/images/doctor-patient-consult.webp`,
    title: 'Diagnostic Review & Second Opinion',
    subtitle: 'Super-Specialist Medical Guidance',
    tag: 'Accredited Multi-Disciplinary Care',
    location: 'Medical Hubs in Kolkata, Delhi NCR & Chennai',
    description: 'Senior clinicians and coordination team examining digital imaging reports to formulate optimal treatment pathways.'
  },
  {
    id: 4,
    image: `${ASSET_BASE}assets/images/patient-recovery-care.jpg`,
    webp: `${ASSET_BASE}assets/images/patient-recovery-care.webp`,
    title: 'Dedicated Attendant Care & Recovery Liaison',
    subtitle: 'Continuous Patient & Family Well-being',
    tag: 'Post-Procedure Attendant Support',
    location: 'Private Guest Suite & Partner Facilities',
    description: 'Trained patient attendants providing continuous reassurance, meal arrangements, and local mobility assistance.'
  }
];

interface HeroSlideshowProps {
  children?: React.ReactNode;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ children }) => {
  // 1. Prepare structured image configuration with WebP and Priority tagging
  const slideConfigs = PATIENT_COORDINATION_SLIDES.map((s, idx) => ({
    url: s.image,
    webpUrl: s.webp,
    critical: idx === 0 // 1st hero slide is critical for zero initial delay
  }));

  // 2. Front-load critical hero images respecting WebP format & user network bandwidth
  const {
    loaded: isPreloaded,
    allLoaded,
    progress: preloadProgress,
    isWebPSupported,
    isSaveDataActive,
    networkStatus,
    preloadIndex,
    getOptimalUrl
  } = useImagePreloader(slideConfigs, {
    criticalCount: 1,
    preferWebP: true,
    respectSaveData: true,
    decodeAsync: true
  });

  // 3. Slideshow transition state
  const {
    currentIndex,
    isPlaying,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePlay,
    pause,
    resume
  } = useSlideshow({
    totalSlides: PATIENT_COORDINATION_SLIDES.length,
    interval: 6500,
    autoPlay: true
  });

  // 4. In low-bandwidth/save-data mode, eagerly preload the next upcoming slide just in time
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % PATIENT_COORDINATION_SLIDES.length;
    preloadIndex(nextIdx);
  }, [currentIndex, preloadIndex]);

  const currentSlide = PATIENT_COORDINATION_SLIDES[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-label="Realistic Patient Coordination Slideshow"
    >
      {/* Background Slideshow Canvas */}
      <div className="absolute inset-0 z-0">
        {PATIENT_COORDINATION_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          const isCritical = index === 0;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Picture element providing modern WebP with automatic JPEG fallback */}
              <picture className="block w-full h-full">
                <source srcSet={slide.webp} type="image/webp" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={isCritical ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={isCritical ? 'high' : 'low'}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </picture>

              {/* Sophisticated Multi-Stage Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/80 to-slate-900/60"></div>
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/40"></div>
              <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/80"></div>
            </div>
          );
        })}
      </div>

      {/* Decorative Subtle Accent Lights */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#0EA5E9]/10 blur-3xl pointer-events-none z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#65A30D]/10 blur-3xl pointer-events-none z-10"></div>

      Foreground Content Container
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">

        {/* Injected Content (Hero text & fast-track card) */}
        {children}

        {/* Slideshow Controls Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Interactive Slide Progress Dots */}
          {/* <div className="flex items-center gap-2">
            {PATIENT_COORDINATION_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-8 bg-linear-to-r from-[#0EA5E9] to-[#F4C430] shadow-xs shadow-sky-500/50'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  title={slide.title}
                />
              );
            })}
          </div> */}
        </div>
      </div>
    </div>
  );
};
