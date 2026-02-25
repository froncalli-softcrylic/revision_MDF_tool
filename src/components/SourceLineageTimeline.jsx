'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, ArrowRight } from 'lucide-react';

/**
 * Source Lineage Timeline — shows when each source record arrived
 * with Realtime vs Batch icons, displayed in the CustomerStory modal.
 */
export default function SourceLineageTimeline({ profile }) {
  if (!profile || !profile.sources || profile.sources.length === 0) return null;

  // Build timeline entries from sources + ingestion types
  const entries = profile.sources.map((source, i) => {
    const isRealtime = (profile.ingestionTypes || []).includes('Realtime') && i % 2 === 0;
    return {
      source,
      type: isRealtime ? 'Realtime' : 'Batch',
      stage: i === 0 ? 'Ingested' : i === 1 ? 'Cleaned' : i === 2 ? 'Linked' : 'Merged',
    };
  });

  return (
    <div className="glass-card-sm p-5 bg-white border-slate-200">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
        📍 Source Lineage Timeline
      </h3>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-slate-200" />

        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              className="relative flex items-start gap-3 pl-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Timeline dot */}
              <motion.div
                className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                  entry.type === 'Realtime'
                    ? 'bg-cyan-400 border-cyan-200'
                    : 'bg-amber-400 border-amber-200'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15 + 0.1, type: 'spring' }}
              />

              <div className="flex-1 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-bold text-slate-800">{entry.source}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    entry.type === 'Realtime'
                      ? 'bg-cyan-50 text-cyan-600 border border-cyan-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {entry.type === 'Realtime' ? <Zap size={8} className="inline mr-0.5" /> : <Clock size={8} className="inline mr-0.5" />}
                    {entry.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ArrowRight size={8} className="text-slate-300" />
                  <span className="text-[10px] text-slate-500 font-medium">{entry.stage} into MDF pipeline</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Final merged node */}
          <motion.div
            className="relative flex items-start gap-3 pl-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: entries.length * 0.15 }}
          >
            <motion.div
              className="absolute left-2 top-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-200 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: entries.length * 0.15, type: 'spring' }}
            >
              <span className="text-[6px] text-white font-black">✓</span>
            </motion.div>
            <div className="flex-1 p-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700">
                Golden Record Created — {profile.recordCount} records merged
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
