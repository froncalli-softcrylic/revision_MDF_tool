'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, FileText, KeyRound, Eye, UserCheck, Database, CheckCircle2 } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const GOVERNANCE_ITEMS = [
  {
    label: 'Data Privacy Controls',
    description: 'PII masking, consent enforcement, GDPR/CCPA',
    icon: Shield,
    color: '#6366f1',
    details: 'All customer PII is masked before identity resolution. Consent signals are respected per jurisdiction.',
  },
  {
    label: 'Access Management',
    description: 'Role-based access, audit trails',
    icon: Lock,
    color: '#f43f5e',
    details: 'Row-level and column-level security. All data access logged with user attribution.',
  },
  {
    label: 'Data Lineage',
    description: 'Full source-to-profile traceability',
    icon: Eye,
    color: '#f59e0b',
    details: 'Every Golden Record field traces back to its original source record and transformation.',
  },
  {
    label: 'Metadata Registry',
    description: 'Schema validation, field dictionaries',
    icon: FileText,
    color: '#10b981',
    details: 'Centralized schema registry ensures field names and types are consistent across all sources.',
  },
  {
    label: 'Identity Governance',
    description: 'Match thresholds, merge rules',
    icon: UserCheck,
    color: '#8b5cf6',
    details: 'Identity resolution thresholds are configurable. Manual review is triggered below confidence Floor.',
  },
  {
    label: 'Data Retention',
    description: 'TTL policies, right-to-delete',
    icon: Database,
    color: '#06b6d4',
    details: 'Automated data expiration policies. Right-to-delete cascades through all transformed datasets.',
  },
];

export default function GovernancePanel() {
  const governanceMode = useMDFStore((s) => s.governanceMode);
  const toggleGovernance = useMDFStore((s) => s.toggleGovernance);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Governance & Compliance</h3>
        </div>
        <div
          className={`toggle-switch flex-shrink-0 ${governanceMode ? 'active' : ''}`}
          onClick={toggleGovernance}
        />
      </div>

      {governanceMode ? (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {GOVERNANCE_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              className="p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-all group"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12` }}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-base font-bold text-slate-900">{item.label}</p>
                    <CheckCircle2 size={10} className="text-emerald-500" />
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{item.description}</p>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors">{item.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div
            className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={10} className="inline mr-1" />
              All 6 governance pillars active — enterprise compliance ready
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-3 font-medium">
          Toggle to see governance & compliance controls that protect your MDF
        </p>
      )}
    </div>
  );
}
