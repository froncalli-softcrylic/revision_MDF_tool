'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, ShoppingCart, User, Smartphone, Zap, Phone, Heart, Headphones, Eye, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

const CHANNEL_CONFIG = {
  Web: { icon: Globe, color: '#06b6d4', bg: 'bg-cyan-50', border: 'border-cyan-100', rail: '#06b6d4' },
  Email: { icon: Mail, color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-100', rail: '#ec4899' },
  Commerce: { icon: ShoppingCart, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100', rail: '#f59e0b' },
  CRM: { icon: User, color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-100', rail: '#8b5cf6' },
  Mobile: { icon: Smartphone, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100', rail: '#10b981' },
  Paid: { icon: Zap, color: '#f43f5e', bg: 'bg-rose-50', border: 'border-rose-100', rail: '#f43f5e' },
  'Call Center': { icon: Phone, color: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-100', rail: '#6366f1' },
  Loyalty: { icon: Heart, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100', rail: '#f59e0b' },
  Support: { icon: Headphones, color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-100', rail: '#8b5cf6' },
};

/**
 * Journey Replay — Subway-map style horizontal timeline showing the customer's
 * cross-channel journey in chronological order, with interactive popover nodes.
 */
export default function JourneyReplay({ profile }) {
  const [selectedStep, setSelectedStep] = useState(null);

  if (!profile || !profile.touchpoints || profile.touchpoints.length === 0) return null;

  const steps = profile.touchpoints.map((tp, i) => {
    const config = CHANNEL_CONFIG[tp.channel] || { icon: Eye, color: '#64748b', bg: 'bg-slate-50', border: 'border-slate-200', rail: '#64748b' };
    return { ...tp, ...config, order: i };
  });

  return (
    <div className="glass-card-sm p-4 sm:p-5 bg-white border-slate-200">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 sm:mb-4">
        🚇 Cross-Channel Journey Replay
      </h3>

      {/* Subway-map timeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-0 min-w-max relative">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const nextStep = steps[idx + 1];
            const isSelected = selectedStep === idx;

            return (
              <div key={idx} className="flex items-start relative">
                <motion.div
                  className="flex flex-col items-center w-36 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  onClick={() => setSelectedStep(isSelected ? null : idx)}
                >
                  {/* Station node */}
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] shadow-md z-10 relative transition-all duration-300 ${step.bg} ${
                      isSelected ? 'ring-4 ring-offset-2' : 'group-hover:scale-110'
                    }`}
                    style={{
                      borderColor: step.color,
                      ringColor: isSelected ? step.color + '40' : undefined,
                    }}
                    animate={isSelected ? { scale: [1, 1.1, 1.05] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <StepIcon size={18} style={{ color: step.color }} />
                    {/* Station number badge */}
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-sm"
                      style={{ background: step.color }}
                    >
                      {idx + 1}
                    </span>
                  </motion.div>

                  {/* Step label */}
                  <div className="mt-2.5 text-center px-1">
                    <p className="text-[11px] font-bold text-slate-800">{step.channel}</p>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5 max-w-[120px] truncate">{step.detail}</p>
                  </div>

                  {/* Interactive Popover */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute top-16 left-1/2 -translate-x-1/2 z-20 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        {/* Popover header */}
                        <div className="px-3 py-2 flex items-center justify-between" style={{ background: step.color + '10' }}>
                          <div className="flex items-center gap-2">
                            <StepIcon size={12} style={{ color: step.color }} />
                            <span className="text-[11px] font-bold" style={{ color: step.color }}>{step.channel}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedStep(null); }} className="text-slate-400 hover:text-slate-600">
                            <X size={12} />
                          </button>
                        </div>
                        {/* Popover content */}
                        <div className="p-3 space-y-2">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Touchpoint Detail</p>
                            <p className="text-[11px] font-semibold text-slate-800">{step.detail}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-1.5 rounded-md bg-rose-50 border border-rose-100">
                              <p className="text-[8px] font-bold text-rose-500 uppercase">Raw</p>
                              <p className="text-[10px] font-mono text-rose-700 truncate">
                                {step.channel === 'Email' ? 'JOHN@Gmail.COM' : step.channel === 'Web' ? '555.123.4567' : 'Original'}
                              </p>
                            </div>
                            <div className="p-1.5 rounded-md bg-emerald-50 border border-emerald-100">
                              <p className="text-[8px] font-bold text-emerald-500 uppercase">Cleansed</p>
                              <p className="text-[10px] font-mono text-emerald-700 truncate">
                                {step.channel === 'Email' ? 'john@gmail.com' : step.channel === 'Web' ? '(555) 123-4567' : 'Normalized'}
                              </p>
                            </div>
                          </div>
                          <div className="text-[9px] text-slate-500 font-medium text-center pt-1 border-t border-slate-100">
                            Step {idx + 1} of {steps.length} in journey
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Rail connector between stations */}
                {idx < steps.length - 1 && (
                  <div className="flex items-center mt-5 mx-0 relative">
                    <div className="w-12 h-[4px] rounded-full relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${step.color}40, ${nextStep?.rail || '#94a3b8'}40)` }}>
                      {/* Animated train dot */}
                      <motion.div
                        className="absolute top-[-2px] w-2 h-2 rounded-full shadow-md"
                        style={{ background: step.color, boxShadow: `0 0 8px ${step.color}60` }}
                        animate={{ left: ['-8px', '48px'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: idx * 0.4 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Final: Golden Record */}
          <div className="flex items-start">
            <div className="flex items-center mt-5 mx-0">
              <div className="w-8 h-[4px] rounded-full bg-gradient-to-r from-violet-200 to-indigo-300 relative overflow-hidden">
                <motion.div
                  className="absolute top-[-2px] w-2 h-2 rounded-full bg-indigo-500 shadow-md"
                  style={{ boxShadow: '0 0 8px rgba(99,102,241,0.6)' }}
                  animate={{ left: ['-8px', '32px'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: steps.length * 0.4 }}
                />
              </div>
            </div>
            <motion.div
              className="flex flex-col items-center w-32"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: steps.length * 0.15 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-white shadow-lg z-10"
                style={{ background: 'var(--gradient-primary)' }}
                animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 24px rgba(99,102,241,0.5)', '0 0 0px rgba(99,102,241,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {profile.firstName[0]}{profile.lastName[0]}
              </motion.div>
              <p className="text-[11px] font-bold text-indigo-600 mt-2">Golden Record</p>
              <p className="text-[9px] text-slate-500 font-medium">Unified Profile</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
