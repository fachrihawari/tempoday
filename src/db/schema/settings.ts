import { pgTable, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';

export interface TempoDaySettings {
  // Currency settings
  currency: string;
  currencySymbol: string;
  locale: string;
}

export const defaultSettings: TempoDaySettings = {
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
};

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: jsonb("data").$type<TempoDaySettings>().default(defaultSettings),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export type Settings = typeof settings.$inferSelect;
export type SettingsInsert = typeof settings.$inferInsert;