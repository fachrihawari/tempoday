// Data models for Dexie/IndexedDB

export interface Task {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  description: string;
  completed: 0 | 1; // Use 0/1 for boolean for IndexedDB compatibility
  priority: 'low' | 'medium' | 'high' | 'urgent'; // New priority field
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

export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'education'
  | 'work'
  | 'travel'
  | 'gifts'
  | 'other';

export interface Transaction {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory; // New category field
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export interface TempoDaySettings {
  // Currency settings
  currency: string;
  currencySymbol: string;
  locale: string;
  // Appearance theme: 'light' | 'dark' | 'system'
  theme: 'light' | 'dark' | 'system';
}

export interface Settings {
  id: string; // UUID
  data: TempoDaySettings;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}