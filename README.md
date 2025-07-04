# TempoDay

TempoDay is a privacy-focused, calendar-centric personal management app designed for simplicity and productivity. It allows users to manage to-do lists, daily notes (diary-like), and financial records, all linked to specific dates within a clean, intuitive calendar interface.

## Features

- [x] **Calendar-Centric Navigation**: Tap a date to see and manage all your entries for that day.
- [x] **To-Do List**:
  - [x] Add, view, and complete tasks for the selected date.
  - [x] Organize tasks by priority with visual indicators.
  - [x] Tasks are saved locally and completion status is persistent.
- [x] **Daily Note (Diary)**:
  - [x] Write and edit a daily note for each date.
  - [x] Notes are saved locally and can be updated anytime.
  - [x] Full-text search across all notes.
- [x] **Financial Records**:
  - [x] Add income or expense transactions for the day.
  - [x] Each entry includes a description, amount, and type (income/expense).
  - [x] Daily summary: total income, total expenses, and net balance.
  - [x] Categorized spending insights with automatic summaries.
- [x] **Local Data Storage & Privacy**:
  - [x] All data is stored locally on your device for privacy and offline access.
  - [x] No cloud sync or user accounts required.
  - [x] Your information never leaves your device, ensuring complete privacy and control.
- [x] **Simple, Clean UI**:
  - [x] Responsive design for mobile and desktop.
  - [x] Clear separation between to-dos, notes, and finances.
  - [x] Easy navigation between dates and sections.
  - [x] Fully implemented dark mode for night owls and aesthetic lovers.
- [x] **Advanced Features**:
  - [x] Natural language input for tasks, notes, and transactions (e.g., "Buy groceries tomorrow" or "Spent $50 on lunch").
  - [x] Powerful search to find any task, note, or transaction instantly.
  - [x] Seamless donation integration via RevenueCat to support development.

For more details, check out the [About TempoDay](about.md) file.

## Technology Stack
- **Framework:** Svelte 5 - Leveraging the latest reactive magic with runes for a seamless development experience.
- **Styling:** Tailwind CSS - Robust dark mode support and utility-first design for rapid UI development.
- **Local Storage:** IndexedDB (via Dexie.js) - Ensuring all data is stored locally for privacy and offline access.
- **Build Tool:** Vite - Lightning-fast builds and optimized performance for modern web apps.

## Getting Started

1. **Install dependencies:**
   ```sh
   bun install
   # or
   npm install
   ```
2. **Run the app locally:**
   ```sh
   bun dev
   # or
   npm run dev
   ```
3. **Open in your browser:**
   Visit `http://localhost:5173` (or the port shown in your terminal).