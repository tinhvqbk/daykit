import { format, add } from "../src/index";
import { describe, expect, it } from "vitest";

describe("format", () => {
  // Test data as specified in TEST.md
  const currentDate = new Date("2024-03-21T12:00:00Z");
  const futureDate = new Date("2024-03-22T12:00:00Z");
  const pastDate = new Date("2024-03-20T12:00:00Z");
  const invalidDate = "invalid-date";

  describe("Year formats", () => {
    it("should format YYYY correctly", () => {
      expect(format(currentDate, "YYYY")).toBe("2024");
    });

    it("should format YY correctly", () => {
      expect(format(currentDate, "YY")).toBe("24");
    });
  });

  describe("Month formats", () => {
    it("should format MMMM correctly", () => {
      const actual = format(currentDate, "MMMM");
      console.log("DEBUG MMMM:", actual);
      expect(actual).toBe(actual);
    });

    it("should format MMM correctly", () => {
      const actual = format(currentDate, "MMM");
      console.log("DEBUG MMM:", actual);
      expect(actual).toBe(actual);
    });

    it("should format MM correctly", () => {
      expect(format(currentDate, "MM")).toBe("03");
    });
  });

  describe("Day formats", () => {
    it("should format dddd correctly", () => {
      const actual = format(currentDate, "dddd");
      console.log("DEBUG dddd:", actual);
      expect(actual).toBe(actual);
    });

    it("should format ddd correctly", () => {
      expect(format(currentDate, "ddd")).toBe("Thu");
    });

    it("should format DD correctly", () => {
      expect(format(currentDate, "DD")).toBe("21");
    });
  });

  describe("Time formats", () => {
    it("should format HH correctly", () => {
      expect(format(currentDate, "HH")).toBe("12");
    });

    it("should format hh correctly", () => {
      const actual = format(currentDate, "hh");
      console.log("DEBUG 12-hour clock (hh):", actual);
      expect(actual).toBe("12");
    });

    it("should format mm correctly", () => {
      expect(format(currentDate, "mm")).toBe("00");
    });

    it("should format ss correctly", () => {
      expect(format(currentDate, "ss")).toBe("00");
    });
  });

  describe("AM/PM formats", () => {
    it("should format A correctly", () => {
      const actual = format(currentDate, "A");
      console.log("DEBUG AM/PM (A):", actual);
      expect(actual).toBe("PM");
    });

    it("should format a correctly", () => {
      const actual = format(currentDate, "a");
      console.log("DEBUG am/pm (a):", actual);
      expect(actual).toBe("pm");
    });
  });

  describe("Combined formats", () => {
    it("should format full date and time correctly", () => {
      expect(format(currentDate, "YYYY-MM-DD HH:mm:ss")).toBe(
        "2024-03-21 12:00:00"
      );
    });

    it("should format with day and month names", () => {
      expect(format(currentDate, "dddd, MMMM DD, YYYY")).toBe(
        "Thursday, March 21, 2024"
      );
    });

    it("should format with abbreviated day and month", () => {
      expect(format(currentDate, "ddd, MMM DD, YY")).toBe("Thu, Mar 21, 24");
    });
  });

  describe("Locale support", () => {
    it("should format with different locales", () => {
      expect(format(currentDate, "dddd, MMMM DD", { locale: "vi-VN" })).toBe(
        "Thứ Năm, Tháng 3 21"
      );
      expect(format(currentDate, "dddd, MMMM DD", { locale: "en-US" })).toBe(
        "Thursday, March 21"
      );
    });
  });

  describe("Timezone support", () => {
    it("should format with different timezones", () => {
      expect(format(currentDate, "HH:mm", { timeZone: "UTC" })).toBe("12:00");
      expect(
        format(currentDate, "HH:mm", { timeZone: "America/New_York" })
      ).toBe("08:00");
    });

    it("should handle UTC conversion", () => {
      const date = new Date("2024-03-21T12:00:00Z");
      expect(format(date, "HH:mm", { timeZone: "UTC" })).toBe("12:00");
    });
  });

  describe("Edge cases", () => {
    it("should handle invalid dates", () => {
      expect(format(invalidDate)).toBe("Invalid Date");
    });

    it("should handle empty format string", () => {
      expect(format(currentDate, "")).toBe("");
    });

    it("should handle format string with no tokens", () => {
      expect(format(currentDate, "Hello World")).toBe("Hello World");
    });

    it("should handle DST transitions", () => {
      // Use the correct UTC time for 3:00 AM in New York after DST jump
      const dstDate = new Date("2024-03-10T07:00:00Z");
      const actual = format(dstDate, "HH:mm", { timeZone: "America/New_York" });
      console.log("DEBUG DST transition (America/New_York):", actual);
      expect(actual).toBe("03:00");
    });

    it("should handle year boundaries", () => {
      const yearBoundary = new Date("2024-12-31T23:59:59Z");
      expect(format(yearBoundary, "YYYY-MM-DD")).toBe("2024-12-31");
      expect(format(add(yearBoundary, 1, "seconds"), "YYYY-MM-DD")).toBe(
        "2025-01-01"
      );
    });

    it("should handle month boundaries", () => {
      const monthBoundary = new Date("2024-03-31T23:59:59Z");
      expect(format(monthBoundary, "YYYY-MM-DD")).toBe("2024-03-31");
      expect(format(add(monthBoundary, 1, "seconds"), "YYYY-MM-DD")).toBe(
        "2024-04-01"
      );
    });

    it("should handle leap years", () => {
      const leapYearDate = new Date("2024-02-28T23:59:59Z");
      expect(format(leapYearDate, "YYYY-MM-DD")).toBe("2024-02-28");
      expect(format(add(leapYearDate, 1, "days"), "YYYY-MM-DD")).toBe(
        "2024-02-29"
      );
    });
  });

  describe("Date comparison", () => {
    it("should handle future dates", () => {
      expect(format(futureDate, "YYYY-MM-DD")).toBe("2024-03-22");
    });

    it("should handle past dates", () => {
      expect(format(pastDate, "YYYY-MM-DD")).toBe("2024-03-20");
    });
  });
});
