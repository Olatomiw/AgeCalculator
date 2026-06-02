/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgeCalculatorCard from './components/AgeCalculatorCard';
import ComparisonCard from './components/ComparisonCard';
import SavedDates from './components/SavedDates';
import StressCompanion from './components/StressCompanion';
import { SavedCalculation } from './types';
import { Calendar, Users, Bookmark, Sparkles, Hourglass } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('calculator');
  const [savedDates, setSavedDates] = useState<SavedCalculation[]>([]);
  
  // States for pre-loading a selected saved date into the main calculator
  const [selectedDob, setSelectedDob] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');

  // Load saved dates on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aethel_calculator_saved_v1');
      if (stored) {
        setSavedDates(JSON.parse(stored));
      } else {
        // Hydrate with some default mock guidelines for friends & milestones
        const defaults: SavedCalculation[] = [
          {
            id: 'default-1',
            name: 'Ada Lovelace (First Programmer)',
            dob: '1815-12-10',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'default-2',
            name: 'Vostok 1 (First Human Spaceflight)',
            dob: '1961-04-12',
            createdAt: new Date().toISOString(),
          },
        ];
        setSavedDates(defaults);
        localStorage.setItem('aethel_calculator_saved_v1', JSON.stringify(defaults));
      }
    } catch (e) {
      console.error('Error hydrating localStorage saved dates:', e);
    }
  }, []);

  const handleAddDate = (name: string, dob: string, timeOfBirth?: string) => {
    const newItem: SavedCalculation = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      dob,
      timeOfBirth,
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...savedDates];
    setSavedDates(updated);
    localStorage.setItem('aethel_calculator_saved_v1', JSON.stringify(updated));
  };

  const handleDeleteDate = (id: string) => {
    const updated = savedDates.filter((item) => item.id !== id);
    setSavedDates(updated);
    localStorage.setItem('aethel_calculator_saved_v1', JSON.stringify(updated));
  };

  const handleSelectSavedDate = (dob: string, name: string) => {
    setSelectedDob(dob);
    setSelectedName(name);
    setCurrentTab('calculator');
    
    // Smooth scroll back to top of main card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Upper Navigation Rail */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Structural Layout Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        
        {/* Animated Banner Header */}
        {currentTab !== 'stress' && (
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm shadow-emerald-100/50 border border-emerald-150/40">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-500/10 animate-pulse" />
              <span>Premium Temporal Chronometer</span>
            </div>

            <h1 className="mt-3.5 font-display text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              bebetolash
            </h1>
            <p className="mt-3 max-w-lg mx-auto font-sans text-sm text-slate-500 leading-relaxed">
              Unveil complete biological summaries, next birth dates countdown ticker, astro alignment structures, and interactive statistics calculated entirely in your browser.
            </p>
          </div>
        )}

        {/* Dynamic Route View Switching */}
        <div className="grid gap-8">
          {currentTab === 'calculator' && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <AgeCalculatorCard 
                initialDob={selectedDob} 
                initialName={selectedName} 
              />
            </div>
          )}

          {currentTab === 'comparison' && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <ComparisonCard />
            </div>
          )}

          {currentTab === 'saved' && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <SavedDates
                savedDates={savedDates}
                onAddDate={handleAddDate}
                onDeleteDate={handleDeleteDate}
                onSelectDate={handleSelectSavedDate}
              />
            </div>
          )}

          {currentTab === 'stress' && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <StressCompanion />
            </div>
          )}
        </div>

        {/* Feature quick showcase boxes for visual premium aesthetic */}
        {currentTab === 'calculator' && !selectedDob && (
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            <div className="flex gap-3.5 rounded-xl border border-slate-100 bg-white/60 p-4.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-slate-800">Precision Math</h4>
                <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed">
                  Calculates years, months, days, lunar alignments and hours correctly handling leap cycles.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 rounded-xl border border-slate-100 bg-white/60 p-4.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-slate-800">Age Comparison</h4>
                <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed">
                  Input birth timings of siblings, partners, or historic dates to instantly check life overlap gaps.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 rounded-xl border border-slate-100 bg-white/60 p-4.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-slate-800">Local Bookmarks</h4>
                <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed">
                  Save household anniversaries directly onto the browser local engine. Secure and offline forever.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Shared Footer Bar */}
      <Footer />
    </div>
  );
}

