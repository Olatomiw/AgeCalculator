/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthdayDate: Date;
  daysToNextBirthday: number;
  monthsToNextBirthday: number;
  nextBirthdayDayName: string;
  nextAge: number;
}

export interface ZodiacInfo {
  sign: string;
  symbol: string;
  element: string;
  traits: string;
  chineseAnimal: string;
  chineseElement: string;
}

export interface FunStats {
  heartbeats: string;
  breaths: string;
  sleepDays: string;
  mealsEaten: string;
  earthOrbits: string;
  moonOrbits: string;
}

export interface ComparisonResult {
  personAName: string;
  personBName: string;
  olderPerson: string;
  diffYears: number;
  diffMonths: number;
  diffDays: number;
  diffTotalDays: number;
  personAAge?: { years: number; months: number; days: number };
  personBAge?: { years: number; months: number; days: number };
}

export interface SavedCalculation {
  id: string;
  name: string;
  dob: string;
  timeOfBirth?: string;
  createdAt: string;
}
