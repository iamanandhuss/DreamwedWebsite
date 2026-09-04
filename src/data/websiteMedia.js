import DEFAULT_MEDIA from './websiteMedia.json';

/**
 * Returns the active website media configuration.
 * Prioritizes custom overrides from Admin (saved in localStorage / backend)
 * and falls back to the default Cloudinary CDN URLs.
 */
export const getWebsiteMedia = () => {
  if (typeof window === 'undefined') return DEFAULT_MEDIA;
  try {
    const saved = localStorage.getItem('dreamwed_website_media_custom');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_MEDIA,
        ...parsed,
        sections: {
          ...DEFAULT_MEDIA.sections,
          ...(parsed.sections || {})
        },
        mediaMap: {
          ...DEFAULT_MEDIA.mediaMap,
          ...(parsed.mediaMap || {})
        }
      };
    }
  } catch (e) {
    console.warn('Error reading custom website media:', e);
  }
  return DEFAULT_MEDIA;
};

/**
 * Returns a specific media URL for a section key or asset name.
 */
export const getMediaUrl = (sectionPath, fallback = '') => {
  const media = getWebsiteMedia();
  if (!sectionPath) return fallback;

  // 1. Direct section key lookup e.g. "hero.backgroundImage"
  if (sectionPath.includes('.')) {
    const [sec, key] = sectionPath.split('.');
    if (media.sections?.[sec]?.[key]) {
      return media.sections[sec][key];
    }
  }

  // 2. Direct map lookup e.g. "RED.jpg"
  if (media.mediaMap?.[sectionPath]) {
    return media.mediaMap[sectionPath];
  }

  return fallback;
};

export const saveWebsiteMediaCustomization = (newConfig) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dreamwed_website_media_custom', JSON.stringify(newConfig));
    window.dispatchEvent(new Event('dreamwed_media_updated'));
  } catch (e) {
    console.error('Failed to save website media customization:', e);
  }
};

export default DEFAULT_MEDIA;
