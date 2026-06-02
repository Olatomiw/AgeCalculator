/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Sparkles, RefreshCw, Milestone, Flame, TrendingUp, HelpCircle } from 'lucide-react';
import { getFullAgeStats, getZodiacInfo, getFunStats } from '../utils';
import { AgeResult, ZodiacInfo, FunStats } from '../types';
import InteractiveMetrics from './InteractiveMetrics';

interface AgeCalculatorCardProps {
  initialDob?: string;
  initialName?: string;
}

export default function AgeCalculatorCard({ initialDob, initialName }: AgeCalculatorCardProps) {
  const [dob, setDob] = useState(initialDob || '');
  const [time, setTime] = useState('');
  const [name, setName] = useState(initialName || '');

  const [stats, setStats] = useState<AgeResult | null>(null);
  const [zodiac, setZodiac] = useState<ZodiacInfo | null>(null);
  const [funStats, setFunStats] = useState<FunStats | null>(null);

  const [error, setError] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialDob) {
      setDob(initialDob);
    }
    if (initialName) {
      setName(initialName);
    }
  }, [initialDob, initialName]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) {
      setError('Please select or type your Date of Birth.');
      return;
    }

    const birthDate = new Date(dob);
    if (birthDate > new Date()) {
      setError('Birth date cannot be in the future.');
      return;
    }

    setError('');
    const calculations = getFullAgeStats(birthDate);
    setStats(calculations);

    const zodiacs = getZodiacInfo(birthDate);
    setZodiac(zodiacs);

    const extraStats = getFunStats(birthDate);
    setFunStats(extraStats);

    // Stop former live timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up a dynamic visual precision ticker
    const totalSecs = calculations.totalSeconds;
    setLiveSeconds(totalSecs);
    setIsLiveActive(true);

    const birthTimeMs = birthDate.getTime();
    intervalRef.current = setInterval(() => {
      const nowMs = new Date().getTime();
      const currentDurationSecs = Math.floor((nowMs - birthTimeMs) / 1000);
      setLiveSeconds(currentDurationSecs);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const clearCard = () => {
    setDob('');
    setTime('');
    setName('');
    setStats(null);
    setZodiac(null);
    setFunStats(null);
    setIsLiveActive(false);
    setError('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const hasResults = stats && zodiac && funStats;

  return (
    <div className="space-y-8">
      {/* Input Module Form */}
      <div className="rounded-3xl shadow-soft border border-emerald-100 bg-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-16 -mt-16 opacity-40"></div>
        
        <div className="relative z-10 flex items-center justify-between border-b border-slate-50 pb-5">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-1">Precision Age Metrics</span>
            <h2 className="font-display text-lg font-black text-slate-800">
              Calculate Exact Local Age
            </h2>
          </div>
          {hasResults && (
            <button
              onClick={clearCard}
              className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 font-sans text-xs font-semibold text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Calculator</span>
            </button>
          )}
        </div>

        <form onSubmit={handleCalculate} className="mt-6 space-y-5 relative z-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Optional Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-0.5">
                Whose age is this? <span className="font-medium text-slate-300">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Enter display name (e.g., Yourself, Mom, Jack)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-gray-50/70 px-4 py-3 font-sans text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* DOB Picker */}
            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-0.5">
                Date of Birth
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </span>
                <input
                  type="date"
                  max={todayStr}
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50/70 py-3 pl-10 pr-4 font-sans text-sm text-slate-800 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Time of Birth - design bonus */}
            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-0.5">
                Time of Birth <span className="font-medium text-slate-300">(Optional)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50/70 py-3 pl-10 pr-4 font-sans text-sm text-slate-850 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="font-sans text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              id="btn-calculate"
              className="w-full rounded-xl emerald-gradient px-6 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-emerald-150 transition-all hover:opacity-90 active:scale-[0.99]"
            >
              Calculate Age
            </button>
          </div>
        </form>

        {/* Main Result Display - Styled strictly after the theme aesthetic */}
        {hasResults && (
          <div className="mt-8 pt-8 border-t border-emerald-100/60 relative z-10">
            <div className="text-center">
              <p className="text-emerald-600 font-semibold mb-2.5 font-sans text-xs uppercase tracking-wider">
                {name ? `${name} has been on Earth for` : 'You have been on Earth for'}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tight leading-normal font-sans">
                {stats.years} <span className="text-lg sm:text-2.5xl font-light text-slate-400 italic">Years</span>,{' '}
                {stats.months} <span className="text-lg sm:text-2.5xl font-light text-slate-400 italic">Months</span>,{' '}
                <span className="text-slate-300 font-light">&</span> {stats.days} <span className="text-lg sm:text-2.5xl font-light text-slate-400 italic">Days</span>
              </h1>
            </div>

            {/* Dynamic Seconds Alive Counter */}
            <div className="mt-6 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl py-3 border border-slate-100/50">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">Dynamic temporal marker (seconds)</span>
              <div className="font-mono text-base font-bold text-slate-700 tracking-tight flex items-center gap-1">
                <span>{liveSeconds.toLocaleString()}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasResults && (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
          {/* Main Visual Display Modules */}
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-12">
            
            {/* Elegant Breakdown Card */}
            <div className="md:col-span-7 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                      Standard Segment Breakdown
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-150/40 bg-slate-50/10 p-3 text-center">
                    <div className="font-display text-2.5xl font-black text-emerald-800">{stats.years}</div>
                    <p className="font-sans text-[10px] uppercase font-bold text-slate-400 tracking-widest">Years</p>
                  </div>
                  <div className="rounded-xl border border-slate-150/40 bg-slate-50/10 p-3 text-center">
                    <div className="font-display text-2.5xl font-black text-emerald-800">{stats.months}</div>
                    <p className="font-sans text-[10px] uppercase font-bold text-slate-400 tracking-widest">Months</p>
                  </div>
                  <div className="rounded-xl border border-slate-150/40 bg-slate-50/10 p-3 text-center">
                    <div className="font-display text-2.5xl font-black text-emerald-800">{stats.days}</div>
                    <p className="font-sans text-[10px] uppercase font-bold text-slate-400 tracking-widest">Days</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-[11px] text-slate-400 font-sans text-center border-t border-slate-50 pt-3">
                Calculations locally compiled utilizing exact leap counts.
              </div>
            </div>

            {/* Right Box: Next Birthday & Days Countdown */}
            <div className="md:col-span-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-5 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Flame className="h-4.5 w-4.5 stroke-[2] text-emerald-300" />
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-white/80">
                    Next Anniversary Proximity
                  </span>
                </div>

                <div className="mt-4 text-center sm:text-left">
                  <div className="font-sans text-xs text-white/70 font-medium">
                    Countdown to your <strong className="text-emerald-300 font-bold">#{stats.nextAge}</strong> birthday:
                  </div>

                  <div className="mt-2.5 font-display text-3xl font-black tracking-tight flex items-baseline justify-center sm:justify-start gap-1">
                    <span>{stats.daysToNextBirthday}</span>
                    <span className="text-xs font-bold text-white/70 uppercase">Days Left</span>
                  </div>

                  <div className="font-sans text-[10px] text-white/60 mt-1 italic">
                    approximately {stats.monthsToNextBirthday} {stats.monthsToNextBirthday === 1 ? 'month' : 'months'} path.
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between font-sans text-xs text-white/80">
                <div className="flex items-center gap-1.5">
                  <Milestone className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Falls on a:</span>
                </div>
                <strong className="text-emerald-300 bg-white/10 rounded-md px-2 py-0.5 uppercase tracking-wide text-[10px]">
                  {stats.nextBirthdayDayName}
                </strong>
              </div>
            </div>

          </div>

          {/* High-density bento grid alignment metrics */}
          <InteractiveMetrics zodiac={zodiac} funStats={funStats} ageResult={stats} dobDate={new Date(dob)} />
        </div>
      )}
    </div>
  );
}
