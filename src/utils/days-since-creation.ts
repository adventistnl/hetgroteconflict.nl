/**
 * Time elapsed since the traditional Ussher chronology date for creation
 * (midnight beginning Sunday, October 23, 4004 BC — proleptic Gregorian
 * calendar), a widely cited reference point in young-earth biblical
 * chronology derived from the genealogies in Scripture. This is a
 * theological/traditional dating, not a scientific one, and is presented
 * as such wherever it's shown.
 *
 * Broken down as a calendar age (years, months, days, hours, minutes,
 * seconds) the same way an "age calculator" would, using JS's own Date
 * arithmetic — verified to correctly apply proleptic-Gregorian leap-year
 * rules even for years this far in the past (e.g. it correctly treats
 * 4004 BC / astronomical year -4003 as a non-leap year, and -4000 as one).
 */

const CREATION_YEAR = -4003; // 4004 BC in astronomical year numbering (no year 0)
const CREATION_MONTH_INDEX = 9; // October, 0-based
const CREATION_DAY = 23;

export interface ElapsedSinceCreation {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Number of days in the given (0-based) month of the given astronomical year. */
function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/**
 * Calendar-accurate elapsed time since the Ussher creation date: whole
 * years, then whole months, then whole days, then time-of-day — each unit
 * borrowing from the next larger one the same way manual date-difference
 * arithmetic (or any "X years, Y months, Z days old" calculator) does.
 */
export function elapsedSinceCreation(now: Date = new Date()): ElapsedSinceCreation {
  let years = now.getUTCFullYear() - CREATION_YEAR;
  let months = now.getUTCMonth() - CREATION_MONTH_INDEX;
  let days = now.getUTCDate() - CREATION_DAY;
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  const seconds = now.getUTCSeconds();

  if (days < 0) {
    const prevMonthIndex = now.getUTCMonth() - 1;
    const prevMonthYear = prevMonthIndex < 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
    days += daysInMonth(prevMonthYear, ((prevMonthIndex % 12) + 12) % 12);
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}
