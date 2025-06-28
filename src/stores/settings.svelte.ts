import { db } from '../dexie/db';
import type { Settings, TempoDaySettings } from '../dexie/models';
import { uuid } from '../lib/unique';

// Default settings for the app
export const defaultSettings: TempoDaySettings = {
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  language: 'en',
  region: 'US',
};

/**
 * Reactive Settings Store using Svelte 5 runes
 * Manages user settings with local persistence via Dexie
 */
class SettingsStore {
  // Reactive state for settings
  settings = $state<TempoDaySettings>(defaultSettings);

  // Loading states for different operations
  isLoading = $state(false);
  isSaving = $state(false);

  // Error state
  error = $state<string | null>(null);

  // Track if settings have been loaded from database
  isInitialized = $state(false);

  /**
   * Load settings from database and update reactive state
   */
  async loadSettings(): Promise<void> {
    if (this.isInitialized || this.isLoading) {
      return; // Already loaded or still loading
    }

    this.isLoading = true;
    this.error = null;

    try {
      // Get the first (and should be only) settings record
      const settingsRecord = await db.settings.toCollection().first();

      if (settingsRecord) {
        // Merge with defaults to ensure all properties exist
        this.settings = { ...defaultSettings, ...settingsRecord.data };
      } else {
        // No settings exist, create default settings
        await this.createDefaultSettings();
      }

      this.isInitialized = true;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : 'Failed to load settings';
      console.error('Error loading settings:', err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Update settings in database and reactive state
   */
  async updateSettings(newSettings: Partial<TempoDaySettings>): Promise<void> {
    this.isSaving = true;
    this.error = null;

    try {
      // Get existing settings record
      const existingRecord = await db.settings.toCollection().first();

      const updatedSettingsData = {
        ...defaultSettings,
        ...this.settings,
        ...newSettings,
      };

      if (existingRecord) {
        // Update existing settings
        await db.settings.update(existingRecord.id, {
          data: updatedSettingsData,
        });
      } else {
        // Create new settings record
        await db.settings.add({
          id: uuid(),
          data: updatedSettingsData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Update reactive state
      this.settings = updatedSettingsData;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : 'Failed to update settings';
      console.error('Error updating settings:', err);
      throw err;
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Create default settings record in the database
   */
  private async createDefaultSettings(): Promise<void> {
    const settingsRecord: Settings = {
      id: uuid(),
      data: defaultSettings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.settings.add(settingsRecord);
    this.settings = defaultSettings;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();