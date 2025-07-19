/**
 * Date utilities for ISO week handling in meal plan persistence
 */

/**
 * Get the Monday of the current ISO week
 * @returns Date object representing Monday of the current week
 */
export const getCurrentMondayDate = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Calculate days to subtract to get to Monday
  // If today is Sunday (0), we need to go back 6 days to get to Monday
  // If today is Monday (1), we need to go back 0 days
  // If today is Tuesday (2), we need to go back 1 day, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToSubtract);
  
  // Reset time to midnight for consistent comparison
  monday.setHours(0, 0, 0, 0);
  
  return monday;
};

/**
 * Get Monday of the week for a specific date
 * @param date - The date to find the Monday for
 * @returns Date object representing Monday of that week
 */
export const getMondayOfWeek = (date: Date): Date => {
  const dayOfWeek = date.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToSubtract);
  monday.setHours(0, 0, 0, 0);
  
  return monday;
};

/**
 * Format date as ISO date string (YYYY-MM-DD) for database storage
 * @param date - The date to format
 * @returns ISO date string
 */
export const formatWeekStart = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parse ISO date string back to Date object
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 */
export const parseWeekStart = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00.000Z');
};

/**
 * Get the next Monday (next week)
 * @param currentMonday - Current Monday date
 * @returns Date object for next Monday
 */
export const getNextMonday = (currentMonday: Date): Date => {
  const nextMonday = new Date(currentMonday);
  nextMonday.setDate(currentMonday.getDate() + 7);
  return nextMonday;
};

/**
 * Get the previous Monday (previous week)
 * @param currentMonday - Current Monday date
 * @returns Date object for previous Monday
 */
export const getPreviousMonday = (currentMonday: Date): Date => {
  const previousMonday = new Date(currentMonday);
  previousMonday.setDate(currentMonday.getDate() - 7);
  return previousMonday;
};

/**
 * Check if two dates are in the same week
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are in the same ISO week
 */
export const isSameWeek = (date1: Date, date2: Date): boolean => {
  const monday1 = getMondayOfWeek(date1);
  const monday2 = getMondayOfWeek(date2);
  return formatWeekStart(monday1) === formatWeekStart(monday2);
};

/**
 * Get a human-readable week range string
 * @param mondayDate - Monday of the week
 * @returns String like "Dec 16 - Dec 22, 2024"
 */
export const getWeekRangeString = (mondayDate: Date): string => {
  const sunday = new Date(mondayDate);
  sunday.setDate(mondayDate.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  const mondayStr = mondayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const sundayStr = sunday.toLocaleDateString('en-US', options);
  
  return `${mondayStr} - ${sundayStr}`;
};