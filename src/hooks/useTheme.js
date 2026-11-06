"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "../utils/themeScript";

const listeners = new Set();

const readSavedTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
    ? "dark"
    : "light";
};

let currentTheme = readSavedTheme();

const applyTheme = (theme) => {
  document.body.classList.toggle("dark-theme", theme === "dark");
};

if (typeof document !== "undefined") {
  applyTheme(currentTheme);
}

export function useTheme() {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    applyTheme(currentTheme);
    setThemeState(currentTheme);
    listeners.add(setThemeState);
    return () => listeners.delete(setThemeState);
  }, []);

  const setTheme = useCallback((next) => {
    if (next === currentTheme) return;

    currentTheme = next;
    applyTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    listeners.forEach((listener) => listener(next));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
