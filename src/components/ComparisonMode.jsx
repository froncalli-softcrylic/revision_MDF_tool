'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, ChevronDown, X, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { useMDFStore } from '@/store/store';

/**
 * Comparison Mode — shows Before MDF vs After MDF side by side,
 * demonstrating the value of the MDF pipeline.
 */
export default function ComparisonMode() {
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const rawData = useMDFStore((s) => s.rawData);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isOpen, setIsOpen] = useState(false);

  if (processingStage !== 'complete' || unifiedProfiles.length === 0) return null;

  const totalRaw = rawData.length;
  const totalUnified = unifiedProfiles.length;
  const duplicateRate = Math.round(((totalRaw - totalUnified) / totalRaw) * 100);

  const beforeMetrics = [
    { label: 'Total Records', value: totalRaw, status: 'bad' },
    { label: 'Duplicate Rate', value: `${duplicateRate}%`, status: 'bad' },
    { label: 'Phone Formats', value: 'Inconsistent', status: 'bad' },
    { label: 'Email Casing', value: 'Mixed', status: 'bad' },
    { label: 'Identity Links', value: '0', status: 'bad' },
    { label: 'Customer View', value: 'Fragmented', status: 'bad' },
  ];

  const afterMetrics = [
    { label: 'Golden Records', value: totalUnified, status: 'good' },
    { label: 'Duplicate Rate', value: '0%', status: 'good' },
    { label: 'Phone Formats', value: '(XXX) XXX-XXXX', status: 'good' },
    { label: 'Email Casing', value: 'Normalized', status: 'good' },
    { label: 'Identity Links', value: `${unifiedProfiles.reduce((s, p) => s + (p.identityLinks?.length || 0), 0)}`, status: 'good' },
    { label: 'Customer View', value: '360° Unified', status: 'good' },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={14} className="text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Before / After MDF</h3>
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
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {/* WITHOUT MDF */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 mb-2 p-2 rounded-lg bg-rose-50 border border-rose-100">
                    <X size={12} className="text-rose-500" />
                    <span className="text-[11px] font-bold text-rose-700">Without MDF</span>
                  </div>
                  {beforeMetrics.map((m, idx) => (
                    <motion.div
                      key={m.label}
                      className="flex items-center justify-between p-2 rounded bg-rose-50/40 border border-rose-100/50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <span className="text-[10px] text-slate-600 font-medium">{m.label}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-rose-600">{m.value}</span>
                        <AlertTriangle size={8} className="text-rose-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* WITH MDF */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 mb-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-700">With MDF</span>
                  </div>
                  {afterMetrics.map((m, idx) => (
                    <motion.div
                      key={m.label}
                      className="flex items-center justify-between p-2 rounded bg-emerald-50/40 border border-emerald-100/50"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <span className="text-[10px] text-slate-600 font-medium">{m.label}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-emerald-600">{m.value}</span>
                        <CheckCircle2 size={8} className="text-emerald-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
