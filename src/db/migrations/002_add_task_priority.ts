import type { DB } from '../index';
import type { Migration } from './index';

export const migration_002_add_task_priority: Migration = {
  version: '0.0.2',
  name: 'Add priority field to tasks',

  async up(db: DB): Promise<void> {
    console.log('🔄 Adding priority field to tasks table...');

    // Add priority column with default value
    await db.execute(`
      ALTER TABLE tasks 
      ADD COLUMN priority VARCHAR(10) 
      CHECK (priority IN ('low', 'medium', 'high')) 
      DEFAULT 'medium';
    `);

    // Create index for priority queries
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_priority 
      ON tasks(priority);
    `);

    console.log('✅ Priority field added to tasks table');
  },
};
