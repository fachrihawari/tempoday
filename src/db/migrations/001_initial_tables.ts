import type { Migration } from './index';
import type { DB } from '../index';

export const migration_001_initial_tables: Migration = {
  version: '0.0.1',
  name: 'Create initial TempoDay tables',

  async up(db: DB): Promise<void> {
    console.log('📝 Creating tasks table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(100) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('📝 Creating index on tasks.date...');
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);`);

    console.log('📝 Creating notes table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT DEFAULT '',
        date DATE NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('📝 Creating index on notes.date...');
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);`);

    console.log('📝 Creating transactions table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        description VARCHAR(100) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        type VARCHAR(7) CHECK (type IN ('income', 'expense')) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('📝 Creating index on transactions.date...');
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);`);

    console.log('📝 Creating settings table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data JSONB DEFAULT '{"currency":"USD","currencySymbol":"$","locale":"en-US"}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
};
