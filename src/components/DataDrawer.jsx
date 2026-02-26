'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, ArrowRight } from 'lucide-react';

export default function DataDrawer({ isOpen, onClose, title, beforeData, afterData }) {
  // Helper to format JSON with basic syntax highlighting colors
  const formatJSON = (obj) => {
    if (!obj) return '';
    const jsonString = JSON.stringify(obj, null, 2);
    return jsonString.split('\n').map((line, i) => {
      // Very basic highlighting logic for keys vs strings vs numbers
      let highlightedLine = line;
      if (line.includes('": "')) {
        highlightedLine = line.replace(/("[^"]+"):/g, '<span class="text-indigo-400">$1</span>:');
        highlightedLine = highlightedLine.replace(/: ("[^"]+")/g, ': <span class="text-emerald-400">$1</span>');
      } else if (line.includes('": ')) {
        highlightedLine = line.replace(/("[^"]+"):/g, '<span class="text-indigo-400">$1</span>:');
        highlightedLine = highlightedLine.replace(/: (true|false|null|\d+)/g, ': <span class="text-amber-400">$1</span>');
      }
      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: highlightedLine }} />
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-lg bg-white dark:bg-[#0f172a] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0f172a]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Code2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title || 'Data Inspector'}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Raw JSON Payload Comparison</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Array */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#020617] space-y-6">
              
              {/* Before Block */}
              <div>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Before (Raw Ingestion)</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl text-sm font-mono text-slate-300 overflow-x-auto border border-slate-800 shadow-inner">
                  {formatJSON(beforeData)}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <ArrowRight size={20} />
                </div>
              </div>

              {/* After Block */}
              <div>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">After (Hygiene Applied)</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl text-sm font-mono text-slate-300 overflow-x-auto border border-emerald-900/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  {formatJSON(afterData)}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
