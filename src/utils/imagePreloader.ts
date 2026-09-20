/**
 * imagePreloader.ts
 * High-performance image preloading utility designed for critical hero sections and slideshows.
 * 
 * Features:
 * 1. WebP Format Detection & Dynamic Resolution
 * 2. Network Information API Awareness (Save-Data header, effectiveType: 4g/3g/2g)
 * 3. Priority Pipeline: Critical above-the-fold images load & decode first
 * 4. Asynchronous GPU Texture Decoding (HTMLImageElement.decode()) to eliminate frame drops
 */

export interface NetworkStatus {
  saveData: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink?: number;
  rtt?: number;
  isLowBandwidth: boolean;
}

export interface ImagePreloadConfig {
  url: string;
  webpUrl?: string;
  critical?: boolean;
}

export interface PreloadProgressCallback {
  (loaded: number, total: number, url: string, isSuccess: boolean): void;
}

// Singleton cache for WebP detection to prevent redundant checks
let cachedWebPSupport: boolean | null = null;

/**
 * Detects whether the current browser environment supports WebP decoding.
 * Uses canvas toDataURL test or 1x1 test image.
 */
export async function checkWebPSupport(): Promise<boolean> {
  if (cachedWebPSupport !== null) {
    return cachedWebPSupport;
  }

  // Check in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cachedWebPSupport = false;
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      cachedWebPSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      return cachedWebPSupport;
    }
  } catch {
    // Fallback through image test
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      cachedWebPSupport = img.width > 0 && img.height > 0;
      resolve(cachedWebPSupport);
    };
    img.onerror = () => {
      cachedWebPSupport = false;
      resolve(false);
    };
    // 1x1 WebP base64 image
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

/**
 * Inspects user network conditions using the Network Information API.
 * Respects navigator.connection.saveData and connection speed.
 */
export function getNetworkStatus(): NetworkStatus {
  if (typeof navigator === 'undefined') {
    return {
      saveData: false,
      effectiveType: 'unknown',
      isLowBandwidth: false
    };
  }

  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) {
    return {
      saveData: false,
      effectiveType: 'unknown',
      isLowBandwidth: false
    };
  }

  const saveData = Boolean(connection.saveData);
  const effectiveType = connection.effectiveType || 'unknown';
  const downlink = connection.downlink;
  const rtt = connection.rtt;

  // Classify as low bandwidth if saveData is true OR network is 2g/slow-2g OR downlink < 1.0 Mbps
  const isLowBandwidth =
    saveData ||
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    (typeof downlink === 'number' && downlink < 0.8);

  return {
    saveData,
    effectiveType,
    downlink,
    rtt,
    isLowBandwidth
  };
}

/**
 * Returns the best image URL for the current browser, swapping to .webp if supported.
 */
export function resolveOptimalImageUrl(
  url: string,
  isWebPSupported: boolean,
  webpOverrideUrl?: string
): string {
  if (webpOverrideUrl && isWebPSupported) {
    return webpOverrideUrl;
  }

  if (isWebPSupported && url && !url.endsWith('.webp')) {
    // If URL is a standard image, attempt webp extension counterpart
    const webpEquivalent = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpEquivalent;
  }

  return url;
}

/**
 * Preloads a single image and calls decode() to ensure texture is fully ready in GPU memory.
 */
export async function preloadSingleImage(
  src: string,
  options: {
    priority?: 'high' | 'low' | 'auto';
    decodeAsync?: boolean;
  } = {}
): Promise<{ src: string; success: boolean; duration: number }> {
  const { priority = 'auto', decodeAsync = true } = options;
  const startTime = performance.now();

  return new Promise((resolve) => {
    const img = new Image();

    // Set priority hint if supported by browser
    if ('fetchPriority' in img && priority !== 'auto') {
      (img as any).fetchPriority = priority;
    }

    const onComplete = async (isSuccess: boolean) => {
      const duration = Math.round(performance.now() - startTime);

      if (isSuccess && decodeAsync && 'decode' in img) {
        try {
          // Asynchronously decode image texture off the main thread
          await img.decode();
        } catch {
          // Ignore decode errors (e.g. image aborted)
        }
      }

      resolve({ src, success: isSuccess, duration });
    };

    if (img.complete && img.naturalWidth > 0) {
      onComplete(true);
    } else {
      img.onload = () => onComplete(true);
      img.onerror = () => onComplete(false);
      img.src = src;
    }
  });
}
