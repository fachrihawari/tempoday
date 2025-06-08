// Database utility functions shared across migration system

import type { Migration } from './migrations';

/**
 * Simple semantic version comparison
 * Returns: negative if a < b, positive if a > b, zero if a === b
 */
export function compareVersions(a: string, b: string): number {
  const parseVersion = (v: string) => v.split('.').map(Number);
  const [aMajor, aMinor, aPatch] = parseVersion(a);
  const [bMajor, bMinor, bPatch] = parseVersion(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

/**
 * Get pending migrations that need to be applied
 * @param migrations - Array of all available migrations
 * @param currentVersion - Current database version
 * @param maxVersion - Maximum version to migrate to (optional)
 * @returns Array of migrations that need to be applied, sorted by version
 */
export function getPendingMigrations(
  migrations: Migration[],
  currentVersion: string,
  maxVersion?: string,
): Migration[] {
  let pendingMigrations = migrations.filter(
    (m) => compareVersions(m.version, currentVersion) > 0,
  );

  // If maxVersion is provided, also filter by maximum version
  if (maxVersion) {
    pendingMigrations = pendingMigrations.filter(
      (m) => compareVersions(m.version, maxVersion) <= 0,
    );
  }

  // Sort migrations by version to ensure correct order
  pendingMigrations.sort((a, b) => compareVersions(a.version, b.version));

  return pendingMigrations;
}
