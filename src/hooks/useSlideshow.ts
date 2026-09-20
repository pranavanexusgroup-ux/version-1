import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSlideshowOptions {
  totalSlides: number;
  interval?: number;
  autoPlay?: boolean;
}

export function useSlideshow({
  totalSlides,
  interval = 5000,
  autoPlay = true
}: UseSlideshowOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  }, [totalSlides]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const pause = useCallback(() => {
    setIsHovered(true);
  }, []);

  const resume = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isHovered, interval, nextSlide, totalSlides]);

  return {
    currentIndex,
    isPlaying,
    isHovered,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePlay,
    pause,
    resume
  };
}
