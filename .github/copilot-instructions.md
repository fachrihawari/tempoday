You are an expert Full-stack Engineer. Your task is to generate the core structure and features for a Minimum Viable Product (MVP) of a calendar-centric personal management mobile application. The app allows users to manage to-do lists, daily notes (diary-like), and basic financial records, all linked to specific dates on a calendar.

Project Goal: Create a simple, intuitive mobile app where users can see and manage their tasks, notes, and finances for any given day within a calendar interface. The MVP should focus on core functionality and a clean user experience, prioritizing local data storage for simplicity.

Core App Name: "TempoDay"

Target Platform (Specify one for MVP focus, e.g., iOS with Swift, Android with Kotlin/Java, or React Native for cross-platform): I want it to be cross platform, maybe start with responsive web first. For the stack, we can use Svelte 5 and tailwindcss.

# MVP: Calendar-Centric Personal Management App ("TempoDay" or Chosen Name)

**Primary MVP Goals:**
* Validate the core concept: Do users find value in seeing to-dos, notes, and financial entries within a single daily calendar view?
* Gather initial user feedback for future iterations.
* Keep the development scope small for a quick launch.

---

## I. Core App Structure & Navigation

1.  **Main Calendar View (Month View):**
    * Standard month display for date navigation.
    * Users can tap on any date in the month view.
    * Tapping a date navigates the user to the **Day View** for the selected date.
    * Clear indication of the current date (today).
    * Ability to navigate to previous/next months.

2.  **Day View:**
    * Accessed by tapping a date on the Main Calendar View.
    * Clearly displays the selected date (e.g., "June 4, 2025").
    * This view will be vertically scrollable if content exceeds screen height.
    * Must be divided into three (3) distinct and clearly delineated sections:
        * To-Do List Section
        * Daily Note Section (Diary-like)
        * Financial Records Section

---

## II. Feature Specifications per Section in Day View

### A. To-Do List Section

* **Display:** Shows a list of to-do items for the selected date.
* **Add Task:**
    * A button (e.g., "+ Add Task") to add a new to-do item.
    * Simple text input for the task description.
    * Action: Adds the task to the list for the current Day View.
* **Task Item:**
    * Each task item displays its text description.
    * Checkbox: Tapping the checkbox marks the task as completed (e.g., text strikethrough, checkmark appears). Tapping again unmarks it.
* **Data Persistence:** To-do items and their completion status are saved locally for each date.

### B. Daily Note Section (Diary-like)

* **Display:** A dedicated text area to display/write a multi-line note for the selected date.
* **Edit/Add Note:**
    * If no note exists for the day, this area can be an empty text field or show a prompt like "+ Add Note."
    * Users can tap into this area to type or edit their daily note.
    * Input: Simple, multi-line text input (no rich text formatting for MVP).
* **Data Persistence:** Note content is saved locally for each date. Changes should ideally be auto-saved or have a clear save action.

### C. Financial Records Section (Manual Entry)

* **Display:** Shows a list of financial transactions (income and expenses) for the selected date.
* **Add Transaction:**
    * A button (e.g., "+ Add Transaction") to add a new financial entry.
    * Input Fields:
        * Description (text, e.g., "Lunch," "Salary").
        * Amount (numeric input).
        * Type (simple selection: "Income" or "Expense" - e.g., using a toggle or radio buttons).
    * Action: Adds the transaction to the list for the current Day View.
* **Transaction Item:**
    * Each transaction in the list displays its description, amount (clearly formatted if simple, otherwise just the number), and an indication of Income/Expense (e.g., color-coding or a simple label).
* **Daily Summary (Optional, but highly desirable for MVP):**
    * Total Income for the day.
    * Total Expenses for the day.
    * Net balance for the day (Income - Expenses).
* **Data Persistence:** All financial entries are saved locally for each date.

---

## III. Data Storage

* All data (to-dos, notes, financial records) must be stored **locally on the user's device**.
* No cloud sync or user accounts are required for this MVP.

---

## IV. UI/UX Considerations (Simple for MVP)

* **Clarity & Simplicity:** The design must be clean, intuitive, and uncluttered.
* **Visual Distinction:** Clearly differentiate between the To-Do, Note, and Financial sections in the Day View.
* **Easy Navigation:** Users should easily understand how to move between dates and access functionalities.
* Use standard platform UI components where possible.

---

## V. Features **NOT** Included in the Initial MVP:

* Cross-device synchronization.
* Notifications or reminders.
* Collaboration or sharing features.
* Complex financial categorization, budgeting, or in-depth financial reporting.
* Bank account synchronization.
* Advanced to-do features (sub-tasks, priorities, recurring tasks).
* Rich text formatting or image attachments for notes.
* Complex global search functionality.
* Dark mode or theme customization.
* Complex user registration.

---

**MVP Focus:** Functionality over aesthetics. The goal is a working prototype to demonstrate the core concept.