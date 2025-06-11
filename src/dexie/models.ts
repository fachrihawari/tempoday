// Data models for Dexie/IndexedDB

export interface Task {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  description: string;
  completed: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export interface Note {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export interface TempoDaySettings {
  // Currency settings
  currency: string;
  currencySymbol: string;
  locale: string;
}

export const defaultSettings: TempoDaySettings = {
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
};

export interface Settings {
  id: string; // UUID
  data: TempoDaySettings;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}
