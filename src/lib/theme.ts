// Centralized Theme System for TempoDay
export const sectionThemes = {
  tasks: {
    primary: 'blue',
    colors: {
      icon: 'text-blue-500',
      button: {
        solid: 'bg-blue-500 text-white hover:bg-blue-600',
        dashed:
          'text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700',
      },
      focus: 'focus:ring-blue-500',
      accent: 'text-blue-600',
    },
  },
  notes: {
    primary: 'purple',
    colors: {
      icon: 'text-purple-500 dark:text-purple-400',
      button: {
        solid:
          'bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700',
        dashed:
          'text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-200',
      },
      focus: 'focus:ring-purple-500 dark:focus:ring-purple-400',
      accent: 'text-purple-600 dark:text-purple-400',
    },
  },
  financials: {
    primary: 'green',
    colors: {
      icon: 'text-green-500',
      button: {
        solid: 'bg-green-500 text-white hover:bg-green-600',
        dashed:
          'text-green-600 border-green-300 hover:border-green-500 hover:text-green-700',
      },
      focus: 'focus:ring-green-500',
      accent: 'text-green-600',
    },
  },
} as const;

export type SectionTheme = keyof typeof sectionThemes;

/**
 * Sets up theme management for Tailwind v4 darkMode: 'class'.
 * Listens to settingsStore and system theme changes.
 */
export function initThemeWatcher(settingsStore: any) {
  let systemDarkListener: MediaQueryList | null = null;

  function applyTheme(theme: 'light' | 'dark' | 'system') {
    const html = document.documentElement;
    // Clean up previous listener
    if (systemDarkListener) {
      systemDarkListener.removeEventListener('change', handleSystemThemeChange);
      systemDarkListener = null;
    }
    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else {
      // System: follow OS
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      // Listen for system changes
      systemDarkListener = window.matchMedia('(prefers-color-scheme: dark)');
      systemDarkListener.addEventListener('change', handleSystemThemeChange);
    }
  }

  function handleSystemThemeChange(e: MediaQueryListEvent) {
    if (settingsStore.settings.theme === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  // Svelte 5: use $effect in the caller, or subscribe here if using a store
  return () => {
    // Only run if settings are loaded and theme is not undefined
    if (settingsStore.settings.theme === undefined) return;
    applyTheme(settingsStore.settings.theme ?? 'system');
  };
}
