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

// Get current schema version from database
export async function getCurrentVersion(db: DB): Promise<string> {
  try {
    // Create migrations table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS _migrations (
        version VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get the latest applied migration by sorting version strings
    const result = await db.execute(`
      SELECT version FROM _migrations 
      ORDER BY applied_at DESC 
      LIMIT 1;
    `);

    if (result.rows && result.rows.length > 0) {
      // For PGlite/Drizzle, try different ways to access the version
      const row = result.rows[0] as { version: string }

      // Try accessing as object property first (PGlite format)
      let version = row.version;

      // If still undefined, try other possible formats
      if (version === undefined) {
        console.error('🔍 Unable to extract version from row:', row);
        console.error('🔍 Row keys:', Object.keys(row || {}));
        return '0.0.0';
      }

      console.log('📊 Found latest migration version:', version);
      return String(version);
    } else {
      console.log('📊 No migrations found, returning 0.0.0');
      return '0.0.0';
    }
  } catch (error) {
    console.error('❌ Failed to get current migration version:', error);
    return '0.0.0';
  }
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
export async function runMigrations(db: DB, maxVersion?: string): Promise<void> {
  console.log('🔄 Checking for pending migrations...');

  const currentVersion = await getCurrentVersion(db);
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

      // Record migration in database
      await db.execute(`
        INSERT INTO _migrations (version, name) 
        VALUES ('${migration.version}', '${migration.name}');
      `);

      // Verify the migration was recorded
      const verifyResult = await db.execute(`
        SELECT version FROM _migrations WHERE version = '${migration.version}';
      `);

      if (!verifyResult.rows || verifyResult.rows.length === 0) {
        throw new Error(`Failed to record migration ${migration.version} in database`);
      }

      console.log(`✅ Migration ${migration.version} applied and recorded successfully`);
    } catch (error) {
      console.error(`❌ Migration ${migration.version} failed:`, error);
      throw new Error(`Migration ${migration.version} failed: ${error}`);
    }
  }

  console.log('✅ All migrations applied successfully');
}
