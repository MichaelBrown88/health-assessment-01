export function getTimestampNumber(timestamp: number | Date | { seconds: number; nanoseconds: number }): number {
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  return timestamp.seconds * 1000;
}

export function addDays(date: Date | number, days: number): Date {
  const result = new Date(typeof date === 'number' ? date : date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date | number, options: Intl.DateTimeFormatOptions = {}): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, options);
}

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const ONE_WEEK_MS = 7 * ONE_DAY_MS; 