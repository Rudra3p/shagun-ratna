"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import userApi from '@/lib/userApi';

const SiteTextsContext = createContext({
  texts: {},
  setTextOverride: () => {},
});

export function SiteTextsProvider({ children, initialTexts = null }) {
  const [texts, setTexts] = useState(initialTexts || {});

  useEffect(() => {
    let cancelled = false;

    userApi.get('/site-texts')
      .then((res) => {
        if (!cancelled && res.data?.texts) {
          setTexts((prev) => ({ ...res.data.texts, ...prev }));
        }
      })
      .catch(() => {
        // Sections will cleanly fallback to default copy
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setTextOverride = (key, value) => {
    setTexts((prev) => {
      if (value === null || value === undefined) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <SiteTextsContext.Provider value={{ texts, setTextOverride }}>
      {children}
    </SiteTextsContext.Provider>
  );
}

export function useSiteTexts() {
  return useContext(SiteTextsContext).texts;
}

export function useSiteText(key, fallbackText = '') {
  const { texts } = useContext(SiteTextsContext);
  return texts[key] !== undefined && texts[key] !== null ? texts[key] : fallbackText;
}

export function useSetSiteText() {
  return useContext(SiteTextsContext).setTextOverride;
}

