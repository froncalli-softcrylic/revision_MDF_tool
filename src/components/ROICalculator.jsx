'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Users, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useMDFStore } from '@/store/store';

/**
 * ROI Calculator — estimates savings from deduplication, unification,
 * and the impact on marketing efficiency.
 */
export default function ROICalculator() {
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const rawData = useMDFStore((s) => s.rawData);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isOpen, setIsOpen] = useState(false);

  if (processingStage !== 'complete' || unifiedProfiles.length === 0) return null;

  // Calculate ROI metrics
  const totalRaw = rawData.length;
  const totalUnified = unifiedProfiles.length;
  const duplicatesRemoved = totalRaw - totalUnified;
  const duplicationRate = Math.round((duplicatesRemoved / totalRaw) * 100);

  // Cost assumptions (per record per year)
  const costPerDuplicateRecord = 12; // $12/duplicate/year in wasted marketing
  const avgLtv = Math.round(unifiedProfiles.reduce((s, p) => s + p.ltv, 0) / unifiedProfiles.length);
  const ltvUplift = 0.15; // 15% LTV uplift from personalization
  const totalLtv = unifiedProfiles.reduce((s, p) => s + p.ltv, 0);

  const annualSavings = duplicatesRemoved * costPerDuplicateRecord;
  const ltvGain = Math.round(totalLtv * ltvUplift);
  const totalROI = annualSavings + ltvGain;

  const metrics = [
    {
      label: 'Duplicates Eliminated',
      value: duplicatesRemoved,
      detail: `${duplicationRate}% duplication rate across ${totalRaw} raw records`,
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      label: 'Wasted Spend Saved',
      value: `$${annualSavings.toLocaleString()}`,
      detail: `$${costPerDuplicateRecord}/duplicate/yr × ${duplicatesRemoved} duplicates`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'LTV Uplift (Personalization)',
      value: `$${ltvGain.toLocaleString()}`,
      detail: `${Math.round(ltvUplift * 100)}% uplift on $${totalLtv.toLocaleString()} total LTV`,
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
            +${totalROI.toLocaleString()}
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
            <div className="px-4 pb-4 space-y-2">
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
                    <span className={`text-sm font-black ${m.color}`}>{m.value}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 ml-6">{m.detail}</p>
                </motion.div>
              ))}

              {/* Total ROI summary */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-800">Estimated Annual ROI</span>
                  <motion.span
                    className="text-base font-black text-indigo-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                  >
                    ${totalROI.toLocaleString()}
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
