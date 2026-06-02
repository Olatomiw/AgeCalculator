/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const links = [
    { id: 'calculator', label: 'Calculator' },
    { id: 'comparison', label: 'Age Compare' },
    { id: 'saved', label: 'My Saved Dates' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Left Side Logo */}
        <div 
          onClick={() => setCurrentTab('calculator')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl emerald-gradient shadow-md shadow-emerald-200">
            <Calendar className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
              bebe<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-extrabold font-black">tolash</span>
            </span>
            <div className="font-sans text-[10px] uppercase tracking-widest text-emerald-600 font-semibold leading-none mt-0.5">
              Precision Engine
            </div>
          </div>
        </div>

        {/* Right Side Links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {links.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => setCurrentTab(link.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold font-sans transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
