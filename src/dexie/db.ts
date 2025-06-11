import Dexie from 'dexie';
import type { Task, Note, Transaction } from './models';

export class TempoDayDexie extends Dexie {
  tasks!: Dexie.Table<Task, string>;
  notes!: Dexie.Table<Note, string>;
  transactions!: Dexie.Table<Transaction, string>;

  constructor() {
    super('TempoDayDB');
    this.version(1).stores({
      tasks: 'id, date, completed',
      notes: 'id, date',
      transactions: 'id, date, type',
    });

    // Setup hooks for like automatic timestamps
    this.setupHooks();
  }

  setupHooks() {
    const creating = (_: string, obj: Task | Note | Transaction) => {
      const now = Date.now();
      obj.createdAt = now;
      obj.updatedAt = now;
    };
    const updating = (modifications: Partial<Task | Note | Transaction>) => {
      modifications.updatedAt = Date.now();
    };

    // Automatically set createdAt and updatedAt timestamps
    this.tasks.hook('creating', creating);
    this.tasks.hook('updating', updating);

    this.notes.hook('creating', creating);
    this.notes.hook('updating', updating);

    this.transactions.hook('creating', creating);
    this.transactions.hook('updating', updating);
  }
}

export const db = new TempoDayDexie();
