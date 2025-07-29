export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function getDateRange(
  centerDate: Date,
  daysAround: number = 30,
): Date[] {
  const dates: Date[] = [];
  const startDate = new Date(centerDate);
  startDate.setDate(centerDate.getDate() - daysAround);

  for (let i = 0; i <= daysAround * 2; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }

  return dates;
}

export function formatDayOfWeek(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

// Utility function to format date as YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
