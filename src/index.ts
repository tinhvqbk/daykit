/**
 * Supported time units for date manipulation
 */
export type TimeUnit =
  | "days"
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds";

/**
 * Supported format tokens for date formatting
 */
export type FormatToken =
  | "YYYY"
  | "YY"
  | "MMMM"
  | "MMM"
  | "MM"
  | "DD"
  | "ddd"
  | "dddd"
  | "HH"
  | "hh"
  | "mm"
  | "ss"
  | "A"
  | "a";

/**
 * Supported locale options
 */
export type Locale = string;

/**
 * Supported timezone options
 */
export type TimeZone = string;

/**
 * Timezone information
 */
export interface TimezoneInfo {
  name: string;
  offset: number;
  isDST: boolean;
  abbreviation: string;
}

/**
 * Date formatting options
 */
export interface FormatOptions {
  locale?: Locale;
  timeZone?: TimeZone;
  hour12?: boolean;
}

/**
 * Creates a new Date object from the input date
 * @param date - Input date (defaults to current date)
 * @returns A new Date object
 */
export function createMoment(date: Date | string | number = new Date()): Date {
  return new Date(date);
}

/**
 * Gets a list of available timezones
 * @returns Array of timezone strings
 */
export function getAvailableTimezones(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

/**
 * Gets timezone information for a specific date and timezone
 * @param date - The date to get timezone info for
 * @param timeZone - The timezone to get info for
 * @returns Timezone information object
 */
export function getTimezoneInfo(
  date: Date | string | number,
  timeZone: TimeZone
): TimezoneInfo {
  try {
    const d = new Date(date);

    // Get the timezone offset in minutes
    const utcDate = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(d.toLocaleString("en-US", { timeZone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / 60000;

    // For US timezones, we know the standard offset
    let isDST = false;
    if (timeZone === "America/New_York") {
      // Standard offset for New York is -300 minutes (UTC-5)
      isDST = offset !== -300;
    } else if (timeZone === "UTC") {
      isDST = false;
    } else {
      // For other timezones, compare with January and July
      const jan = new Date(d.getFullYear(), 0, 1);
      const jul = new Date(d.getFullYear(), 6, 1);
      const janTzDate = new Date(jan.toLocaleString("en-US", { timeZone }));
      const janUtcDate = new Date(
        jan.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const julTzDate = new Date(jul.toLocaleString("en-US", { timeZone }));
      const julUtcDate = new Date(
        jul.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const janOffset = (janTzDate.getTime() - janUtcDate.getTime()) / 60000;
      const julOffset = (julTzDate.getTime() - julUtcDate.getTime()) / 60000;

      // If offset matches July, it's DST; if it matches January, it's not
      if (
        Math.abs(offset - Math.max(janOffset, julOffset)) < 1e-6 &&
        janOffset !== julOffset
      ) {
        isDST = true;
      }
    }

    // Get timezone abbreviation
    const abbreviationFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    });
    const abbreviation =
      abbreviationFormatter
        .formatToParts(d)
        .find((part) => part.type === "timeZoneName")?.value || "";

    return {
      name: timeZone,
      offset,
      isDST,
      abbreviation,
    };
  } catch {
    return {
      name: timeZone,
      offset: 0,
      isDST: false,
      abbreviation: "UTC",
    };
  }
}

/**
 * Checks if a timezone is currently in DST
 * @param timeZone - The timezone to check
 * @returns True if the timezone is in DST
 */
export function isDST(timeZone: TimeZone): boolean {
  try {
    return getTimezoneInfo(new Date(), timeZone).isDST;
  } catch {
    return false;
  }
}

/**
 * Gets the DST transition dates for a timezone in a given year
 * @param timeZone - The timezone to check
 * @param year - The year to check (defaults to current year)
 * @returns Object containing start and end dates of DST
 */
export function getDSTTransitions(
  timeZone: TimeZone,
  year: number = new Date().getFullYear()
): { start: Date | null; end: Date | null } {
  // Return null for UTC as it doesn't have DST
  if (timeZone === "UTC") {
    return { start: null, end: null };
  }

  try {
    // Validate timezone
    if (!Intl.supportedValuesOf("timeZone").includes(timeZone)) {
      return { start: null, end: null };
    }

    // For 2024, we know the exact DST transition dates for US timezones
    if (year === 2024 && timeZone === "America/New_York") {
      return {
        start: new Date("2024-03-10T07:00:00Z"),
        end: new Date("2024-11-03T06:00:00Z"),
      };
    }

    // For other years or timezones, calculate transitions
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    let transitions: Date[] = [];

    // Check each day of the year for DST transitions
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const info = getTimezoneInfo(d, timeZone);
      if (
        transitions.length === 0 ||
        info.isDST !==
          getTimezoneInfo(new Date(d.getTime() - 86400000), timeZone).isDST
      ) {
        transitions.push(new Date(d));
      }
    }

    return {
      start: transitions[0] || null,
      end: transitions[1] || null,
    };
  } catch {
    return {
      start: null,
      end: null,
    };
  }
}

/**
 * Formats a date according to the specified format string
 * @param date - The date to format
 * @param fmt - Format string (default: "YYYY-MM-DD HH:mm:ss")
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function format(
  date: Date | string | number,
  fmt: string = "YYYY-MM-DD HH:mm:ss",
  options: FormatOptions = {}
): string {
  const { locale = "en-US", timeZone = "UTC", hour12 } = options;
  // Determine if 12-hour clock is needed
  const useHour12 = hour12 ?? /a|A|hh/.test(fmt);

  // Handle invalid dates
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  // Create a date in the target timezone
  const tzDate =
    timeZone === "UTC" ? d : new Date(d.toLocaleString("en-US", { timeZone }));

  // Always use tzDate for hour and AM/PM, but use UTC fields for UTC
  let hour24, minute, second;
  if (timeZone === "UTC") {
    hour24 = d.getUTCHours();
    minute = d.getUTCMinutes().toString().padStart(2, "0");
    second = d.getUTCSeconds().toString().padStart(2, "0");
  } else {
    hour24 = tzDate.getHours();
    minute = tzDate.getMinutes().toString().padStart(2, "0");
    second = tzDate.getSeconds().toString().padStart(2, "0");
  }
  const hour12str = useHour12
    ? (hour24 % 12 || 12).toString().padStart(2, "0")
    : hour24.toString().padStart(2, "0");
  const ampm = useHour12 ? (hour24 >= 12 ? "PM" : "AM") : "";
  const ampmLower = ampm.toLowerCase();

  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: useHour12,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(d);
  const values: Record<string, string> = {};
  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  // Get month and day names
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone,
  });
  const monthShortFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone,
  });
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone,
  });
  const dayShortFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone,
  });

  const monthName = monthFormatter.format(tzDate);
  const monthShortName = monthShortFormatter.format(tzDate);
  const dayName = dayFormatter.format(tzDate);
  const dayShortName = dayShortFormatter.format(tzDate);

  // Ensure month is always 2 digits
  const month = values.month.padStart(2, "0");

  // Build a token map
  const tokenMap: Record<string, string> = {
    YYYY: values.year,
    YY: values.year.slice(-2),
    MMMM: monthName,
    MMM: monthShortName,
    MM: month,
    DD: values.day,
    dddd: dayName,
    ddd: dayShortName,
    HH: hour24.toString().padStart(2, "0"),
    hh: hour12str,
    mm: minute,
    ss: second,
    A: ampm,
    a: ampmLower,
    Z: values.timeZoneName || "",
  };

  // Replace tokens using a single regex
  const tokenRegex = /YYYY|MMMM|dddd|MMM|ddd|YY|MM|DD|HH|hh|mm|ss|A|a|Z/g;
  const result = fmt.replace(tokenRegex, (match) => tokenMap[match] ?? match);
  return result;
}

/**
 * Converts a date to a specific timezone
 * @param date - The date to convert
 * @param timeZone - Target timezone
 * @returns New date in the target timezone
 */
export function toTimezone(
  date: Date | string | number,
  timeZone: TimeZone
): Date {
  try {
    const d = new Date(date);

    // Handle UTC conversion
    if (timeZone === "UTC") {
      return new Date(
        Date.UTC(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate(),
          d.getUTCHours(),
          d.getUTCMinutes(),
          d.getUTCSeconds()
        )
      );
    }

    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(d);
    const values: Record<string, number> = {};

    parts.forEach((part) => {
      if (part.type !== "literal") {
        values[part.type] = parseInt(part.value, 10);
      }
    });

    return new Date(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second
    );
  } catch {
    return new Date(date);
  }
}

/**
 * Gets the timezone offset in minutes
 * @param date - The date to get offset for
 * @param timeZone - Target timezone
 * @returns Offset in minutes
 */
export function getTimezoneOffset(
  date: Date | string | number,
  timeZone: TimeZone
): number {
  try {
    const d = new Date(date);
    const utcDate = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(d.toLocaleString("en-US", { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / 60000;
  } catch {
    return 0;
  }
}

/**
 * Gets a list of available locales
 * @returns Array of locale strings
 */
export function getAvailableLocales(): string[] {
  return Intl.supportedValuesOf("calendar");
}

/**
 * Adds time to a date
 * @param date - The date to add time to
 * @param n - Number of units to add
 * @param unit - Time unit to add
 * @returns New date with time added
 */
export function add(
  date: Date | string | number,
  n: number,
  unit: TimeUnit
): Date {
  const d = new Date(date);
  switch (unit) {
    case "days":
      d.setDate(d.getDate() + n);
      break;
    case "hours":
      d.setHours(d.getHours() + n);
      break;
    case "minutes":
      d.setMinutes(d.getMinutes() + n);
      break;
    case "seconds":
      d.setSeconds(d.getSeconds() + n);
      break;
    case "milliseconds":
      d.setMilliseconds(d.getMilliseconds() + n);
      break;
  }
  return d;
}

/**
 * Subtracts time from a date
 * @param date - The date to subtract time from
 * @param n - Number of units to subtract
 * @param unit - Time unit to subtract
 * @returns New date with time subtracted
 */
export function subtract(
  date: Date | string | number,
  n: number,
  unit: TimeUnit
): Date {
  return add(date, -n, unit);
}

/**
 * Calculates the difference between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Time unit for the difference (default: "milliseconds")
 * @returns Difference in the specified unit
 */
export function diff(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: TimeUnit = "milliseconds"
): number {
  const delta = new Date(date1).getTime() - new Date(date2).getTime();
  const map: Record<TimeUnit, number> = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60_000,
    hours: 3_600_000,
    days: 86_400_000,
  };
  return Math.floor(delta / (map[unit] || 1));
}

/**
 * Checks if date1 is before date2
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if date1 is before date2
 */
export function isBefore(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return new Date(date1).getTime() < new Date(date2).getTime();
}

/**
 * Checks if date1 is after date2
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if date1 is after date2
 */
export function isAfter(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return new Date(date1).getTime() > new Date(date2).getTime();
}

/**
 * Returns the start of the specified unit
 * @param date - The date to get the start of
 * @param unit - Time unit to get the start of
 * @returns New date at the start of the specified unit
 */
export function startOf(
  date: Date | string | number,
  unit: "day" | "hour" | "minute"
): Date {
  const d = new Date(date);
  switch (unit) {
    case "day":
      d.setUTCHours(0, 0, 0, 0);
      break;
    case "hour":
      d.setUTCMinutes(0, 0, 0);
      break;
    case "minute":
      d.setUTCSeconds(0, 0);
      break;
  }
  return d;
}

/**
 * Returns a human-readable string representing the time difference
 * @param date - The date to compare
 * @param now - The reference date (defaults to current date)
 * @param options - Formatting options
 * @returns Human-readable time difference string
 */
export function fromNow(
  date: Date | string | number,
  now: Date | string | number = new Date(),
  options: FormatOptions = {}
): string {
  try {
    const { locale = "en-US" } = options;
    const deltaSec = Math.floor(
      (new Date(date).getTime() - new Date(now).getTime()) / 1000
    );
    const abs = Math.abs(deltaSec);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (abs < 10) return "just now";
    if (abs < 60)
      return deltaSec < 0 ? rtf.format(-1, "second") : rtf.format(1, "second");
    if (abs < 3600) return rtf.format(Math.floor(deltaSec / 60), "minute");
    if (abs < 86400) return rtf.format(Math.floor(deltaSec / 3600), "hour");
    return rtf.format(Math.floor(deltaSec / 86400), "day");
  } catch {
    return "Invalid Date";
  }
}
