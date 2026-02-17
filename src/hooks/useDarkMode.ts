import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai-dash-dark-mode';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return { isDark, toggleDark };
}
