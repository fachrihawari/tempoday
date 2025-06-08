// TempoDay Database Version Management
import { version } from '../../package.json' assert { type: 'json' };

console.log({ version }, '📦 Loaded package version');

// Current application version from package.json
export const APP_VERSION = version;

// Version compatibility checking
export interface VersionInfo {
  installedVersion: string; // The version of the app/database that's currently installed
  migratedAt: string;
}

const VERSION_KEY = 'tempoday_version';

// Cache for version info to avoid repeated localStorage access
let cachedVersionInfo: VersionInfo | null | undefined = undefined;

// Get stored version info from localStorage
export function getStoredVersionInfo(): VersionInfo | null {
  // Use cache if available
  if (cachedVersionInfo !== undefined) {
    return cachedVersionInfo;
  }

  try {
    const stored = localStorage.getItem(VERSION_KEY);
    const result = stored ? JSON.parse(stored) : null;
    cachedVersionInfo = result;
    return result;
  } catch {
    cachedVersionInfo = null;
    return null;
  }
}

// Store version info to localStorage
export function storeVersionInfo(info: VersionInfo): void {
  localStorage.setItem(VERSION_KEY, JSON.stringify(info));
  // Update cache
  cachedVersionInfo = info;
}

// Check if migration is needed by comparing app versions
export function isMigrationNeeded(): boolean {
  const stored = getStoredVersionInfo();

  if (!stored) {
    console.log('🔄 First time setup - migration needed');
    return true;
  }

  if (stored.installedVersion !== APP_VERSION) {
    console.log(
      `🔄 App version changed: ${stored.installedVersion} → ${APP_VERSION}`,
    );
    return true;
  }

  console.log('✅ Database is up to date');
  return false;
}

// Update version info after successful migration
export function updateVersionInfo(installedVersion: string): void {
  const versionInfo: VersionInfo = {
    installedVersion,
    migratedAt: new Date().toISOString(),
  };

  storeVersionInfo(versionInfo);
  console.log('📝 Version info updated:', versionInfo);
}

// Clear version cache (for development/testing)
export function clearVersionCache(): void {
  cachedVersionInfo = undefined;
}
