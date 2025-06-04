import { writable, derived } from 'svelte/store';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD format
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // YYYY-MM-DD format
}

export interface DayData {
  todos: TodoItem[];
  note: string;
  transactions: Transaction[];
}

export interface Settings {
  currency: string;
  currencySymbol: string;
  locale: string;
}

// Default settings
const defaultSettings: Settings = {
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US'
};

// Current selected date
export const selectedDate = writable<Date>(new Date());

// Data storage - keyed by date string (YYYY-MM-DD)
export const dayDataStore = writable<Record<string, DayData>>({});

// Settings store
export const settingsStore = writable<Settings>(defaultSettings);

// Utility function to format date as YYYY-MM-DD
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Local storage functions
export function loadFromLocalStorage(): Record<string, DayData> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('tempoday-data');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
}

export function saveToLocalStorage(data: Record<string, DayData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('tempoday-data', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Settings local storage functions
export function loadSettingsFromLocalStorage(): Settings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem('tempoday-settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
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

// Initialize stores with localStorage data
if (typeof window !== 'undefined') {
  dayDataStore.set(loadFromLocalStorage());
  settingsStore.set(loadSettingsFromLocalStorage());
  
  // Auto-save to localStorage whenever stores change
  dayDataStore.subscribe((data) => {
    saveToLocalStorage(data);
  });
  
  settingsStore.subscribe((settings) => {
    saveSettingsToLocalStorage(settings);
  });
}

// Derived stores for current day data
export const currentDateKey = derived(selectedDate, $selectedDate => formatDateKey($selectedDate));

export const currentDayData = derived(
  [dayDataStore, currentDateKey], 
  ([$dayDataStore, $currentDateKey]) => $dayDataStore[$currentDateKey] || { todos: [], note: '', transactions: [] }
);

// Helper function to update current day data
export function updateCurrentDayData(updates: Partial<DayData>) {
  let currentSelectedDate: Date;
  const unsubscribe = selectedDate.subscribe(date => currentSelectedDate = date);
  
  dayDataStore.update(store => {
    const dateKey = formatDateKey(currentSelectedDate);
    const currentData = store[dateKey] || { todos: [], note: '', transactions: [] };
    unsubscribe();
    return {
      ...store,
      [dateKey]: {
        ...currentData,
        ...updates
      }
    };
  });
}
