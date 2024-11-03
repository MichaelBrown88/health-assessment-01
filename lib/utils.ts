import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: number | Date | { seconds: number; nanoseconds: number }): string {
  if (date instanceof Date) {
    return format(date, 'MMM d, yyyy')
  }
  
  if (typeof date === 'number') {
    return format(new Date(date), 'MMM d, yyyy')
  }
  
  if (typeof date === 'object' && 'seconds' in date) {
    return format(new Date(date.seconds * 1000), 'MMM d, yyyy')
  }
  
  return 'Invalid date'
}

export function getTimestampDate(timestamp: number | Date | { seconds: number; nanoseconds: number }): Date {
  if (timestamp instanceof Date) {
    return timestamp
  }
  
  if (typeof timestamp === 'number') {
    return new Date(timestamp)
  }
  
  if (typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000)
  }
  
  return new Date()
}
