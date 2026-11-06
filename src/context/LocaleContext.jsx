"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, splitLocale } from "../i18n/config";

const LocaleContext = createContext(null);

export const LocaleProvider = ({ locale, children }) => {
  const value = useMemo(
    () => ({
      locale,
      supportedLocales: LOCALES,
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

export const usePathWithoutLocale = () => splitLocale(usePathname()).path;
