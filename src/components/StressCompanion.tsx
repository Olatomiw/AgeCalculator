import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Activity, 
  Sparkles, 
  Trash2, 
  Plus, 
  Heart, 
  Info, 
  X, 
  Shield, 
  Smile, 
  Brain, 
  RefreshCw,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';

// Intersecting TypeScript structures for log entries
interface RecoveryLog {
  id: string;
  type: string;
  stamp: string;
  meta: string;
  color: string;
  colorText: string;
  metric: string;
}

export default function StressCompanion() {
  const [activeTab, setActiveTab] = useState<'home' | 'assessment' | 'tools' | 'about'>('home');
  const [logs, setLogs] = useState<RecoveryLog[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  // Mood check-in state
  const [selectedMood, setSelectedMood] = useState<string>('😌 Grounded');
  const [journalInput, setJournalInput] = useState<string>('');

  // Questionnaire state
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({});
  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(false);
  const [surveyResult, setSurveyResult] = useState<{
    score: number;
    category: string;
    description: string;
    tips: string[];
    colorBg: string;
    colorText: string;
  } | null>(null);

  // Breathing trainer engines
  const [isBreathing, setIsBreathing] = useState<boolean>(false);
  const [breathPhaseIndex, setBreathPhaseIndex] = useState<number>(0); // 0: Inhale, 1: Hold (Full), 2: Exhale, 3: Hold (Empty)
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load logs on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('bebetolash_session_v1');
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        const initialLogs: RecoveryLog[] = [
          {
            id: 'init-1',
            type: 'Breathing practice',
            stamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            meta: '3 Completed rounds of box breathing',
            color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            colorText: '#0E622F',
            metric: '3 Rounds'
          }
        ];
        setLogs(initialLogs);
        sessionStorage.setItem('bebetolash_session_v1', JSON.stringify(initialLogs));
      }
    } catch (e) {
      console.error('SessionStorage unavailable, operating in pure state', e);
    }
  }, []);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Save logs helper
  const updateAndSaveLogs = (updated: RecoveryLog[]) => {
    setLogs(updated);
    try {
      sessionStorage.setItem('bebetolash_session_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Mood Cabin Log addition
  const handleAddJournalNote = () => {
    const trimmed = journalInput.trim();
    if (!trimmed) {
      triggerToast("Please write down a few thoughts to preserve.");
      return;
    }

    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: RecoveryLog = {
      id: `note-${Date.now()}`,
      type: 'Personal Mental Note',
      stamp,
      meta: `Reflected: "${trimmed}"`,
      color: 'bg-violet-50 text-violet-800 border-violet-100',
      colorText: '#4A265E',
      metric: selectedMood
    };

    const nextLogs = [newLog, ...logs];
    updateAndSaveLogs(nextLogs);
    setJournalInput('');
    triggerToast("Mental note archived safely.");
  };

  // Clear a recovery log
  const handleDeleteLog = (id: string) => {
    const nextLogs = logs.filter(log => log.id !== id);
    updateAndSaveLogs(nextLogs);
    triggerToast("Record cleared successfully.");
  };

  // Questionnaire logic
  const handleSurveyOptionCheck = (qKey: string, score: number) => {
    setSurveyAnswers(prev => ({ ...prev, [qKey]: score }));
  };

  const surveyProgressCount = Object.keys(surveyAnswers).length;

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (surveyProgressCount < 5) return;

    const totalScore = (Object.values(surveyAnswers) as number[]).reduce((acc: number, cr: number) => acc + cr, 0);
    
    let category = '';
    let description = '';
    let tips: string[] = [];
    let colorBg = '';
    let colorText = '';

    if (totalScore <= 9) {
      category = 'Low Stress Resilient State';
      description = 'Excellent! You are maintaining an exceptionally healthy and resilient equilibrium. All physiological indicators point to stable and managed stress levels.';
      tips = [
        'Maintain your nourishing sleep schedule with at least 7-8 hours of sleep.',
        'Take 4 cycles of guided box breathing daily to protect your active resilience.',
        'Preserve your physical boundaries and practice a weekly digital detox.'
      ];
      colorBg = 'bg-emerald-50 border-emerald-100';
      colorText = 'text-emerald-800';
    } else if (totalScore <= 15) {
      category = 'Moderate Tension Alert';
      description = 'Take a deep breath. You are currently carrying moderate neurological demand, and your nervous system is signaling a need for caring rebalance.';
      tips = [
        'Set scheduled desk breaks to rise and fully roll your neck and shoulders.',
        'Close your eyes and complete 5 minutes of symmetric box breathing to trigger vagal cooling.',
        'Disconnect all smart screens at least 45 minutes before going to bed.'
      ];
      colorBg = 'bg-amber-50 border-amber-100';
      colorText = 'text-amber-800';
    } else {
      category = 'High Sustained Stress Alert';
      description = 'Your body and mind are indicating high stress loads. Treat your thoughts with utmost patience and extreme kindness. It is a vital time to scale back non-essential tasks.';
      tips = [
        'Disconnect from work notifications or stressful media channels for 30 minutes.',
        'Commit to a structured box-breathing cycle each morning and evening.',
        'Share your pressure load with an empathetic, trusted classmate, family member, or counsellor.'
      ];
      colorBg = 'bg-rose-50 border-rose-100';
      colorText = 'text-rose-800';
    }

    const result = { score: totalScore, category, description, tips, colorBg, colorText };
    setSurveyResult(result);
    setSurveyCompleted(true);

    // Auto log to session list
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const surveyLog: RecoveryLog = {
      id: `survey-${Date.now()}`,
      type: 'Stress Assessment Completed',
      stamp,
      meta: `Overall score: ${totalScore}/20 (${totalScore <= 9 ? 'Low' : totalScore <= 15 ? 'Moderate' : 'High'})`,
      color: result.colorBg + ' ' + result.colorText,
      colorText: totalScore <= 9 ? '#0E622F' : totalScore <= 15 ? '#856404' : '#A8201A',
      metric: `${totalScore} Score`
    };

    updateAndSaveLogs([surveyLog, ...logs]);
    triggerToast("Assessment logged and archived.");
  };

  const handleResetSurvey = () => {
    setSurveyAnswers({});
    setSurveyCompleted(false);
    setSurveyResult(null);
  };

  // Box Breathing Trainer Engine
  const phases = [
    { title: 'INHALE', text: 'Slowly breathe in, swelling with calm air', scale: 1.2, bgClass: 'bg-violet-600' },
    { title: 'RETAIN', text: 'Suspend the breath in absolute stillness', scale: 1.2, bgClass: 'bg-violet-700' },
    { title: 'EXHALE', text: 'Slowly release, pushing out deep muscle tension', scale: 0.6, bgClass: 'bg-indigo-600' },
    { title: 'RETAIN EMPTY', text: 'Rest empty in complete muscle quietude', scale: 0.6, bgClass: 'bg-indigo-850' }
  ];

  // Tick monitor
  useEffect(() => {
    if (isBreathing) {
      breathingIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // State change triggers next phase
            setBreathPhaseIndex(idx => {
              const nextIdx = (idx + 1) % 4;
              if (nextIdx === 0) {
                // Completed one complete square cycle (16 seconds total)
                setCyclesCompleted(c => {
                  const updatedC = c + 1;
                  // Append to logs periodically if they are breathing actively
                  if (updatedC > 0 && updatedC % 2 === 0) {
                    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setLogs(currLogs => {
                      const filtered = currLogs.filter(log => !log.id.startsWith('breathing-current-'));
                      const trainingLog: RecoveryLog = {
                        id: `breathing-current-${Date.now()}`,
                        type: 'Box Breathing Workout',
                        stamp,
                        meta: `Completed ${updatedC} continuous cycles peacefully.`,
                        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        colorText: '#2E7D32',
                        metric: `${updatedC} Cycles`
                      };
                      const finalLogs = [trainingLog, ...filtered];
                      sessionStorage.setItem('bebetolash_session_v1', JSON.stringify(finalLogs));
                      return finalLogs;
                    });
                  }
                  return updatedC;
                });
              }
              return nextIdx;
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    }

    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, [isBreathing]);

  const handleToggleBreathing = () => {
    setIsBreathing(curr => !curr);
  };

  const handleResetBreathing = () => {
    setIsBreathing(false);
    setBreathPhaseIndex(0);
    setSecondsLeft(4);
    setElapsedSeconds(0);
    setCyclesCompleted(0);
  };

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-violet-100 shadow-soft overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-violet-950 text-violet-50 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-violet-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-300 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internal Navigation Ribbon */}
      <div className="flex border-b border-slate-100 overflow-x-auto bg-violet-50/20">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-4 px-3 text-center font-sans font-bold text-xs sm:text-sm tracking-tight border-b-2 transition-all min-w-[80px] ${
            activeTab === 'home' 
              ? 'border-violet-600 text-violet-900 bg-white shadow-sm' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-violet-50/10'
          }`}
        >
          Overview Cabin
        </button>
        <button 
          onClick={() => setActiveTab('assessment')}
          className={`flex-1 py-4 px-3 text-center font-sans font-bold text-xs sm:text-sm tracking-tight border-b-2 transition-all min-w-[80px] ${
            activeTab === 'assessment' 
              ? 'border-violet-600 text-violet-900 bg-white shadow-sm' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-violet-50/10'
          }`}
        >
          Stress Assessment
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-4 px-3 text-center font-sans font-bold text-xs sm:text-sm tracking-tight border-b-2 transition-all min-w-[80px] ${
            activeTab === 'tools' 
              ? 'border-violet-600 text-violet-900 bg-white shadow-sm' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-violet-50/10'
          }`}
        >
          Box Breathing Guide
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-4 px-3 text-center font-sans font-bold text-xs sm:text-sm tracking-tight border-b-2 transition-all min-w-[80px] ${
            activeTab === 'about' 
              ? 'border-violet-600 text-violet-900 bg-white shadow-sm' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-violet-50/10'
          }`}
        >
          Science & Habits
        </button>
      </div>

      {/* Pane Content Window */}
      <div className="p-6 sm:p-10">
        
        {/* ================= TAB: HOME / OVERVIEW ================= */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-5 items-center bg-gradient-to-br from-violet-50/40 via-indigo-50/20 to-white p-6 rounded-2xl border border-violet-100/60">
              <div className="md:col-span-3 space-y-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 uppercase tracking-wider">
                  Premium Calm System
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-violet-950 tracking-tight leading-none">
                  A Gentle Space for Your Calm
                </h1>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Discover balance, assess daily mental load, and train your nervous system with clinical box-breathing. Entirely offline and client-side to protect your complete privacy.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button 
                    onClick={() => setActiveTab('assessment')}
                    className="bg-violet-600 text-white rounded-xl px-4 py-2 font-sans font-semibold text-xs transition-colors hover:bg-violet-700 shadow-sm"
                  >
                    Take Assessment
                  </button>
                  <button 
                    onClick={() => setActiveTab('tools')}
                    className="bg-violet-50 text-violet-700 rounded-xl px-4 py-2 font-sans font-semibold text-xs transition-colors hover:bg-violet-100"
                  >
                    Breathe Now
                  </button>
                </div>
              </div>
              <div className="hidden md:block md:col-span-2">
                <svg viewBox="0 0 200 120" fill="none" className="w-full h-auto opacity-90">
                  <circle cx="100" cy="60" r="30" fill="url(#sun-grad)" opacity="0.8" />
                  <g stroke="#6E448A" strokeWidth="1" opacity="0.6" transform="translate(85,45) scale(0.7)">
                    <path d="M20 30 C 5 15, 5 5, 20 0 C 35 5, 35 15, 20 30 Z" fill="#FFFFFF" />
                    <path d="M20 30 C 0 20, -5 10, 5 5 C 15 1, 20 10, 20 30 Z" fill="#FFFFFF" />
                  </g>
                  <defs>
                    <linearGradient id="sun-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#FAF5FD" />
                      <stop offset="100%" stop-color="#EADFF0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Side: Recovery Logs */}
              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-extrabold text-violet-950 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-4">
                    <Activity className="h-4.5 w-4.5 text-violet-600" />
                    My Recovery Logs
                  </h3>
                  
                  <div className="space-y-3 max-h-[195px] overflow-y-auto pr-1">
                    {logs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-8">
                        Your calm workspace is empty. Complete a stress questionnaire or a box-breathing cycle to document your session records here.
                      </p>
                    ) : (
                      logs.map(log => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-xs transition-shadow hover:shadow-sm">
                          <div className="flex flex-col gap-0.5 max-w-[70%]">
                            <span className="font-sans text-xs font-bold text-violet-950 leading-tight">
                              {log.type}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 leading-none">
                              {log.stamp} • {log.meta}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                              log.color.includes('bg-') ? log.color : 'bg-violet-100 text-violet-800'
                            }`}>
                              {log.metric}
                            </span>
                            <button 
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-50 transition-colors"
                              aria-label="Delete log entry"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Mood Cabin Input */}
              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-extrabold text-violet-950 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-4">
                    <Smile className="h-4.5 w-4.5 text-violet-600" />
                    Mood Cabin check-in
                  </h3>
                  
                  <p className="font-sans text-xs text-slate-500 mb-4 leading-relaxed">
                    Preserve a reflection slice of your immediate mental atmosphere.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4.5">
                    {['😌 Grounded', '😊 Joyful', '😐 Mindful', '😞 Weary', '😫 Loaded'].map(mood => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all shadow-xs ${
                          selectedMood === mood 
                            ? 'bg-violet-600 text-white border-violet-600 border' 
                            : 'bg-white text-slate-600 border border-slate-150 hover:bg-slate-50'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="text"
                      value={journalInput}
                      onChange={(e) => setJournalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddJournalNote()}
                      placeholder="My thoughts in this moment..."
                      className="flex-1 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-sans text-slate-800 shadow-xs focus:border-violet-400 focus:outline-none"
                    />
                    <button 
                      onClick={handleAddJournalNote}
                      className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 font-semibold text-xs font-sans transition-colors shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: ASSESSMENT ================= */}
        {activeTab === 'assessment' && (
          <div className="max-w-2xl mx-auto">
            {!surveyCompleted ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-violet-950">
                    Stress Assessment Questionnaire
                  </h2>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed mt-1">
                    An honest 5-question micro-scale evaluating Sleep, Stiffness, Stillness, Focus, and Sensitivity.
                  </p>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5">
                  <div className="w-full bg-violet-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <motion.div 
                      className="bg-violet-600 h-full"
                      animate={{ width: `${(surveyProgressCount / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="font-sans text-xs font-semibold text-violet-700">
                    Progress: {surveyProgressCount} of 5 completed.
                  </p>
                </div>

                <form onSubmit={handleSurveySubmit} className="space-y-8 divide-y divide-slate-100">
                  {/* Q1 */}
                  <div className="space-y-3.5 pt-4 first:pt-0">
                    <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold flex items-center justify-center border border-violet-100 shrink-0">1</span>
                      Sleep quality
                    </h3>
                    <p className="font-sans text-xs text-slate-500">
                      How would you index the quality of your sleep over the past few nights?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { label: 'Deeply restful & refreshing sleep', value: 1 },
                        { label: 'Satisfactory, but minor grogginess', value: 2 },
                        { label: 'Tossed & turned, waking up tired', value: 3 },
                        { label: 'Very fitful sleep, insomnia cycles', value: 4 }
                      ].map(opt => (
                        <label 
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:bg-violet-50/10 ${
                            surveyAnswers.q1 === opt.value 
                              ? 'border-violet-600 bg-violet-50/10 shadow-xs' 
                              : 'border-slate-150/80'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="q1" 
                            checked={surveyAnswers.q1 === opt.value}
                            onChange={() => handleSurveyOptionCheck('q1', opt.value)}
                            className="text-violet-600 focus:ring-violet-500 h-4 w-4"
                          />
                          <span className="font-sans text-xs text-slate-700 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="space-y-3.5 pt-6">
                    <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold flex items-center justify-center border border-violet-100 shrink-0">2</span>
                      Muscular and physical tension
                    </h3>
                    <p className="font-sans text-xs text-slate-500">
                      Do you have frequent tight neck muscles, clenched jaw, or chronic tension headaches?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { label: 'My body feels relaxed and loose', value: 1 },
                        { label: 'Occasional minor shoulder stiffness', value: 2 },
                        { label: 'Frequent neck aches or tight back', value: 3 },
                        { label: 'Severe sustained tension, clenching', value: 4 }
                      ].map(opt => (
                        <label 
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:bg-violet-50/10 ${
                            surveyAnswers.q2 === opt.value 
                              ? 'border-violet-600 bg-violet-50/10 shadow-xs' 
                              : 'border-slate-150/80'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="q2" 
                            checked={surveyAnswers.q2 === opt.value}
                            onChange={() => handleSurveyOptionCheck('q2', opt.value)}
                            className="text-violet-600 focus:ring-violet-500 h-4 w-4"
                          />
                          <span className="font-sans text-xs text-slate-700 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="space-y-3.5 pt-6">
                    <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold flex items-center justify-center border border-violet-100 shrink-0">3</span>
                      Finding inner stillness
                    </h3>
                    <p className="font-sans text-xs text-slate-500">
                      How easily can you tap into a state of inner calm when sudden stressful worries arise?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { label: 'Effortlessly; I remain anchored', value: 1 },
                        { label: 'Takes some mental work, but I recover', value: 2 },
                        { label: 'Difficult; worrisome loops persist', value: 3 },
                        { label: 'Extremely hard; worry easily overlaps', value: 4 }
                      ].map(opt => (
                        <label 
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:bg-violet-50/10 ${
                            surveyAnswers.q3 === opt.value 
                              ? 'border-violet-600 bg-violet-50/10 shadow-xs' 
                              : 'border-slate-150/80'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="q3" 
                            checked={surveyAnswers.q3 === opt.value}
                            onChange={() => handleSurveyOptionCheck('q3', opt.value)}
                            className="text-violet-600 focus:ring-violet-500 h-4 w-4"
                          />
                          <span className="font-sans text-xs text-slate-700 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="space-y-3.5 pt-6">
                    <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold flex items-center justify-center border border-violet-100 shrink-0">4</span>
                      Focus and mental clarity
                    </h3>
                    <p className="font-sans text-xs text-slate-500">
                      How would you describe your mental concentration and cognitive focus today?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { label: 'Sharp, clear, and easy concentration', value: 1 },
                        { label: 'Mildly scattered, but managing well', value: 2 },
                        { label: 'Hard to maintain focus for long', value: 3 },
                        { label: 'Deep brain fog, totally disorganized', value: 4 }
                      ].map(opt => (
                        <label 
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:bg-violet-50/10 ${
                            surveyAnswers.q4 === opt.value 
                              ? 'border-violet-600 bg-violet-50/10 shadow-xs' 
                              : 'border-slate-150/80'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="q4" 
                            checked={surveyAnswers.q4 === opt.value}
                            onChange={() => handleSurveyOptionCheck('q4', opt.value)}
                            className="text-violet-600 focus:ring-violet-500 h-4 w-4"
                          />
                          <span className="font-sans text-xs text-slate-700 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q5 */}
                  <div className="space-y-3.5 pt-6">
                    <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold flex items-center justify-center border border-violet-100 shrink-0">5</span>
                      Emotional sensitivity
                    </h3>
                    <p className="font-sans text-xs text-slate-500">
                      How rapidly do you react emotionally to abrupt interruptions or daily irritations?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { label: 'Highly patient, adaptive, and quiet', value: 1 },
                        { label: 'Normal irritability, easily dismissed', value: 2 },
                        { label: 'Quickly frustrated, carrying lingering heat', value: 3 },
                        { label: 'Slightly reactive, near raw breakdown margins', value: 4 }
                      ].map(opt => (
                        <label 
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:bg-violet-50/10 ${
                            surveyAnswers.q5 === opt.value 
                              ? 'border-violet-600 bg-violet-50/10 shadow-xs' 
                              : 'border-slate-150/80'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="q5" 
                            checked={surveyAnswers.q5 === opt.value}
                            onChange={() => handleSurveyOptionCheck('q5', opt.value)}
                            className="text-violet-600 focus:ring-violet-500 h-4 w-4"
                          />
                          <span className="font-sans text-xs text-slate-700 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </form>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSurveySubmit}
                    disabled={surveyProgressCount < 5}
                    className={`rounded-xl px-5 py-3 font-semibold text-xs sm:text-sm font-sans tracking-tight transition-all shadow-md ${
                      surveyProgressCount === 5 
                        ? 'bg-violet-600 hover:bg-violet-700 text-white cursor-pointer' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    View Calming Action Plan
                  </button>
                </div>
              </div>
            ) : (
              surveyResult && (
                <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                  <div>
                    <h2 className="font-display text-xl font-extrabold text-violet-950">
                      Primary Assessment Results
                    </h2>
                    <p className="font-sans text-xs text-slate-500">
                      Personalized biological response strategy matched to your current neurological state.
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border ${surveyResult.colorBg} flex flex-col gap-4 shadow-sm`}>
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider opacity-90 block">
                        Index Level Category
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-black tracking-tight mt-1">
                        {surveyResult.category}
                      </h3>
                      <div className="font-mono text-3xl font-extrabold mt-2">
                        {surveyResult.score} <span className="text-sm font-sans font-medium tracking-normal opacity-80">/ 20</span>
                      </div>
                    </div>
                    <p className="font-sans text-xs sm:text-sm leading-relaxed font-medium">
                      {surveyResult.description}
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-display text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award className="h-4 w-4 text-violet-600" />
                      Coping Strategy Action Plan
                    </h3>
                    
                    <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-600">
                      {surveyResult.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="flex gap-2.5 items-start">
                          <span className="h-4.5 w-4.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-violet-200">
                            {tIdx + 1}
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={handleResetSurvey}
                      className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-xl px-4 py-2 text-xs font-semibold font-sans transition-colors"
                    >
                      Retake Audit Survey
                    </button>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="bg-violet-600 text-white hover:bg-violet-700 rounded-xl px-5 py-2.5 text-xs font-semibold font-sans transition-colors shadow-sm"
                    >
                      Decompress with Box Breathing
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ================= TAB: TOOLS / BREATHING ================= */}
        {activeTab === 'tools' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="font-display text-xl font-extrabold text-violet-950">
                Interactive Guided Box-Breathing
              </h2>
              <p className="font-sans text-xs text-slate-500">
                Synchronize your breath to balance the autonomic scale toward restful calm.
              </p>
            </div>

            {/* Symmetrical Square Breathing Box representation */}
            <div className="flex flex-col items-center py-6">
              <div className="relative w-64 h-64 border-2 border-dashed border-violet-100 rounded-2xl flex items-center justify-center bg-white shadow-soft">
                
                {/* 4 Square borders representing the 16s cycle */}
                {/* 1. TOP border (Inhale) */}
                <div className={`absolute top-0 left-0 h-1.5 rounded-t-2xl transition-all duration-300 ${
                  isBreathing && breathPhaseIndex === 0 
                    ? 'w-full bg-violet-600 shadow-md shadow-violet-400' 
                    : 'w-full bg-slate-100'
                }`}>
                  <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-2 py-0.5 rounded border tracking-widest ${
                    isBreathing && breathPhaseIndex === 0 
                      ? 'bg-violet-600 text-white border-violet-600' 
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}>
                    1. INHALE
                  </span>
                </div>

                {/* 2. RIGHT border (Retain) */}
                <div className={`absolute top-0 right-0 w-1.5 transition-all duration-300 ${
                  isBreathing && breathPhaseIndex === 1 
                    ? 'h-full bg-indigo-600 shadow-md shadow-indigo-400' 
                    : 'h-full bg-slate-100'
                }`}>
                  <span className={`absolute top-1/2 left-3 -translate-y-1/2 rotate-90 text-[9px] font-extrabold px-2 py-0.5 rounded border tracking-widest ${
                    isBreathing && breathPhaseIndex === 1 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}>
                    2. HOLD
                  </span>
                </div>

                {/* 3. BOTTOM border (Exhale) */}
                <div className={`absolute bottom-0 left-0 h-1.5 rounded-b-2xl transition-all duration-300 ${
                  isBreathing && breathPhaseIndex === 2 
                    ? 'w-full bg-violet-600 shadow-md shadow-violet-400' 
                    : 'w-full bg-slate-100'
                }`}>
                  <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-2 py-0.5 rounded border tracking-widest ${
                    isBreathing && breathPhaseIndex === 2 
                      ? 'bg-violet-600 text-white border-violet-600' 
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}>
                    3. EXHALE
                  </span>
                </div>

                {/* 4. LEFT border (Retain Empty) */}
                <div className={`absolute top-0 left-0 w-1.5 transition-all duration-300 ${
                  isBreathing && breathPhaseIndex === 3 
                    ? 'h-full bg-indigo-850 shadow-md shadow-indigo-400' 
                    : 'h-full bg-slate-100'
                }`}>
                  <span className={`absolute top-1/2 right-3 -translate-y-1/2 -rotate-90 text-[9px] font-extrabold px-2 py-0.5 rounded border tracking-widest ${
                    isBreathing && breathPhaseIndex === 3 
                      ? 'bg-indigo-850 text-white border-indigo-850' 
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}>
                    4. RETRETAIN
                  </span>
                </div>

                {/* Dynamic Spheric Ring Core */}
                <motion.div 
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white border-2 border-white shadow-lg ${
                    isBreathing ? phases[breathPhaseIndex].bgClass : 'bg-slate-450 bg-slate-400'
                  }`}
                  animate={{ scale: isBreathing ? phases[breathPhaseIndex].scale : 0.8 }}
                  transition={{ ease: "easeInOut", duration: 4 }}
                >
                  <span className="font-mono text-3xl font-extrabold text-white">
                    {isBreathing ? `${secondsLeft}s` : '--'}
                  </span>
                  <span className="font-sans text-[10px] uppercase font-extrabold tracking-wider text-violet-100 leading-none mt-1">
                    {isBreathing ? phases[breathPhaseIndex].title : 'Ready'}
                  </span>
                </motion.div>
              </div>

              {/* Tips Status Message */}
              <p className="font-sans text-xs sm:text-sm font-semibold text-violet-950 text-center mt-8 min-h-[40px] px-4 max-w-xs leading-relaxed">
                {isBreathing ? phases[breathPhaseIndex].text : 'Click start below to initiate your paced breathing trainer'}
              </p>

              {/* Action Rows */}
              <div className="flex gap-3 justify-center mt-3 w-full max-w-xs">
                <button
                  onClick={handleToggleBreathing}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-semibold text-xs sm:text-sm font-sans flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  {isBreathing ? 'Pause Practice' : 'Start Practice'}
                </button>
                <button
                  onClick={handleResetBreathing}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-5 py-3 font-semibold text-xs sm:text-sm font-sans transition-all"
                >
                  Reset
                </button>
              </div>

              {/* Workout Statistics Summary */}
              <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-xs border-t border-slate-100 pt-6">
                <div className="text-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="text-2xl font-mono font-extrabold text-violet-950">
                    {cyclesCompleted}
                  </div>
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Completed Cycles
                  </div>
                </div>
                <div className="text-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="text-2xl font-mono font-extrabold text-violet-950">
                    {formatMinSec(elapsedSeconds)}
                  </div>
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Practice Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: ABOUT ================= */}
        {activeTab === 'about' && (
          <div className="space-y-6 max-w-2xl mx-auto font-sans text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div>
              <h2 className="font-display text-xl font-extrabold text-violet-950">
                Somatic Rest & Autonomic Regulation
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-1">
                The neurological sciences driving cardiac stabilization and deep calming states.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Stress is not simply a mental experience; it represents a physiological alert sequence orchestrated by your nervous system. In high-pressure states, the <strong>Sympathetic Nervous System ("fight-or-flight" driver)</strong> recruits cortisol and adrenaline, which accelerates respiration, tightens physical muscles, and limits digestive priorities.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-5 pt-2">
                <div className="p-5 rounded-2xl bg-violet-50/30 border border-violet-100 space-y-2">
                  <h3 className="font-display text-xs sm:text-sm font-extrabold text-violet-950 flex items-center gap-1.5 border-b border-violet-100/50 pb-1.5">
                    <Brain className="h-4 w-4 text-violet-600" />
                    Autonomic Vagus Balancing
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    By strictly pacing breathing—particularly extending exhalations and quietly resting empty—you send direct electric signals through your vagus cranial nerve. This dampens adrenaline, slows resting cardiac pacing, and activates cooling rest mechanisms.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-2">
                  <h3 className="font-display text-xs sm:text-sm font-extrabold text-indigo-950 flex items-center gap-1.5 border-b border-indigo-100/50 pb-1.5">
                    <Wind className="h-4 w-4 text-indigo-600" />
                    Symmetric Breathing (4-4-4-4)
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Designed for tactical forces and medical residents, the perfect box breathing symmetry anchors visual and cognitive channels. It coordinates steady lung volumes, balancing oxygen absorption and carbon dioxide release seamlessly to support physical composure.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-4 space-y-3">
                <h3 className="font-display text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-violet-600" />
                  Supportive Coping Habits
                </h3>
                <ul className="space-y-2.5 pl-1 text-slate-500 text-xs sm:text-sm">
                  <li className="flex gap-2 items-start">
                    <span className="text-violet-600 font-black">•</span>
                    <span><strong>Muscle Decouple:</strong> Periodically check physical shoulder and brow lines. Clench them hard for 4 seconds, then drop them fully to release tension loops.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-violet-600 font-black">•</span>
                    <span><strong>Sleep Hygiene boundaries:</strong> Close visual tablets and turn off notification alerts 30 minutes before rest to let healthy hormone cycles form.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-violet-600 font-black">•</span>
                    <span><strong>Ambient Intervals:</strong> Spending even 15 minutes near natural flora or quiet blue skies resets your cognitive attentional filters.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-150 pt-6 mt-4 p-4.5 bg-rose-50/30 rounded-2xl border border-rose-100 flex gap-3.5 items-start">
              <Shield className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-sans text-xs font-bold text-rose-900 block uppercase tracking-wider">Clinical Disclaimer</span>
                <p className="font-sans text-[11px] text-rose-800/90 leading-normal">
                  Bebetolash Stress Companion is exclusively intended for educational and general breathing exercises. This site is not a substitute for clinical diagnosis, therapeutic prescriptions, or consulting physician counseling. If you suffer from somatic distress, anxiety disorders, or acute respiratory issues, please contact direct licensed healthcare practitioners or helplines.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
