/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, User, ArrowRightLeft, Users, ChevronRight } from 'lucide-react';
import { compareAges } from '../utils';
import { ComparisonResult } from '../types';

export default function ComparisonCard() {
  const [nameA, setNameA] = useState('');
  const [dobA, setDobA] = useState('');
  const [nameB, setNameB] = useState('');
  const [dobB, setDobB] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dobA || !dobB) {
      setError('Please select birth dates for both people');
      return;
    }

    setError('');
    const dateA = new Date(dobA);
    const dateB = new Date(dobB);

    const activeResult = compareAges(
      nameA.trim() || 'First Person',
      dateA,
      nameB.trim() || 'Second Person',
      dateB
    );

    setResult(activeResult);
  };

  const handleReset = () => {
    setNameA('');
    setDobA('');
    setNameB('');
    setDobB('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="rounded-3xl shadow-soft border border-emerald-100 bg-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-16 -mt-16 opacity-40"></div>
        
        <div className="relative z-10 border-b border-slate-50 pb-5">
          <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-1 block">Milestone Origins Compare</span>
          <h3 className="font-display text-lg font-black text-slate-800 flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-emerald-600" />
            <span>Compare Lifespan Metrics</span>
          </h3>
          <p className="mt-1 font-sans text-xs text-slate-400">
            Compare two individuals to outline birth sequence offsets, age discrepancies, and live milestones.
          </p>
        </div>

        <form onSubmit={handleCompare} className="mt-6 space-y-5 relative z-10">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Person A block */}
            <div className="space-y-4 rounded-2xl bg-gray-50/50 p-5 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">First Person</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Rachel"
                      value={nameA}
                      onChange={(e) => {
                        setNameA(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-slate-850 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Birth Date</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type="date"
                      max={todayStr}
                      value={dobA}
                      onChange={(e) => {
                        setDobA(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-slate-850 transition-colors focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Person B block */}
            <div className="space-y-4 rounded-2xl bg-gray-50/50 p-5 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-teal-700">Second Person</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Michael"
                      value={nameB}
                      onChange={(e) => {
                        setNameB(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-slate-850 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Birth Date</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type="date"
                      max={todayStr}
                      value={dobB}
                      onChange={(e) => {
                        setDobB(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-slate-850 transition-colors focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="font-sans text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-2">
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 px-5 py-3 font-sans text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
              >
                Clear Fields
              </button>
            )}
            <button
              type="submit"
              id="btn-trigger-compare"
              className="flex items-center justify-center gap-2 rounded-xl emerald-gradient px-6 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-emerald-150 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>Compare Lifetime Gap</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Results Card */}
      {result && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft sm:p-8 space-y-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center pb-5 border-b border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none block mb-1">
              Lifespan Discrepancy Matrix
            </span>
            
            {result.olderPerson === 'Both are exactly the same age' ? (
              <div className="font-display text-lg font-black text-slate-850 mt-2">
                They are the exact same age!
              </div>
            ) : (
              <>
                <div className="font-display text-xl sm:text-2xl font-black text-emerald-950 mt-2.5">
                  <span className="text-emerald-700 font-extrabold">{result.olderPerson}</span> is older
                </div>
                
                <p className="font-sans text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                  There is an exact birth sequence gap of{' '}
                  <strong className="text-slate-800 font-bold">
                    {result.diffYears} {result.diffYears === 1 ? 'year' : 'years'},{' '}
                    {result.diffMonths} {result.diffMonths === 1 ? 'month' : 'months'},{' '}
                    and {result.diffDays} {result.diffDays === 1 ? 'day' : 'days'}
                  </strong>.
                </p>
                <div className="font-mono text-xs text-emerald-800 font-semibold mt-3 bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block border border-emerald-100/50">
                  Total discrepancy: {result.diffTotalDays.toLocaleString()} Days Lived
                </div>
              </>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Person A Age Breakdown */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
              <h5 className="font-display text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>{result.personAName}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Timeline</span>
              </h5>
              <div className="mt-4 space-y-2.5">
                {result.personAAge ? (
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="text-slate-500">Exact Chronological Age:</span>
                    <strong className="font-bold text-emerald-800">
                      {result.personAAge.years}y {result.personAAge.months}m {result.personAAge.days}d
                    </strong>
                  </div>
                ) : null}
                <div className="flex items-center justify-between font-sans text-xs">
                  <span className="text-slate-500">Origin Birthdate:</span>
                  <span className="font-mono font-bold text-slate-600">
                    {new Date(dobA).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Person B Age Breakdown */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
              <h5 className="font-display text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>{result.personBName}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400">Timeline</span>
              </h5>
              <div className="mt-4 space-y-2.5">
                {result.personBAge ? (
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="text-slate-500">Exact Chronological Age:</span>
                    <strong className="font-bold text-teal-800">
                      {result.personBAge.years}y {result.personBAge.months}m {result.personBAge.days}d
                    </strong>
                  </div>
                ) : null}
                <div className="flex items-center justify-between font-sans text-xs">
                  <span className="text-slate-500">Origin Birthdate:</span>
                  <span className="font-mono font-bold text-slate-600">
                    {new Date(dobB).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
