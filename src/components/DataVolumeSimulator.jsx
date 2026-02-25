'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Zap, Clock, ChevronDown, HardDrive } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const VOLUME_TIERS = [
  { label: '10K', records: 10000, label2: '10,000' },
  { label: '100K', records: 100000, label2: '100,000' },
  { label: '1M', records: 1000000, label2: '1,000,000' },
  { label: '10M', records: 10000000, label2: '10,000,000' },
];

/**
 * Data Volume & Throughput Simulator — lets users see how processing
 * scales with data volume, showing latency estimates per ingestion path.
 */
export default function DataVolumeSimulator() {
  const selectedSources = useMDFStore((s) => s.selectedSources);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isOpen, setIsOpen] = useState(false);
  const [volumeIdx, setVolumeIdx] = useState(1); // default 100K

  if (processingStage !== 'complete' || selectedSources.length === 0) return null;

  const tier = VOLUME_TIERS[volumeIdx];

  // Estimates (simplified, based on typical MDF benchmarks)
  const realtimeLatencyMs = 50 + volumeIdx * 30; // 50-140ms
  const batchLatencyMin = [2, 15, 90, 480][volumeIdx]; // 2min - 8hrs
  const hygieneThruput = Math.round(tier.records / [1, 3, 18, 120][volumeIdx]); // records/sec
  const identityThruput = Math.round(hygieneThruput * 0.6);
  const storageGB = [0.1, 1, 10, 100][volumeIdx];

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Gauge size={14} className="text-violet-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Volume & Throughput</h3>
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
              {/* Volume Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {VOLUME_TIERS.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setVolumeIdx(i)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                      i === volumeIdx
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-center text-slate-500 font-medium">
                Simulating {tier.label2} records across {selectedSources.length} sources
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-cyan-50/70 border border-cyan-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Zap size={10} className="text-cyan-600" />
                    <span className="text-[9px] font-bold text-cyan-700 uppercase">Realtime Latency</span>
                  </div>
                  <p className="text-sm font-black text-cyan-800">{realtimeLatencyMs}ms</p>
                  <p className="text-[9px] text-cyan-600">per event</p>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock size={10} className="text-amber-600" />
                    <span className="text-[9px] font-bold text-amber-700 uppercase">Batch Processing</span>
                  </div>
                  <p className="text-sm font-black text-amber-800">
                    {batchLatencyMin >= 60 ? `${Math.round(batchLatencyMin / 60)}h` : `${batchLatencyMin}min`}
                  </p>
                  <p className="text-[9px] text-amber-600">full refresh</p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Gauge size={10} className="text-emerald-600" />
                    <span className="text-[9px] font-bold text-emerald-700 uppercase">Hygiene Throughput</span>
                  </div>
                  <p className="text-sm font-black text-emerald-800">{hygieneThruput.toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-600">records/sec</p>
                </div>

                <div className="p-2.5 rounded-lg bg-violet-50/70 border border-violet-100">
                  <div className="flex items-center gap-1 mb-1">
                    <HardDrive size={10} className="text-violet-600" />
                    <span className="text-[9px] font-bold text-violet-700 uppercase">Storage Estimate</span>
                  </div>
                  <p className="text-sm font-black text-violet-800">{storageGB >= 1 ? `${storageGB} GB` : `${storageGB * 1000} MB`}</p>
                  <p className="text-[9px] text-violet-600">unified profiles</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
