/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, User, Clock } from 'lucide-react';
import { SavedCalculation } from '../types';

interface SavedDatesProps {
  savedDates: SavedCalculation[];
  onAddDate: (name: string, dob: string, timeOfBirth?: string) => void;
  onDeleteDate: (id: string) => void;
  onSelectDate: (dob: string, name: string) => void;
}

export default function SavedDates({
  savedDates,
  onAddDate,
  onDeleteDate,
  onSelectDate,
}: SavedDatesProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (!dob) {
      setError('Please select a birth date');
      return;
    }
    if (new Date(dob) > new Date()) {
      setError('Birth date cannot be in the future');
      return;
    }

    onAddDate(name.trim(), dob, time || undefined);
    setName('');
    setDob('');
    setTime('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Save New Birthday Form */}
      <div className="rounded-3xl shadow-soft border border-emerald-100 bg-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-16 -mt-16 opacity-40"></div>
        
        <div className="relative z-10 border-b border-slate-50 pb-5">
          <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-1 block">Milestone Archive Engine</span>
          <h3 className="font-display text-lg font-black text-slate-800 flex items-center gap-2">
            <Plus className="h-4.5 w-4.5 text-emerald-600" />
            <span>Save a Birthday / Milestone</span>
          </h3>
          <p className="mt-1 font-sans text-xs text-slate-400">
            Save names and origin dates to archive them in your local browser sandbox to access anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 relative z-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-0.5">
                Name / Label
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Grandma, Jack"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50/70 py-2.5 pl-9 pr-4 font-sans text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* DOB Date Input */}
            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-0.5">
                Birth Date
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="date"
                  max={todayStr}
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50/70 py-2.5 pl-9 pr-4 font-sans text-sm text-slate-800 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Approximate Birth Time (Optional) */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="block font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-0.5">
                Birth Time <span className="font-medium text-slate-300">(Optional)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Clock className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50/70 py-2.5 pl-9 pr-4 font-sans text-sm text-slate-800 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="font-sans text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              id="btn-save-event"
              className="w-full rounded-xl emerald-gradient px-6 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-emerald-150 transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
            >
              Add to Saved Dates
            </button>
          </div>
        </form>
      </div>

      {/* Saved Milestones Grid */}
      <div className="space-y-4">
        <h4 className="font-display text-sm font-bold text-slate-500 uppercase tracking-wider">
          Saved Anniversaries & Birthdays ({savedDates.length})
        </h4>

        {savedDates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 py-10 text-center bg-slate-50/50">
            <Calendar className="mx-auto h-8 w-8 text-slate-400/80 stroke-[1.5]" />
            <p className="mt-3 font-sans text-sm font-medium text-slate-500">Your milestones drawer is empty</p>
            <p className="mt-1 font-sans text-xs text-slate-450">Archive people and graduation times above for easy calculations.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {savedDates.map((item) => {
              const formattedDob = new Date(item.dob).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC' // standard display for Date inputs
              });

              return (
                <div
                  key={item.id}
                  className="group relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  <div 
                    onClick={() => onSelectDate(item.dob, item.name)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-display font-bold text-slate-800 py-0.5 group-hover:text-emerald-700 transition-colors text-sm sm:text-base">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 font-sans text-xs text-slate-550 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{formattedDob}</span>
                      {item.timeOfBirth && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {item.timeOfBirth}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDate(item.id)}
                    className="ml-3 rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100"
                    title="Delete Saved item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
