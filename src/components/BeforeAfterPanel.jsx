'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { useState } from 'react';
import DataDrawer from './DataDrawer';

function FieldRow({ label, raw, clean, improved, onClick }) {
  return (
    <motion.div
      className="grid grid-cols-[60px_1fr_20px_1fr] gap-2 items-center py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition-colors"
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={onClick}
    >
      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{label}</span>
      <div className="flex items-center gap-1">
        {raw ? (
          <span className="text-base font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 truncate max-w-[140px]">{raw}</span>
        ) : (
          <span className="text-sm text-slate-400 italic">—</span>
        )}
      </div>
      <ArrowRight size={10} className="text-slate-300 mx-auto" />
      <div className="flex items-center gap-1">
        {clean ? (
          <motion.span
            className={`text-base font-mono px-2 py-0.5 rounded border truncate max-w-[140px] ${
              improved ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-600 bg-slate-50 border-slate-100'
            }`}
            initial={improved ? { boxShadow: '0 0 0px rgba(16,185,129,0)' } : {}}
            animate={improved ? {
              boxShadow: ['0 0 12px rgba(16,185,129,0.4)', '0 0 0px rgba(16,185,129,0)']
            } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >{clean}</motion.span>
        ) : (
          <span className="text-sm text-slate-400 italic">—</span>
        )}
        {improved && <CheckCircle2 size={10} className="text-emerald-500 flex-shrink-0" />}
      </div>
    </motion.div>
  );
}

export default function BeforeAfterPanel() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const rawData = useMDFStore((s) => s.rawData);
  const cleanedData = useMDFStore((s) => s.cleanedData);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Only show after hygiene stage or later
  const stageIdx = ['idle', 'ingesting', 'hygiene', 'identity', 'profiling', 'measurement', 'activating', 'complete'].indexOf(processingStage);
  if (stageIdx < 2 || rawData.length === 0) return null;

  // Pick a sample of records to show before/after
  const sampleSize = Math.min(4, rawData.length);
  const samples = [];
  for (let i = 0; i < sampleSize; i++) {
    const raw = rawData[i];
    const clean = cleanedData[i] || raw;
    samples.push({ raw, clean });
  }

  const totalIssues = rawData.filter(
    (r) => (r.email && r.email !== r.email.toLowerCase().trim()) || (r.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(r.phone))
  ).length;
  const fixedPct = rawData.length > 0 ? Math.round((totalIssues / rawData.length) * 100) : 0;

  return (
    <>
      <motion.div
        className="glass-card-sm p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        layout
      >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-600" />
          <h4 className="text-base font-bold text-slate-900 uppercase tracking-wider">Before → After Hygiene</h4>
        </div>
        <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
          <AlertTriangle size={8} className="inline mr-0.5" />
          {fixedPct}% records had issues
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[60px_1fr_20px_1fr] gap-2 items-center py-1 mb-1">
        <span className="text-sm font-bold text-slate-400"></span>
        <span className="text-sm font-bold text-rose-500 uppercase">Raw Input</span>
        <span></span>
        <span className="text-sm font-bold text-emerald-500 uppercase">Cleaned</span>
      </div>

      {/* Sample Rows */}
      <AnimatePresence>
        {samples.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
            layout
          >
            <FieldRow
              label="Phone"
              raw={s.raw.phone}
              clean={s.clean.phone}
              improved={s.raw.phone !== s.clean.phone}
              onClick={() => setSelectedRecord({ before: s.raw, after: s.clean, source: s.raw.sourceId })}
            />
            <FieldRow
              label="Email"
              raw={s.raw.email}
              clean={s.clean.email}
              improved={s.raw.email !== s.clean.email}
              onClick={() => setSelectedRecord({ before: s.raw, after: s.clean, source: s.raw.sourceId })}
            />
            {i < sampleSize - 1 && <div className="border-b-2 border-dashed border-slate-100 dark:border-slate-800 my-1 -mx-2" />}
          </motion.div>
        ))}
      </AnimatePresence>

      {rawData.length > sampleSize && (
        <p className="text-sm text-slate-400 text-center mt-2 font-medium">
          +{rawData.length - sampleSize} more records cleaned
        </p>
      )}
      </motion.div>

      <DataDrawer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `Record Details (${selectedRecord.source || 'Unknown'})` : ''}
        beforeData={selectedRecord?.before}
        afterData={selectedRecord?.after}
      />
    </>
  );
}
