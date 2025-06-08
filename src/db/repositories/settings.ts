import { eq } from 'drizzle-orm';
import type { DB } from '../index';
import {
  type TempoDaySettings,
  defaultSettings,
  settings,
} from '../schema/settings';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SettingsRepository {
  constructor(private db: DB) {}

  /**
   * Get current settings (there should only be one settings record)
   */
  async getSettings(): Promise<TempoDaySettings> {
    await delay(300); // Simulate network delay (shorter for settings)

    const result = await this.db.select().from(settings).limit(1);

    if (result.length === 0) {
      // No settings exist, create default settings
      return await this.createDefaultSettings();
    }

    return result[0].data || defaultSettings;
  }

  /**
   * Update settings (creates if doesn't exist)
   */
  async updateSettings(
    newSettings: Partial<TempoDaySettings>,
  ): Promise<TempoDaySettings> {
    await delay(500); // Simulate network delay

    const existing = await this.db.select().from(settings).limit(1);

    const updatedSettings = {
      ...defaultSettings,
      ...(existing[0]?.data || {}),
      ...newSettings,
    };

    if (existing.length === 0) {
      // Create new settings record
      const [newRecord] = await this.db
        .insert(settings)
        .values({
          data: updatedSettings,
        })
        .returning();

      return newRecord.data || defaultSettings;
    } else {
      // Update existing settings
      const [updatedRecord] = await this.db
        .update(settings)
        .set({
          data: updatedSettings,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existing[0].id))
        .returning();

      return updatedRecord.data || defaultSettings;
    }
  }

  /**
   * Create default settings
   */
  private async createDefaultSettings(): Promise<TempoDaySettings> {
    const [newRecord] = await this.db
      .insert(settings)
      .values({
        data: defaultSettings,
      })
      .returning();

    return newRecord.data || defaultSettings;
  }
}
