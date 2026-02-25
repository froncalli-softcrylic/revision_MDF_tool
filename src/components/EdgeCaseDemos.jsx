'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, MailX, Copy, PhoneOff } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const EDGE_CASES = [
  {
    key: 'missingEmail',
    label: 'Missing Emails',
    description: '~40% of records lack email addresses',
    icon: MailX,
    color: '#ef4444',
  },
  {
    key: 'duplicateCRM',
    label: 'Duplicate CRM Records',
    description: '30% duplicated with slight name variations',
    icon: Copy,
    color: '#f59e0b',
  },
  {
    key: 'mismatchedPhones',
    label: 'Mismatched Phone Formats',
    description: 'Extremely inconsistent phone formatting',
    icon: PhoneOff,
    color: '#8b5cf6',
  },
];

export default function EdgeCaseDemos() {
  const edgeCases = useMDFStore((s) => s.edgeCases);
  const toggleEdgeCase = useMDFStore((s) => s.toggleEdgeCase);
  const processingStage = useMDFStore((s) => s.processingStage);

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';
  const activeCount = Object.values(edgeCases).filter(Boolean).length;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={14} className="text-amber-600" />
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Edge Cases</h3>
        {activeCount > 0 && (
          <span className="text-sm font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-full">{activeCount}</span>
        )}
      </div>
      <div className="space-y-2">
        {EDGE_CASES.map((ec) => {
          const isActive = edgeCases[ec.key];
          return (
            <motion.div
              key={ec.key}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 ${
                isActive ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 bg-white'
              } ${isRunning ? 'opacity-50' : 'cursor-pointer hover:border-slate-200'}`}
              onClick={() => !isRunning && toggleEdgeCase(ec.key)}
              whileTap={!isRunning ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-2">
                <ec.icon size={13} style={{ color: ec.color }} />
                <div>
                  <p className="text-base font-semibold text-slate-900">{ec.label}</p>
                  <p className="text-sm text-slate-500">{ec.description}</p>
                </div>
              </div>
              <div className={`toggle-switch flex-shrink-0 ${isActive ? 'active' : ''}`} />
            </motion.div>
          );
        })}
      </div>
      {activeCount > 0 && (
        <p className="text-sm text-amber-600 font-medium mt-2 text-center">
          ⚠️ Edge cases active — re-run simulation to see effects
        </p>
      )}
    </div>
  );
}
