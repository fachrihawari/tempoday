import { writable } from 'svelte/store';

export interface Settings {
  currency: string;
  currencySymbol: string;
  locale: string;
}

// Default settings
const defaultSettings: Settings = {
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
};

// Current selected date
export const selectedDate = writable<Date>(new Date());

// Settings store
export const settingsStore = writable<Settings>(defaultSettings);

// Utility function to format date as YYYY-MM-DD
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Settings local storage functions
export function loadSettingsFromLocalStorage(): Settings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const stored = localStorage.getItem('tempoday-settings');
    return stored
      ? { ...defaultSettings, ...JSON.parse(stored) }
      : defaultSettings;
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return defaultSettings;
  }
}

export function saveSettingsToLocalStorage(settings: Settings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('tempoday-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

// Initialize settings store with localStorage data
if (typeof window !== 'undefined') {
  settingsStore.set(loadSettingsFromLocalStorage());

  // Auto-save settings to localStorage when store changes
  settingsStore.subscribe((settings) => {
    saveSettingsToLocalStorage(settings);
  });
}
