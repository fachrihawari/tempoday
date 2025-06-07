// TempoDay Automatic Migration System
// Handles automatic migration detection and execution when new versions are available

import type { DB } from './index';
import { runMigrations, getCurrentVersion } from './migrations/index';
import {
  isMigrationNeeded,
  updateVersionInfo,
  getStoredVersionInfo,
  APP_VERSION
} from './version';

// Simple semantic version comparison (duplicated from migrations/index for now)
function compareVersions(a: string, b: string): number {
  const parseVersion = (v: string) => v.split('.').map(Number);
  const [aMajor, aMinor, aPatch] = parseVersion(a);
  const [bMajor, bMinor, bPatch] = parseVersion(b);
  
  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

export interface MigrationResult {
  wasNeeded: boolean;
  previousVersion: string;
  currentVersion: string;
  error?: string;
}

/**
 * Automatically check and run migrations if needed
 * This is the main entry point for automatic migration handling
 */
export async function autoRunMigrations(db: DB): Promise<MigrationResult> {
  console.log('🔍 Checking for automatic migrations...');
  
  const result: MigrationResult = {
    wasNeeded: false,
    previousVersion: '0.0.0',
    currentVersion: '0.0.0',
  };

  try {
    // Get current database state
    const currentDbVersion = await getCurrentVersion(db);
    result.previousVersion = currentDbVersion;
    
    // Check if migration is needed - either by version change or pending migrations
    const versionMigrationNeeded = isMigrationNeeded();
    
    // Also check if there are any pending migrations in the database
    const { migrations } = await import('./migrations/index');
    
    const pendingMigrations = migrations.filter(m => 
      compareVersions(m.version, currentDbVersion) > 0 && 
      compareVersions(m.version, APP_VERSION) <= 0
    );
    
    const hasPendingMigrations = pendingMigrations.length > 0;
    const migrationNeeded = versionMigrationNeeded || hasPendingMigrations;
    
    // Debug logging for migration filtering
    if (migrations.length > 0) {
      console.log(`🔍 Migration filtering: DB version ${currentDbVersion}, App version ${APP_VERSION}`);
      console.log(`📦 Total migrations available: ${migrations.length}`);
      console.log(`📦 Pending migrations (${currentDbVersion} < version <= ${APP_VERSION}): ${pendingMigrations.length}`);
      
      if (pendingMigrations.length > 0) {
        console.log('📋 Pending migration versions:', pendingMigrations.map(m => m.version));
      }
    }
    
    if (!migrationNeeded) {
      result.currentVersion = currentDbVersion;
      console.log('✅ No migrations needed - database is up to date');
      return result;
    }

    result.wasNeeded = true;
    const storedInfo = getStoredVersionInfo();

    console.log('🔄 Migrations needed - starting automatic migration...');
    console.log(`📊 Previous version: ${currentDbVersion}, Target: ${APP_VERSION}`);
    
    if (storedInfo) {
      console.log(`📱 Installed version: ${storedInfo.installedVersion} → ${APP_VERSION}`);
    }
    
    if (hasPendingMigrations) {
      console.log(`📦 Found ${pendingMigrations.length} pending migration(s)`);
    }

    // Run the migrations with APP_VERSION constraint
    await runMigrations(db, APP_VERSION);

    // Get final state
    const finalVersion = await getCurrentVersion(db);
    result.currentVersion = finalVersion;

    // Update version tracking - use APP_VERSION since we successfully applied migrations up to this version
    updateVersionInfo(APP_VERSION);

    console.log('✅ Automatic migrations completed successfully');
    console.log(`📈 Migration completed: ${currentDbVersion} → ${finalVersion}`);

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    result.error = errorMessage;
    
    console.error('❌ Automatic migration failed:', error);
    console.error('🔧 Manual intervention may be required');
    
    throw new Error(`Automatic migration failed: ${errorMessage}`);
  }
}


/**
 * Development helper: Force migration check by resetting version info
 * Only available in development mode
 */
// @ts-expect-error
 window.forceMigrationCheck = function forceMigrationCheck(): void {
  if (!import.meta.env.DEV) {
    throw new Error('Force migration check is only available in development mode');
  }

  console.log('🔄 Forcing migration check (development mode)');
  localStorage.removeItem('tempoday_version');
  indexedDB.deleteDatabase('/pglite/tempoday-db'); // Clear IndexedDB for a fresh start
  console.log('🗑️ Cleared localStorage and IndexedDB for fresh migration check');

  console.log('✅ Version info cleared - next initialization will trigger migrations');
}