'use client';

import { motion } from 'framer-motion';
import { Sparkles, Phone, Mail, Scissors, Type } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const RULES = [
  { key: 'normalizePhone', label: 'Normalize Phone', description: 'Convert to (XXX) XXX-XXXX', icon: Phone, color: '#06b6d4' },
  { key: 'lowercaseEmail', label: 'Lowercase Email', description: 'Trim & lowercase all emails', icon: Mail, color: '#6366f1' },
  { key: 'trimWhitespace', label: 'Trim Whitespace', description: 'Remove leading/trailing spaces', icon: Scissors, color: '#f59e0b' },
  { key: 'properCaseNames', label: 'Proper-Case Names', description: 'Capitalize first letter of names', icon: Type, color: '#10b981' },
];

export default function HygieneRulesPanel() {
  const hygieneRules = useMDFStore((s) => s.hygieneRules);
  const toggleHygieneRule = useMDFStore((s) => s.toggleHygieneRule);
  const processingStage = useMDFStore((s) => s.processingStage);

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';
  const activeCount = Object.values(hygieneRules).filter(Boolean).length;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-cyan-600" />
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Hygiene Rules</h3>
        <span className="text-sm font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded-full border border-cyan-100">
          {activeCount}/{RULES.length}
        </span>
      </div>
      <div className="space-y-2">
        {RULES.map((rule) => {
          const isActive = hygieneRules[rule.key];
          return (
            <motion.div
              key={rule.key}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 ${
                isActive ? 'border-cyan-200 bg-cyan-50/30' : 'border-slate-100 bg-white'
              } ${isRunning ? 'opacity-50' : 'cursor-pointer hover:border-slate-200'}`}
              onClick={() => !isRunning && toggleHygieneRule(rule.key)}
              whileTap={!isRunning ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-2">
                <rule.icon size={13} style={{ color: isActive ? rule.color : '#94a3b8' }} />
                <div>
                  <p className="text-base font-semibold text-slate-900">{rule.label}</p>
                  <p className="text-sm text-slate-500">{rule.description}</p>
                </div>
              </div>
              <div className={`toggle-switch flex-shrink-0 ${isActive ? 'active' : ''}`} />
            </motion.div>
          );
        })}
      </div>
      {activeCount < RULES.length && (
        <p className="text-sm text-amber-600 font-medium mt-2 text-center">
          ⚠️ Disabled rules — identity resolution may miss matches
        </p>
      )}
    </div>
  );
}
