'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldCheck, Settings2 } from 'lucide-react';

import ScenarioPresets from './ScenarioPresets';
import InfrastructurePanel from './InfrastructurePanel';
import IdentityModeToggle from './IdentityModeToggle';
import HygieneRulesPanel from './HygieneRulesPanel';
import GovernancePanel from './GovernancePanel';
import ConsentLayer from './ConsentLayer';
import SourceDependencyMap from './SourceDependencyMap';
import EdgeCaseDemos from './EdgeCaseDemos';
import ArchitectureCanvas from './ArchitectureCanvas';

// The Run Simulation button has been extracted from InfrastructurePanel
import { useMDFStore } from '@/store/store';
import { Play, Loader2, CheckCircle2 } from 'lucide-react';

export default function InfrastructureSidebar() {
  const [activeTab, setActiveTab] = useState('sources');
  const selectedSources = useMDFStore((s) => s.selectedSources);
  const runSimulation = useMDFStore((s) => s.runSimulation);
  const processingStage = useMDFStore((s) => s.processingStage);

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';
  const isComplete = processingStage === 'complete';

  const TABS = [
    { id: 'sources', label: 'Sources', icon: Database },
    { id: 'rules', label: 'Rules', icon: ShieldCheck },
    { id: 'advanced', label: 'Advanced', icon: Settings2 },
  ];

  return (
    <div className="glass-card flex flex-col h-full md:max-h-[calc(100vh-105px)] overflow-hidden bg-white/80 border-slate-200">
      {/* Header Tabs */}
      <div className="flex-shrink-0 border-b border-slate-100 bg-slate-50/50 p-2">
        <div className="flex bg-slate-100/80 p-1 rounded-xl">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 ${
                  isActive ? 'text-indigo-600 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <tab.icon size={16} className={isActive ? 'text-indigo-500' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'sources' && (
              <>
                <ScenarioPresets />
                <div className="border-t border-slate-100 my-4" />
                <InfrastructurePanel />
              </>
            )}

            {activeTab === 'rules' && (
              <>
                <IdentityModeToggle />
                <div className="border-t border-slate-100 my-4" />
                <HygieneRulesPanel />
                <div className="border-t border-slate-100 my-4" />
                <GovernancePanel />
                <div className="border-t border-slate-100 my-4" />
                <ConsentLayer />
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                <div className="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                    <Settings2 size={16} className="text-indigo-500" />
                    Interactive Architecture
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">View the node-based canvas mapping how sources connect to the MDF Engine.</p>
                  <button 
                    onClick={() => setIsCanvasOpen(true)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Open Canvas Map
                  </button>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 my-4" />
                <SourceDependencyMap />
                <div className="border-t border-slate-100 dark:border-slate-800 my-4" />
                <EdgeCaseDemos />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Footer: Run Simulation Button */}
      <div className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
        <motion.button
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover-lift transition-all duration-300 shadow-sm relative overflow-hidden ${
            isRunning
              ? 'bg-indigo-100 text-indigo-500 cursor-not-allowed border-none'
              : isComplete
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
              : selectedSources.length > 0
              ? 'text-white cursor-pointer border-0'
              : 'bg-slate-100 text-slate-400 font-semibold cursor-not-allowed border-none'
          }`}
          style={
            !isRunning && !isComplete && selectedSources.length > 0
              ? { background: 'var(--gradient-primary)', boxShadow: '0 8px 16px -4px rgba(99,102,241,0.3)' }
              : {}
          }
          onClick={() => !isRunning && selectedSources.length > 0 && runSimulation()}
          whileHover={!isRunning && selectedSources.length > 0 ? { scale: 1.02 } : {}}
          whileTap={!isRunning && selectedSources.length > 0 ? { scale: 0.98 } : {}}
          disabled={isRunning || selectedSources.length === 0}
        >
          {isRunning && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          {isRunning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : isComplete ? (
            <>
              <CheckCircle2 size={16} />
              Re-Run Simulation
            </>
          ) : (
            <>
              <Play size={16} />
              Run MDF Simulation
            </>
          )}
        </motion.button>
      </div>

      <ArchitectureCanvas isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} />
    </div>
  );
}
