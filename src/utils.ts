/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgeResult, ZodiacInfo, FunStats, ComparisonResult } from './types';

/**
 * Calculates exact age down to year, month, and day.
 */
export function calculateExactAge(dobDate: Date, targetDate: Date = new Date()): { years: number; months: number; days: number } {
  const birthYear = dobDate.getFullYear();
  const birthMonth = dobDate.getMonth();
  const birthDay = dobDate.getDate();

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  let years = targetYear - birthYear;
  let months = targetMonth - birthMonth;
  let days = targetDay - birthDay;

  if (days < 0) {
    // Get the previous month
    const prevMonth = targetMonth === 0 ? 11 : targetMonth - 1;
    const prevMonthYear = targetMonth === 0 ? targetYear - 1 : targetYear;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    days += daysInPrevMonth;
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days };
}

/**
 * Generates comprehensive age stats from Date of Birth.
 */
export function getFullAgeStats(dobDate: Date, targetDate: Date = new Date()): AgeResult {
  const { years, months, days } = calculateExactAge(dobDate, targetDate);

  const diffTime = targetDate.getTime() - dobDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Number((totalDays / 7).toFixed(1));
  const totalMonths = parseFloat((totalDays / 30.437).toFixed(1)); // Average days in month
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffTime / (1000 * 60));
  const totalSeconds = Math.floor(diffTime / 1000);

  // Next Birthday Calculation
  const nextBirthdayDate = new Date(targetDate.getFullYear(), dobDate.getMonth(), dobDate.getDate());
  
  // Set times to midnight to ensure accurate day countdown
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const nextBdayMidnight = new Date(nextBirthdayDate.getFullYear(), nextBirthdayDate.getMonth(), nextBirthdayDate.getDate());
  
  if (nextBdayMidnight.getTime() < targetMidnight.getTime()) {
    nextBdayMidnight.setFullYear(targetDate.getFullYear() + 1);
  }

  const msToBirthday = nextBdayMidnight.getTime() - targetMidnight.getTime();
  const daysToNextBirthday = Math.ceil(msToBirthday / (1000 * 60 * 60 * 24));

  // Months to Birthday breakdown
  let monthsToNextBirthday = nextBdayMidnight.getMonth() - targetDate.getMonth();
  if (monthsToNextBirthday < 0 || (monthsToNextBirthday === 0 && nextBdayMidnight.getDate() < targetDate.getDate())) {
    monthsToNextBirthday += 12;
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayDayName = daysOfWeek[nextBdayMidnight.getDay()];

  const nextAge = years + 1;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthdayDate: nextBdayMidnight,
    daysToNextBirthday,
    monthsToNextBirthday,
    nextBirthdayDayName,
    nextAge,
  };
}

/**
 * Returns Western & Chinese Zodiac specifications based on DOB.
 */
