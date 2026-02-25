'use client';

import { motion } from 'framer-motion';
import { Globe, Mail, ShoppingCart, User, Smartphone, Zap, Phone, Heart, Headphones, Eye, ArrowRight } from 'lucide-react';

const CHANNEL_CONFIG = {
  Web: { icon: Globe, color: '#06b6d4', bg: 'bg-cyan-50', border: 'border-cyan-100' },
  Email: { icon: Mail, color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-100' },
  Commerce: { icon: ShoppingCart, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' },
  CRM: { icon: User, color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-100' },
  Mobile: { icon: Smartphone, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  Paid: { icon: Zap, color: '#f43f5e', bg: 'bg-rose-50', border: 'border-rose-100' },
  'Call Center': { icon: Phone, color: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  Loyalty: { icon: Heart, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' },
  Support: { icon: Headphones, color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-100' },
};

/**
 * Journey Replay — animated horizontal timeline showing the customer's
 * cross-channel journey in chronological order.
 */
export default function JourneyReplay({ profile }) {
  if (!profile || !profile.touchpoints || profile.touchpoints.length === 0) return null;

  const steps = profile.touchpoints.map((tp, i) => {
    const config = CHANNEL_CONFIG[tp.channel] || { icon: Eye, color: '#64748b', bg: 'bg-slate-50', border: 'border-slate-200' };
    return { ...tp, ...config, order: i };
  });

  return (
    <div className="glass-card-sm p-5 bg-white border-slate-200">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
        🎬 Cross-Channel Journey Replay
      </h3>

      {/* Horizontal scrollable timeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-0 min-w-max">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={idx} className="flex items-start">
                <motion.div
                  className="flex flex-col items-center w-32"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                >
                  {/* Step dot with icon */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.bg} ${step.border} shadow-sm z-10 relative`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: idx * 0.2 + 0.5, duration: 0.4 }}
                  >
                    <StepIcon size={16} style={{ color: step.color }} />
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: step.color + '40' }}
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ delay: idx * 0.2 + 0.3, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </motion.div>

                  {/* Step label */}
                  <div className="mt-2 text-center px-1">
                    <p className="text-[10px] font-bold text-slate-800">{step.channel}</p>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">{step.detail}</p>
                  </div>

                  {/* Step number */}
                  <span className="text-[8px] font-bold text-slate-400 mt-1">Step {idx + 1}</span>
                </motion.div>

                {/* Connector arrow */}
                {idx < steps.length - 1 && (
                  <div className="flex items-center mt-4 mx-0 relative">
                    <div className="w-8 h-[2px] bg-slate-200 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 w-4 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                        animate={{ left: ['-16px', '32px'] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: idx * 0.3 }}
                      />
                    </div>
                    <ArrowRight size={10} className="text-slate-300 -ml-1" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Final: Golden Record */}
          <motion.div
            className="flex flex-col items-center w-32"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: steps.length * 0.2 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white shadow-lg z-10"
              style={{ background: 'var(--gradient-primary)' }}
              animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.4)', '0 0 0px rgba(99,102,241,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {profile.firstName[0]}{profile.lastName[0]}
            </motion.div>
            <p className="text-[10px] font-bold text-indigo-600 mt-2">Golden Record</p>
            <p className="text-[9px] text-slate-500 font-medium">Unified Profile</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
