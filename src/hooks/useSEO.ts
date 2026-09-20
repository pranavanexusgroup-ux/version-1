import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_TITLE = 'Global Medical Tourism Services | Pranava Nexus Care';
const DEFAULT_DESCRIPTION = 'Pranava Nexus Care provides structured medical tourism coordination for patients and families seeking treatment in India and verified global destinations. Hospital appointments, travel, and care planning.';
const DEFAULT_IMAGE = `${import.meta.env.BASE_URL}assets/images/patient-coordination-hero.jpg`;

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    'medical tourism india',
    'healthcare travel facilitator',
    'patient care coordination',
    'kolkata medical tourism',
    'international patient assistance',
    'hospital appointment coordination',
    'pranava nexus care'
  ],
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  jsonLd
}: SEOProps) {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? `${title} | Pranava Nexus Care`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }

    // 3. OpenGraph Tags
    const fullImageUrl = ogImage.startsWith('http')
      ? ogImage
      : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

    const currentUrl = canonicalUrl || window.location.href;

    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'Pranava Nexus Care');

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 6. JSON-LD Structured Data
    let scriptTag = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount if needed
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, jsonLd]);
}
