export interface ThemeConfig {
  appName: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
}

const defaultTheme: ThemeConfig = {
  appName: 'AI Dash',
};

let cachedTheme: ThemeConfig | null = null;

export async function loadThemeConfig(): Promise<ThemeConfig> {
  if (cachedTheme) return cachedTheme;

  try {
    const res = await fetch('/theme.json');
    if (res.ok) {
      const config = await res.json();
      cachedTheme = { ...defaultTheme, ...config } as ThemeConfig;
      return cachedTheme!;
    }
  } catch {
    // No custom theme — use defaults
  }

  cachedTheme = defaultTheme;
  return cachedTheme;
}

export function applyThemeColors(config: ThemeConfig): void {
  const root = document.documentElement;
  if (config.primaryColor) {
    root.style.setProperty('--color-primary', config.primaryColor);
  }
  if (config.accentColor) {
    root.style.setProperty('--color-primary-hover', config.accentColor);
  }
}

export function getDefaultTheme(): ThemeConfig {
  return defaultTheme;
}
