'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

/**
 * Conflict Resolution Panel — shows which fields had conflicts across
 * sources and which value "won" the merge, with the merge strategy used.
 * Displayed inside the CustomerStory modal.
 */
export default function ConflictResolution({ profile }) {
  if (!profile || !profile.sources || profile.sources.length < 2) return null;

  // Build conflicts from profile data — simulate realistic conflict scenarios
  const conflicts = [];

  // Phone conflict: if the profile has phone and multiple sources
  if (profile.phone && profile.sources.length >= 2) {
    const variants = [
      { source: profile.sources[0], value: profile.phone.replace(/[()-\s]/g, ''), raw: true },
      { source: profile.sources[1], value: profile.phone, raw: false },
    ];
    if (profile.sources.length >= 3) {
      variants.push({ source: profile.sources[2], value: `+1${profile.phone.replace(/[()-\s]/g, '')}`, raw: true });
    }
    conflicts.push({
      field: 'Phone',
      winner: profile.phone,
      winnerSource: profile.sources[1],
      strategy: 'Most Complete Format',
      variants,
    });
  }

  // Email conflict
  if (profile.email && profile.sources.length >= 2) {
    const emailParts = profile.email.split('@');
    conflicts.push({
      field: 'Email',
      winner: profile.email,
      winnerSource: profile.sources[0],
      strategy: 'Most Recent',
      variants: [
        { source: profile.sources[0], value: profile.email, raw: false },
        { source: profile.sources[1], value: profile.email.toUpperCase(), raw: true },
      ],
    });
  }

  // Name conflict
  if (profile.firstName && profile.sources.length >= 2) {
    conflicts.push({
      field: 'Name',
      winner: `${profile.firstName} ${profile.lastName}`,
      winnerSource: profile.sources[0],
      strategy: 'Trusted Source Priority',
      variants: [
        { source: profile.sources[0], value: `${profile.firstName} ${profile.lastName}`, raw: false },
        { source: profile.sources[1], value: `${profile.firstName.toLowerCase()} ${profile.lastName.toLowerCase()}`, raw: true },
      ],
    });
  }

  // City conflict
  if (profile.city && profile.sources.length >= 3) {
    conflicts.push({
      field: 'Location',
      winner: `${profile.city}, ${profile.state}`,
      winnerSource: profile.sources[0],
      strategy: 'Majority Vote',
      variants: [
        { source: profile.sources[0], value: `${profile.city}, ${profile.state}`, raw: false },
        { source: profile.sources[2], value: profile.city, raw: true },
      ],
    });
  }

  if (conflicts.length === 0) return null;

  return (
    <div className="glass-card-sm p-4 sm:p-5 bg-white border-slate-200 overflow-x-auto">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Shield size={14} className="text-amber-600 flex-shrink-0" />
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Conflict Resolution
        </h3>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100 sm:ml-auto mt-1 sm:mt-0">
          {conflicts.length} field{conflicts.length !== 1 ? 's' : ''} resolved
        </span>
      </div>

      <div className="space-y-3">
        {conflicts.map((conflict, idx) => (
          <motion.div
            key={conflict.field}
            className="p-3 rounded-xl bg-slate-50 border border-slate-100"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-2">
              <span className="text-[11px] font-bold text-slate-800">{conflict.field}</span>
              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 w-fit">
                Strategy: {conflict.strategy}
              </span>
            </div>

            {/* Variant values from each source */}
            <div className="space-y-1 mb-2">
              {conflict.variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold text-slate-400 w-24 truncate">{v.source}</span>
                  <code className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    v.raw ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {v.value}
                  </code>
                  {!v.raw && (
                    <CheckCircle2 size={10} className="text-emerald-500" />
                  )}
                  {v.raw && (
                    <AlertTriangle size={10} className="text-rose-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Winner */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-100 mt-2">
              <ArrowRight size={10} className="text-emerald-500 hidden sm:block" />
              <span className="text-[10px] font-bold text-emerald-700">
                Winner: <code className="bg-emerald-50 px-1 py-0.5 rounded break-all">{conflict.winner}</code>
              </span>
              <span className="text-[9px] text-slate-400 sm:ml-auto w-full sm:w-auto">from {conflict.winnerSource}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
