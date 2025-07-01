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

  /**
   * Test and verify database indexes are working
   */
  async testIndexes() {
    console.log('=== Testing Database Indexes ===');

    try {
      // Get table schemas to see what indexes exist
      const tasksSchema = this.tasks.schema;
      console.log('Tasks table indexes:', tasksSchema.indexes.map(idx => ({ name: idx.name, keyPath: idx.keyPath })));

      // Check if we have any tasks, if not create some test data
      const existingTaskCount = await this.tasks.count();
      console.log(`Existing tasks in database: ${existingTaskCount}`);

      if (existingTaskCount === 0) {
        console.log('No tasks found. Creating test data...');
        const testTasks = [
          {
            id: 'test-1',
            date: new Date().toISOString().split('T')[0],
            description: 'Test completed task',
            completed: true,
            priority: 'medium' as const,
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: 'test-2',
            date: new Date().toISOString().split('T')[0],
            description: 'Test incomplete task',
            completed: false,
            priority: 'high' as const,
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: 'test-3',
            date: new Date().toISOString().split('T')[0],
            description: 'Another incomplete task',
            completed: false,
            priority: 'low' as const,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ];

        await this.tasks.bulkAdd(testTasks);
        console.log('Test tasks created successfully');
      }

      // Test boolean index queries (IndexedDB stores booleans as 1/0)
      console.log('\n--- Testing Boolean Index Queries ---');
      const completedViaIndex = await this.tasks.where('completed').equals(1).count();
      const incompleteViaIndex = await this.tasks.where('completed').equals(0).count();
      console.log('✅ Index query with numbers (1=true, 0=false):');
      console.log('   - Completed tasks:', completedViaIndex);
      console.log('   - Incomplete tasks:', incompleteViaIndex);

      // Alternative: Test without using index (filter after retrieval)
      console.log('\n--- Testing In-Memory Filter (No Index) ---');
      const allTasksData = await this.tasks.toArray();
      const completedCount = allTasksData.filter(task => task.completed === true).length;
      const incompleteCount = allTasksData.filter(task => task.completed === false).length;
      const allTasksCount = allTasksData.length;

      console.log('✅ In-memory filter results:');
      console.log('   - Completed tasks:', completedCount);
      console.log('   - Incomplete tasks:', incompleteCount);
      console.log('   - Total tasks:', allTasksCount);

      // Test other indexes
      console.log('\n--- Testing Other Indexes ---');
      const todayString = new Date().toISOString().split('T')[0];
      const todayTasks = await this.tasks.where('date').equals(todayString).count();
      console.log(`✅ Date index - Today's tasks: ${todayTasks}`);

      // Show all table schemas
      const transactionsSchema = this.transactions.schema;
      const notesSchema = this.notes.schema;
      console.log('\n--- All Table Indexes ---');
      console.log('Tasks indexes:', tasksSchema.indexes.map(idx => ({ name: idx.name, keyPath: idx.keyPath })));
      console.log('Transactions indexes:', transactionsSchema.indexes.map(idx => ({ name: idx.name, keyPath: idx.keyPath })));
      console.log('Notes indexes:', notesSchema.indexes.map(idx => ({ name: idx.name, keyPath: idx.keyPath })));

      console.log('\n=== Index test completed successfully ===');

    } catch (error) {
      console.error('❌ Error testing indexes:', error);
    }
  }
}

export const db = new TempoDayDexie();