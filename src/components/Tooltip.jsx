'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

export default function Tooltip({ children, content, position = 'top' }) {
  const [isHovered, setIsHovered] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-flex items-center gap-1 cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="border-b-2 border-dashed border-indigo-200 dark:border-indigo-800 transition-colors group-hover:border-indigo-400">
        {children}
      </span>
      <Info size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-[200] ${positions[position]} w-64 p-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-700 dark:border-slate-200 pointer-events-none`}
          >
            <p className="text-xs font-semibold leading-relaxed">{content}</p>
            {/* Context Arrow */}
            <div className={`absolute w-3 h-3 bg-slate-900 dark:bg-white border-br transform rotate-45
              ${position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-slate-700 dark:border-slate-200 border-r border-b' : ''}
              ${position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 -rotate-135 border-slate-700 dark:border-slate-200 border-r border-b' : ''}
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
