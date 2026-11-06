"use client";

import { forwardRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "../context/LocaleContext";
import { localizePath } from "./config";

export function useLocalePath() {
  const { locale } = useLocale();
  return (href) => localizePath(href, locale);
}

export const LocaleLink = forwardRef(function LocaleLink({ href, ...props }, ref) {
  const { locale } = useLocale();
  return <Link ref={ref} href={localizePath(href, locale)} {...props} />;
});

export function useLocaleRouter() {
  const router = useRouter();
  const { locale } = useLocale();

  return useMemo(
    () => ({
      ...router,
      push: (href, options) => router.push(localizePath(href, locale), options),
      replace: (href, options) => router.replace(localizePath(href, locale), options),
      prefetch: (href, options) => router.prefetch(localizePath(href, locale), options),
    }),
    [router, locale]
  );
}
