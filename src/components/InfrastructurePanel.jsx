'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Zap, Clock, Play, Loader2, CheckCircle2,
  ArrowRight, ChevronDown, Search, ChevronsDownUp
} from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { SOURCE_CATALOG, SOURCE_CATEGORIES, getSourcesByCategory, DATA_CLASS_COLORS } from '@/store/sourceCatalog';

export default function InfrastructurePanel() {
  const selectedSources = useMDFStore((s) => s.selectedSources);
  const toggleSource = useMDFStore((s) => s.toggleSource);
  const runSimulation = useMDFStore((s) => s.runSimulation);
  const processingStage = useMDFStore((s) => s.processingStage);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';
  const isComplete = processingStage === 'complete';

  const toggleCategory = (key) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? false : !prev[key],
    }));
  };

  const allCollapsed = SOURCE_CATEGORIES.every((cat) => expandedCategories[cat.key] === false);

  const toggleAll = () => {
    const next = {};
    SOURCE_CATEGORIES.forEach((cat) => { next[cat.key] = allCollapsed; });
    setExpandedCategories(next);
  };

  const filteredCatalog = searchQuery.trim()
    ? SOURCE_CATALOG.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.dataClass.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SOURCE_CATALOG;

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-50">
            <Database size={20} className="text-cyan-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Client Data Infrastructure</h2>
            <p className="text-base text-slate-500 font-medium">
              {selectedSources.length} of {SOURCE_CATALOG.length} sources selected
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar + Collapse All */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sources..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-[2px] focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            onClick={toggleAll}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
            title={allCollapsed ? "Expand all categories" : "Collapse all categories"}
          >
            <ChevronsDownUp size={14} />
          </button>
        </div>
      </div>

      {/* Source Categories */}
      {SOURCE_CATEGORIES.map((category) => {
        const categorySources = searchQuery.trim()
          ? filteredCatalog.filter((s) => s.sourceCategory === category.key)
          : getSourcesByCategory(category.key);

        if (categorySources.length === 0) return null;

        const isExpanded = expandedCategories[category.key] !== false; // default open
        const selectedInCategory = categorySources.filter((s) => selectedSources.includes(s.id)).length;

        return (
          <motion.div
            key={category.key}
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category Header — Clickable to collapse */}
            <button
              onClick={() => toggleCategory(category.key)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: category.color }} />
                <h3 className="text-[13px] font-bold text-slate-900">{category.label}</h3>
                {category.architectureTier && (
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {category.architectureTier}
                  </span>
                )}
                {selectedInCategory > 0 && (
                  <span className="text-sm font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: category.color }}>
                    {selectedInCategory}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${category.badgeClass} text-sm`}>
                  {category.ingestionType === 'Realtime' ? <><Zap size={8} /> Realtime</> : category.ingestionType === 'Batch' ? <><Clock size={8} /> Batch</> : <><Zap size={8} /> Mixed</>}
                </span>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} className="text-slate-400" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    <p className="text-sm text-slate-500 font-medium mb-2">{category.description}</p>
                    {categorySources.map((source) => {
                      const isActive = selectedSources.includes(source.id);
                      const dcStyle = DATA_CLASS_COLORS[source.dataClass] || DATA_CLASS_COLORS.event;
                      return (
                        <motion.div
                          key={source.id}
                          className={`glass-card-sm p-3 cursor-pointer hover-lift transition-all duration-300 ${
                            isActive ? 'border-indigo-300 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                          onClick={() => !isRunning && toggleSource(source.id)}
                          whileHover={{ scale: isRunning ? 1 : 1.01 }}
                          whileTap={{ scale: isRunning ? 1 : 0.99 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                <source.icon size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-base font-semibold text-slate-900 truncate">{source.name}</p>
                                <p className="text-sm text-slate-500 truncate">{source.description}</p>
                              </div>
                            </div>
                            <div className={`toggle-switch flex-shrink-0 ${isActive ? 'active' : ''}`} />
                          </div>

                          {/* Data Class + Identity pills */}
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-sm font-bold ${dcStyle.bg} ${dcStyle.text} ${dcStyle.border} border`}>
                              {dcStyle.label}
                            </span>
                            {source.identitiesAvailable.slice(0, 3).map((id) => (
                              <span key={id} className="inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                {id}
                              </span>
                            ))}
                            {source.identitiesAvailable.length > 3 && (
                              <span className="text-sm text-slate-400 font-medium">+{source.identitiesAvailable.length - 3}</span>
                            )}
                          </div>

                          {/* Flow indicator */}
                          <AnimatePresence>
                            {isActive && isRunning && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 pt-2 border-t border-slate-100"
                              >
                                <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-dot" />
                                  <span>Streaming to MDF Engine</span>
                                  <ArrowRight size={10} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Run Simulation Button */}
      <motion.button
        className={`w-full py-4 px-6 rounded-xl font-bold text-xl flex items-center justify-center gap-3 hover-lift transition-all duration-300 shadow-sm relative overflow-hidden ${
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
        {/* Shimmer effect when running */}
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

      {/* Source Count */}
      <div className="text-center pt-1">
        <p className="text-sm font-medium text-slate-500">
          {selectedSources.length} of {SOURCE_CATALOG.length} sources selected
        </p>
      </div>
    </div>
  );
}
