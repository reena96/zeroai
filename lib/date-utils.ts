/**
 * Date utility functions for streak tracking
 * Uses local timezone for "daily" calculations
 */

/**
 * Get today's date as a locale string (e.g., "11/7/2025")
 * Uses local timezone for consistent daily tracking
 */
export function getTodayDateString(): string {
  return new Date().toLocaleDateString();
}

/**
 * Get yesterday's date as a locale string
 * Used to determine if streak should increment
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString();
}

/**
 * Check if two date strings represent consecutive days
 * @param earlierDate - The earlier date string (e.g., "11/6/2025")
 * @param laterDate - The later date string (e.g., "11/7/2025")
 * @returns true if laterDate is exactly one day after earlierDate
 */
export function areConsecutiveDays(earlierDate: string, laterDate: string): boolean {
  try {
    const earlier = new Date(earlierDate);
    const later = new Date(laterDate);

    // Calculate difference in milliseconds
    const diffMs = later.getTime() - earlier.getTime();
    // Convert to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays === 1;
  } catch (error) {
    console.error('[date-utils] Error comparing dates:', error);
    return false;
  }
}
