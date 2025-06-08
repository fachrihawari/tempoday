import { db } from '../index';
// Reactive wrapper for SettingsRepository using Svelte 5 runes
import { SettingsRepository } from '../repositories/settings';
import type { TempoDaySettings } from '../schema/settings';
import { defaultSettings } from '../schema/settings';

export class ReactiveSettings {
  private repo: SettingsRepository;

  // Reactive state for settings
  settings = $state<TempoDaySettings>(defaultSettings);

  // Loading states for different operations
  isLoading = $state(false);
  isSaving = $state(false);

  // Error state
  error = $state<string | null>(null);

  // Track if settings have been loaded from database
  isInitialized = $state(false);

  constructor() {
    this.repo = new SettingsRepository(db);
  }

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
      this.settings = await this.repo.getSettings();
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
      const updatedSettings = await this.repo.updateSettings(newSettings);
      this.settings = updatedSettings;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : 'Failed to update settings';
      console.error('Error updating settings:', err);
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Update a single setting
   */
  async updateSetting<K extends keyof TempoDaySettings>(
    key: K,
    value: TempoDaySettings[K],
  ): Promise<void> {
    await this.updateSettings({ [key]: value } as Partial<TempoDaySettings>);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }
}

// Export singleton instance
export const reactiveSettings = new ReactiveSettings();
