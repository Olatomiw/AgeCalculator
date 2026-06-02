/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, Heart, Shield, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white/80 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Trademark & Disclaimer */}
          <div className="text-center sm:text-left">
            <p className="font-display text-sm font-semibold text-slate-700">
              bebetolash Age Calculator
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 font-sans text-xs text-slate-500 sm:justify-start">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>All calculations are done locally in your browser. No data leaves your machine.</span>
            </p>
          </div>

          {/* Social placeholder and developer details */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs font-medium text-slate-400">Secure Locally Active</span>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            
            <p className="flex items-center gap-1 font-sans text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-emerald-500 text-emerald-500" />
              <span>&copy; {new Date().getFullYear()} bebetolash. All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
