'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MailX, Copy, PhoneOff, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { useState } from 'react';

const EDGE_CASES = [
  {
    key: 'missingEmail',
    label: 'Missing Emails',
    description: '~40% of records lack email addresses',
    icon: MailX,
    color: '#ef4444',
    tourSteps: [
      {
        title: 'The Problem: Missing Emails',
        content: 'When records arrive from Call Center or In-Store POS systems, they often lack email addresses. Up to 40% of your CRM records may have no email.',
        rawExample: '{ name: "Jane Doe", phone: "(555) 123-4567", email: null }',
        visual: '❌'
      },
      {
        title: 'MDF Identity Stitching',
        content: 'MDF uses phone number matching and deterministic identity resolution to stitch these email-less records to existing profiles from other sources.',
        rawExample: 'Phone Match: (555) 123-4567 → Profile #2847',
        visual: '🔗'
      },
      {
        title: 'The Result: Enriched Profiles',
        content: 'After stitching, the profile is enriched with the email found from another source (e.g., Web Signup or CRM). The Golden Record now has a complete email field.',
        rawExample: '{ name: "Jane Doe", phone: "(555) 123-4567", email: "jane.doe@email.com" }',
        visual: '✅'
      },
    ],
  },
  {
    key: 'duplicateCRM',
    label: 'Duplicate CRM Records',
    description: '30% duplicated with slight name variations',
    icon: Copy,
    color: '#f59e0b',
    tourSteps: [
      {
        title: 'The Problem: CRM Duplicates',
        content: 'Sales reps create new CRM records without checking for existing ones. The same person may appear as "Bob Smith", "Robert Smith", and "B. Smith Jr.".',
        rawExample: 'Record A: "Bob Smith" (bob@co.com)\nRecord B: "Robert Smith" (bob@co.com)\nRecord C: "B. Smith Jr." (bob@co.com)',
        visual: '📋'
      },
      {
        title: 'MDF Fuzzy Name Matching',
        content: 'MDF applies Levenshtein distance and phonetic matching (Soundex) on names, plus exact email/phone matching to identify these as the same person.',
        rawExample: 'Soundex("Bob") = B100\nSoundex("Robert") = R163\nEmail Match: bob@co.com → Same entity',
        visual: '🔍'
      },
      {
        title: 'The Result: Single Golden Record',
        content: 'All three records merge into a single Golden Record with the most complete name version, preserving all touchpoints and interaction history.',
        rawExample: '{ name: "Robert Smith", email: "bob@co.com", sources: ["CRM-1", "CRM-2", "CRM-3"], touchpoints: 14 }',
        visual: '⭐'
      },
    ],
  },
  {
    key: 'mismatchedPhones',
    label: 'Mismatched Phone Formats',
    description: 'Extremely inconsistent phone formatting',
    icon: PhoneOff,
    color: '#8b5cf6',
    tourSteps: [
      {
        title: 'The Problem: Format Chaos',
        content: 'Different systems store phone numbers in wildly different formats. The same number can appear as 10+ variations, causing matching failures.',
        rawExample: '5551234567\n555-123-4567\n(555) 123-4567\n+1-555-123-4567\n555.123.4567',
        visual: '🔀'
      },
      {
        title: 'MDF Phone Normalization',
        content: 'MDF strips all non-digit characters, validates the number length, then reformats to a canonical format: (XXX) XXX-XXXX. International prefixes are also handled.',
        rawExample: 'Input: "+1.555.123.4567"\nStrip: "15551234567"\nTrim country: "5551234567"\nFormat: "(555) 123-4567"',
        visual: '🔧'
      },
      {
        title: 'The Result: Consistent Matching',
        content: 'With normalized phone numbers, records that were previously invisible to matching now correctly cluster together, improving identity resolution accuracy by 25-40%.',
        rawExample: 'Before: 5 separate records\nAfter: 1 unified profile\nMatch improvement: +35%',
        visual: '📊'
      },
    ],
  },
];

function GuidedTourModal({ edgeCase, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = edgeCase.tourSteps;
  const step = steps[currentStep];

  return (
    <div className="tour-overlay">
      <motion.div
        className="tour-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="tour-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100" style={{ background: `${edgeCase.color}08` }}>
          <div className="flex items-center gap-2">
            <edgeCase.icon size={16} style={{ color: edgeCase.color }} />
            <span className="text-sm font-bold text-slate-900">{edgeCase.label}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500">
            <X size={14} />
          </button>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="p-5"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">{step.visual}</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">{step.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.content}</p>
            <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {step.rawExample}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer: navigation */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          {/* Step indicator */}
          <div className="tour-step-indicator">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`tour-step-dot ${i === currentStep ? 'active' : ''}`}
                style={i === currentStep ? { background: edgeCase.color } : {}}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={12} /> Prev
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
                style={{ background: edgeCase.color }}
              >
                Next <ChevronRight size={12} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
                style={{ background: edgeCase.color }}
              >
                Done ✓
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function EdgeCaseDemos() {
  const edgeCases = useMDFStore((s) => s.edgeCases);
  const toggleEdgeCase = useMDFStore((s) => s.toggleEdgeCase);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [activeTour, setActiveTour] = useState(null);

  const isRunning = processingStage !== 'idle' && processingStage !== 'complete';
  const activeCount = Object.values(edgeCases).filter(Boolean).length;

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-4">
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
                } ${isRunning ? 'opacity-50' : ''}`}
                whileTap={!isRunning ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => !isRunning && toggleEdgeCase(ec.key)}>
                  <ec.icon size={13} style={{ color: ec.color }} />
                  <div>
                    <p className="text-base font-semibold text-slate-900">{ec.label}</p>
                    <p className="text-sm text-slate-500">{ec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Guide button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTour(ec.key); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors flex-shrink-0"
                  >
                    <Eye size={10} /> Guide
                  </button>
                  <div
                    className={`toggle-switch flex-shrink-0 ${isActive ? 'active' : ''} ${isRunning ? '' : 'cursor-pointer'}`}
                    onClick={() => !isRunning && toggleEdgeCase(ec.key)}
                  />
                </div>
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

      {/* Guided Tour Modal */}
      <AnimatePresence>
        {activeTour && (
          <GuidedTourModal
            edgeCase={EDGE_CASES.find((ec) => ec.key === activeTour)}
            onClose={() => setActiveTour(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
