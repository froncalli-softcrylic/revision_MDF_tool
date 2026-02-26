'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Laptop, Stethoscope, Film, Sparkles, X } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const PRESETS = [
  {
    id: 'retail',
    name: 'Retail eCommerce',
    description: 'Web + POS + CRM + Loyalty + Email + Paid Media',
    icon: ShoppingCart,
    color: '#f43f5e',
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    id: 'b2bSaas',
    name: 'B2B SaaS',
    description: 'Product Telemetry + CRM + Billing + Marketo + Enrichment',
    icon: Laptop,
    color: '#6366f1',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'CRM + Call Center + Support + MDM + EDW + Offline',
    icon: Stethoscope,
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    description: 'Web + Mobile + GA4 + Ads + ID Graph + A/B Tests',
    icon: Film,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-500',
  },
];

export default function ScenarioPresets() {
  const applyPreset = useMDFStore((s) => s.applyPreset);
  const activePreset = useMDFStore((s) => s.activePreset);
  const clearPreset = useMDFStore((s) => s.clearPreset);
  const processingStage = useMDFStore((s) => s.processingStage);

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Industry Presets</h3>
        </div>
        {activePreset && (
          <button
            onClick={() => { clearPreset(); }}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <motion.button
              key={preset.id}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !isRunning && applyPreset(preset.id)}
              whileHover={!isRunning ? { scale: 1.02 } : {}}
              whileTap={!isRunning ? { scale: 0.98 } : {}}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${preset.gradient}`}>
                <preset.icon size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-800 text-center">{preset.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
