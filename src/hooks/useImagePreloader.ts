import { useState, useEffect, useCallback, useRef } from 'react';
import {
  checkWebPSupport,
  getNetworkStatus,
  resolveOptimalImageUrl,
  preloadSingleImage,
  NetworkStatus
} from '../utils/imagePreloader';

export type ImageInput = string | { url: string; webpUrl?: string; critical?: boolean };

export interface PreloadOptions {
  /**
   * Number of initial slides considered critical above the fold (default: 1)
   */
  criticalCount?: number;
  /**
   * Automatically prefer WebP if supported (default: true)
   */
  preferWebP?: boolean;
  /**
   * Respect navigator.connection.saveData or 2G connections (default: true)
   */
  respectSaveData?: boolean;
  /**
   * Run HTMLImageElement.decode() to avoid frame drops on swap (default: true)
   */
  decodeAsync?: boolean;
}

export interface PreloadResult {
  /** True once critical image(s) are ready for immediate rendering */
  loaded: boolean;
  /** True once all scheduled images are loaded */
  allLoaded: boolean;
  /** Percentage of loaded images (0 - 100) */
  progress: number;
  /** List of loaded image URLs */
  loadedImages: string[];
  /** List of failed image URLs */
  failedImages: string[];
  /** Detected WebP support status */
  isWebPSupported: boolean | null;
  /** Active Network and Data Saver state */
  networkStatus: NetworkStatus;
  /** Explicit indicator if Data Saver mode is active */
  isSaveDataActive: boolean;
  /** Function to load a specific slide index on-demand */
  preloadIndex: (index: number) => Promise<void>;
  /** Helper to get the optimal WebP or fallback URL */
  getOptimalUrl: (url: string, webpUrl?: string) => string;
}

/**
 * useImagePreloader
 * Advanced hook that preloads critical hero section images to ensure a smooth, lag-free
 * slideshow experience on initial page load.
 * 
 * - Supports WebP format detection and transparent resolution
 * - Respects user bandwidth preferences (Data Saver / slow connections)
 * - Decodes images asynchronously in the background before rendering
 */
