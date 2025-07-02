import Dexie from 'dexie';
import type { Note, Settings, Task, Transaction } from './models';

export class TempoDayDexie extends Dexie {
  tasks!: Dexie.Table<Task, string>;
  notes!: Dexie.Table<Note, string>;
  transactions!: Dexie.Table<Transaction, string>;
  settings!: Dexie.Table<Settings, string>;

  constructor() {
    super('TempoDayDB');
    this.version(1).stores({
      tasks: 'id, date, completed',
      notes: 'id, date',
      transactions: 'id, date, type',
      settings: 'id',
    });

    // Version 2: Add priority field to tasks
    this.version(2).stores({
      tasks: 'id, date, completed, priority',
      notes: 'id, date',
      transactions: 'id, date, type',
      settings: 'id',
    }).upgrade(tx => {
      // Migrate existing tasks to have default 'medium' priority
      return tx.table('tasks').toCollection().modify(task => {
        if (!task.priority) {
          task.priority = 'medium';
        }
        // Normalize completed field to 0/1, with fallback for missing/invalid
        if (typeof task.completed === 'boolean') {
          task.completed = task.completed ? 1 : 0;
        } else if (task.completed !== 0 && task.completed !== 1) {
          task.completed = 0;
        }
      });
    });

    // Version 3: Add category field to transactions
    this.version(3).stores({
      tasks: 'id, date, description, completed, priority',
      notes: 'id, date, content',
      transactions: 'id, date, description, type, category',
      settings: 'id',
    }).upgrade(tx => {
      // Migrate existing transactions to have default category
      return tx.table('transactions').toCollection().modify(transaction => {
        if (!transaction.category) {
          // Set default category based on transaction type
          transaction.category = transaction.type === 'income' ? 'work' : 'other';
        }
      });
    });
  }
  /**
   * Get the current schema version
   */
  getCurrentSchemaVersion(): number {
    return 3; // Current schema version
  }
}

// Utility to get default last 30 days date range
export function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29); // Last 30 days including today
  return {
    start: start.toISOString().slice(0, 10), // 'YYYY-MM-DD'
    end: end.toISOString().slice(0, 10),
  };
}

export const db = new TempoDayDexie();