# DayKit - A Modern Date Manipulation Library

A lightweight, type-safe date manipulation library for TypeScript/JavaScript with comprehensive timezone support.

## Features

- 🕒 Full timezone support with DST handling
- 🌍 Multi-locale support
- 📅 Comprehensive date formatting
- ⚡ Type-safe API
- 🎯 Zero dependencies
- �� Tree-shakeable

## Demo

[Playground](https://codesandbox.io/p/sandbox/hp99zn)

## Installation

```bash
npm install daykit
# or
yarn add daykit
# or
pnpm add daykit
```

## Usage

```typescript
import {
  format,
  add,
  subtract,
  diff,
  isBefore,
  isAfter,
  startOf,
  fromNow,
} from "daykit";

// Format dates
format(new Date(), "YYYY-MM-DD HH:mm:ss"); // "2024-03-21 12:00:00"
format(new Date(), "dddd, MMMM DD, YYYY"); // "Thursday, March 21, 2024"

// Add/subtract time
add(new Date(), 1, "days");
subtract(new Date(), 2, "hours");

// Compare dates
isBefore(date1, date2);
isAfter(date1, date2);

// Get time difference
diff(date1, date2, "days");

// Get start of time unit
startOf(new Date(), "day");

// Get relative time
fromNow(new Date()); // "just now"
```

## API Reference

### Date Creation

```typescript
createMoment(date?: Date | string | number): Date
```

Creates a new Date object from the input date.

### Formatting

```typescript
format(
  date: Date | string | number,
  fmt?: string,
  options?: FormatOptions
): string
```

Format tokens:

- `YYYY`: Full year (2024)
- `YY`: Short year (24)
- `MMMM`: Full month name (March)
- `MMM`: Short month name (Mar)
- `MM`: Month number (03)
- `DD`: Day of month (21)
- `ddd`: Short day name (Thu)
- `dddd`: Full day name (Thursday)
- `HH`: 24-hour (12)
- `hh`: 12-hour (12)
- `mm`: Minutes (00)
- `ss`: Seconds (00)
- `A`: AM/PM (PM)
- `a`: am/pm (pm)

Format options:

```typescript
interface FormatOptions {
  locale?: string; // Default: "en-US"
  timeZone?: string; // Default: "UTC"
  hour12?: boolean; // Default: auto-detected from format
}
```

### Time Manipulation

```typescript
add(date: Date | string | number, n: number, unit: TimeUnit): Date
subtract(date: Date | string | number, n: number, unit: TimeUnit): Date
```

Supported time units:

- `days`
- `hours`
- `minutes`
- `seconds`
- `milliseconds`

### Date Comparison

```typescript
diff(date1: Date | string | number, date2: Date | string | number, unit?: TimeUnit): number
isBefore(date1: Date | string | number, date2: Date | string | number): boolean
isAfter(date1: Date | string | number, date2: Date | string | number): boolean
```

### Timezone Support

```typescript
getAvailableTimezones(): string[]
getTimezoneInfo(date: Date | string | number, timeZone: string): TimezoneInfo
isDST(timeZone: string): boolean
getDSTTransitions(timeZone: string, year?: number): { start: Date | null; end: Date | null }
toTimezone(date: Date | string | number, timeZone: string): Date
getTimezoneOffset(date: Date | string | number, timeZone: string): number
```

Timezone information:

```typescript
interface TimezoneInfo {
  name: string; // Timezone name
  offset: number; // Offset in minutes
  isDST: boolean; // Whether in DST
  abbreviation: string; // Timezone abbreviation
}
```

### Locale Support

```typescript
getAvailableLocales(): string[]
```

### Time Unit Operations

```typescript
startOf(date: Date | string | number, unit: "day" | "hour" | "minute"): Date
```

### Relative Time

```typescript
fromNow(
  date: Date | string | number,
  now?: Date | string | number,
  options?: FormatOptions
): string
```

## Examples

### Basic Formatting

```typescript
import { format } from "daykit";

// Basic date format
format(new Date(), "YYYY-MM-DD"); // "2024-03-21"

// Full date and time
format(new Date(), "YYYY-MM-DD HH:mm:ss"); // "2024-03-21 12:00:00"

// With day and month names
format(new Date(), "dddd, MMMM DD, YYYY"); // "Thursday, March 21, 2024"
```

### Timezone Handling

```typescript
import { format, getTimezoneInfo } from "daykit";

// Format in different timezones
format(new Date(), "HH:mm", { timeZone: "UTC" }); // "12:00"
format(new Date(), "HH:mm", { timeZone: "America/New_York" }); // "08:00"

// Get timezone information
const info = getTimezoneInfo(new Date(), "America/New_York");
console.log(info);
// {
//   name: "America/New_York",
//   offset: -240,
//   isDST: true,
//   abbreviation: "EDT"
// }
```

### Locale Support

```typescript
import { format } from "daykit";

// English (US)
format(new Date(), "dddd, MMMM DD", { locale: "en-US" });
// "Thursday, March 21"

// Vietnamese
format(new Date(), "dddd, MMMM DD", { locale: "vi-VN" });
// "Thứ Năm, Tháng 3 21"
```

### Date Manipulation

```typescript
import { add, subtract, diff } from "daykit";

const date = new Date();

// Add time
add(date, 1, "days"); // Add one day
add(date, 2, "hours"); // Add two hours

// Subtract time
subtract(date, 1, "days"); // Subtract one day

// Get difference
diff(date1, date2, "days"); // Get difference in days
```

### DST Handling

```typescript
import { getDSTTransitions, isDST } from "daykit";

// Check if timezone is in DST
isDST("America/New_York"); // true/false

// Get DST transition dates
const transitions = getDSTTransitions("America/New_York", 2024);
console.log(transitions);
// {
//   start: Date("2024-03-10T07:00:00Z"),
//   end: Date("2024-11-03T06:00:00Z")
// }
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © KyleTV
