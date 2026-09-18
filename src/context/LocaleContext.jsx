"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LocaleContext = createContext(null);

const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "ru"];
const LOCALE_STORAGE_KEY = "portfolio-locale";

const resolveInitialLocale = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  if (SUPPORTED_LOCALES.includes(savedLocale)) {
    return savedLocale;
  }

  return window.navigator.language?.toLowerCase().startsWith("ru")
    ? "ru"
    : DEFAULT_LOCALE;
};

export const LocaleProvider = ({ children }) => {
  // На сервере localStorage и navigator.language недоступны, поэтому первый
  // рендер всегда идёт на языке по умолчанию — иначе разметка сервера и клиента
  // разойдутся и React выбросит ошибку гидрации. Сохранённый язык поднимается
  // эффектом сразу после монтирования.
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    setLocale(resolveInitialLocale());
    setIsResolved(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Пока сохранённый язык не прочитан, писать в localStorage нельзя: запись
  // стартового "en" затёрла бы выбранный ранее "ru" ещё до того, как эффект
  // выше успеет его поднять.
  useEffect(() => {
    if (!isResolved) return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, isResolved]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      supportedLocales: SUPPORTED_LOCALES,
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
};
