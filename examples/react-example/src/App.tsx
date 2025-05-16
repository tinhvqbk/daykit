import React, { useState, useEffect } from "react";
import {
  format,
  add,
  subtract,
  diff,
  fromNow,
  startOf,
  isBefore,
  isAfter,
  createMoment,
  getAvailableTimezones,
  getTimezoneInfo,
  isDST,
  getDSTTransitions,
  toTimezone,
  getTimezoneOffset,
  getAvailableLocales,
} from "daykit";

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [customDate, setCustomDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [availableTimezones] = useState(getAvailableTimezones());
  const [availableLocales] = useState(getAvailableLocales());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Example dates
  const tomorrow = add(now, 1, "days");
  const yesterday = subtract(now, 1, "days");
  const nextWeek = add(now, 7, "days");
  const lastWeek = subtract(now, 7, "days");

  // Get timezone info
  const timezoneInfo = getTimezoneInfo(now, selectedTimezone);
  const dstTransitions = getDSTTransitions(selectedTimezone);
  const isDSTNow = isDST(selectedTimezone);
  const timezoneOffset = getTimezoneOffset(now, selectedTimezone);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">DayKit Examples</h1>

      <div className="space-y-8">
        {/* Current Time */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Time</h2>
          <p className="text-gray-600">{format(now, "YYYY-MM-DD HH:mm:ss")}</p>
        </section>

        {/* Date Formatting */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Date Formatting</h2>
          <div className="space-y-2">
            <p>Default format: {format(now)}</p>
            <p>Custom format: {format(now, "YYYY/MM/DD")}</p>
            <p>With locale: {format(now, "YYYY-MM-DD", { locale: "fr-FR" })}</p>
            <p>
              With timezone:{" "}
              {format(now, "HH:mm:ss", { timeZone: "Asia/Tokyo" })}
            </p>
            <p>12-hour format: {format(now, "hh:mm:ss A", { hour12: true })}</p>
          </div>
        </section>

        {/* Date Manipulation */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Date Manipulation</h2>
          <div className="space-y-2">
            <p>Tomorrow: {format(tomorrow)}</p>
            <p>Yesterday: {format(yesterday)}</p>
            <p>Next week: {format(nextWeek)}</p>
            <p>Last week: {format(lastWeek)}</p>
            <p>Add 2 hours: {format(add(now, 2, "hours"))}</p>
            <p>Subtract 30 minutes: {format(subtract(now, 30, "minutes"))}</p>
          </div>
        </section>

        {/* Date Comparison */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Date Comparison</h2>
          <div className="space-y-2">
            <p>
              Is tomorrow after now? {isAfter(tomorrow, now) ? "Yes" : "No"}
            </p>
            <p>
              Is yesterday before now? {isBefore(yesterday, now) ? "Yes" : "No"}
            </p>
            <p>Days until next week: {diff(nextWeek, now, "days")}</p>
            <p>Hours since yesterday: {diff(now, yesterday, "hours")}</p>
            <p>Minutes until tomorrow: {diff(tomorrow, now, "minutes")}</p>
          </div>
        </section>

        {/* Relative Time */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Relative Time</h2>
          <div className="space-y-2">
            <p>Tomorrow: {fromNow(tomorrow)}</p>
            <p>Yesterday: {fromNow(yesterday)}</p>
            <p>Next week: {fromNow(nextWeek)}</p>
            <p>Last week: {fromNow(lastWeek)}</p>
            <p>
              With French locale: {fromNow(tomorrow, now, { locale: "fr-FR" })}
            </p>
          </div>
        </section>

        {/* Start of Period */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Start of Period</h2>
          <div className="space-y-2">
            <p>Start of day: {format(startOf(now, "day"))}</p>
            <p>Start of hour: {format(startOf(now, "hour"))}</p>
            <p>Start of minute: {format(startOf(now, "minute"))}</p>
          </div>
        </section>

        {/* Timezone Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Timezone Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Timezone
              </label>
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="border p-2 rounded w-full"
              >
                {availableTimezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <p>Timezone Name: {timezoneInfo.name}</p>
              <p>Timezone Offset: {timezoneInfo.offset} minutes</p>
              <p>Is DST: {timezoneInfo.isDST ? "Yes" : "No"}</p>
              <p>Timezone Abbreviation: {timezoneInfo.abbreviation}</p>
              <p>Current DST Status: {isDSTNow ? "In DST" : "Not in DST"}</p>
              <p>Timezone Offset: {timezoneOffset} minutes</p>
              {dstTransitions.start && (
                <p>DST Start: {format(dstTransitions.start)}</p>
              )}
              {dstTransitions.end && (
                <p>DST End: {format(dstTransitions.end)}</p>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Date Picker */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Interactive Date Picker
          </h2>
          <div className="space-y-4">
            <input
              type="datetime-local"
              value={format(customDate, "YYYY-MM-DDTHH:mm")}
              onChange={(e) => setCustomDate(new Date(e.target.value))}
              className="border p-2 rounded"
            />
            <div className="space-y-2">
              <p>Selected date: {format(customDate)}</p>
              <p>Relative time: {fromNow(customDate)}</p>
              <p>Days from now: {diff(customDate, now, "days")}</p>
              <p>
                In selected timezone:{" "}
                {format(toTimezone(customDate, selectedTimezone))}
              </p>
            </div>
          </div>
        </section>

        {/* Available Locales */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Available Locales</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableLocales.map((locale) => (
              <div key={locale} className="p-2 bg-gray-50 rounded">
                {locale}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
