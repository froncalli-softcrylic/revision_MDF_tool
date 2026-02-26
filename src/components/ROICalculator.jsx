'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Users, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useMDFStore } from '@/store/store';
import Tooltip from './Tooltip';

/**
 * AnimatedValue — smoothly animates between number values
 */
function AnimatedValue({ value, prefix = '', suffix = '', className = '' }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const duration = 500;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <span className={className}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

/**
 * ROI Calculator — estimates savings from deduplication, unification,
 * and the impact on marketing efficiency. Now with sensitivity sliders.
 */
export default function ROICalculator() {
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const rawData = useMDFStore((s) => s.rawData);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isOpen, setIsOpen] = useState(false);

  // Sensitivity sliders
  const [costPerDuplicate, setCostPerDuplicate] = useState(12);
  const [ltvUplift, setLtvUplift] = useState(15);

  if (processingStage !== 'complete' || unifiedProfiles.length === 0) return null;

  // Calculate ROI metrics
  const totalRaw = rawData.length;
  const totalUnified = unifiedProfiles.length;
  const duplicatesRemoved = totalRaw - totalUnified;
  const duplicationRate = Math.round((duplicatesRemoved / totalRaw) * 100);

  const avgLtv = Math.round(unifiedProfiles.reduce((s, p) => s + p.ltv, 0) / unifiedProfiles.length);
  const totalLtv = unifiedProfiles.reduce((s, p) => s + p.ltv, 0);

  const annualSavings = duplicatesRemoved * costPerDuplicate;
  const ltvGain = Math.round(totalLtv * (ltvUplift / 100));
  const totalROI = annualSavings + ltvGain;

  const metrics = [
    {
      label: 'Duplicates Eliminated',
      value: duplicatesRemoved,
      displayValue: duplicatesRemoved.toLocaleString(),
      detail: `${duplicationRate}% duplication rate across ${totalRaw} raw records`,
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      label: 'Wasted Spend Saved',
      value: annualSavings,
      displayValue: null, // will use AnimatedValue
      detail: `$${costPerDuplicate}/duplicate/yr × ${duplicatesRemoved} duplicates`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'LTV Uplift (Personalization)',
      value: ltvGain,
      displayValue: null, // will use AnimatedValue
      detail: `${ltvUplift}% uplift on $${totalLtv.toLocaleString()} total LTV`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">ROI Impact</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
            +<AnimatedValue value={totalROI} prefix="$" />
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Sensitivity Sliders */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <SlidersHorizontal size={12} className="text-indigo-500" />
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Sensitivity Controls</span>
                </div>

                {/* Cost per duplicate slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-slate-600">Cost per Duplicate Record</label>
                    <span className="text-[11px] font-black text-indigo-600">${costPerDuplicate}/yr</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={costPerDuplicate}
                    onChange={(e) => setCostPerDuplicate(Number(e.target.value))}
                    className="roi-slider w-full"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium mt-0.5">
                    <span>$5</span>
                    <span>$25</span>
                  </div>
                </div>

                {/* LTV uplift slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-slate-600">
                      <Tooltip content="Lifetime Value (LTV) increases when unified data enables consistent, highly personalized cross-channel marketing." position="top">
                        LTV Uplift from Personalization
                      </Tooltip>
                    </label>
                    <span className="text-[11px] font-black text-indigo-600">{ltvUplift}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={ltvUplift}
                    onChange={(e) => setLtvUplift(Number(e.target.value))}
                    className="roi-slider w-full"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium mt-0.5">
                    <span>5%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>

              {/* Metric cards */}
              {metrics.map((m, idx) => (
                <motion.div
                  key={m.label}
                  className={`p-3 rounded-lg ${m.bg} border ${m.border}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <m.icon size={14} className={m.color} />
                      <span className="text-[11px] font-bold text-slate-800">{m.label}</span>
                    </div>
                    {m.displayValue !== null ? (
                      <span className={`text-sm font-black ${m.color}`}>{m.displayValue}</span>
                    ) : (
                      <AnimatedValue value={m.value} prefix="$" className={`text-sm font-black ${m.color}`} />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 ml-6">{m.detail}</p>
                </motion.div>
              ))}

              {/* Total ROI summary */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-800">
                    <Tooltip content="Return on Investment (ROI) estimated by calculating savings from deduplicated marketing spend and revenue from increased LTV." position="top">
                      Estimated Annual ROI
                    </Tooltip>
                  </span>
                  <AnimatedValue value={totalROI} prefix="$" className="text-base font-black text-indigo-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
