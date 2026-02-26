'use client';

import { motion } from 'framer-motion';

export default function SkeletonLoader({ type = 'row', count = 3, className = "space-y-3" }) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass-card-sm p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">
           {/* Shimmer gradient */}
           <motion.div 
             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12 z-10"
             animate={{ left: ['-100%', '200%'] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
           />
           
           {type === 'profile' ? (
             <>
               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50 relative z-0" />
               <div className="flex-1 space-y-2 relative z-0">
                 <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3" />
                 <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-1/4" />
               </div>
               <div className="hidden sm:block w-20 h-4 bg-slate-200 dark:bg-slate-700/50 rounded relative z-0" />
             </>
           ) : type === 'card' ? (
             <div className="flex flex-col gap-3 w-full relative z-0">
               <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/2" />
               <div className="h-12 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
             </div>
           ) : (
             <div className="flex-1 space-y-2 relative z-0">
               <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
               <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-5/6" />
             </div>
           )}
        </div>
      ))}
    </div>
  );
}
