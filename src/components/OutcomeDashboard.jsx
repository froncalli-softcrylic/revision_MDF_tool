'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, Users, GitMerge, Target, Gauge, ArrowDown, ArrowUp,
  CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useMDFStore } from '@/store/store';

function MetricCard({ icon: Icon, label, value, subtitle, color, delay = 0 }) {
  return (
    <motion.div
      className="glass-card-sm p-4 bg-white border-slate-200 hover-lift transition-all"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      {subtitle && <p className="text-sm font-medium text-slate-500 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}

function ReadinessMeter({ percentage, delay = 0 }) {
  const color = percentage >= 80 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';
  const label = percentage >= 80 ? 'Activation Ready' : percentage >= 50 ? 'Partially Ready' : 'Not Ready';

  return (
    <motion.div
      className="glass-card-sm p-4 bg-white border-slate-200"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gauge size={14} style={{ color }} />
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Activation Readiness</span>
        </div>
        <span className="text-base font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>
      <p className="text-right text-base font-black mt-1" style={{ color }}>{percentage}%</p>
    </motion.div>
  );
}

export default function OutcomeDashboard() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const rawData = useMDFStore((s) => s.rawData);
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const identityClusters = useMDFStore((s) => s.identityClusters);

  if (processingStage !== 'complete') return null;

  const totalRaw = rawData.length;
  const totalProfiles = unifiedProfiles.length;
  const duplicatesRemoved = totalRaw - totalProfiles;
  const duplicationRate = totalRaw > 0 ? Math.round((duplicatesRemoved / totalRaw) * 100) : 0;

  // Match rate: profiles with at least 2 sources merged
  const matchedProfiles = unifiedProfiles.filter((p) => p.recordCount >= 2).length;
  const matchRate = totalProfiles > 0 ? Math.round((matchedProfiles / totalProfiles) * 100) : 0;

  // Attribution confidence = profiles with high/medium match confidence
  const highConf = unifiedProfiles.filter((p) => p.matchConfidence === 'high').length;
  const medConf = unifiedProfiles.filter((p) => p.matchConfidence === 'medium').length;
  const attrConfidence = totalProfiles > 0 ? Math.round(((highConf * 1 + medConf * 0.6) / totalProfiles) * 100) : 0;

  // Activation readiness: based on hygiene + identity completeness
  const profilesWithEmail = unifiedProfiles.filter((p) => p.email).length;
  const readiness = totalProfiles > 0 ? Math.round((profilesWithEmail / totalProfiles) * 90 + (matchRate > 50 ? 10 : 0)) : 0;

  return (
    <motion.div
      className="glass-card-sm p-5 bg-gradient-to-br from-white to-slate-50/50 border-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Business Outcomes</h3>
        <span className="badge badge-source text-sm ml-auto">Post-MDF</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricCard
          icon={GitMerge}
          label="Match Rate"
          value={`${matchRate}%`}
          subtitle={`${matchedProfiles}/${totalProfiles} profiles resolved`}
          color="#6366f1"
          delay={0.1}
        />
        <MetricCard
          icon={ArrowDown}
          label="Duplication Reduced"
          value={`${duplicationRate}%`}
          subtitle={`${duplicatesRemoved} duplicates merged`}
          color="#10b981"
          delay={0.2}
        />
        <MetricCard
          icon={Target}
          label="Attribution Confidence"
          value={`${attrConfidence}%`}
          subtitle={`${highConf} high, ${medConf} medium`}
          color="#f59e0b"
          delay={0.3}
        />
        <MetricCard
          icon={Users}
          label="Golden Records"
          value={totalProfiles}
          subtitle={`From ${totalRaw} raw records`}
          color="#8b5cf6"
          delay={0.4}
        />
      </div>

      <ReadinessMeter percentage={readiness} delay={0.5} />
    </motion.div>
  );
}
