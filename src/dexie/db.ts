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
      });
    });

    // Version 3: Add category field to transactions
    this.version(3).stores({
      tasks: 'id, date, completed, priority',
      notes: 'id, date',
      transactions: 'id, date, type, category',
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
}

export const db = new TempoDayDexie();