export function useImagePreloader(
  images: ImageInput[],
  options: PreloadOptions = {}
): PreloadResult {
  const {
    criticalCount = 1,
    preferWebP = true,
    respectSaveData = true,
    decodeAsync = true
  } = options;

  const [loaded, setLoaded] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [isWebPSupported, setIsWebPSupported] = useState<boolean | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => getNetworkStatus());

  // Keep track of loaded indices to prevent re-fetching
  const loadedIndicesRef = useRef<Set<number>>(new Set());
  const normalizedImagesRef = useRef<{ url: string; webpUrl?: string; critical: boolean }[]>([]);

  // Normalize inputs
  normalizedImagesRef.current = images.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        url: item,
        webpUrl: item.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
        critical: idx < criticalCount
      };
    }
    return {
      url: item.url,
      webpUrl: item.webpUrl || item.url.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      critical: item.critical ?? idx < criticalCount
    };
  });

  // Helper to compute optimal URL
  const getOptimalUrl = useCallback(
    (url: string, webpUrl?: string) => {
      const webpAllowed = preferWebP && isWebPSupported === true;
      return resolveOptimalImageUrl(url, webpAllowed, webpUrl);
    },
    [preferWebP, isWebPSupported]
  );

  // Preload a specific image index
  const preloadIndex = useCallback(
    async (index: number) => {
      const list = normalizedImagesRef.current;
      if (index < 0 || index >= list.length) return;
      if (loadedIndicesRef.current.has(index)) return;

      const item = list[index];
      const targetUrl = getOptimalUrl(item.url, item.webpUrl);

      const res = await preloadSingleImage(targetUrl, {
        priority: item.critical ? 'high' : 'low',
        decodeAsync
      });

      loadedIndicesRef.current.add(index);

      if (res.success) {
        setLoadedImages((prev) => (prev.includes(targetUrl) ? prev : [...prev, targetUrl]));
      } else {
        // If webp fails, try fallback original URL
        if (targetUrl !== item.url) {
          const fallbackRes = await preloadSingleImage(item.url, {
            priority: item.critical ? 'high' : 'low',
            decodeAsync
          });
          if (fallbackRes.success) {
            setLoadedImages((prev) => (prev.includes(item.url) ? prev : [...prev, item.url]));
          } else {
            setFailedImages((prev) => [...prev, item.url]);
          }
        } else {
          setFailedImages((prev) => [...prev, targetUrl]);
        }
      }
    },
    [getOptimalUrl, decodeAsync]
  );

  // Initial loading orchestration
  useEffect(() => {
    let isMounted = true;

    async function initializePreload() {
      // 1. Detect WebP capability
      const webpSupported = await checkWebPSupport();
      if (!isMounted) return;
      setIsWebPSupported(webpSupported);

      // 2. Read latest network conditions
      const currentNetwork = getNetworkStatus();
      if (!isMounted) return;
      setNetworkStatus(currentNetwork);

      const items = normalizedImagesRef.current;
      if (items.length === 0) {
        setLoaded(true);
        setAllLoaded(true);
        setProgress(100);
        return;
      }

      // Check if we should preserve bandwidth
      const shouldSaveBandwidth = respectSaveData && currentNetwork.isLowBandwidth;

      // Stage A: Preload Critical Hero Image(s) immediately with high priority
      const criticalIndices = items
        .map((item, idx) => (item.critical ? idx : -1))
        .filter((idx) => idx !== -1);

      // Default to at least the first image if none flagged
      const initialIndicesToLoad = criticalIndices.length > 0 ? criticalIndices : [0];

      await Promise.all(
        initialIndicesToLoad.map(async (idx) => {
          const item = items[idx];
          const targetUrl = resolveOptimalImageUrl(
            item.url,
            preferWebP && webpSupported,
            item.webpUrl
          );

          const res = await preloadSingleImage(targetUrl, {
            priority: 'high',
            decodeAsync
          });

          if (!isMounted) return;
          loadedIndicesRef.current.add(idx);

          if (res.success) {
            setLoadedImages((prev) => (prev.includes(targetUrl) ? prev : [...prev, targetUrl]));
          } else if (targetUrl !== item.url) {
            // Fallback
            const fallbackRes = await preloadSingleImage(item.url, {
              priority: 'high',
              decodeAsync
            });
            if (fallbackRes.success) {
              setLoadedImages((prev) => (prev.includes(item.url) ? prev : [...prev, item.url]));
            } else {
              setFailedImages((prev) => [...prev, item.url]);
            }
          } else {
            setFailedImages((prev) => [...prev, targetUrl]);
          }
        })
      );

      if (!isMounted) return;

      // Critical phase complete: Hero is ready with zero initial lag or flicker!
      setLoaded(true);

      const criticalRatio = Math.round((initialIndicesToLoad.length / items.length) * 100);
      setProgress(criticalRatio);

      // Stage B: Non-Critical Preloading
      if (shouldSaveBandwidth) {
        // User requested Save-Data or is on slow network: Defer remaining slides to on-demand
        setAllLoaded(false);
        return;
      }

      // If user has standard/fast connection, preload remaining background slides sequentially
      const remainingIndices = items
        .map((_, idx) => idx)
        .filter((idx) => !initialIndicesToLoad.includes(idx));

      let loadedCount = initialIndicesToLoad.length;

      for (const idx of remainingIndices) {
        if (!isMounted) return;
        const item = items[idx];
        const targetUrl = resolveOptimalImageUrl(
          item.url,
          preferWebP && webpSupported,
          item.webpUrl
        );

        const res = await preloadSingleImage(targetUrl, {
          priority: 'low',
          decodeAsync
        });

        if (!isMounted) return;
        loadedIndicesRef.current.add(idx);

        if (res.success) {
          setLoadedImages((prev) => (prev.includes(targetUrl) ? prev : [...prev, targetUrl]));
        } else if (targetUrl !== item.url) {
          const fallbackRes = await preloadSingleImage(item.url, {
            priority: 'low',
            decodeAsync
          });
          if (fallbackRes.success) {
            setLoadedImages((prev) => (prev.includes(item.url) ? prev : [...prev, item.url]));
          } else {
            setFailedImages((prev) => [...prev, item.url]);
          }
        } else {
          setFailedImages((prev) => [...prev, targetUrl]);
        }

        loadedCount++;
        setProgress(Math.round((loadedCount / items.length) * 100));
      }

      if (isMounted) {
        setAllLoaded(true);
        setProgress(100);
      }
    }

    initializePreload();

    return () => {
      isMounted = false;
    };
  }, [images.length, criticalCount, preferWebP, respectSaveData, decodeAsync]);

  return {
    loaded,
    allLoaded,
    progress,
    loadedImages,
    failedImages,
    isWebPSupported,
    networkStatus,
    isSaveDataActive: networkStatus.isLowBandwidth,
    preloadIndex,
    getOptimalUrl
  };
}
