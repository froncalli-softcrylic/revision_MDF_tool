'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Wrench, X, CheckCircle2 } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const REQUIRED_COMPONENTS = [
  { check: (s) => s.selectedSources.length >= 2, label: 'At least 2 data sources selected', fixAction: null },
  { check: (s) => s.hygieneRules.normalizePhone && s.hygieneRules.lowercaseEmail, label: 'Core hygiene rules active (Phone + Email)', fixKey: 'hygiene' },
  { check: (s) => !s.edgeCases.missingEmail || s.selectedSources.length >= 4, label: 'Sufficient identity keys despite edge cases', fixAction: null },
];

export default function ValidationBanner() {
  const state = useMDFStore();
  const { selectedSources, hygieneRules, edgeCases, toggleHygieneRule } = state;

  if (selectedSources.length === 0) return null;

  const issues = REQUIRED_COMPONENTS.filter((comp) => !comp.check(state));

  if (issues.length === 0) return null;

  const handleFix = (fixKey) => {
    if (fixKey === 'hygiene') {
      if (!hygieneRules.normalizePhone) toggleHygieneRule('normalizePhone');
      if (!hygieneRules.lowercaseEmail) toggleHygieneRule('lowercaseEmail');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="glass-card border-amber-200 bg-amber-50/50 p-4"
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
      >
        <div className="flex items-start gap-3">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-base font-bold text-amber-900 mb-1.5">Configuration Warnings</h4>
            <ul className="space-y-1.5">
              {issues.map((issue, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-amber-800 font-medium flex items-center gap-1.5">
                    <AlertTriangle size={10} className="text-amber-500" />
                    {issue.label}
                  </span>
                  {issue.fixKey && (
                    <button
                      onClick={() => handleFix(issue.fixKey)}
                      className="text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                    >
                      <Wrench size={8} /> Auto-Fix
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
