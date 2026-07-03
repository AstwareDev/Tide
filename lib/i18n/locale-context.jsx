"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, translate } from "@/lib/i18n/translations";

const STORAGE_KEY = "tide_locale";
const LocaleContext = createContext(null);

function readStoredLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_LOCALES.includes(stored) ? stored : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  // Fades content out/in around a locale switch so it reads as a deliberate
  // "soft refresh" of the whole UI rather than a jarring instant text swap —
  // without an actual page reload.
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next) => {
      if (!SUPPORTED_LOCALES.includes(next) || next === locale) return;
      setTransitioning(true);
      window.setTimeout(() => {
        window.localStorage.setItem(STORAGE_KEY, next);
        document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000`;
        setLocaleState(next);
        requestAnimationFrame(() => setTransitioning(false));
      }, 180);
    },
    [locale]
  );

  const t = useCallback((key, vars) => translate(locale, key, vars), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      <div className="transition-opacity duration-200 ease-out" style={{ opacity: transitioning ? 0 : 1 }}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
