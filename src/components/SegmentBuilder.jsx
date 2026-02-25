'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Plus, X, Users, Download, ChevronDown } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const FIELD_OPTIONS = [
  { value: 'ltv', label: 'Lifetime Value ($)', type: 'number' },
  { value: 'totalSpend', label: 'Total Spend ($)', type: 'number' },
  { value: 'leadScore', label: 'Lead Score', type: 'number' },
  { value: 'recordCount', label: 'Sources Merged', type: 'number' },
  { value: 'email', label: 'Has Email', type: 'exists' },
  { value: 'phone', label: 'Has Phone', type: 'exists' },
  { value: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'prospect', 'churned'] },
];

const OPERATORS = {
  number: [
    { value: 'gt', label: '>' },
    { value: 'gte', label: '≥' },
    { value: 'lt', label: '<' },
    { value: 'lte', label: '≤' },
    { value: 'eq', label: '=' },
  ],
  exists: [{ value: 'exists', label: 'exists' }, { value: 'notExists', label: 'does not exist' }],
  select: [{ value: 'eq', label: 'is' }, { value: 'neq', label: 'is not' }],
};

function evaluateRule(profile, rule) {
  const val = profile[rule.field];
  if (rule.type === 'exists') {
    return rule.operator === 'exists' ? !!val : !val;
  }
  if (rule.type === 'number') {
    const num = Number(val) || 0;
    const target = Number(rule.value) || 0;
    if (rule.operator === 'gt') return num > target;
    if (rule.operator === 'gte') return num >= target;
    if (rule.operator === 'lt') return num < target;
    if (rule.operator === 'lte') return num <= target;
    if (rule.operator === 'eq') return num === target;
  }
  if (rule.type === 'select') {
    if (rule.operator === 'eq') return val === rule.value;
    if (rule.operator === 'neq') return val !== rule.value;
  }
  return true;
}

export default function SegmentBuilder() {
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const [rules, setRules] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addRule = () => {
    const field = FIELD_OPTIONS[0];
    const ops = OPERATORS[field.type];
    setRules([...rules, {
      id: Date.now(),
      field: field.value,
      type: field.type,
      operator: ops[0].value,
      value: field.type === 'number' ? '0' : field.options?.[0] || '',
    }]);
  };

  const updateRule = (id, updates) => {
    setRules(rules.map((r) => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRule = (id) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const changeField = (id, fieldValue) => {
    const fieldDef = FIELD_OPTIONS.find((f) => f.value === fieldValue);
    const ops = OPERATORS[fieldDef.type];
    updateRule(id, {
      field: fieldValue,
      type: fieldDef.type,
      operator: ops[0].value,
      value: fieldDef.type === 'number' ? '0' : fieldDef.options?.[0] || '',
    });
  };

  const matchingProfiles = useMemo(() => {
    if (rules.length === 0) return unifiedProfiles;
    return unifiedProfiles.filter((p) => rules.every((r) => evaluateRule(p, r)));
  }, [rules, unifiedProfiles]);

  const matchPct = unifiedProfiles.length > 0
    ? Math.round((matchingProfiles.length / unifiedProfiles.length) * 100)
    : 0;

  if (unifiedProfiles.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Audience Segment Builder</h3>
          {rules.length > 0 && (
            <span className="text-[10px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded-full">
              {matchingProfiles.length}/{unifiedProfiles.length}
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
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
              {/* Rules */}
              {rules.map((rule, idx) => {
                const fieldDef = FIELD_OPTIONS.find((f) => f.value === rule.field);
                const ops = OPERATORS[rule.type] || [];
                return (
                  <motion.div
                    key={rule.id}
                    className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {idx > 0 && <span className="text-[10px] font-bold text-indigo-500">AND</span>}
                    <select
                      value={rule.field}
                      onChange={(e) => changeField(rule.id, e.target.value)}
                      className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 outline-none"
                    >
                      {FIELD_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <select
                      value={rule.operator}
                      onChange={(e) => updateRule(rule.id, { operator: e.target.value })}
                      className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 outline-none"
                    >
                      {ops.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {rule.type === 'number' && (
                      <input
                        type="number"
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                        className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-1 w-20 text-slate-700 outline-none"
                      />
                    )}
                    {rule.type === 'select' && (
                      <select
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                        className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 outline-none"
                      >
                        {fieldDef.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                    <button onClick={() => removeRule(rule.id)} className="text-slate-400 hover:text-rose-500 ml-auto">
                      <X size={12} />
                    </button>
                  </motion.div>
                );
              })}

              {/* Add Rule Button */}
              <button
                onClick={addRule}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Plus size={12} /> Add Rule
              </button>

              {/* Results Bar */}
              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-indigo-600" />
                    <span className="text-[11px] font-bold text-indigo-700">
                      {matchingProfiles.length} of {unifiedProfiles.length} profiles match
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-500">{matchPct}%</span>
                </div>
                <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--gradient-primary)' }}
                    initial={{ width: '100%' }}
                    animate={{ width: `${matchPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                {rules.length > 0 && matchingProfiles.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {matchingProfiles.slice(0, 5).map((p) => (
                      <span key={p.id} className="text-[9px] font-medium text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                        {p.firstName} {p.lastName[0]}.
                      </span>
                    ))}
                    {matchingProfiles.length > 5 && (
                      <span className="text-[9px] font-medium text-indigo-400">+{matchingProfiles.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
