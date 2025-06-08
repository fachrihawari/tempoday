import type { DB } from '../index';

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

// Simple semantic version comparison
function compareVersions(a: string, b: string): number {
  const parseVersion = (v: string) => v.split('.').map(Number);
  const [aMajor, aMinor, aPatch] = parseVersion(a);
  const [bMajor, bMinor, bPatch] = parseVersion(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

// Apply pending migrations
export async function runMigrations(db: DB, currentVersion: string, maxVersion: string): Promise<void> {
  console.log('🔄 Checking for pending migrations...');

  let pendingMigrations = migrations.filter(m =>
    compareVersions(m.version, currentVersion) > 0
  );
  
  // If maxVersion is provided, also filter by maximum version
  if (maxVersion) {
    pendingMigrations = pendingMigrations.filter(m => 
      compareVersions(m.version, maxVersion) <= 0
    );
    console.log(`🔒 Constraining migrations to max version: ${maxVersion}`);
  }

  if (pendingMigrations.length === 0) {
    console.log('✅ Database is up to date (version ' + currentVersion + ')');
    return;
  }

  // Sort migrations by version
  pendingMigrations.sort((a, b) => compareVersions(a.version, b.version));

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
