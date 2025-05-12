import { describe, it, expect } from "vitest";
import {
  createMoment,
  format,
  add,
  subtract,
  diff,
  isBefore,
  isAfter,
  startOf,
  fromNow,
  getAvailableTimezones,
  getTimezoneInfo,
  isDST,
  getDSTTransitions,
  toTimezone,
  getTimezoneOffset,
  getAvailableLocales,
} from "../src";

describe("DayKit", () => {
  // Test data
  const now = new Date("2024-03-21T12:00:00Z");
  const future = new Date("2024-03-22T12:00:00Z");
  const past = new Date("2024-03-20T12:00:00Z");
  const invalidDate = new Date("invalid");

  describe("Date Creation", () => {
    describe("createMoment", () => {
      it("creates a new Date object from input", () => {
        expect(createMoment(now)).toBeInstanceOf(Date);
        expect(createMoment(now).getTime()).toBe(now.getTime());
      });

      it("creates a new Date object from string", () => {
        const dateStr = "2024-03-21T12:00:00Z";
        expect(createMoment(dateStr).getTime()).toBe(
          new Date(dateStr).getTime()
        );
      });

      it("creates a new Date object from timestamp", () => {
        const timestamp = now.getTime();
        expect(createMoment(timestamp).getTime()).toBe(timestamp);
      });

      it("defaults to current date when no input provided", () => {
        const result = createMoment();
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBeLessThanOrEqual(Date.now());
      });

      it("handles invalid date input gracefully", () => {
        expect(createMoment(invalidDate)).toBeInstanceOf(Date);
      });
    });
  });

  describe("Date Formatting", () => {
    describe("format", () => {
      it("formats date with default format", () => {
        expect(format(now)).toBe("2024-03-21 12:00:00");
      });

      it("formats date with custom format", () => {
        expect(format(now, "YYYY/MM/DD")).toBe("2024/03/21");
        expect(format(now, "HH:mm")).toBe("12:00");
        expect(format(now, "YYYY-MM-DD HH:mm:ss")).toBe("2024-03-21 12:00:00");
      });

      it("formats date with custom locale", () => {
        expect(format(now, "YYYY-MM-DD", { locale: "fr-FR" })).toBe(
          "2024-03-21"
        );
        expect(format(now, "HH:mm", { locale: "de-DE" })).toBe("12:00");
      });

      it("formats date with timezone", () => {
        expect(format(now, "HH:mm:ss", { timeZone: "Asia/Tokyo" })).toBe(
          "21:00:00"
        );
        expect(format(now, "HH:mm:ss", { timeZone: "America/New_York" })).toBe(
          "08:00:00"
        );
      });

      it("formats date with 12-hour clock", () => {
        expect(format(now, "hh:mm:ss A", { hour12: true })).toBe("12:00:00 PM");
        expect(format(now, "hh:mm:ss a", { hour12: true })).toBe("12:00:00 pm");
      });

      it("handles invalid dates gracefully", () => {
        expect(() => format(invalidDate)).not.toThrow();
      });
    });
  });

  describe("Date Arithmetic", () => {
    describe("add", () => {
      it("adds days correctly", () => {
        const result = add(now, 1, "days");
        expect(result.getUTCDate()).toBe(22);
        expect(result.getUTCHours()).toBe(12);
      });

      it("adds hours correctly", () => {
        const result = add(now, 2, "hours");
        expect(result.getUTCHours()).toBe(14);
        expect(result.getUTCDate()).toBe(21);
      });

      it("adds minutes correctly", () => {
        const result = add(now, 30, "minutes");
        expect(result.getUTCMinutes()).toBe(30);
        expect(result.getUTCHours()).toBe(12);
      });

      it("adds seconds correctly", () => {
        const result = add(now, 45, "seconds");
        expect(result.getUTCSeconds()).toBe(45);
        expect(result.getUTCMinutes()).toBe(0);
      });

      it("handles negative values", () => {
        const result = add(now, -2, "hours");
        expect(result.getUTCHours()).toBe(10);
      });

      it("handles invalid dates gracefully", () => {
        expect(() => add(invalidDate, 1, "days")).not.toThrow();
      });
    });

    describe("subtract", () => {
      it("subtracts days correctly", () => {
        const result = subtract(now, 1, "days");
        expect(result.getUTCDate()).toBe(20);
        expect(result.getUTCHours()).toBe(12);
      });

      it("subtracts hours correctly", () => {
        const result = subtract(now, 2, "hours");
        expect(result.getUTCHours()).toBe(10);
        expect(result.getUTCDate()).toBe(21);
      });

      it("handles negative values", () => {
        const result = subtract(now, -2, "hours");
        expect(result.getUTCHours()).toBe(14);
      });

      it("handles invalid dates gracefully", () => {
        expect(() => subtract(invalidDate, 1, "days")).not.toThrow();
      });
    });

    describe("diff", () => {
      it("calculates difference in days", () => {
        expect(diff(future, now, "days")).toBe(1);
        expect(diff(now, past, "days")).toBe(1);
      });

      it("calculates difference in hours", () => {
        expect(diff(future, now, "hours")).toBe(24);
        expect(diff(now, past, "hours")).toBe(24);
      });

      it("calculates difference in minutes", () => {
        expect(diff(future, now, "minutes")).toBe(1440);
        expect(diff(now, past, "minutes")).toBe(1440);
      });

      it("handles invalid dates gracefully", () => {
        expect(() => diff(invalidDate, now, "days")).not.toThrow();
      });
    });
  });

  describe("Date Comparison", () => {
    describe("isBefore/isAfter", () => {
      it("checks if date is before", () => {
        expect(isBefore(now, future)).toBe(true);
        expect(isBefore(past, now)).toBe(true);
      });

      it("checks if date is after", () => {
        expect(isAfter(future, now)).toBe(true);
        expect(isAfter(now, past)).toBe(true);
      });

      it("handles equal dates", () => {
        expect(isBefore(now, now)).toBe(false);
        expect(isAfter(now, now)).toBe(false);
      });

      it("handles invalid dates gracefully", () => {
        expect(() => isBefore(invalidDate, now)).not.toThrow();
        expect(() => isAfter(invalidDate, now)).not.toThrow();
      });
    });
  });

  describe("Date Manipulation", () => {
    describe("startOf", () => {
      it("gets start of day", () => {
        const result = startOf(now, "day");
        expect(result.getUTCHours()).toBe(0);
        expect(result.getUTCMinutes()).toBe(0);
        expect(result.getUTCSeconds()).toBe(0);
      });

      it("gets start of hour", () => {
        const result = startOf(now, "hour");
        expect(result.getUTCHours()).toBe(12);
        expect(result.getUTCMinutes()).toBe(0);
        expect(result.getUTCSeconds()).toBe(0);
      });

      it("gets start of minute", () => {
        const result = startOf(now, "minute");
        expect(result.getUTCHours()).toBe(12);
        expect(result.getUTCMinutes()).toBe(0);
        expect(result.getUTCSeconds()).toBe(0);
      });

      it("handles invalid dates gracefully", () => {
        expect(() => startOf(invalidDate, "day")).not.toThrow();
      });
    });
  });

  describe("Relative Time", () => {
    describe("fromNow", () => {
      it('returns "just now" for recent dates', () => {
        const recent = new Date(now.getTime() - 5 * 1000); // 5 seconds ago
        expect(fromNow(recent, now)).toBe("just now");
      });

      it("returns minutes ago", () => {
        const minutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        expect(fromNow(minutesAgo, now)).toBe("30 minutes ago");
      });

      it("returns hours ago", () => {
        const hoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        expect(fromNow(hoursAgo, now)).toBe("2 hours ago");
      });

      it("returns days ago", () => {
        const daysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
        expect(fromNow(daysAgo, now)).toBe("2 days ago");
      });

      it("handles future dates", () => {
        const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        expect(fromNow(future, now)).toBe("in 2 hours");
      });

      it("handles invalid dates gracefully", () => {
        expect(() => fromNow(invalidDate, now)).not.toThrow();
      });
    });
  });

  describe("Timezone Functions", () => {
    describe("getAvailableTimezones", () => {
      it("returns an array of timezone strings", () => {
        const timezones = getAvailableTimezones();
        expect(Array.isArray(timezones)).toBe(true);
        expect(timezones.length).toBeGreaterThan(0);
        expect(timezones).toContain("America/New_York");
      });
    });

    describe("getTimezoneInfo", () => {
      it("returns timezone information", () => {
        const info = getTimezoneInfo(now, "America/New_York");
        expect(info).toHaveProperty("name", "America/New_York");
        expect(info).toHaveProperty("offset");
        expect(info).toHaveProperty("isDST");
        expect(info).toHaveProperty("abbreviation");
      });

      it("handles UTC timezone", () => {
        const info = getTimezoneInfo(now, "UTC");
        expect(info.offset).toBe(0);
        expect(info.isDST).toBe(false);
        expect(info.abbreviation).toBe("UTC");
      });

      it("handles invalid timezone gracefully", () => {
        const info = getTimezoneInfo(now, "Invalid/Timezone");
        expect(info).toEqual({
          name: "Invalid/Timezone",
          offset: 0,
          isDST: false,
          abbreviation: "UTC",
        });
      });
    });

    describe("isDST", () => {
      it("returns boolean for DST status", () => {
        const dstStatus = isDST("America/New_York");
        expect(typeof dstStatus).toBe("boolean");
      });

      it("returns false for UTC", () => {
        expect(isDST("UTC")).toBe(false);
      });

      it("handles invalid timezone gracefully", () => {
        expect(isDST("Invalid/Timezone")).toBe(false);
      });
    });

    describe("getDSTTransitions", () => {
      it("returns DST transition dates", () => {
        const transitions = getDSTTransitions("America/New_York", 2024);
        expect(transitions).toHaveProperty("start");
        expect(transitions).toHaveProperty("end");
        expect(
          transitions.start instanceof Date || transitions.start === null
        ).toBe(true);
        expect(
          transitions.end instanceof Date || transitions.end === null
        ).toBe(true);
      });

      it("returns null transitions for UTC", () => {
        const transitions = getDSTTransitions("UTC", 2024);
        expect(transitions.start).toBeNull();
        expect(transitions.end).toBeNull();
      });

      it("handles invalid timezone gracefully", () => {
        const transitions = getDSTTransitions("Invalid/Timezone", 2024);
        expect(transitions.start).toBeNull();
        expect(transitions.end).toBeNull();
      });
    });

    describe("toTimezone", () => {
      it("converts date to target timezone", () => {
        const nyTime = toTimezone(now, "America/New_York");
        expect(nyTime instanceof Date).toBe(true);
        expect(nyTime.getTime()).not.toBe(now.getTime());
      });

      it("handles UTC conversion", () => {
        const utcTime = toTimezone(now, "UTC");
        expect(utcTime.getUTCHours()).toBe(now.getUTCHours());
        expect(utcTime.getUTCMinutes()).toBe(now.getUTCMinutes());
      });

      it("handles invalid timezone gracefully", () => {
        const result = toTimezone(now, "Invalid/Timezone");
        expect(result).toBeInstanceOf(Date);
      });
    });

    describe("getTimezoneOffset", () => {
      it("returns offset in minutes", () => {
        const offset = getTimezoneOffset(now, "America/New_York");
        expect(typeof offset).toBe("number");
        expect(Math.abs(offset) % 60).toBe(0); // Should be in whole hours
      });

      it("returns 0 for UTC", () => {
        expect(getTimezoneOffset(now, "UTC")).toBe(0);
      });

      it("handles invalid timezone gracefully", () => {
        expect(getTimezoneOffset(now, "Invalid/Timezone")).toBe(0);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles invalid dates consistently", () => {
      expect(() => format(invalidDate)).not.toThrow();
      expect(() => add(invalidDate, 1, "days")).not.toThrow();
      expect(() => subtract(invalidDate, 1, "days")).not.toThrow();
      expect(() => diff(invalidDate, now, "days")).not.toThrow();
      expect(() => isBefore(invalidDate, now)).not.toThrow();
      expect(() => isAfter(invalidDate, now)).not.toThrow();
      expect(() => startOf(invalidDate, "day")).not.toThrow();
      expect(() => fromNow(invalidDate, now)).not.toThrow();
    });

    it("handles DST transitions", () => {
      // Test around DST transition in New York (March 10, 2024)
      const beforeDST = new Date("2024-03-10T06:59:59Z"); // Just before DST starts
      const afterDST = new Date("2024-03-10T07:00:00Z"); // DST starts

      const beforeInfo = getTimezoneInfo(beforeDST, "America/New_York");
      const afterInfo = getTimezoneInfo(afterDST, "America/New_York");

      // Before DST: UTC-5 (offset = -300)
      // After DST: UTC-4 (offset = -240)
      expect(beforeInfo.isDST).toBe(false);
      expect(afterInfo.isDST).toBe(true);
      expect(beforeInfo.offset).toBe(-300);
      expect(afterInfo.offset).toBe(-240);
    });

    it("handles year boundaries", () => {
      const newYear = new Date("2024-12-31T23:59:59Z");
      const nextYear = add(newYear, 1, "seconds");
      expect(nextYear.getUTCFullYear()).toBe(2025);
      expect(nextYear.getUTCHours()).toBe(0);
      expect(nextYear.getUTCMinutes()).toBe(0);
      expect(nextYear.getUTCSeconds()).toBe(0);
    });

    it("handles month boundaries", () => {
      const endOfMonth = new Date("2024-01-31T23:59:59Z");
      const nextMonth = add(endOfMonth, 1, "days");
      expect(nextMonth.getUTCMonth()).toBe(1); // February
      expect(nextMonth.getUTCDate()).toBe(1);
    });

    it("handles leap years", () => {
      const leapYear = new Date("2024-02-28T23:59:59Z");
      const nextDay = add(leapYear, 1, "days");
      expect(nextDay.getUTCDate()).toBe(29);
      expect(nextDay.getUTCMonth()).toBe(1); // February
    });
  });
});
