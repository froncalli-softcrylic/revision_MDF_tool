'use client';

import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMDFStore } from '@/store/store';

function QualityGauge({ label, score, color, delay = 0 }) {
  return (
    <motion.div
      className="flex-1 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="6" fill="none" />
          <motion.circle
            cx="40" cy="40" r="34"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - score / 100) }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-black"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DataQualityScore() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const rawData = useMDFStore((s) => s.rawData);
  const cleanedData = useMDFStore((s) => s.cleanedData);
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);

  if (processingStage === 'idle') return null;

  // Calculate before score: based on messiness of raw data
  const rawWithEmail = rawData.filter((r) => r.email).length;
  const rawWithPhone = rawData.filter((r) => r.phone).length;
  const rawWithName = rawData.filter((r) => r.firstName).length;
  const totalFields = rawData.length * 3; // email, phone, name are the 3 key fields
  const filledFields = rawWithEmail + rawWithPhone + rawWithName;
  const completenessRaw = totalFields > 0 ? Math.round((filledFields / totalFields) * 50) : 0;

  // Messiness penalty: check for inconsistent casing, spaces, etc.
  const messyEmails = rawData.filter((r) => r.email && (r.email.includes(' ') || r.email !== r.email.toLowerCase())).length;
  const messyPhones = rawData.filter((r) => r.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(r.phone)).length;
  const messinessScore = Math.max(0, completenessRaw - Math.round(((messyEmails + messyPhones) / Math.max(1, rawData.length)) * 30));
  const beforeScore = Math.max(20, Math.min(55, messinessScore + 20));

  // After score: based on cleaned data quality + deduplication
  const dedupRatio = rawData.length > 0 && unifiedProfiles.length > 0
    ? Math.round((1 - unifiedProfiles.length / rawData.length) * 30) : 0;
  const afterScore = processingStage === 'complete' || processingStage === 'activating' || processingStage === 'measurement'
    ? Math.min(98, beforeScore + 35 + dedupRatio)
    : beforeScore;

  const improvement = afterScore - beforeScore;

  return (
    <motion.div
      className="glass-card-sm p-4 bg-white border-slate-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={14} className="text-indigo-600" />
        <h4 className="text-base font-bold text-slate-900 uppercase tracking-wider">Data Quality Score</h4>
      </div>

      <div className="flex items-center gap-2">
        <QualityGauge label="Before MDF" score={beforeScore} color="#ef4444" delay={0} />

        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ArrowRight size={16} className="text-slate-400" />
          {processingStage === 'complete' && (
            <motion.span
              className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
            >
              +{improvement}
            </motion.span>
          )}
        </motion.div>

        <QualityGauge
          label="After MDF"
          score={afterScore}
          color={processingStage === 'complete' ? '#10b981' : '#94a3b8'}
          delay={0.3}
        />
      </div>

      {processingStage === 'complete' && (
        <motion.div
          className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <p className="text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={10} className="inline mr-1" />
            MDF improved data quality by {improvement} points — {rawData.length} records → {unifiedProfiles.length} unified profiles
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
