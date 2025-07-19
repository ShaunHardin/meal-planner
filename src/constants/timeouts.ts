/**
 * Constants for timeouts and durations used throughout the application
 */

// Auto-hide timeouts for notification messages (in milliseconds)
export const NOTIFICATION_TIMEOUTS = {
  SUCCESS: 3000,     // 3 seconds for success messages
  ERROR: 5000,       // 5 seconds for error messages
  TOAST: 3000,       // 3 seconds for toast messages
} as const;

// Other timing constants
export const API_TIMEOUTS = {
  DEFAULT: 30000,    // 30 seconds for API requests
} as const;