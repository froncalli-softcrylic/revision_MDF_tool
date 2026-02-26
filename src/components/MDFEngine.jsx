'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Sparkles, Fingerprint, UserCircle, BarChart3,
  Radio, ArrowUp, Lock, FileText, KeyRound,
  Target, Route, Megaphone, Palette, ChevronRight,
  Users, DollarSign, Globe, Mail, Smartphone, ShoppingCart,
  Eye
} from 'lucide-react';
import { useMDFStore } from '@/store/store';
import DataQualityScore from './DataQualityScore';
import OutcomeDashboard from './OutcomeDashboard';
import AudienceExportSimulator from './AudienceExportSimulator';
import BeforeAfterPanel from './BeforeAfterPanel';
import NoBypassVisual from './NoBypassVisual';
import IngestionLanes from './IngestionLanes';
import SegmentBuilder from './SegmentBuilder';
import PerSourceQuality from './PerSourceQuality';
import ROICalculator from './ROICalculator';
import DataVolumeSimulator from './DataVolumeSimulator';
import ComparisonMode from './ComparisonMode';
import SkeletonLoader from './SkeletonLoader';

const STAGES = [
  { id: 'hygiene', label: 'Data Hygiene', icon: Sparkles, color: '#22d3ee', description: 'Standardize formats', whyItMatters: 'Without standardization, "john@gmail.com" and "JOHN@Gmail.com" look like different people, causing missed matches and inflated profiles.' },
  { id: 'identity', label: 'Identity Resolution', icon: Fingerprint, color: '#8b5cf6', description: 'Stitch disparate IDs', whyItMatters: 'Customers interact across 5-7 channels. Without stitching IDs, a single customer appears as 5 different people in your CDP.' },
  { id: 'profiling', label: 'Unified Profile', icon: UserCircle, color: '#6366f1', description: '360° Golden Record', whyItMatters: 'Golden Records eliminate data silos. Marketing, sales, and support all see the same, authoritative customer view.' },
  { id: 'measurement', label: 'Measurement', icon: BarChart3, color: '#10b981', description: 'KPIs & Attribution', whyItMatters: 'Clean unified data enables accurate multi-touch attribution, preventing budget misallocation across channels.' },
];

const MARTECH = [
  { label: 'CDP', sublabel: 'Audience Mgmt', icon: Target, color: '#f43f5e' },
  { label: 'Orchestration', sublabel: 'Journeys', icon: Route, color: '#f59e0b' },
  { label: 'Campaigns', sublabel: 'Management', icon: Megaphone, color: '#6366f1' },
  { label: 'Personalization', sublabel: 'Real-time', icon: Palette, color: '#10b981' },
];

const GOVERNANCE = [
  { label: 'User Management', icon: Lock },
  { label: 'Meta Data Store', icon: FileText },
  { label: 'Access Store', icon: KeyRound },
];

const stageOrder = ['idle', 'ingesting', 'hygiene', 'identity', 'profiling', 'measurement', 'activating', 'complete'];

function getStageIndex(stage) {
  return stageOrder.indexOf(stage);
}

