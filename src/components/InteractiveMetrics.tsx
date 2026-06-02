/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Wind, Moon, Globe, Compass, Star, Calendar, Orbit } from 'lucide-react';
import { ZodiacInfo, FunStats, AgeResult } from '../types';

interface InteractiveMetricsProps {
  zodiac: ZodiacInfo;
  funStats: FunStats;
  ageResult: AgeResult;
  dobDate: Date;
}

export default function InteractiveMetrics({ zodiac, funStats, ageResult, dobDate }: InteractiveMetricsProps) {
  // Helper to count leap years between DOB and now
  const getLeapYearsCount = () => {
    let count = 0;
    const startYear = dobDate.getFullYear();
    const endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        count++;
      }
    }
    return count;
  };

  const leapYears = getLeapYearsCount();
  const decades = (ageResult.years / 10).toFixed(1);

  return (
    <div className="space-y-6">
      {/* High Density Section Header */}
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-display text-base font-bold text-slate-800">
          Precision Metrics Dashboard
        </h3>
        <p className="font-sans text-xs text-slate-500">
          A high-density representation of biological counts, cosmic orbits, and temporal calculations.
        </p>
      </div>

      {/* Bento Grid Styling */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Weeks Card - Core Theme Contrast */}
        <div className="bg-emerald-950 text-white p-5 rounded-2xl flex flex-col justify-between shadow-soft border border-emerald-900">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Total Lifespan Weeks</span>
              <span className="text-xs font-semibold px-2 py-0.5 roundedbg-emerald-900 bg-emerald-900/50 text-emerald-300">Metric 01</span>
            </div>
            <p className="text-3xl font-mono font-bold mt-4 tracking-tight">
              {ageResult.totalWeeks.toLocaleString()}
            </p>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-2 font-sans">
            Weeks elapsed since your origin milestone date.
          </p>
        </div>

        {/* Total Days Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Accumulative Days</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-500">Metric 02</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 mt-4 font-display">
              {ageResult.totalDays.toLocaleString()} <span className="text-xs text-slate-400 font-normal">days</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Total count of 24-hour cycles completed.
          </p>
        </div>

        {/* Next Birthday Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Anniversary Proximity</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Metric 03</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 mt-4 font-display">
              {ageResult.daysToNextBirthday} <span className="text-xs text-slate-400 font-normal">Days left</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Remaining days until next birthday event.
          </p>
        </div>

        {/* Dynamic Heartbeats Card - Emerald Accent Background */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Heartbeats (Estimate)</span>
              <span className="text-xs font-semibold text-rose-600 animate-pulse">❤️</span>
            </div>
            <p className="text-2xl font-bold text-emerald-950 mt-4 font-mono leading-none tracking-tight">
              ~{funStats.heartbeats}
            </p>
          </div>
          <p className="text-[11px] text-emerald-800/85 mt-2 font-sans">
            Estimated cycles calculated at average resting paces.
          </p>
        </div>

        {/* Zodiac Card (Col-Span-2 for balance) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-4 text-7xl font-bold opacity-[0.04] select-none text-emerald-990 font-display">
            {zodiac.symbol}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Astrological Alignment</span>
              <span className="text-xs font-semibold text-emerald-600">{zodiac.symbol} Western Sign</span>
            </div>
            <div className="flex justify-between items-baseline mt-4 border-b border-slate-50 pb-2">
              <span className="text-xl font-bold text-slate-800 font-display">{zodiac.sign}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">{zodiac.element} Element</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed italic mt-2.5">
              "{zodiac.traits}"
            </p>
          </div>
        </div>

        {/* Lunar Animal Card (Col-Span-2) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-4 text-6xl opacity-[0.03] select-none">
            🐉
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Lunar Zodiac & Element</span>
              <span className="text-xs font-semibold text-teal-600">Chinese Astro Cycle</span>
            </div>
            <div className="flex justify-between items-baseline mt-4 border-b border-slate-50 pb-2">
              <span className="text-xl font-bold text-slate-800 font-display">Year of the {zodiac.chineseAnimal}</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">{zodiac.chineseElement}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
              Your lunar year alignment governs energetic properties of {zodiac.chineseElement} under the zodiac sign of the {zodiac.chineseAnimal}.
            </p>
          </div>
        </div>

        {/* Leap Years Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Leap Years Lived</span>
              <span className="text-xs font-semibold text-emerald-600">29-Feb cycles</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 mt-4 font-display">
              {leapYears} <span className="text-xs text-slate-400 font-normal">cycles</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Total actual 366-day solar calendar years completed.
          </p>
        </div>

        {/* Decades Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Decades Completed</span>
              <span className="text-xs font-semibold text-emerald-600">Era metric</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 mt-4 font-display">
              {decades} <span className="text-xs text-slate-400 font-normal">decades</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Your generational age expressed in decimal units.
          </p>
        </div>

        {/* Cosmic Orbit Metrics */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-soft sm:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Planetary Orbits</span>
            </div>
            <div className="mt-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Earth around the Sun:</span>
                <span className="font-bold text-slate-800 font-mono">{funStats.earthOrbits} Laps</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Moon around the Earth:</span>
                <span className="font-bold text-slate-800 font-mono">{funStats.moonOrbits} Orbits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Breathing Metrics */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-soft sm:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-600">
              <Wind className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Atmospheric Tidal Footprint</span>
            </div>
            <div className="mt-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Oxygen Breaths:</span>
                <span className="font-bold text-slate-800 font-mono">~{funStats.breaths}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Approximate Meals Eaten:</span>
                <span className="font-bold text-slate-800 font-mono">~{funStats.mealsEaten}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
