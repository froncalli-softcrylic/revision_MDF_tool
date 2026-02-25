'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowRight, Radio } from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { SOURCE_CATALOG } from '@/store/sourceCatalog';

/**
 * Dual-lane ingestion visual — shows Realtime (streaming) vs Batch (chunk) lanes
 * with selected sources flowing into the appropriate lane.
 */
export default function IngestionLanes() {
  const selectedSources = useMDFStore((s) => s.selectedSources);
  const processingStage = useMDFStore((s) => s.processingStage);

  const isActive = processingStage !== 'idle';
  if (!isActive || selectedSources.length === 0) return null;

  const selected = selectedSources
    .map((id) => SOURCE_CATALOG.find((s) => s.id === id))
    .filter(Boolean);

  const realtimeSources = selected.filter((s) => s.ingestionMode === 'realtime');
  const batchSources = selected.filter((s) => s.ingestionMode === 'batch');

  return (
    <motion.div
      className="glass-card-sm p-4 bg-white border-slate-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Radio size={14} className="text-cyan-600" />
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ingestion Pipelines</h4>
      </div>

      <div className="space-y-2">
        {/* Realtime Lane */}
        <div className="relative p-3 rounded-lg bg-cyan-50/50 border border-cyan-100 overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={12} className="text-cyan-600" />
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">Realtime Stream</span>
            <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded-full ml-auto">
              {realtimeSources.length} source{realtimeSources.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {realtimeSources.map((s) => (
              <span key={s.id} className="text-[10px] font-medium text-cyan-700 bg-cyan-100/70 px-1.5 py-0.5 rounded">
                {s.name.split(' ')[0]}
              </span>
            ))}
          </div>
          {/* Streaming animation */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-200"
          >
            <motion.div
              className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              animate={{ left: ['-48px', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        {/* Batch Lane */}
        <div className="relative p-3 rounded-lg bg-amber-50/50 border border-amber-100 overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock size={12} className="text-amber-600" />
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Batch Pipeline</span>
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full ml-auto">
              {batchSources.length} source{batchSources.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {batchSources.map((s) => (
              <span key={s.id} className="text-[10px] font-medium text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                {s.name.split(' ')[0]}
              </span>
            ))}
          </div>
          {/* Chunk drop animation */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-200">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-y-0 w-4 bg-amber-400 rounded-full"
                animate={{ left: ['-16px', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: i * 0.8 }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2 text-slate-400">
        <ArrowRight size={10} />
        <span className="text-[9px] font-medium">Both feed into MDF Engine</span>
        <ArrowRight size={10} />
      </div>
    </motion.div>
  );
}
