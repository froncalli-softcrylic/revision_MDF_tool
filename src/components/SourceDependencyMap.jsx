'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ChevronDown, Link2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { SOURCE_CATALOG } from '@/store/sourceCatalog';

const DEPENDENCY_RULES = [
  {
    requires: ['crm', 'ga4'],
    label: 'CRM + Web Analytics',
    insight: 'Enables Identity Resolution — CRM email matches web cookies to de-anonymize sessions.',
    impact: 'high',
  },
  {
    requires: ['crm', 'pos'],
    label: 'CRM + Commerce',
    insight: 'Links lead data to purchase history for accurate LTV calculation and sales attribution.',
    impact: 'high',
  },
  {
    requires: ['crm', 'emailEngagement'],
    label: 'CRM + Email Engagement',
    insight: 'Combines contact records with engagement metrics for lead scoring and nurture optimization.',
    impact: 'medium',
  },
  {
    requires: ['ga4', 'paidSocial'],
    label: 'Web Analytics + Paid Media',
    insight: 'Multi-touch attribution across paid channels and organic web activity.',
    impact: 'high',
  },
  {
    requires: ['pos', 'loyalty'],
    label: 'Commerce + Loyalty',
    insight: 'Enriches purchase data with loyalty tier and rewards for personalization.',
    impact: 'medium',
  },
  {
    requires: ['webAppEvents', 'mobileAppEvents'],
    label: 'Web + Mobile App',
    insight: 'Cross-device identity stitching using email and device ID overlap.',
    impact: 'medium',
  },
  {
    requires: ['crm', 'support'],
    label: 'CRM + Support',
    insight: 'Unified view of sales pipeline and support history for churn prevention.',
    impact: 'medium',
  },
  {
    requires: ['identityGraph', 'crm'],
    label: 'Identity Graph + CRM',
    insight: 'External ID graph enriches CRM records with cross-device and household linkage.',
    impact: 'high',
  },
];

export default function SourceDependencyMap() {
  const selectedSources = useMDFStore((s) => s.selectedSources);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isOpen, setIsOpen] = useState(false);

  if (selectedSources.length < 2) return null;

  const matchedRules = DEPENDENCY_RULES
    .filter((r) => r.requires.every((id) => selectedSources.includes(id)))
    .sort((a, b) => (a.impact === 'high' ? -1 : 1));

  const possibleRules = DEPENDENCY_RULES
    .filter((r) => r.requires.some((id) => selectedSources.includes(id)) && !r.requires.every((id) => selectedSources.includes(id)));

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Network size={14} className="text-violet-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Source Synergies</h3>
          {matchedRules.length > 0 && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
              {matchedRules.length} active
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {/* Active synergies */}
              {matchedRules.map((rule, idx) => (
                <motion.div
                  key={rule.label}
                  className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-800">{rule.label}</span>
                    {rule.impact === 'high' && (
                      <Sparkles size={10} className="text-amber-500 ml-auto" />
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-medium ml-5">{rule.insight}</p>
                </motion.div>
              ))}

              {/* Missing synergies (suggestions) */}
              {possibleRules.length > 0 && (
                <>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Add to unlock:</p>
                  {possibleRules.slice(0, 3).map((rule, idx) => {
                    const missing = rule.requires.filter((id) => !selectedSources.includes(id));
                    const missingNames = missing.map((id) => SOURCE_CATALOG.find((s) => s.id === id)?.name || id);
                    return (
                      <motion.div
                        key={rule.label}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-100 border-dashed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={12} className="text-amber-400" />
                          <span className="text-[11px] font-bold text-slate-600">{rule.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium ml-5">
                          Add <span className="text-indigo-600 font-bold">{missingNames.join(', ')}</span> to enable this.
                        </p>
                      </motion.div>
                    );
                  })}
                </>
              )}

              {matchedRules.length === 0 && possibleRules.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-3">Select more sources to see synergies</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
