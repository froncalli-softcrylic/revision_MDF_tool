'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, Eye, EyeOff, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { useMDFStore } from '@/store/store';

const CONSENT_FIELDS = [
  { field: 'email', label: 'Email Marketing', description: 'Email campaigns and newsletters' },
  { field: 'phone', label: 'Phone / SMS', description: 'Calls and text messages' },
  { field: 'web_tracking', label: 'Web Tracking', description: 'Cookies and behavioral events' },
  { field: 'third_party', label: '3rd Party Sharing', description: 'Data shared with partners' },
  { field: 'profiling', label: 'Profiling & Scoring', description: 'Lead scoring and segmentation' },
];

/**
 * Consent Layer — shows how GDPR/CCPA consent flags propagate through
 * the MDF pipeline. Demonstrates governance impact on data availability.
 */
export default function ConsentLayer() {
  const processingStage = useMDFStore((s) => s.processingStage);
  const unifiedProfiles = useMDFStore((s) => s.unifiedProfiles);
  const [isOpen, setIsOpen] = useState(false);
  const [consentFlags, setConsentFlags] = useState({
    email: true,
    phone: true,
    web_tracking: true,
    third_party: false,
    profiling: true,
  });

  if (processingStage !== 'complete' || unifiedProfiles.length === 0) return null;

  const toggleConsent = (field) => {
    setConsentFlags((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const activeConsents = Object.values(consentFlags).filter(Boolean).length;
  const totalFields = CONSENT_FIELDS.length;

  // Simulate how consent affects available profiles for each MarTech output
  const availableForCDP = consentFlags.profiling ? unifiedProfiles.length : Math.round(unifiedProfiles.length * 0.3);
  const availableForEmail = consentFlags.email ? unifiedProfiles.length : 0;
  const availableForAds = consentFlags.third_party ? unifiedProfiles.length : Math.round(unifiedProfiles.length * 0.15);
  const availableForPersonalization = consentFlags.web_tracking ? unifiedProfiles.length : Math.round(unifiedProfiles.length * 0.4);

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-amber-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Privacy & Consent</h3>
          <span className="text-sm font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100">
            {activeConsents}/{totalFields} active
          </span>
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
            <div className="pb-4 pt-2 space-y-4">
              <p className="text-[10px] text-slate-500 font-medium">
                Toggle consent flags to see how GDPR/CCPA compliance affects data flow to MarTech.
              </p>

              {/* Consent Toggles */}
              <div className="space-y-1">
                {CONSENT_FIELDS.map((cf) => (
                  <button
                    key={cf.field}
                    onClick={() => toggleConsent(cf.field)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      consentFlags[cf.field]
                        ? 'bg-emerald-50/50 border-emerald-100'
                        : 'bg-rose-50/50 border-rose-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {consentFlags[cf.field] ? (
                        <Unlock size={12} className="text-emerald-500" />
                      ) : (
                        <Lock size={12} className="text-rose-500" />
                      )}
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-slate-800">{cf.label}</span>
                        <p className="text-[9px] text-slate-500">{cf.description}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${
                      consentFlags[cf.field] ? 'bg-emerald-400' : 'bg-rose-300'
                    }`}>
                      <motion.div
                        className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                        animate={{ left: consentFlags[cf.field] ? '16px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Impact on MarTech outputs */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-wider">MarTech Impact</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'CDP Audiences', count: availableForCDP, requires: 'profiling' },
                    { label: 'Email Campaigns', count: availableForEmail, requires: 'email' },
                    { label: 'Ad Retargeting', count: availableForAds, requires: 'third_party' },
                    { label: 'Personalization', count: availableForPersonalization, requires: 'web_tracking' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-2 rounded bg-white border border-slate-100">
                      <p className={`text-sm font-black ${item.count === 0 ? 'text-rose-500' : 'text-indigo-600'}`}>
                        {item.count}
                      </p>
                      <p className="text-[9px] text-slate-500 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
