import { useSyncExternalStore } from "react";

/**
 * Совпадает ли медиазапрос. На сервере и при гидрации всегда false —
 * так разметка сходится с SSR, а реальное значение приходит сразу после.
 */
export const useMediaQuery = (query) =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
