"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import userApi from '@/lib/userApi';

const SiteImagesContext = createContext({ images: {}, mediaTypes: {} });

export function SiteImagesProvider({ children }) {
  const [siteMedia, setSiteMedia] = useState({ images: {}, mediaTypes: {} });

  useEffect(() => {
    let cancelled = false;

    userApi.get('/site-images')
      .then((res) => {
        if (!cancelled) {
          setSiteMedia({
            images: res.data.images || {},
            mediaTypes: res.data.mediaTypes || {},
          });
        }
      })
      .catch(() => {
        // Sections keep using their default assets if this feed fails
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <SiteImagesContext.Provider value={siteMedia}>
      {children}
    </SiteImagesContext.Provider>
  );
}

// Whole map lookup — use when resolving several keys in a loop (map/array), since
// hooks can't be called per-iteration inside a .map() callback.
export function useSiteImages() {
  return useContext(SiteImagesContext).images;
}

// Single key lookup with a fallback to the section's default asset.
export function useSiteImage(key, fallbackSrc) {
  return useSiteImages()[key] || fallbackSrc;
}

export function useSiteMedia(key, fallbackSrc) {
  const { images, mediaTypes } = useContext(SiteImagesContext);
  return {
    url: images[key] || fallbackSrc,
    type: mediaTypes[key] === 'video' ? 'video' : 'image',
  };
}
