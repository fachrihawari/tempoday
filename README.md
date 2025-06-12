# TempoDay

TempoDay is a privacy-focused, calendar-centric personal management app designed for simplicity and productivity. It allows users to manage to-do lists, daily notes (diary-like), and basic financial records, all linked to specific dates within a clean, intuitive calendar interface.

## Features

### 1. Calendar-Centric Navigation
Tap a date to see and manage all your entries for that day.

### 2. Day View Sections
Each day is divided into three main sections:

#### A. To-Do List
- Add, view, and complete tasks for the selected date.
- Tasks are saved locally and completion status is persistent.

#### B. Daily Note (Diary)
- Write and edit a daily note for each date.
- Notes are saved locally and can be updated anytime.

#### C. Financial Records
- Add income or expense transactions for the day.
- Each entry includes a description, amount, and type (income/expense).
- Daily summary: total income, total expenses, and net balance.

### 3. Local Data Storage & Privacy
- All data is stored locally on your device for privacy and offline access.
- No cloud sync or user accounts required.
- Your information never leaves your device, ensuring complete privacy and control.

### 4. Simple, Clean UI
- Responsive design for mobile and desktop.
- Clear separation between to-dos, notes, and finances.
- Easy navigation between dates and sections.

## Technology Stack
- **Framework:** Svelte 5
- **Styling:** Tailwind CSS
- **Local Storage:** IndexedDB (via Dexie.js)

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


