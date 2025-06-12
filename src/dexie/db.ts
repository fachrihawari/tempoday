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
  }
}

export const db = new TempoDayDexie();
