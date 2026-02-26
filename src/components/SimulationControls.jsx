'use client';

import { motion } from 'framer-motion';
import { Play, SkipForward, Pause, RotateCcw, Zap, StepForward } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const STAGE_LABELS = {
  idle: 'Ready',
  ingesting: 'Ingesting Data',
  hygiene: 'Data Hygiene',
  identity: 'Identity Resolution',
  profiling: 'Building Profiles',
  measurement: 'Measurement',
  activating: 'MarTech Activation',
  complete: 'Complete',
};

export default function SimulationControls() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const simulationMode = useMDFStore((s) => s.simulationMode);
  const stepPending = useMDFStore((s) => s.stepPending);
  const setSimulationMode = useMDFStore((s) => s.setSimulationMode);
  const advanceStep = useMDFStore((s) => s.advanceStep);
  const runSimulation = useMDFStore((s) => s.runSimulation);
  const selectedSources = useMDFStore((s) => s.selectedSources);

  const isIdle = processingStage === 'idle';
  const isComplete = processingStage === 'complete';
  const isRunning = !isIdle && !isComplete;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Zap size={14} className="text-indigo-600" />
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Simulation Mode</h3>
      </div>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <motion.button
          className={`p-2.5 rounded-xl border text-center transition-all duration-200 ${
            simulationMode === 'auto'
              ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          } ${isRunning ? 'opacity-50' : ''}`}
          onClick={() => !isRunning && setSimulationMode('auto')}
          whileTap={!isRunning ? { scale: 0.97 } : {}}
        >
          <Play size={14} className={`mx-auto mb-1 ${simulationMode === 'auto' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <p className="text-base font-bold text-slate-900">Auto-Play</p>
          <p className="text-sm text-slate-500">Runs all stages</p>
        </motion.button>
        <motion.button
          className={`p-2.5 rounded-xl border text-center transition-all duration-200 ${
            simulationMode === 'step'
              ? 'border-violet-300 bg-violet-50/50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          } ${isRunning ? 'opacity-50' : ''}`}
          onClick={() => !isRunning && setSimulationMode('step')}
          whileTap={!isRunning ? { scale: 0.97 } : {}}
        >
          <StepForward size={14} className={`mx-auto mb-1 ${simulationMode === 'step' ? 'text-violet-600' : 'text-slate-400'}`} />
          <p className="text-base font-bold text-slate-900">Step-by-Step</p>
          <p className="text-sm text-slate-500">Pause each stage</p>
        </motion.button>
      </div>

      {/* Step Controls - visible during step mode simulation */}
      {simulationMode === 'step' && isRunning && (
        <motion.div
          className="p-3 rounded-xl bg-violet-50 border border-violet-200"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-bold text-violet-800 uppercase tracking-wider">Current Stage</p>
              <p className="text-lg font-bold text-violet-900">{STAGE_LABELS[processingStage]}</p>
            </div>
            {stepPending && (
              <motion.div
                className="w-2 h-2 rounded-full bg-violet-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>
          {stepPending ? (
            <motion.button
              className="w-full py-2 px-4 rounded-lg bg-violet-600 text-white text-base font-bold flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors"
              onClick={advanceStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SkipForward size={12} /> Next Stage →
            </motion.button>
          ) : (
            <div className="w-full py-2 px-4 rounded-lg bg-violet-100 text-violet-600 text-base font-bold text-center flex items-center justify-center gap-2">
              <motion.div
                className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Processing...
            </div>
          )}
        </motion.div>
      )}

      {/* Idle / Complete states */}
      {isIdle && (
        <p className="text-sm text-slate-500 text-center font-medium">
          {simulationMode === 'auto' ? '⚡ Auto mode — runs all 6 stages continuously' : '🎯 Step mode — pause & inspect each stage'}
        </p>
      )}
      {isComplete && (
        <p className="text-sm text-emerald-600 text-center font-medium">
          ✅ Simulation complete — switch mode and re-run to compare
        </p>
      )}
    </div>
  );
}
