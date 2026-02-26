'use client';

import { motion } from 'framer-motion';
import { Fingerprint, Crosshair, BrainCircuit } from 'lucide-react';
import { useMDFStore } from '@/store/store';
import Tooltip from './Tooltip';

export default function IdentityModeToggle() {
  const identityMode = useMDFStore((s) => s.identityMode);
  const setIdentityMode = useMDFStore((s) => s.setIdentityMode);
  const processingStage = useMDFStore((s) => s.processingStage);

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint size={14} className="text-violet-600" />
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Identity Mode</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          className={`p-3 rounded-xl border text-left transition-all duration-200 ${
            identityMode === 'deterministic'
              ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          } ${isRunning ? 'opacity-50' : ''}`}
          onClick={() => !isRunning && setIdentityMode('deterministic')}
          whileTap={!isRunning ? { scale: 0.97 } : {}}
        >
          <Crosshair size={14} className={`mb-1.5 ${identityMode === 'deterministic' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <p className="text-base font-bold text-slate-900">
            <Tooltip content="Links records only when exact, unique identifiers (like Email or Phone) match perfectly." position="top">
              Deterministic
            </Tooltip>
          </p>
          <p className="text-sm text-slate-500 mt-0.5">Exact email/phone match</p>
        </motion.button>
        <motion.button
          className={`p-3 rounded-xl border text-left transition-all duration-200 ${
            identityMode === 'probabilistic'
              ? 'border-violet-300 bg-violet-50/50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          } ${isRunning ? 'opacity-50' : ''}`}
          onClick={() => !isRunning && setIdentityMode('probabilistic')}
          whileTap={!isRunning ? { scale: 0.97 } : {}}
        >
          <BrainCircuit size={14} className={`mb-1.5 ${identityMode === 'probabilistic' ? 'text-violet-600' : 'text-slate-400'}`} />
          <p className="text-base font-bold text-slate-900">
            <Tooltip content="Uses fuzzy matching algorithms (like similar names + same city) to guess if records belong to the same person." position="top">
              Probabilistic
            </Tooltip>
          </p>
          <p className="text-sm text-slate-500 mt-0.5">Fuzzy name + city match</p>
        </motion.button>
      </div>
      <p className="text-sm text-slate-500 mt-2 text-center font-medium">
        {identityMode === 'deterministic'
          ? '🎯 Only exact ID matches are merged'
          : '🧠 Fuzzy matching on name + city + partial phone'}
      </p>
    </div>
  );
}