export function getZodiacInfo(dob: Date): ZodiacInfo {
  const month = dob.getMonth() + 1; // 1-indexed
  const day = dob.getDate();
  const year = dob.getFullYear();

  let sign = '';
  let symbol = '';
  let element = '';
  let traits = '';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    sign = 'Aries';
    symbol = '♈';
    element = 'Fire';
    traits = 'Courageous, energetic, willful, commanding, and leading.';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    sign = 'Taurus';
    symbol = '♉';
    element = 'Earth';
    traits = 'Reliable, patient, practical, devoted, responsible, and stable.';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    sign = 'Gemini';
    symbol = '♊';
    element = 'Air';
    traits = 'Gentle, affectionate, curious, adaptable, and quick-witted.';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    sign = 'Cancer';
    symbol = '♋';
    element = 'Water';
    traits = 'Highly imaginative, loyal, sympathetic, persuasive, and intuitive.';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    sign = 'Leo';
    symbol = '♌';
    element = 'Fire';
    traits = 'Creative, passionate, generous, warm-hearted, cheerful, and humorous.';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    sign = 'Virgo';
    symbol = '♍';
    element = 'Earth';
    traits = 'Loyal, analytical, kind, hardworking, practical, and highly organized.';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    sign = 'Libra';
    symbol = '♎';
    element = 'Air';
    traits = 'Cooperative, diplomatic, gracious, fair-minded, and highly social.';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    sign = 'Scorpio';
    symbol = '♏';
    element = 'Water';
    traits = 'Resourceful, powerful, brave, passionate, and a true steadfast friend.';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    sign = 'Sagittarius';
    symbol = '♐';
    element = 'Fire';
    traits = 'Generous, idealistic, great sense of humor, adventurous, and curious.';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    sign = 'Capricorn';
    symbol = '♑';
    element = 'Earth';
    traits = 'Responsible, disciplined, self-controlled, patient, and excellent leaders.';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    sign = 'Aquarius';
    symbol = '♒';
    element = 'Air';
    traits = 'Progressive, original, independent, humanitarian, and highly intellectual.';
  } else {
    sign = 'Pisces';
    symbol = '♓';
    element = 'Water';
    traits = 'Compassionate, artistic, intuitive, gentle, wise, and deeply musical.';
  }

  // Chinese Zodiac cycle
  const animals = [
    'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox',
    'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'
  ];
  const chineseAnimal = animals[year % 12];

  // Chinese Elements
  const lastDigit = year % 10;
  let chineseElement = 'Metal';
  if (lastDigit === 0 || lastDigit === 1) chineseElement = 'Metal (金)';
  else if (lastDigit === 2 || lastDigit === 3) chineseElement = 'Water (水)';
  else if (lastDigit === 4 || lastDigit === 5) chineseElement = 'Wood (木)';
  else if (lastDigit === 6 || lastDigit === 7) chineseElement = 'Fire (火)';
  else if (lastDigit === 8 || lastDigit === 9) chineseElement = 'Earth (土)';

  return {
    sign,
    symbol,
    element,
    traits,
    chineseAnimal,
    chineseElement,
  };
}

/**
 * Calculates fun high-fidelity biological and orbital statistics.
 */
export function getFunStats(dob: Date, target: Date = new Date()): FunStats {
  const diffMs = target.getTime() - dob.getTime();
  const totalDays = diffMs / (1000 * 60 * 60 * 24);

  // Estimations
  const heartbeatRate = 72; // average bpm
  const breathsRate = 16; // average breaths per min
  const sleepFraction = 0.33; // average 1/3 of life sleeping
  const mealsCount = 3; // 3 meals a day

  const heartbeatsVal = Math.round(totalDays * 24 * 60 * heartbeatRate);
  const breathsVal = Math.round(totalDays * 24 * 60 * breathsRate);
  const sleepDaysVal = Math.round(totalDays * sleepFraction);
  const mealsVal = Math.round(totalDays * mealsCount);
  const earthOrbitsVal = (totalDays / 365.256).toFixed(2);
  const moonOrbitsVal = (totalDays / 27.322).toFixed(1); // Lunar orbit period

  return {
    heartbeats: heartbeatsVal.toLocaleString(),
    breaths: breathsVal.toLocaleString(),
    sleepDays: sleepDaysVal.toLocaleString(),
    mealsEaten: mealsVal.toLocaleString(),
    earthOrbits: earthOrbitsVal,
    moonOrbits: moonOrbitsVal,
  };
}

/**
 * Compares ages of two people and returns breakdown.
 */
export function compareAges(
  personAName: string,
  dobA: Date,
  personBName: string,
  dobB: Date
): ComparisonResult {
  const timeA = dobA.getTime();
  const timeB = dobB.getTime();

  let olderPerson = '';
  let diffYears = 0;
  let diffMonths = 0;
  let diffDays = 0;
  const diffTotalDays = Math.abs(Math.floor((timeA - timeB) / (1000 * 60 * 60 * 24)));

  if (timeA === timeB) {
    olderPerson = 'Both are exactly the same age';
  } else if (timeA < timeB) {
    olderPerson = personAName || 'Person A';
    const ageBreakdown = calculateExactAge(dobA, dobB);
    diffYears = ageBreakdown.years;
    diffMonths = ageBreakdown.months;
    diffDays = ageBreakdown.days;
  } else {
    olderPerson = personBName || 'Person B';
    const ageBreakdown = calculateExactAge(dobB, dobA);
    diffYears = ageBreakdown.years;
    diffMonths = ageBreakdown.months;
    diffDays = ageBreakdown.days;
  }

  const ageA = calculateExactAge(dobA);
  const ageB = calculateExactAge(dobB);

  return {
    personAName,
    personBName,
    olderPerson,
    diffYears,
    diffMonths,
    diffDays,
    diffTotalDays,
    personAAge: ageA,
    personBAge: ageB,
  };
}