export default function MDFEngine() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const stageProgress = useMDFStore((s) => s.stageProgress);
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const selectProfile = useMDFStore((s) => s.selectProfile);
  const rawData = useMDFStore((s) => s.rawData);
  const cleanedData = useMDFStore((s) => s.cleanedData);
  const identityClusters = useMDFStore((s) => s.identityClusters);
  const currentIdx = getStageIndex(processingStage);
  const isActive = processingStage !== 'idle';

  // Inline micro-preview data for each stage
  const getStagePreview = (stageId) => {
    if (stageId === 'hygiene' && cleanedData.length > 0 && rawData.length > 0) {
      const raw = rawData[0];
      const clean = cleanedData[0];
      if (raw?.originalPhone && clean?.phone) return `"${raw.originalPhone}" → "${clean.phone}"`;
      if (raw?.originalEmail && clean?.email) return `"${raw.originalEmail}" → "${clean.email}"`;
    }
    if (stageId === 'identity' && identityClusters.length > 0) {
      return `${identityClusters.length} identity clusters found`;
    }
    if (stageId === 'profiling' && unifiedProfiles.length > 0) {
      return `${unifiedProfiles.length} Golden Records created`;
    }
    if (stageId === 'measurement' && unifiedProfiles.length > 0) {
      const avgLtv = Math.round(unifiedProfiles.reduce((s, p) => s + p.ltv, 0) / unifiedProfiles.length);
      return `Avg LTV: $${avgLtv.toLocaleString()}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* MDF Engine Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50">
              <Sparkles size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">MDF Engine & Customer Directory</h2>
              <p className="text-base text-slate-500 font-medium">Data Pipeline · Golden Records · MarTech Activation</p>
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <div className={`w-2.5 h-2.5 rounded-full ${processingStage === 'complete' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse-dot'}`} />
              <span className="text-base font-semibold text-slate-600 capitalize">{processingStage}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isActive && (
          <div className="mt-3">
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--gradient-primary)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${stageProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-slate-600">Ingestion</span>
              <span className="text-sm text-slate-600">Activation</span>
            </div>
          </div>
        )}
      </div>

      {/* Pipeline + Governance Layout */}
      <div className="flex gap-2 sm:gap-3">
        {/* Governance Left Rail */}
        <div className="hidden md:flex governance-rail p-2 flex-col gap-3 items-center justify-center w-12 flex-shrink-0">
          {GOVERNANCE.map((g) => (
            <div key={g.label} className="flex flex-col items-center gap-1" title={g.label}>
              <g.icon size={14} className="text-amber-600/70" />
              <span className="text-xs font-bold text-amber-700/60 text-center leading-tight">{g.label.split(' ')[0]}</span>
            </div>
          ))}
          <div className="mt-1">
            <ShieldCheck size={12} className="text-amber-400/40" />
          </div>
        </div>

        {/* Main Pipeline */}
        <div className="flex-1 space-y-3">
          {/* Ingestion Indicator */}
          <AnimatePresence>
            {isActive && currentIdx >= 1 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                className="glass-card-sm p-4 flex items-center justify-between bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <Radio size={16} className="text-cyan-600 animate-pulse-dot" />
                  <span className="text-base font-semibold text-slate-700">
                    {rawData.length} raw records ingested
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-realtime">Realtime</span>
                  <span className="badge badge-batch">Batch</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4 MDF Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {STAGES.map((stage, idx) => {
              const stageIdx = getStageIndex(stage.id);
              const isActiveStage = processingStage === stage.id;
              const isPast = currentIdx > stageIdx;
              const isFuture = currentIdx < stageIdx;

              return (
                <motion.div
                  key={stage.id}
                  className={`glass-card-sm p-4 text-center transition-all duration-500 bg-white ${
                    isActiveStage
                      ? 'animate-stage-glow border-indigo-400 shadow-md'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isFuture && isActive ? 0.4 : 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: isActiveStage || isPast
                          ? `${stage.color}15`
                          : '#f1f5f9' // slate-100
                      }}
                      animate={isActiveStage ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <stage.icon
                        size={20}
                        style={{ color: isActiveStage || isPast ? stage.color : '#94a3b8' }}
                      />
                    </motion.div>
                    <p className={`text-base font-bold ${
                      isActiveStage ? 'text-indigo-900' : isPast ? 'text-emerald-700' : 'text-slate-600'
                    }`}>
                      {stage.label}
                    </p>
                    <p className="text-sm font-medium text-slate-500">{stage.description}</p>
                    {isPast && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
                      >
                        <span className="text-xs text-emerald-400">✓</span>
                      </motion.div>
                    )}
                  </div>
                  {/* Inline stage micro-preview */}
                  {(isActiveStage || isPast) && getStagePreview(stage.id) && (
                    <motion.div
                      className="mt-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-[10px] text-slate-600 font-mono font-medium truncate">
                        {getStagePreview(stage.id)}
                      </p>
                    </motion.div>
                  )}
                  {/* "Why this matters" tooltip */}
                  {(isActiveStage || isPast) && stage.whyItMatters && (
                    <motion.div
                      className="mt-2 px-2 py-1.5 rounded-lg bg-indigo-50/70 border border-indigo-100"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-xs text-indigo-700 font-medium leading-relaxed break-words break-all sm:break-normal">
                        💡 {stage.whyItMatters}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Animated Pipeline Connector */}
          {isActive && currentIdx >= 2 && (
            <div className="px-4 py-2 relative h-6 w-full flex items-center overflow-hidden rounded-full">
              <div className="w-full h-[2px] bg-slate-200 absolute inset-x-4" />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full absolute"
                  style={{ background: 'var(--gradient-primary)', boxShadow: '0 0 8px 2px rgba(99,102,241,0.4)', left: 0 }}
                  initial={{ x: '-10px', opacity: 0 }}
                  animate={{ x: '800px', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
                />
              ))}
            </div>
          )}

          {/* Flow UP to MarTech */}
          <AnimatePresence>
            {(currentIdx >= getStageIndex('activating') || processingStage === 'complete') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-center gap-3 py-3">
                  <ArrowUp size={16} className="text-indigo-500 animate-float" />
                  <span className="text-base text-indigo-600 font-bold uppercase tracking-wider">
                    Composable MarTech Stack
                  </span>
                  <ArrowUp size={16} className="text-indigo-500 animate-float" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  {MARTECH.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      className="glass-card-sm p-4 text-center bg-white/70 backdrop-blur-md border border-slate-200 hover-lift relative overflow-hidden group hover:border-indigo-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500 transform -translate-x-full group-hover:translate-x-full duration-1000" />
                      <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${item.color}15` }}>
                        <item.icon size={18} style={{ color: item.color }} />
                      </div>
                      <p className="text-base font-bold text-slate-900 relative z-10">{item.label}</p>
                      <p className="text-sm font-medium text-slate-500 relative z-10">{item.sublabel}</p>
                      {/* MarTech flow count */}
                      {processingStage === 'complete' && unifiedProfiles.length > 0 && (
                        <motion.div
                          className="mt-1.5 text-[10px] font-bold text-indigo-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                          ↑ {unifiedProfiles.length} profiles
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Governance Right Rail */}
        <div className="hidden md:flex governance-rail p-2 flex-col gap-3 items-center justify-center w-12 flex-shrink-0">
          <span className="text-sm text-amber-600/70 font-bold uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>
            Enterprise Controls
          </span>
          <ShieldCheck size={18} className="text-amber-500/60" />
        </div>
      </div>

      {/* Customer Directory */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">Customer Directory</h3>
          </div>
          {unifiedProfiles.length > 0 && (
            <span className="badge badge-source">{unifiedProfiles.length} Golden Records</span>
          )}
        </div>

        {isActive && processingStage !== 'complete' && unifiedProfiles.length === 0 ? (
          <div className="mt-4">
            <SkeletonLoader type="profile" count={5} />
          </div>
        ) : unifiedProfiles.length === 0 ? (
          <div className="text-center py-10">
            <UserCircle size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-lg text-slate-500">No unified profiles yet</p>
            <p className="text-base text-slate-600 mt-1">Run a simulation to generate Golden Records</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {unifiedProfiles.map((profile, idx) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                  className="glass-card-sm p-4 cursor-pointer border border-slate-200 hover-lift bg-white hover:bg-slate-50/50 hover:border-indigo-300 group"
                  onClick={() => selectProfile(profile)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm flex-shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                        {profile.firstName[0]}{profile.lastName[0]}
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-sm sm:text-base font-medium text-slate-500 truncate max-w-[200px] sm:max-w-none">{profile.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <p className="text-base text-emerald-600 font-bold">${profile.ltv.toLocaleString()} LTV</p>
                        <div className="flex gap-1 mt-1 justify-start sm:justify-end">
                          {profile.sources.map((s) => (
                            <span key={s} className="w-2 h-2 rounded-full bg-indigo-500" title={s} />
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1.5 transition-all duration-300 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Source badges row */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {profile.sources.map((s) => (
                      <span key={s} className="badge badge-source">{s}</span>
                    ))}
                    {profile.ingestionTypes.map((t) => (
                      <span key={t} className={`badge ${t === 'Realtime' ? 'badge-realtime' : 'badge-batch'}`}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Section 1: DATA QUALITY OVERVIEW ── */}
      <motion.div
        className="flex items-center gap-3 mt-2 mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
        <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest whitespace-nowrap">📊 Data Quality Overview</span>
        <div className="h-px flex-1 bg-gradient-to-l from-indigo-200 to-transparent" />
      </motion.div>
      <DataQualityScore />
      <PerSourceQuality />

      {/* ── Section 2: IMPACT OF CLEANSING ── */}
      <motion.div
        className="flex items-center gap-3 mt-2 mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-200 to-transparent" />
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest whitespace-nowrap">✨ Impact of Cleansing</span>
        <div className="h-px flex-1 bg-gradient-to-l from-cyan-200 to-transparent" />
      </motion.div>
      <BeforeAfterPanel />
      <NoBypassVisual isActive={isActive} />
      <IngestionLanes />

      {/* ── Section 3: AUDIENCE ACTIVATION ── */}
      <motion.div
        className="flex items-center gap-3 mt-2 mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-violet-200 to-transparent" />
        <span className="text-[11px] font-bold text-violet-600 uppercase tracking-widest whitespace-nowrap">🎯 Audience Activation</span>
        <div className="h-px flex-1 bg-gradient-to-l from-violet-200 to-transparent" />
      </motion.div>
      <SegmentBuilder />
      <AudienceExportSimulator />

      {/* ── Section 4: BUSINESS VALUE ── */}
      <motion.div
        className="flex items-center gap-3 mt-2 mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest whitespace-nowrap">💰 Business Value</span>
        <div className="h-px flex-1 bg-gradient-to-l from-emerald-200 to-transparent" />
      </motion.div>
      <ROICalculator />
      <OutcomeDashboard />
      <DataVolumeSimulator />
      <ComparisonMode />
    </div>
  );
}
