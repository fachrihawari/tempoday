// TempoDay Automatic Migration System
// Handles automatic migration detection and execution when new versions are available

import type { DB } from './index';
import { getCurrentVersion, runMigrations } from './migrations/index';
import { getPendingMigrations } from './utils';
import { APP_VERSION, isMigrationNeeded, updateVersionInfo } from './version';

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
  const startTime = performance.now();
  console.log('🔍 Checking for automatic migrations...');

  const result: MigrationResult = {
    wasNeeded: false,
    previousVersion: '0.0.0',
    currentVersion: '0.0.0',
  };

  try {
    // Quick check: if version info indicates no migration needed, use fast path
    const versionMigrationNeeded = isMigrationNeeded();

    // Get the current version from localStorage
    const currentDbVersion = await getCurrentVersion();

    // Update result with current version
    result.previousVersion = currentDbVersion;

    // Fast path: no version change detected, just get current version from localStorage
    if (!versionMigrationNeeded) {
      result.currentVersion = currentDbVersion;

      const endTime = performance.now();
      console.log(
        `✅ No migrations needed - app version unchanged (${(endTime - startTime).toFixed(2)}ms)`,
      );
      return result;
    }

    // Only import migrations if we potentially need them
    const { migrations } = await import('./migrations/index');

    const pendingMigrations = getPendingMigrations(
      migrations,
      currentDbVersion,
      APP_VERSION,
    );

    const hasPendingMigrations = pendingMigrations.length > 0;
    if (!hasPendingMigrations) {
      result.currentVersion = currentDbVersion;

      const endTime = performance.now();
      console.log(
        `✅ No pending migrations found - database is up to date (${(endTime - startTime).toFixed(2)}ms)`,
      );
      return result;
    }

    result.wasNeeded = true;

    console.log('🔄 Migrations needed - starting automatic migration...');
    console.log(
      `📊 Previous version: ${currentDbVersion}, Target: ${APP_VERSION}`,
    );

    // Run the migrations with APP_VERSION constraint
    await runMigrations(db, currentDbVersion, APP_VERSION);

    // Get final state
    result.currentVersion = APP_VERSION;

    // Update version tracking - use APP_VERSION since we successfully applied migrations up to this version
    updateVersionInfo(APP_VERSION);

    console.log('✅ Automatic migrations completed successfully');
    console.log(`📈 Migration completed: ${currentDbVersion} → ${APP_VERSION}`);

    const endTime = performance.now();
    console.log(
      `⏱️ Auto-migration check completed in ${(endTime - startTime).toFixed(2)}ms`,
    );

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
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
    throw new Error(
      'Force migration check is only available in development mode',
    );
  }

  console.log('🔄 Forcing migration check (development mode)');
  localStorage.removeItem('tempoday_version');

  // Clear version cache
  import('./version').then(({ clearVersionCache }) => {
    clearVersionCache();
  });

  indexedDB.deleteDatabase('/pglite/tempoday-db'); // Clear IndexedDB for a fresh start
  console.log(
    '🗑️ Cleared localStorage, cache, and IndexedDB for fresh migration check',
  );

  console.log(
    '✅ Version info cleared - next initialization will trigger migrations',
  );
};
