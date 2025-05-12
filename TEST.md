# DayKit Test Cases

This document outlines comprehensive test cases for the DayKit library, a lightweight date manipulation toolkit.

---

## Test Data

The test suite uses clearly defined standard test dates:

- Current date: March 21, 2024, at 12:00:00 UTC
- Future date: March 22, 2024, at 12:00:00 UTC
- Past date: March 20, 2024, at 12:00:00 UTC
- Invalid date: Created from an invalid date string ("invalid-date")

---

## Date Creation

### createMoment

The createMoment function should:

- Create new Date objects from:
  - Valid date strings (e.g., "2024-03-21T12:00:00Z")
  - Timestamps (e.g., `1711022400000`)
  - No input, defaulting to the current date
- Gracefully handle invalid date inputs, returning the current date

---

## Date Formatting

### format

The format function should:

- Format dates using default (`YYYY-MM-DD HH:mm:ss`) and custom patterns
- Support tokens: `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `DD`, `ddd`, `dddd`, `HH`, `hh`, `mm`, `ss`, `A`, `a`
- Correctly handle locale settings (`en-US`, `vi-VN`, etc.)
- Accurately process timezone conversions (UTC, America/New_York)
- Support both 12-hour (AM/PM) and 24-hour clock formats
- Gracefully handle invalid dates, returning empty strings

Example:

```javascript
format(new Date("2024-03-21T12:00:00Z"), 'YYYY-MM-DD HH:mm', 'UTC') → "2024-03-21 12:00"
```

---

## Date Arithmetic

### add

The add function should:

- Add days, hours, minutes, seconds correctly
- Accurately process negative values
- Handle invalid dates gracefully, returning the input unchanged

Examples:

```javascript
add(new Date('2024-03-21T12:00:00Z'), 1, 'days') → "2024-03-22T12:00:00Z"
add(new Date('2024-03-21T12:00:00Z'), -1, 'days') → "2024-03-20T12:00:00Z"
```

### subtract

The subtract function should:

- Subtract days, hours correctly
- Correctly process negative values
- Gracefully handle invalid dates

Examples:

```javascript
subtract(new Date('2024-03-21T12:00:00Z'), 1, 'days') → "2024-03-20T12:00:00Z"
subtract(new Date('2024-03-21T12:00:00Z'), -1, 'days') → "2024-03-22T12:00:00Z"
```

### diff

The diff function should:

- Calculate differences in days, hours, minutes precisely
- Gracefully handle invalid dates, returning `NaN`

Example:

```javascript
diff('2024-03-21T12:00:00Z', '2024-03-20T12:00:00Z', 'days') → 1
```

---

## Date Comparison

### isBefore/isAfter

These functions should:

- Identify dates before/after another correctly
- Return `false` for equal or invalid dates

Example:

```javascript
isBefore('2024-03-20', '2024-03-21') → true
isAfter('2024-03-22', '2024-03-21') → true
```

---

## Date Manipulation

### startOf

The startOf function should:

- Return correct start of day (`00:00:00`), hour (`HH:00:00`), minute (`HH:mm:00`)
- Gracefully handle invalid dates

Example:

```javascript
startOf('2024-03-21T12:34:56Z', 'day') → "2024-03-21T00:00:00Z"
```

---

## Relative Time

### fromNow

The fromNow function should:

- Display "just now" for events <10 seconds ago
- Display accurate minutes/hours/days in past and future

Examples:

```javascript
fromNow(new Date(Date.now() - 5000)) → "just now"
fromNow(new Date(Date.now() - 60000)) → "1 minute ago"
fromNow(new Date(Date.now() + 60000)) → "in 1 minute"
```

---

## Timezone Functions

### getAvailableTimezones

- Return all available timezones, including `America/New_York`, `Asia/Ho_Chi_Minh`

### getTimezoneInfo

- Provide complete timezone details
- Gracefully handle invalid timezone inputs

### isDST

- Return accurate DST status; always `false` for UTC

### getDSTTransitions

- Provide accurate DST transition dates or `null` for UTC

Example:

```javascript
getDSTTransitions('America/New_York', 2024) → [
  { start: "2024-03-10T07:00:00Z", end: "2024-11-03T06:00:00Z" }
]
```

### toTimezone

- Correctly convert dates to specified timezone
- Gracefully handle invalid timezones

### getTimezoneOffset

- Accurately return timezone offsets (0 for UTC)
- Default to `0` for invalid timezones

---

## Edge Cases

### Invalid Dates

All functions (`format`, `add`, `subtract`, `diff`, `isBefore`, `isAfter`, `startOf`, `fromNow`) should gracefully handle invalid dates by returning sensible defaults without errors.

### DST Transitions

- Correctly handle date arithmetic around DST transitions
- Accurately detect DST offset changes

### Year and Month Boundaries

- Correctly handle transitions across year/month boundaries

### Leap Years

- Correctly process dates like February 29

Example:

```javascript
add('2024-02-28', 1, 'days') → "2024-02-29"
```

---

## Test Implementation Notes

- Timezone functions return defaults for invalid inputs
- Date manipulation maintains UTC consistency
- Relative time outputs are human-readable with clearly defined thresholds
- Format supports all specified tokens and locales explicitly defined above
