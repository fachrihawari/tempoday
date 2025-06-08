import * as schema from "./schema";
import type { DB } from ".";
import { autoRunMigrations, type MigrationResult } from './auto-migration';

// Initialize database for TempoDay MVP using migration system
export async function initializeDatabase(db: DB) {
  console.log('🔄 Initializing TempoDay database...');
  try {
    // Use automatic migration system instead of manual table creation
    await autoRunMigrations(db);

    // Insert sample data for MVP testing (only in development)
    await insertSampleData(db);

    console.log('✅ TempoDay database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Sample data insertion for MVP testing
async function insertSampleData(db: DB) {
  if (!import.meta.env.DEV) {
    console.log('🚫 Skipping sample data insertion in production')  
    return;
  }

  console.log('📝 Inserting TempoDay sample data for MVP testing...');
  const today = '2025-06-05';

  try {
    // Check if sample data already exists
    const existingTasks = await db.select().from(schema.tasks).limit(1);
    if (existingTasks.length > 0) {
      console.log('📝 TempoDay sample data already exists, skipping insertion');
      return;
    }

    // Insert sample tasks for MVP testing
    await db.insert(schema.tasks).values([
      { title: 'Plan TempoDay MVP features', completed: true, date: today },
      { title: 'Set up calendar navigation', completed: true, date: today },
      { title: 'Create Day View layout', completed: false, date: today },
      { title: 'Test To-Do section functionality', completed: false, date: today },
      { title: 'Implement financial summary', completed: false, date: today },
    ]);

    // Insert sample daily note
    await db.insert(schema.notes).values({
      content: `Day 1 of TempoDay development:

Today I focused on setting up the core database structure for the MVP. The app will have three main sections in the Day View:
1. To-Do List Section - Simple task management with checkboxes
2. Daily Note Section - Diary-like entries for each day  
3. Financial Records Section - Income/expense tracking with daily summaries

The goal is to create a calendar-centric personal management app where users can see everything for a specific day in one view. Starting with local storage using PGlite + Drizzle ORM.

Next steps: Build the Svelte 5 components for the calendar interface and Day View sections.`,
      date: today,
    });

    // Insert sample financial transactions
    await db.insert(schema.transactions).values([
      { description: 'Morning coffee', amount: '4.50', type: 'expense', date: today },
      { description: 'Freelance project payment', amount: '250.00', type: 'income', date: today },
      { description: 'Lunch at downtown cafe', amount: '15.75', type: 'expense', date: today },
      { description: 'Gas for car', amount: '45.00', type: 'expense', date: today },
    ]);

    // Insert default settings
    await db.insert(schema.settings).values({
      data: {
        currency: 'USD',
        currencySymbol: '$',
        locale: 'en-US',
      },
    });

    console.log('✅ TempoDay MVP sample data inserted successfully');
  } catch (error) {
    console.error('❌ Failed to insert TempoDay sample data:', error);
  }
}