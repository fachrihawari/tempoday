import { writable } from 'svelte/store';

// Current selected date
export const selectedDate = writable<Date>(new Date());

// Utility function to format date as YYYY-MM-DD
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}
