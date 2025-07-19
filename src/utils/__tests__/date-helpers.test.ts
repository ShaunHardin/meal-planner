import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentMondayDate,
  getMondayOfWeek,
  formatWeekStart,
  parseWeekStart,
  getNextMonday,
  getPreviousMonday,
  isSameWeek,
  getWeekRangeString,
} from '../date-helpers';

describe('Date Helpers', () => {
  beforeEach(() => {
    // Reset any date mocks
    vi.useRealTimers();
  });

  describe('getMondayOfWeek', () => {
    it('should return Monday for a Monday date', () => {
      const monday = new Date('2024-12-16T10:30:00'); // Monday
      const result = getMondayOfWeek(monday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return Monday for a Wednesday date', () => {
      const wednesday = new Date('2024-12-18T15:45:00'); // Wednesday
      const result = getMondayOfWeek(wednesday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
      expect(result.getHours()).toBe(0);
    });

    it('should return Monday for a Sunday date', () => {
      const sunday = new Date('2024-12-22T09:15:00'); // Sunday
      const result = getMondayOfWeek(sunday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
    });

    it('should return Monday for a Saturday date', () => {
      const saturday = new Date('2024-12-21T23:59:00'); // Saturday
      const result = getMondayOfWeek(saturday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
    });
  });

  describe('getCurrentMondayDate', () => {
    it('should return Monday of current week when today is Monday', () => {
      const mockMonday = new Date('2024-12-16T10:30:00'); // Monday
      vi.setSystemTime(mockMonday);

      const result = getCurrentMondayDate();
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
      expect(result.getHours()).toBe(0);
    });

    it('should return Monday of current week when today is Friday', () => {
      const mockFriday = new Date('2024-12-20T14:25:00'); // Friday
      vi.setSystemTime(mockFriday);

      const result = getCurrentMondayDate();
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
    });

    it('should return Monday of current week when today is Sunday', () => {
      const mockSunday = new Date('2024-12-22T08:00:00'); // Sunday
      vi.setSystemTime(mockSunday);

      const result = getCurrentMondayDate();
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-16');
    });
  });

  describe('formatWeekStart', () => {
    it('should format date as ISO date string', () => {
      const date = new Date('2024-12-16T10:30:00');
      const result = formatWeekStart(date);
      
      expect(result).toBe('2024-12-16');
    });

    it('should handle different time zones consistently', () => {
      const date = new Date('2024-12-16T23:59:59');
      const result = formatWeekStart(date);
      
      expect(result).toBe('2024-12-16');
    });
  });

  describe('parseWeekStart', () => {
    it('should parse ISO date string to Date object', () => {
      const dateString = '2024-12-16';
      const result = parseWeekStart(dateString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11); // December (0-indexed)
      expect(result.getDate()).toBe(16);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe('getNextMonday', () => {
    it('should return Monday of next week', () => {
      const currentMonday = new Date('2024-12-16T00:00:00');
      const result = getNextMonday(currentMonday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-23');
    });

    it('should not mutate original date', () => {
      const currentMonday = new Date('2024-12-16T00:00:00');
      const originalTime = currentMonday.getTime();
      
      getNextMonday(currentMonday);
      
      expect(currentMonday.getTime()).toBe(originalTime);
    });
  });

  describe('getPreviousMonday', () => {
    it('should return Monday of previous week', () => {
      const currentMonday = new Date('2024-12-16T00:00:00');
      const result = getPreviousMonday(currentMonday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(formatWeekStart(result)).toBe('2024-12-09');
    });

    it('should not mutate original date', () => {
      const currentMonday = new Date('2024-12-16T00:00:00');
      const originalTime = currentMonday.getTime();
      
      getPreviousMonday(currentMonday);
      
      expect(currentMonday.getTime()).toBe(originalTime);
    });
  });

  describe('isSameWeek', () => {
    it('should return true for dates in the same week', () => {
      const monday = new Date('2024-12-16T09:00:00');
      const friday = new Date('2024-12-20T17:00:00');
      
      expect(isSameWeek(monday, friday)).toBe(true);
    });

    it('should return false for dates in different weeks', () => {
      const thisWeek = new Date('2024-12-16T09:00:00');
      const nextWeek = new Date('2024-12-23T09:00:00');
      
      expect(isSameWeek(thisWeek, nextWeek)).toBe(false);
    });

    it('should handle Sunday correctly', () => {
      const monday = new Date('2024-12-16T09:00:00');
      const sunday = new Date('2024-12-22T18:00:00');
      
      expect(isSameWeek(monday, sunday)).toBe(true);
    });

    it('should handle week boundaries correctly', () => {
      const sunday = new Date('2024-12-22T23:59:59'); // End of week
      const nextMonday = new Date('2024-12-23T00:00:01'); // Start of next week
      
      expect(isSameWeek(sunday, nextMonday)).toBe(false);
    });
  });

  describe('getWeekRangeString', () => {
    it('should return formatted week range string', () => {
      const monday = new Date('2024-12-16T00:00:00');
      const result = getWeekRangeString(monday);
      
      expect(result).toBe('Dec 16 - Dec 22, 2024');
    });

    it('should handle cross-month ranges', () => {
      const monday = new Date('2024-01-29T00:00:00'); // Monday Jan 29
      const result = getWeekRangeString(monday);
      
      expect(result).toBe('Jan 29 - Feb 4, 2024');
    });

    it('should handle cross-year ranges', () => {
      const monday = new Date('2024-12-30T00:00:00'); // Monday Dec 30
      const result = getWeekRangeString(monday);
      
      expect(result).toBe('Dec 30 - Jan 5, 2025');
    });
  });
});