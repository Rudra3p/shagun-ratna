"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import userApi from '@/lib/userApi';

const SiteImagesContext = createContext({});

export function SiteImagesProvider({ children }) {
  const [images, setImages] = useState({});

  useEffect(() => {
    let cancelled = false;

    userApi.get('/site-images')
      .then((res) => {
        if (!cancelled) setImages(res.data.images || {});
      })
      .catch(() => {
        // Sections keep using their default assets if this feed fails
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <SiteImagesContext.Provider value={images}>
      {children}
    </SiteImagesContext.Provider>
  );
}

// Whole map lookup — use when resolving several keys in a loop (map/array), since
// hooks can't be called per-iteration inside a .map() callback.
export function useSiteImages() {
  return useContext(SiteImagesContext);
}

// Single key lookup with a fallback to the section's default asset.
export function useSiteImage(key, fallbackSrc) {
  const images = useContext(SiteImagesContext);
  return images[key] || fallbackSrc;
}
