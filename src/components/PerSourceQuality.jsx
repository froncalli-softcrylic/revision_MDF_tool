'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useMDFStore } from '@/store/store';
import { SOURCE_CATALOG } from '@/store/sourceCatalog';

/**
 * Per-Source Data Quality — shows data quality breakdown per source,
 * highlighting which sources contributed the dirtiest data.
 */
export default function PerSourceQuality() {
  const rawData = useMDFStore((s) => s.rawData);
  const cleanedData = useMDFStore((s) => s.cleanedData);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isOpen, setIsOpen] = useState(false);

  const isComplete = processingStage === 'complete';
  if (!isComplete || rawData.length === 0) return null;

  // Calculate per-source quality metrics
  const sourceMetrics = {};
  rawData.forEach((raw, i) => {
    const clean = cleanedData[i] || raw;
    const srcId = raw.sourceId || 'unknown';
    const srcInfo = SOURCE_CATALOG.find((s) => s.id === srcId);
    const srcName = srcInfo?.name || raw.source || srcId;

    if (!sourceMetrics[srcId]) {
      sourceMetrics[srcId] = { name: srcName, total: 0, issues: 0, phoneIssues: 0, emailIssues: 0, nameIssues: 0, color: srcInfo?.color || '#6366f1' };
    }
    const m = sourceMetrics[srcId];
    m.total++;

    if (raw.originalPhone && raw.originalPhone !== clean.phone) { m.issues++; m.phoneIssues++; }
    if (raw.originalEmail && raw.originalEmail !== clean.email) { m.issues++; m.emailIssues++; }
    if (raw.firstName && clean.firstName && raw.firstName !== clean.firstName) { m.issues++; m.nameIssues++; }
  });

  const sources = Object.values(sourceMetrics)
    .map((m) => ({ ...m, qualityScore: Math.round(((m.total - m.issues) / Math.max(m.total, 1)) * 100) }))
    .sort((a, b) => a.qualityScore - b.qualityScore);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-cyan-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Per-Source Data Quality</h3>
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
              {sources.map((src, idx) => {
                const isGood = src.qualityScore >= 80;
                const isMedium = src.qualityScore >= 50 && src.qualityScore < 80;
                return (
                  <motion.div
                    key={src.name}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isGood ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : (
                          <AlertTriangle size={12} className={isMedium ? 'text-amber-500' : 'text-rose-500'} />
                        )}
                        <span className="text-[11px] font-bold text-slate-800 truncate max-w-[150px]">{src.name}</span>
                      </div>
                      <span className={`text-[11px] font-black ${
                        isGood ? 'text-emerald-600' : isMedium ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {src.qualityScore}%
                      </span>
                    </div>

                    {/* Quality bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: isGood ? '#10b981' : isMedium ? '#f59e0b' : '#f43f5e',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${src.qualityScore}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      />
                    </div>

                    {/* Issue breakdown */}
                    <div className="flex gap-3 text-[9px] font-medium text-slate-500">
                      <span>{src.total} records</span>
                      {src.phoneIssues > 0 && <span className="text-rose-500">📞 {src.phoneIssues} phone</span>}
                      {src.emailIssues > 0 && <span className="text-rose-500">✉️ {src.emailIssues} email</span>}
                      {src.nameIssues > 0 && <span className="text-rose-500">👤 {src.nameIssues} name</span>}
                      {src.issues === 0 && <span className="text-emerald-500">✓ Clean</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
