import {
  date,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    description: varchar('description', { length: 100 }).notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    type: varchar('type', { length: 7, enum: ['income', 'expense'] }).notNull(), // Using varchar for type with enum constraint
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index('transactions_date_idx').on(table.date)],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
