import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number | Date | { seconds: number; nanoseconds: number }): string {
  let date: Date;
  
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp.seconds * 1000);
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
