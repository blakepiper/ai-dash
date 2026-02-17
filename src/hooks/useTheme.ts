import { useState, useEffect } from 'react';
import { ThemeConfig, loadThemeConfig, applyThemeColors, getDefaultTheme } from '../config/theme';

const DARK_KEY = 'ai-dash-dark-mode';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(DARK_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getDefaultTheme);

  useEffect(() => {
    loadThemeConfig().then((config) => {
      setThemeConfig(config);
      if (!isDark) {
        applyThemeColors(config);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      applyThemeColors(themeConfig);
    }
    localStorage.setItem(DARK_KEY, String(isDark));
  }, [isDark, themeConfig]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return { isDark, toggleDark, themeConfig };
}
