'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, CheckCircle2, Target, Route, Users, Sparkles,
  ArrowRight, Loader2, Zap
} from 'lucide-react';
import { useMDFStore } from '@/store/store';

const DESTINATIONS = [
  { id: 'meta', name: 'Meta Ads', icon: Target, color: '#1877F2', description: 'Custom Audiences' },
  { id: 'ajo', name: 'Adobe Journey Optimizer', icon: Route, color: '#FF0000', description: 'Journey Triggers' },
  { id: 'google', name: 'Google Ads', icon: Target, color: '#34A853', description: 'Customer Match' },
  { id: 'braze', name: 'Braze', icon: Sparkles, color: '#FF6F00', description: 'User Segments' },
];

export default function AudienceExportSimulator() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const [selectedDests, setSelectedDests] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState([]);

  if (processingStage !== 'complete' || unifiedProfiles.length === 0) return null;

  const toggleDest = (id) => {
    if (exporting) return;
    setSelectedDests((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedDests.length === 0 || exporting) return;
    setExporting(true);
    setExported([]);
    for (const destId of selectedDests) {
      await new Promise((r) => setTimeout(r, 800));
      setExported((prev) => [...prev, destId]);
    }
    setExporting(false);
  };

  const eligibleCount = unifiedProfiles.filter((p) => p.email).length;

  return (
    <motion.div
      className="glass-card-sm p-5 bg-white border-slate-200"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Upload size={14} className="text-indigo-600" />
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Audience Export</h3>
        <span className="badge badge-source text-sm ml-auto">
          <Users size={8} className="inline mr-0.5" />
          {eligibleCount} eligible
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-3">Push unified profiles to your MarTech destinations</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {DESTINATIONS.map((dest) => {
          const isSelected = selectedDests.includes(dest.id);
          const isExported = exported.includes(dest.id);
          return (
            <motion.button
              key={dest.id}
              className={`p-2.5 rounded-lg border text-left transition-all duration-200 ${
                isExported
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : isSelected
                  ? 'border-indigo-300 bg-indigo-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => toggleDest(dest.id)}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${dest.color}15` }}>
                  {isExported ? (
                    <CheckCircle2 size={12} className="text-emerald-600" />
                  ) : (
                    <dest.icon size={12} style={{ color: dest.color }} />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-900">{dest.name}</span>
              </div>
              <p className="text-sm text-slate-500">{isExported ? `${eligibleCount} profiles sent` : dest.description}</p>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
          selectedDests.length === 0 || exporting
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : exported.length > 0
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'text-white cursor-pointer'
        }`}
        style={
          selectedDests.length > 0 && !exporting && exported.length === 0
            ? { background: 'var(--gradient-primary)' }
            : {}
        }
        onClick={handleExport}
        whileHover={selectedDests.length > 0 && !exporting ? { scale: 1.02 } : {}}
        whileTap={selectedDests.length > 0 && !exporting ? { scale: 0.98 } : {}}
        disabled={selectedDests.length === 0 || exporting}
      >
        {exporting ? (
          <><Loader2 size={12} className="animate-spin" /> Exporting {exported.length + 1}/{selectedDests.length}...</>
        ) : exported.length > 0 ? (
          <><CheckCircle2 size={12} /> All segments exported!</>
        ) : (
          <><Zap size={12} /> Export to {selectedDests.length || '...'} destination{selectedDests.length !== 1 ? 's' : ''}</>
        )}
      </motion.button>
    </motion.div>
  );
}
