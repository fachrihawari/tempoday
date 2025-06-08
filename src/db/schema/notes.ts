import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').default(''),
    date: date('date').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index('notes_date_idx').on(table.date)],
);

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
