'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Settings, Sparkles, Fingerprint, X, Moon, Sun } from 'lucide-react';
import { useMDFStore } from '@/store/store';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const runSimulation = useMDFStore((s) => s.runSimulation);
  const toggleTheme = useMDFStore((s) => s.toggleTheme);
  const theme = useMDFStore((s) => s.theme);
  const applyPreset = useMDFStore((s) => s.applyPreset);
  const setIdentityMode = useMDFStore((s) => s.setIdentityMode);
  const selectedSources = useMDFStore((s) => s.selectedSources);

  // Define searchable actions
  const actions = [
    {
      id: 'run',
      title: 'Run Simulation',
      icon: Play,
      category: 'Actions',
      disabled: selectedSources.length === 0,
      action: () => {
        if (selectedSources.length > 0) runSimulation();
      }
    },
    {
      id: 'theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      category: 'Actions',
      disabled: false,
      action: toggleTheme
    },
    {
      id: 'preset_retail',
      title: 'Apply Retail Preset',
      icon: Sparkles,
      category: 'Presets',
      disabled: false,
      action: () => applyPreset('retail')
    },
    {
      id: 'preset_b2b',
      title: 'Apply B2B SaaS Preset',
      icon: Sparkles,
      category: 'Presets',
      disabled: false,
      action: () => applyPreset('b2bSaas')
    },
    {
      id: 'preset_health',
      title: 'Apply Healthcare Preset',
      icon: Sparkles,
      category: 'Presets',
      disabled: false,
      action: () => applyPreset('healthcare')
    },
    {
      id: 'id_det',
      title: 'Use Deterministic Identity',
      icon: Fingerprint,
      category: 'Identity',
      disabled: false,
      action: () => setIdentityMode('deterministic')
    },
    {
      id: 'id_prob',
      title: 'Use Probabilistic Identity',
      icon: Fingerprint,
      category: 'Identity',
      disabled: false,
      action: () => setIdentityMode('probabilistic')
    }
  ];

  // Filter actions based on search query
  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global hotkey listener (Ctrl+K or Cmd+K to open, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle keyboard navigation within the modal
  useEffect(() => {
    const handleNavigation = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex] && !filteredActions[selectedIndex].disabled) {
          filteredActions[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, filteredActions, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl mx-4 bg-white dark:bg-[#0f172a] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
              <Search size={20} className="text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 w-full bg-transparent text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Action List */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredActions.map((action, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={action.id}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all outline-none ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      } ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        if (!action.disabled) {
                          action.action();
                          setIsOpen(false);
                        }
                      }}
                    >
                      <action.icon
                        size={18}
                        className={isSelected ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'}
                      />
                      <div className="flex-1 text-left flex flex-col">
                        <span className="text-sm font-semibold">{action.title}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 max-w-fit">
                        {action.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-[#0b1120] border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-medium flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm font-mono text-[10px]">↑↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm font-mono text-[10px]">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm font-mono text-[10px]">esc</kbd>
                to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
