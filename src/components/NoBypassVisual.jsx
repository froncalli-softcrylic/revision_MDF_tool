'use client';

import { motion } from 'framer-motion';
import { ShieldOff, ShieldCheck, ArrowRight, X } from 'lucide-react';

/**
 * Shows the "Ultimate Rule" — raw data CANNOT bypass the MDF.
 * Displays a blocked path (dashed, red X) vs the clean MDF path (green, flowing).
 */
export default function NoBypassVisual({ isActive }) {
  if (!isActive) return null;

  return (
    <motion.div
      className="glass-card-sm p-4 bg-white border-slate-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} className="text-indigo-600" />
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">The MDF Rule</h4>
      </div>

      <div className="space-y-2">
        {/* Blocked Path */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-rose-50/60 border border-rose-100">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[11px] font-bold text-rose-600 whitespace-nowrap">Raw Data</span>
            <div className="flex-1 relative h-[2px] mx-1">
              <div className="absolute inset-0 border-t-2 border-dashed border-rose-300" />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <X size={14} className="text-rose-500 bg-rose-50 rounded-full" />
              </motion.div>
            </div>
            <span className="text-[11px] font-bold text-rose-600 whitespace-nowrap">MarTech</span>
          </div>
          <ShieldOff size={14} className="text-rose-400 flex-shrink-0" />
        </div>

        {/* Clean Path */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[11px] font-bold text-emerald-600 whitespace-nowrap">Raw Data</span>
            <div className="flex-1 relative h-[2px] mx-1 overflow-hidden">
              <div className="absolute inset-0 bg-emerald-200 rounded-full" />
              <motion.div
                className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"
                animate={{ left: ['-24px', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">MDF</span>
            <div className="flex-1 relative h-[2px] mx-1 overflow-hidden">
              <div className="absolute inset-0 bg-emerald-200 rounded-full" />
              <motion.div
                className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"
                animate={{ left: ['-24px', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.75 }}
              />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 whitespace-nowrap">MarTech</span>
          </div>
          <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
        </div>
      </div>

      <p className="text-[10px] text-slate-500 text-center mt-2 font-medium">
        All data must pass through the MDF before reaching the MarTech stack
      </p>
    </motion.div>
  );
}
