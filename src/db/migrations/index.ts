import type { DB } from '../index';
import { getPendingMigrations } from '../utils';

export interface Migration {
  version: string; // Now using semantic version strings like "0.0.1"
  name: string;
  up: (db: DB) => Promise<void>;
}

// Import all migrations
import { migration_001_initial_tables } from './001_initial_tables';
import { migration_002_add_task_priority } from './002_add_task_priority';

// Migration registry - add new migrations here
export const migrations: Migration[] = [
  migration_001_initial_tables,
  migration_002_add_task_priority,
];

// Get current schema version from localStorage
export async function getCurrentVersion(): Promise<string> {
  // Use version tracking from localStorage instead of database table
  const { getStoredVersionInfo } = await import('../version');
  const storedInfo = getStoredVersionInfo();
  
  if (!storedInfo) {
    console.log('📊 No version info found, fallback to version: 0.0.0');
    return '0.0.0';
  }
  
  console.log('📊 Installed version:', storedInfo.installedVersion);
  return storedInfo.installedVersion;
}

// Apply pending migrations
export async function runMigrations(db: DB, currentVersion: string, maxVersion: string): Promise<void> {
  console.log('🔄 Checking for pending migrations...');

  const pendingMigrations = getPendingMigrations(migrations, currentVersion, maxVersion);

  if (pendingMigrations.length === 0) {
    console.log('✅ Database is up to date (version ' + currentVersion + ')');
    return;
  }

  console.log(`🔒 Constraining migrations: ${currentVersion} < version <= ${maxVersion}`);

  console.log(`📦 Found ${pendingMigrations.length} pending migration(s)`);
  if (pendingMigrations.length > 0) {
    console.log('📋 Will apply migrations:', pendingMigrations.map(m => `${m.version} (${m.name})`).join(', '));
  }

  for (const migration of pendingMigrations) {
    try {
      console.log(`🔄 Applying migration ${migration.version}: ${migration.name}`);

      await migration.up(db);

      console.log(`✅ Migration ${migration.version} applied successfully`);
    } catch (error) {
      console.error(`❌ Migration ${migration.version} failed:`, error);
      throw new Error(`Migration ${migration.version} failed: ${error}`);
    }
  }

  console.log('✅ All migrations applied successfully');
}
