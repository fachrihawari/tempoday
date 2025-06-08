import type { DB } from '.';
import { autoRunMigrations } from './auto-migration';
import * as schema from './schema';

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
    console.log('🚫 Skipping sample data insertion in production');
    return;
  }

  console.log('📝 Inserting TempoDay sample data for MVP testing...');

  // Generate dates for the last 5 days (including today)
  const dates = [];
  for (let i = 4; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  try {
    // Check if sample data already exists
    const existingTasks = await db.select().from(schema.tasks).limit(1);
    if (existingTasks.length > 0) {
      console.log('📝 TempoDay sample data already exists, skipping insertion');
      return;
    }

    // Sample tasks for each day
    const sampleTasks = [
      // Day 1 (4 days ago) - Project Planning
      { title: 'Plan TempoDay MVP features', completed: true, date: dates[0] },
      { title: 'Research calendar libraries', completed: true, date: dates[0] },
      {
        title: 'Create wireframes for Day View',
        completed: true,
        date: dates[0],
      },
      {
        title: 'Set up development environment',
        completed: true,
        date: dates[0],
      },

      // Day 2 (3 days ago) - Database Setup
      { title: 'Set up PGlite database', completed: true, date: dates[1] },
      { title: 'Design database schema', completed: true, date: dates[1] },
      { title: 'Implement Drizzle ORM', completed: true, date: dates[1] },
      { title: 'Create migration system', completed: false, date: dates[1] },

      // Day 3 (2 days ago) - UI Components
      { title: 'Build calendar navigation', completed: true, date: dates[2] },
      { title: 'Create Task component', completed: true, date: dates[2] },
      { title: 'Design Note editor', completed: true, date: dates[2] },
      { title: 'Add loading states', completed: false, date: dates[2] },

      // Day 4 (yesterday) - Financial Features
      {
        title: 'Implement transaction tracking',
        completed: true,
        date: dates[3],
      },
      { title: 'Add daily financial summary', completed: true, date: dates[3] },
      { title: 'Create expense categories', completed: false, date: dates[3] },
      {
        title: 'Test financial calculations',
        completed: false,
        date: dates[3],
      },

      // Day 5 (today) - Testing & Polish
      {
        title: 'Test reactive state management',
        completed: true,
        date: dates[4],
      },
      { title: 'Fix infinite loop issues', completed: true, date: dates[4] },
      { title: 'Polish UI components', completed: false, date: dates[4] },
      { title: 'Add error handling', completed: false, date: dates[4] },
      { title: 'Prepare for user testing', completed: false, date: dates[4] },
    ];

    await db.insert(schema.tasks).values(sampleTasks);

    // Sample notes for each day
    const sampleNotes = [
      {
        content: `Day 1 - TempoDay Project Kickoff 🚀

Started working on TempoDay, a calendar-centric personal management app. The concept is simple but powerful: see all your tasks, notes, and finances for any day in one unified view.

Today's focus was on planning and research:
- Defined MVP scope with 3 core sections
- Researched Svelte 5 and modern web technologies
- Created initial project structure
- Set up the development workflow

Excited to build something that actually helps with daily organization!

Next: Database architecture and schema design.`,
        date: dates[0],
      },
      {
        content: `Day 2 - Database Foundation 💾

Deep dive into the data layer today. Chose PGlite for local-first storage with the ability to sync later. Drizzle ORM is fantastic - type-safe migrations and queries.

Key decisions made:
- Local-first approach with IndexedDB persistence
- Separate tables for tasks, notes, transactions, settings
- Date-based organization (YYYY-MM-DD keys)
- Auto-migration system for schema updates

The foundation is solid. Ready to build the UI layer tomorrow.

Challenge: Balancing simplicity with extensibility for future features.`,
        date: dates[1],
      },
      {
        content: `Day 3 - UI Components Coming Together ✨

Built the core Svelte components today. The calendar navigation feels smooth and the Day View layout is taking shape nicely.

Progress made:
- Calendar month/day navigation working
- Task components with checkboxes and state management
- Note editor with basic formatting
- Consistent design system with Tailwind

The app is starting to feel real! The three-section Day View layout works well on both desktop and mobile.

Tomorrow: Financial tracking features and daily summaries.`,
        date: dates[2],
      },
      {
        content: `Day 4 - Financial Tracking Features 💰

Implemented the financial section today. It's surprisingly satisfying to see daily income/expense summaries with real-time calculations.

Features completed:
- Add income/expense transactions
- Automatic daily totals and net balance
- Clean transaction list with type indicators
- Basic transaction management (add/delete)

The manual entry approach works well for the MVP. Users can quickly log expenses as they happen throughout the day.

Need to add better error handling and polish the interactions.`,
        date: dates[3],
      },
      {
        content: `Day 5 - Reactive State & Bug Fixes 🐛

Focused on the reactive state management system today. Switched from simple stores to a more robust repository pattern with Svelte 5 runes.

Fixed major issues:
- Infinite loop when loading empty data sets
- Proper date change handling across components
- Error states and loading indicators
- Auto-save debouncing for notes

The app feels much more stable now. The reactive system properly handles date navigation and data loading without performance issues.

Ready for some user testing to validate the core concept!`,
        date: dates[4],
      },
    ];

    await db.insert(schema.notes).values(sampleNotes);

    // Sample financial transactions for each day
    const sampleTransactions = [
      // Day 1 (4 days ago) - Project setup day
      {
        description: 'Coffee shop work session',
        amount: '5.25',
        type: 'expense' as const,
        date: dates[0],
      },
      {
        description: 'Domain registration',
        amount: '12.99',
        type: 'expense' as const,
        date: dates[0],
      },
      {
        description: 'Lunch during planning',
        amount: '18.50',
        type: 'expense' as const,
        date: dates[0],
      },

      // Day 2 (3 days ago) - Database work
      {
        description: 'Technical books purchase',
        amount: '45.00',
        type: 'expense' as const,
        date: dates[1],
      },
      {
        description: 'Consultation payment received',
        amount: '150.00',
        type: 'income' as const,
        date: dates[1],
      },
      {
        description: 'Morning coffee',
        amount: '4.75',
        type: 'expense' as const,
        date: dates[1],
      },
      {
        description: 'Dinner while coding',
        amount: '22.30',
        type: 'expense' as const,
        date: dates[1],
      },

      // Day 3 (2 days ago) - UI development
      {
        description: 'Figma Pro subscription',
        amount: '15.00',
        type: 'expense' as const,
        date: dates[2],
      },
      {
        description: 'Freelance project payment',
        amount: '275.00',
        type: 'income' as const,
        date: dates[2],
      },
      {
        description: 'Coffee and pastry',
        amount: '8.90',
        type: 'expense' as const,
        date: dates[2],
      },
      {
        description: 'Lunch at food truck',
        amount: '12.50',
        type: 'expense' as const,
        date: dates[2],
      },
      {
        description: 'Gas for car',
        amount: '45.00',
        type: 'expense' as const,
        date: dates[2],
      },

      // Day 4 (yesterday) - Financial features
      {
        description: 'Testing transaction: Coffee',
        amount: '4.50',
        type: 'expense' as const,
        date: dates[3],
      },
      {
        description: 'Side project income',
        amount: '125.00',
        type: 'income' as const,
        date: dates[3],
      },
      {
        description: 'Lunch at cafe',
        amount: '16.75',
        type: 'expense' as const,
        date: dates[3],
      },
      {
        description: 'Grocery shopping',
        amount: '67.45',
        type: 'expense' as const,
        date: dates[3],
      },
      {
        description: 'Online course purchase',
        amount: '89.99',
        type: 'expense' as const,
        date: dates[3],
      },

      // Day 5 (today) - Testing day
      {
        description: 'Morning coffee run',
        amount: '5.50',
        type: 'expense' as const,
        date: dates[4],
      },
      {
        description: 'Client payment received',
        amount: '320.00',
        type: 'income' as const,
        date: dates[4],
      },
      {
        description: 'Team lunch expense',
        amount: '28.75',
        type: 'expense' as const,
        date: dates[4],
      },
      {
        description: 'Office supplies',
        amount: '23.40',
        type: 'expense' as const,
        date: dates[4],
      },
    ];

    await db.insert(schema.transactions).values(sampleTransactions);

    // Insert default settings
    await db.insert(schema.settings).values({
      data: {
        currency: 'USD',
        currencySymbol: '$',
        locale: 'en-US',
      },
    });

    console.log(
      `✅ TempoDay MVP sample data inserted successfully for ${dates.length} days`,
    );
    console.log(`📅 Date range: ${dates[0]} to ${dates[4]}`);
  } catch (error) {
    console.error('❌ Failed to insert TempoDay sample data:', error);
  }
}
